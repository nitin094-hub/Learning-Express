const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("../models/userModel");

const tourScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlenght: [
      40,
      "A tour name should have less that or equal to 40 characters",
    ],
    minlenght: [
      40,
      "A tour name should have greater that or equal to 10 characters",
    ],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either : easy, medium or difficult",
    },
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    max: [5, "Rating must be less than or equal to 5"],
    min: [0, "Rating must be greater than or equal to 0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        // this only points to to current doc on NEW DOCUMENT CREATION
        return val < this.price;
      },
      message: "Discount price should be less than the price",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  startLocation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    adress: String,
    description: String,
  },
  locations: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      adress: String,
      description: String,
      day: Number,
    },
  ],
  guides: Array,
});

tourScheme.pre("save", async function (next) {
  console.log(this.guides);
  const guidesPromise = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromise);
  next();
});

// Document middleWare

tourScheme.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourScheme.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware

tourScheme.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation middleware

tourScheme.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model("Tour", tourScheme);

module.exports = Tour;
