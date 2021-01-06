const express = require("express");
require("dotenv").config(); // telling to read .env file
const listEndpoints = require("express-list-endpoints");

const {
  notFoundHandler,
  notAuthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandlers,
} = require("./errorHandling");

const homesRouter = require("./homes");
const bookingsRouter = require("./bookings");

const server = express();

server.use(express.json());

server.get("/", (req, res, next) => res.send("Server is running"));
server.use("/homes", homesRouter);
server.use("/bookings", bookingsRouter);

const port = process.env.PORT || 3001;

console.log(listEndpoints(server));

server.use(notFoundHandler);
server.use(notAuthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandlers);

server.listen(port, () => console.log("Server is running on port" + port));
