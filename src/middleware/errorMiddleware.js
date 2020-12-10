const errorMiddleware = (err, req, res, next) => {
  delete err.stack;
  next(err);
};

module.exports = errorMiddleware;