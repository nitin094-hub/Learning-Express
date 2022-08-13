// const fs = require("fs");
const Tour = require("../models/tourModel");
const ApiFeatures = require("../utils/apiFeatures");
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   if (parseInt(val) > tours.length) {
//     return res.status(404).send({
//       status: "fail",
//       message: "Invalide Id",
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!("name" in req.body) || !("price" in req.body)) {
//     return res.status(400).send({
//       status: "error",
//       message: "Request doesn't contain name or price property",
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingAverage price";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Filtering
    // const queryObj = { ...req.query };
    // const exculdeArr = ["sort", "limit", "page", "fields"];
    // exculdeArr.forEach((item) => delete queryObj[item]);
    // let query = Tour.find(queryObj);

    // Sorting
    // if (req.query.sort) {
    //   query = query.sort(req.query.sort);
    // }

    // // Limiting

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // // Pagination

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();

    const allTours = await features.query;
    res.status(200).send({
      status: "success",
      requestTime: req.requestTime,
      results: allTours.length,
      data: {
        allTours,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  // const tourId = tours[tours.length - 1].id + 1;
  // const changedIdTour = {
  //   ...req.body,
  //   id: tourId,
  // };
  // const newTour = [...tours, changedIdTour];
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(newTour),
  //   (err) => {
  //     if (err) console.log(err);
  //     res.status(201).send({
  //       status: "success",
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).send({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourById = async (req, res) => {
  const id = req.params.id;
  // const filteredTour = tours.filter((item) => item.id === id)[0];
  // res.status(200).send({
  //   status: "success",
  //   filteredTour,
  // });

  try {
    const tour = await Tour.findById(id);
    res.status(200).send({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  const id = req.params.id;
  // const updatedTour = tours.map((item) => {
  //   if (item.id === id) {
  //     return {
  //       ...item,
  //       ...req.body,
  //     };
  //   } else {
  //     return item;
  //   }
  // });

  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(updatedTour),
  //   (err) => {
  //     res.status(201).send({
  //       status: "Success",
  //       data: {
  //         updatedTour,
  //       },
  //     });
  //   }
  // );

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const id = req.params.id;

  // const deletedTour = tours.filter((item) => item.id !== id);
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(deletedTour),
  //   (err) => {
  //     res.status(200).send({
  //       status: "success",
  //       data: {
  //         deletedTour,
  //       },
  //     });
  //   }
  // );
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).send({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRating: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).send({
      status: "success",
      data: { stats },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: "$startDates" },
          numToursStart: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
    ]);
    res.status(200).send({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};
