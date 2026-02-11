require("dotenv").config(); // 👈 MUST be first line

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const paymentRoutes = require("./Routes/payment");

// Initialize globals
global.foodData = [];
global.foodCategory = [];

// Connect DB
require("./db")(function (err, data, CatData) {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    global.foodData = data || [];
    global.foodCategory = CatData || [];
    console.log("Food and Category data loaded");
  }
});

// ✅ CORS Middleware
const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://crustify-one.vercel.app"
  ],
  credentials: true
}));



app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Crustify Backend is running successfully",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", require("./Routes/Auth"));
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", require("./Routes/admin"));



app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

