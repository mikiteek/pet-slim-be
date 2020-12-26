const UserAlreadyExistError = {
  message: "Such email already exist",
}

const BadRequestError = {
  message: "Bad request",
}

const NotFoundError = {
  message: "Not found",
}

const UnauthorizedError = {
  message: "Unauthorized",
}

module.exports = {
  UserAlreadyExistError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
};