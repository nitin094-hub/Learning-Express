const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  if (parseInt(val) > tours.length) {
    return res.status(404).send({
      status: "fail",
      message: "Invalide Id",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!("name" in req.body) || !("price" in req.body)) {
    return res.status(400).send({
      status: "error",
      message: "Request doesn't contain name or price property",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).send({
    status: "success",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const tourId = tours[tours.length - 1].id + 1;
  const changedIdTour = {
    ...req.body,
    id: tourId,
  };
  const newTour = [...tours, changedIdTour];
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTour),
    (err) => {
      if (err) console.log(err);
      res.status(201).send({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTourById = (req, res) => {
  const id = parseInt(req.params.id);
  const filteredTour = tours.filter((item) => item.id === id)[0];
  res.status(200).send({
    status: "success",
    filteredTour,
  });
};

exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTour = tours.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...req.body,
      };
    } else {
      return item;
    }
  });

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTour),
    (err) => {
      res.status(201).send({
        status: "Success",
        data: {
          updatedTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id);

  const deletedTour = tours.filter((item) => item.id !== id);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(deletedTour),
    (err) => {
      res.status(200).send({
        status: "success",
        data: {
          deletedTour,
        },
      });
    }
  );
};
