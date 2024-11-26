const User = require("../models/users");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.status(200).send(users);
  })
  .catch((err) => {
    console.error(err);
    return res.status(BAD_REQUEST).send({ message: "An Error has occured" });
  });
};

const createUser = (req, res) => {
  const {name, avatar } = req.body;
  User.create({name, avatar})
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    console.error(err);
    if(err.name === "ValidationError") {
      res.status(BAD_REQUEST).send({ message: err.message });
    } else  {
      res.status(DEFAULT).send({ message: err.message });
    }
    //  return res.status(500).send({ message: err.message });
  });

};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail(() => {
    const error = new Error("User ID not found");
    error.name = "DocumentNotFoundError";
    throw error;
  })
.then((user) => res.status(200).send(user)).catch((err) => {
    if(err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "User Not Found"});
    }
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "User Not Found" });
    }
    return res.status(DEFAULT).send({ message: "Internal Service Error" });
  });
};

module.exports = { getUsers, createUser, getUser };