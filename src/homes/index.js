const express = require("express");
const fs = require("fs-extra");
const path = require("path");

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
// edit homes
// delete homes

module.exports = router;
