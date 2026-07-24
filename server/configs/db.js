import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/prathsgpt`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Fail fast: don't let the server start listening with no DB connection
    process.exit(1);
  }
};

export default connectDB;