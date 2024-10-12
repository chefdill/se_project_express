const User = require("../models/users");
const { getUsers } = require("../controller/users");

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    throw Error("AHHH!");
    res.send(users);
  })
  .catch((err) => {
    console.error(err);
  });
};

module.exports = { getUsers };