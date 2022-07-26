const express = require("express");
const morgan = require("morgan");
const app = express();
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

///////////////////////////////////////////////////////// MIDDLEwARE //////////////////////////////////////////////////////////////

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});
app.use(express.static(`${__dirname}/public`));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

module.exports = app;
