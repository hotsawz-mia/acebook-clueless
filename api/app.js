const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

// Serve uploaded images statically from /uploads
// This lets clients fetch photos via URLs like /uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/users", usersRouter);
app.use("/posts", tokenChecker, postsRouter);
app.use("/tokens", authenticationRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
