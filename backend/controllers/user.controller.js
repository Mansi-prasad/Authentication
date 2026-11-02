import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";
import { LoginSchema, registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import {
  generateAccessToken,
  generateToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../config/generateToken.js";
import { generateCSRFToken } from "../middlewares/CSRFMiddleware.js";
import { getVerifyEmailHtml, getOtpHtml } from "../config/html.js";
import { sendResetPasswordMail } from "../config/sendMail.js";

// register user
export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;

    let firstErrorMessage = "Validation failed";
    let allErrors = [];

    // showing exact error message
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allErrors[0]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: zodError,
      error: allErrors,
    });
  }

  const { name, email, password } = validation.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

  const isRateLimited = await redisClient.get(rateLimitKey);

  if (isRateLimited) {
    return res.status(429).json({
      success: false,
      message: "Too many requests, try again",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // generate secure email verification token
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const dataStore = JSON.stringify({
    name,
    email,
    password: hashPassword,
  });

  // saving registration data temporarily
  await redisClient.set(verifyKey, dataStore, { EX: 300 });

  const subject = "verify your email for Account creation.";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, a verification link has been sent, it will expire in 5 minutes",
  });
});

// verify user
export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is required.",
    });
  }

  const verifyKey = `verify:${token}`;
  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({
      message: "Verification link is expired.",
    });
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  res.status(201).json({
    message: "Email verified successfully! your account has been created.",
    user: { _id: newUser._id, name: newUser.name, email: newUser.email },
  });
});

// login user
export const LoginUser = TryCatch(async (req, res) => {
  //  sanitize and validate input
  const sanitizedBody = sanitize(req.body);
  const validation = LoginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;

    let firstErrorMessage = "Validation failed";
    let allErrors = [];

    // showing exact error message
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allErrors[0]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allErrors,
    });
  }

  const { email, password } = validation.data;

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again",
    });
  }

  // find user
  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // compare password
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // generate a secure 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;

  // store otp for 5 minutes
  await redisClient.set(otpKey, JSON.stringify(otp), {
    EX: 300,
  });

  const subject = "Otp for verification";
  const html = getOtpHtml({ email, otp });
  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  res.json({
    message:
      "If your email is valid, an otp has been sent. it will be valid for 5 min",
  });
});

// verify otp
export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Please provide all details" });
  }

  const otpKey = `otp:${email}`;
  const storedOtpString = await redisClient.get(otpKey);

  if (!storedOtpString) {
    return res.status(400).json({ message: "otp expired" });
  }

  const storedOtp = JSON.parse(storedOtpString);

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "invalid OTP" });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const tokenData = await generateToken(user?._id, res);

  res.status(200).json({
    message: `Welcome ${user.name}`,
    user,
    token: tokenData,
    sessionInfo: {
      sessionId: tokenData.sessionId,
      loginTime: new Date().toISOString(),
      csrfToken: tokenData.csrfToken,
    },
  });
});

// get profile
export const myProfile = TryCatch(async (req, res) => {
  const user = req.user;
  const sessionId = req.sessionId;

  const sessionData = await redisClient.get(`session:${sessionId}`);

  let sessionInfo = null;

  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    sessionInfo = {
      sessionId,
      loginTime: parsedSession.createdAt,
      lastActivity: parsedSession.lastActivity,
    };
  }

  res.json({ user, sessionInfo });
});

// refresh token
export const refreshToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const decode = await verifyRefreshToken(refreshToken);

  if (!decode) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");

    return res.status(401).json({
      message: "Session expired. Please login again.",
    });
  }

  generateAccessToken(decode.id, decode.sessionId, res);

  res.status(200).json({
    message: "token refreshed",
  });
});

// Resend OTP
export const resendOtp = TryCatch(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Please provide your email",
    });
  }

  // Check whether user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Rate limiting
  const rateLimitKey = `resend-otp-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Please wait before requesting another OTP",
    });
  }

  // Generate a new 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  // Store OTP in Redis for 5 minutes
  await redisClient.set(otpKey, JSON.stringify(otp), {
    EX: 300,
  });

  // Send OTP through email
  const subject = "Resend OTP for verification";
  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  // Apply 60-second rate limit
  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  return res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email",
  });
});

// logout user
export const logoutUser = TryCatch(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (userId) {
      await revokeRefreshToken(userId);
      await redisClient.del(`user:${userId}`);
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");

    res.status(200).json({ message: "User Logged out successfully!" });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

// refresh csrf
export const refreshCSRF = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const newCSRFToken = await generateCSRFToken(userId, res);

  res.json({
    message: "CSRF token refreshed.",
    csrfToken: newCSRFToken,
  });
});

// Forgot Password
export const forgotPassword = TryCatch(async (req, res) => {

  // Sanitize and validate email
  const sanitizedBody = sanitize(req.body);
  const email = sanitizedBody.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email address",
    });
  }

  // Rate limiting
  const rateLimitKey = `forgot-password-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      success: false,
      message: "Please wait before requesting another reset link",
    });
  }

  // Find user
  const user = await User.findOne({ email });

  const successMessage =
    "If your email is registered, a password reset link has been sent. It will expire in 5 minutes.";

  if (!user || !user.password) {
    await redisClient.set(rateLimitKey, "true", { EX: 60 });

    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before storing in Redis
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetKey = `forgot-password:${hashedToken}`;

  // Store token in Redis for 5 minutes
  await redisClient.set(
    resetKey,
    JSON.stringify({
      userId: user._id.toString(),
    }),
    { EX: 300 },
  );

  // Send password reset email
  try {
    await sendResetPasswordMail({
      email,
      token: resetToken,
    });

    // Apply rate limit after successful email
    await redisClient.set(rateLimitKey, "true", { EX: 60 });
  } catch (error) {
    // Delete token if email sending fails
    await redisClient.del(resetKey);
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: successMessage,
  });
});

// Reset Password
export const resetPassword = TryCatch(async (req, res) => {
  // Get token and password
  const { token } = req.params;
  const sanitizedBody = sanitize(req.body);

  const password = sanitizedBody.password;
  const confirmPassword = sanitizedBody.confirmPassword;

  // Validate input
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset link.",
    });
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide both passwords.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  // Hash the received token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetKey = `forgot-password:${hashedToken}`;

  // Find token in Redis
  const storedData = await redisClient.get(resetKey);

  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: "Reset link is invalid or expired. Please request a new one.",
    });
  }

  // Get user ID from Redis
  const { userId } = JSON.parse(storedData);

  const user = await User.findById(userId);

  if (!user || !user.password) {
    await redisClient.del(resetKey);

    return res.status(400).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update user password
  user.password = hashedPassword;
  await user.save();

  // Delete used reset token
  await redisClient.del(resetKey);

  return res.status(200).json({
    success: true,
    message:
      "Password reset successfully. Please login with your new password.",
  });
});
