require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const connectDB = require("./config/db");

const app = express();

// Security headers
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// Allow the frontend origin to send cookies cross-origin
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5500",
    credentials: true,
  })
);

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", name: "AuthFlow API" })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// Centralized error-handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`AuthFlow API listening on port ${PORT}`);
  });
});
