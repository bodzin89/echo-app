module.exports = class BadRequestResponse extends Error {
  constructor(message) {
    super();

    this.status = 400;
    this.message = message;
  }
};
