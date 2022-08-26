const mongoose = required("mongoose");

const reviewScheme = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  rating: {
    type: Number,
    max: 5,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date().now,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    require: [true, "Review must belong to a tour"],
  },
});

module.exports = reviewScheme;
