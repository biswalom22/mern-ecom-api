import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import productroutes from "./routes/productroutes";
import returnRoutes from "./routes/returnRoutes";
import path from "path";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", productroutes);
app.use('/api', cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", returnRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
