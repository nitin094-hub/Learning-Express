function AppError(message, statusCode, stack = null) {
  this.statusCode = statusCode;
  this.message = message;
  this.isOperational = true;
  this.getErrorObj = function () {
    const err = new Error(this.message);
    err.status = "fail";
    err.statusCode = this.statusCode;
    console.log(err);
    return err;
  };
}
module.exports = AppError;
