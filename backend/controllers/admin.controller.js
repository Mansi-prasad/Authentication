import TryCatch from "../middlewares/TryCatch";

export default adminController = TryCatch(async (req, res) => {
  res.json({
    message: "Hello admin",
  });
});
