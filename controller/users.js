const User = require("../models/users");

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send({ message: "An Error has occured" });
  });
};

const createUser = (req, res) => {
  const {name, avatar } = req.body;
  User.create({name, avatar})
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    console.error(err);
    console.log(err.name);
    return res.status(500).send({ message: err.message });
  });

}

module.exports = { getUsers, createUser };