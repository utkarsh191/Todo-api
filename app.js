const express = require("express");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req,res) => {
  res.send("Todo API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);


module.exports = app;