const notFoundHandler = (err, req, res, next) => {
  if (err.httpStatuscode === 404) {
    res.status(404).send("Cannot find what are you looking for!");
  }
  next(err);
};

const notAuthorizedHandler = (err, req, res, next) => {
  if (err.httpStatuscode === 401) {
    res.status(401).send("You are not authorized!");
  }
  next(err);
};

const forbiddenHandler = (err, req, res, next) => {
  if (err.httpStatuscode === 403) {
    res.status(403).send("This is forbidden!");
  }
  next(err);
};

const badRequestHandler = (err, req, res, next) => {
  if (err.httpStatuscode === 400) {
    res.status(400).send("Bad request!");
  }
  next(err);
};

const catchAllHandlers = (err, req, res, next) => {
  if (err.httpStatuscode === 500) {
    res.status(500).send("Have no idea, what went wrong!");
  }
  next(err);
};

module.exports = {
  notFoundHandler,
  notAuthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandlers,
};
