const dotenv = require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
// const requireAuth = require("./middleware/authMiddleware"); //protects routes
const userRoutes = require("./routes/user");
const stockRoutes = require("./routes/stocks");

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://portfolio-tracker-frontend-u26r.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use("/users", userRoutes);
app.use("/api", stockRoutes);

// ===========================
// ====== DB CONNECTION ======
// ===========================
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

let PORT = process.env.PORT;

app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
