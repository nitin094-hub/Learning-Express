const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a Password"],
    min: [8, "The password must have atleast 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your Password"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "The Passwords doesn't match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
