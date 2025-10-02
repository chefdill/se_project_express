const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");
const { BAD_REQUEST_CODE } = require('../utils/errors/bad-request-err');
const { NOT_FOUND_CODE } = require('../utils/errors/not-found-err');
const { NOT_AUTHORIZED_CODE } = require('../utils/errors/unauthorized-err');
const { DEFAULT_CODE } = require('../utils/errors/default-err');
const { CONFLICT_CODE } = require('../utils/errors/conflict-code-err');

// const getUsers = (req, res) => {
//   User.find({})
//   .then((users) => {
//     res.status(200).send(users);
//   })
//   .catch((err) => {
//     console.error(err);
//     return res.status(DEFAULT).send({ message: "An Error has occured" });
//   });
// };

const createUser = (req, res, next) => {
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
      return next(new BAD_REQUEST_CODE("Invalid data"));
    }
    if (err.statusCode === CONFLICT_CODE) {
      return next(new CONFLICT_CODE("The user with the provided email already exists"));
    }
    return next(new DEFAULT_CODE("Internal Service Error"));
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BAD_REQUEST_CODE("Invalid data"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new NOT_AUTHORIZED_CODE("Invalid data"));
     }
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST_CODE("Invalid data"));
    }
    return next(new DEFAULT_CODE("Internal Service Error"));
  });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
  .orFail(() => {
    const error = new Error("User ID not found");
    error.name = "DocumentNotFoundError";
    throw error;
  })
.then((user) => res.status(200).send(user)).catch((err) => {
    if(err.name === "DocumentNotFoundError") {
      return next(new NOT_FOUND_CODE("User Not Found"));
    }
    if (err.name === "CastError") {
      return next(new BAD_REQUEST_CODE("Invalid data"));
    }
    return next(new DEFAULT_CODE("Internal Service Error"));
  });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        return next(new NOT_FOUND_CODE("User Not Found"));
      }
        return res.status(200).send(updateUser);
      })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return next(new BAD_REQUEST_CODE("Invalid data"));
        }
        return next(new DEFAULT_CODE("Internal Service Error"));
        });
    };


module.exports = { createUser, getCurrentUser, login, updateProfile };