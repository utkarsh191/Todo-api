const uploadRoutes = require("./routes/uploadRoutes");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

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
app.use(cors());
app.use(limiter);
app.use(morgan("dev"));
app.use(helmet());

app.get("/", (req,res) => {
  res.send("Todo API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Middleware (Always Last)
app.use(errorMiddleware);

module.exports = app;