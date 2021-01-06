const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const { finished } = require("stream");
const { Transform } = require("json2csv");
const { pipeline } = require("stream");

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

//CSV EXPORT

router.get("/csv/export", async (req, res, next) => {
  // SOURCE json file
  const source = fs.createReadStream(bookingFilePath);
  // TRANSFORM json2csv
  const transformJsonintoCsv = new Transform({
    fields: [
      "title",
      "address",
      "description",
      "price",
      "rooms",
      "facilities",
      "image",
    ],
  });

  res.setHeader("Content-Disposition", "attachment; filename=export.csv"); // creatin permition "save on disk" window, to open in brower

  // DESTINATION UPLOAD to client - response object
  pipeline(source, transformJsonintoCsv, res, (err) => {
    if (err) {
      next(err);
    } else {
      console.log("Json file is transformed to csv file!");
    }
  });
});

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
    }
    const selectedBooking = await readFile(bookingFilePath);
    const selectedHomeisAlreadyAddedtoBookinglist = selectedBooking.find(
      (booking) => booking.id === req.params.id
    );
    if (selectedHomeisAlreadyAddedtoBookinglist) {
      const error = new Error();
      error.httpStatuscode = 400;
      res.send("This home is already added!");
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

router.delete("/:id", async (req, res, next) => {
  // 1) get all bookings from the list
  // 2) take specified booking out
  // 3) rewrite list of bookings
  const bookingList = await readFile(bookingFilePath);
  const selectedBooking = await bookingList.filter(
    (booking) => booking.id !== req.params.id
  );
  await writeFile(selectedBooking);
  res.status(200).send("Booking has been deleted.");
});

module.exports = router;

//thank you Ubeyt
