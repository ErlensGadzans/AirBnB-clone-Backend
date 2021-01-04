const express = require("express");
const listEndpoints = require("express-list-endpoints");

const homesRouter = require("./homes");

const server = express();

server.use(express.json());

server.get("/", (req, res, next) => res.send("Server is running"));
server.use("/homes", homesRouter);

const port = process.env.PORT || 3001;

console.log(listEndpoints(server));

server.listen(port, () => console.log("Server is running on port" + port));
