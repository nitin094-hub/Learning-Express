const express = require("express");
var cors = require("cors");
const morgan = require("morgan");
const app = express();
const mongoSanatize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/appError");

///////////////////////////////////////////////////////// MIDDLEwARE //////////////////////////////////////////////////////////////

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());

app.use(express.json());
// app.use(mongoSanatize());
// app.use(xss());

app.use(express.static(`${__dirname}/public`));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // (err.status = "fail"), (err.statusCode = 400);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use((err, req, res, next) => {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
