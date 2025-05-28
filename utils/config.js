const { JWT_SECRET = "some-secret-key" } = process.env;

console.log(JWT_SECRET)

module.exports = {
  JWT_SECRET,
};