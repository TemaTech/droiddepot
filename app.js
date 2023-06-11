/* eslint-disable import/no-extraneous-dependencies */
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const indexRouter = require("./routes/index");

const app = express();

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGODB_URI_DEV)
  .catch((e) => console.error(e));

mongoose.connection.once("open", () => {
  console.log("Successfully connected to MongoDB");
});

mongoose.connection.on("error", (e) => {
  console.error(e);
});

// Set up compression
app.use(compression());

// Set up Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  })
);

// Set up rate limiter
const limiter = RateLimit({
  windowMs: 1 * 60 * 100,
  max: 100,
});

app.use(limiter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
