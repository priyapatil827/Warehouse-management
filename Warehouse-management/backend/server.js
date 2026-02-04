import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import stockRouter from "./routes/stockRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import path from "path";
import employeeRouter from "./routes/employeeRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

connectDB();
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/product", productRouter);
app.use("/api/stock", stockRouter);
app.use("/api/order", orderRouter);
app.use("/api/employee", employeeRouter);

app.listen(5050, () => {
  console.log("Server Started");
});
