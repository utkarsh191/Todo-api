const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);
app.use(helmet());
app.use(cors());

app.get("/", (req,res) => {
  res.send("Todo API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Error Middleware (Always Last)
app.use(errorMiddleware);

module.exports = app;