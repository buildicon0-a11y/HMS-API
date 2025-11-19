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
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options("*", cors()); // Preflight requests

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
   HEALTH CHECK (OPTIONAL)
--------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("HMS API Running...");
});

/* ---------------------------------------------------
   ERROR HANDLER
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
