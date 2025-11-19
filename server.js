// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ---------------------------------------------------
   CORS CONFIG
--------------------------------------------------- */
app.use(cors({
  origin: "*",                  // Allow all domains OR set specific domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ❌ Removed because it causes "Missing parameter name at index 1: *"
// app.options('*', cors());

/* ---------------------------------------------------
   BODY PARSER
--------------------------------------------------- */
app.use(express.json({ limit: "5mb" }));

/* ---------------------------------------------------
   DATABASE CONNECTION
--------------------------------------------------- */
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

/* ---------------------------------------------------
   ROUTES IMPORT
--------------------------------------------------- */
const registrationRoutes = require("./routes/registrationRoutes");
const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const engineerVisitRoutes = require("./routes/engineerVisitRoutes");

/* ---------------------------------------------------
   ROUTES
--------------------------------------------------- */
app.use("/api/registrations", registrationRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/engineer-visits", engineerVisitRoutes);

/* ---------------------------------------------------
   HEALTH CHECK ROUTE
--------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("HMS API Running...");
});

/* ---------------------------------------------------
   GLOBAL ERROR HANDLER
--------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ---------------------------------------------------
   START SERVER
--------------------------------------------------- */
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
