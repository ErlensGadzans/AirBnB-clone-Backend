const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const uniqid = require("uniqid");

const cloudStorage = new CloudinaryStorage({
  //instant of storage
  cloudinary: cloudinary, //credential, akreditācija, polnomochija
  params: {
    folder: "homes",
  },
});

const cloudMulter = multer({ storage: cloudStorage }); //cloudinary version of Multer

const router = express.Router();
const homesFilePath = path.join(__dirname, "homes.json"); //receiving files from fake or hardcoded database

const readFile = async () => {
  const buffer = await fs.readFile(homesFilePath); // 1) reading json file as a buffer
  const text = buffer.toString(); // 2) byte & bits transformed in to the text
  return JSON.parse(text); // 3) returns content of the file
};

const writeFile = async (content) =>
  await fs.writeFile(homesFilePath, JSON.stringify(content));

// get all homes
router.get("/", async (req, res, next) => {
  res.send(await readFile());
});
// create new apatment - have to use Cloudinary to upload images
router.post("/", cloudMulter.single("cover"), async (req, res, next) => {
  try {
    //Add place with address , title , description, price , rooms info , house facilities
    // Address must be an object contains , street , city ,zip code , country , latitude , longitude
    // Show location with google maps iframe in details page.
    // Title and description must be string and cant be empty.
    const newHome = JSON.parse(req.body.home); //reading the body from requested body name
    newHome.image = req.file.path; //put the image from cloudinary
    newHome.id = uniqid();

    const currentHomes = await readFile(); //reading files from json file
    await writeFile([...currentHomes, newHome]); // creating array with previous Home & pushing newHome details

    res.status(201).send(newHome.id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// edit homes
// delete homes

module.exports = router;
