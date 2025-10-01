class NOT_AUTHORIZED_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  NOT_AUTHORIZED_CODE,
};