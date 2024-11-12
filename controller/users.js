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
  .orFail()
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    console.error(err);
    if(err.name === "ValidationError") {
      res.status(400).send({ message: err.message });
    } else  {
      res.status(500).send({ message: err.message });
    }
     return res.status(500).send({ message: err.message });
  });

};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId).then((user) => res.status(200).send(user))
};

module.exports = { getUsers, createUser, getUser };