class UserAlreadyExistError extends Error {
  constructor(message = "Such email already exist") {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  UserAlreadyExistError,
};