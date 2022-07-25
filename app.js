const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

///////////////////////////////////////////////////////// MIDDLEwARE //////////////////////////////////////////////////////////////

app.use(morgan("dev"));

// app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

///////////////////////////////////////////////////////// API //////////////////////////////////////////////////////////////
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).send({
    status: "success",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const tourId = tours[tours.length - 1].id + 1;
  const changedIdTour = {
    ...req.body,
    id: tourId,
  };
  const newTour = [...tours, changedIdTour];
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTour),
    (err) => {
      res.status(201).send({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getTourById = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    return res.status(404).send({
      status: "fail",
      message: "Invalide Id",
    });
  }
  const filteredTour = tours.filter((item) => item.id === id)[0];
  res.status(200).send({
    status: "success",
    filteredTour,
  });
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    return res.status(404).send({
      status: "fail",
      message: "Invalide Id",
    });
  }
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
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    return res.status(404).send({
      status: "fail",
      message: "Invalide Id",
    });
  }
  const deletedTour = tours.filter((item) => item.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const getAllUsers = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not defined!",
  });
};
const createUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not defined!",
  });
};
const getUserById = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not defined!",
  });
};
const updateUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not defined!",
  });
};
const deleteUser = (req, res) => {
  res.status(500).send({
    status: "error",
    message: "This route is not defined!",
  });
};

// app.get("/api/v1/tours", getAllTours);

// app.post("/api/v1/tours/", createTour);

// app.get("/api/v1/tours/:id", getTourById);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);

/////////////////////////////////////////// ANOTHER WAY OF WRITING API////////////////////////////////////////////////////////I

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
