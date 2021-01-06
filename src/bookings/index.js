const express = require("express");

const path = require("path");
const fs = require("fs-extra");
const { finished } = require("stream");

const router = express.Router();

const bookingFilePath = path.join(__dirname, "bookings.json");
const homesFilePath = path.join(__dirname, "../homes/homes.json");

const readFile = async (path) => {
  const buffer = await fs.readFile(path); // 1) reading json file as a buffer
  const text = buffer.toString(); // 2) byte & bits transformed in to the text
  return JSON.parse(text); // 3) returns content of the file
};

const writeFile = async (content) =>
  await fs.writeFile(bookingFilePath, JSON.stringify(content));

// GET BOOKINGS
router.get("/", async (req, res, next) => {
  res.send(await readFile(bookingFilePath));
});

// ADD OR POST BOOKING //need to identify home by id and copy it in booking json file
router.post("/:id", async (req, res, next) => {
  try {
    const homesList = await readFile(homesFilePath);
    const currentHome = homesList.find((home) => home.id === req.params.id);

    if (!currentHome) {
      const error = new Error("There is no home" + req.params.id);
      err.httpStatuscode = 404;
      next(error);
    } else {
      const currentBooking = await readFile(bookingFilePath);
      await writeFile([...currentBooking, currentHome]);
      res.status(201).send("Home has been added to bookinglist!");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// REMOVE OR DELETE BOOKING

module.exports = router;
