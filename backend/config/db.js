import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERNAuthentication",
    });

    console.log("MongoDB connected.");
  } catch (error) {
    console.log("mongoDB connection error:", error);
  }
};

export default connectDB;
