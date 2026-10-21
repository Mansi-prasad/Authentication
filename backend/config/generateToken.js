import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";

export const generateToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  const refreshTokenKey = `refresh_token:${id}`;

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: true,
    sameSite: "strict", // strict prevents csirf attack , it only access the cookie from backend url
    maxAge: 1 * 60 * 1000, // valid for 1 minute
  });

  res.cookie("refreshtoken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    // secure: true,
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const storeToken = await redisClient.get(`refresh_token:${decode.id}`);

    if (storeToken === refreshToken) {
      return decode;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const generateAccessToken = (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
    maxAge: 1 * 60 * 1000, // 1000 ms
  });
};

export const revokeRefreshToken = async (userId) => {
  await redisClient.del(`refresh_token:${userId}`);
};


