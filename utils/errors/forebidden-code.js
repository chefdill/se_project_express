class FOREBIDDEN_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  FOREBIDDEN_CODE,
};