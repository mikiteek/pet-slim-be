class UserAlreadyExistError extends Error {
  constructor(message = "Such email already exist") {
    super(message);
    this.status = 409;
  }
}

class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.status = 404;
  }

}

module.exports = {
  UserAlreadyExistError,
  BadRequestError,
  NotFoundError,
};