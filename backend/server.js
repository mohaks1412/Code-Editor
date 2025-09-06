// server.js
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// Routes
import userRoutes from "./Routes/userRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import mediaRoutes from "./Routes/mediaRoutes.js";
import fileRoutes from "./Routes/fileRoutes.js";
import testCaseRoutes from "./Routes/TestcaseRoutes.js";
import runRoutes from "./Routes/exeRoutes.js";
// Socket handler (modularized)
import socketHandler from "./Sockets/index.js";

// ----------------------- DB Connection -----------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// ----------------------- Express Setup -----------------------
const app = express();
const server = http.createServer(app);

// Get the correct origin from environment variables or use localhost for development
const frontendOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: frontendOrigin, // Use the dynamic origin
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/testcases", testCaseRoutes);
app.use("/api/execute", runRoutes);

// ----------------------- Socket.io Setup -----------------------
const io = new Server(server, {
  cors: {
    origin: frontendOrigin, // Use the dynamic origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Pass socket.io instance to modular handler
socketHandler(io);

// ----------------------- Start Server -----------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));