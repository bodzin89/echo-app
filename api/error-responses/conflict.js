module.exports = class ConflictResponse extends Error {
  constructor(message) {
    super();

    this.status = 409;
    this.message = message;
  }
};
