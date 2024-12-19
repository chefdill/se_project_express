const User = require("../models/users");
const { BAD_REQUEST, NOT_FOUND, DEFAULT, CONFLICT_CODE } = require('../utils/errors');
const bcrypt  = require("bcryptjs");

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.status(200).send(users);
  })
  .catch((err) => {
    console.error(err);
    return res.status(DEFAULT).send({ message: "An Error has occured" });
  });
};

const createUser = (req, res) => {
  const {name, avatar, email, password } = req.body;
  return User.findOne({ email })
  .then((user) => {
    if (user) {
      const error = new Error(
        "The user with the provided email already exists"
      );
      error.statusCode = CONFLICT_CODE;
      throw error;
    }

    return bcrypt.hash(password, 10).then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    );
  })
  .then((user) => {
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    if (err.statusCode === CONFLICT_CODE) {
      return res
        .status(CONFLICT_CODE)
        .send({ message: "The user with the provided email already exists" });
    }
    return res
      .status(DEFAULT)
      .send({ message: "Internal Service Error" });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    return res
      .status(DEFAULT)
      .send({ message: "Internal Service Error" });
  });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;
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

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        return res.status(NOT_FOUND).send({ message: "User Not Found" });
      }
        res.status(200).send(updateUser);
      })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return res
            .status(BAD_REQUEST)
            .send({ message: "Invalid data" });
        }
        return res
        .status(DEFAULT)
        .send({ message: "Internal Service Error" });
        });
    };


module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };