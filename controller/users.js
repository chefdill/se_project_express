const User = require("../models/users");
// const { getUsers } = require("../controller/users");

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    throw new Error("AHHH!");
    res.send(users);
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send({ message: "An Error has occured" });
  });
};

module.exports = { getUsers };