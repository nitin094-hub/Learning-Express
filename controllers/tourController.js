// const fs = require("fs");
const Tour = require("../models/tourModel");

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

exports.getAllTours = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const exculdeArr = ["sort", "limit", "page", "fields"];
    exculdeArr.forEach((item) => delete queryObj[item]);
    let query = Tour.find({ queryObj });

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }
    console.log(req.query.sort);
    const allTours = await query;
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
