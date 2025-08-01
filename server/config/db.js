
import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI);
};
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
export default connectDB;
