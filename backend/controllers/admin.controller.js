import TryCatch from "../middlewares/TryCatch.js";

export const adminController = TryCatch(async (req, res) => {
  res.json({
    message: "Hello admin",
  });
});