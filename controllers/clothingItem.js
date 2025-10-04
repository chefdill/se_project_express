const mongoose = require("mongoose");
const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST_CODE } = require('../utils/errors/bad-request-err');
const { NOT_FOUND_CODE } = require('../utils/errors/not-found-err');
const { DEFAULT_CODE } = require('../utils/errors/default-err');
const { FOREBIDDEN_CODE } = require('../utils/errors/forebidden-code-err');
const { CONFLICT_CODE } = require('../utils/errors/conflict-code-err');

// create item function
const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST_CODE("Invalid item data"));
      } else if (err.code === 11000){
        next(new CONFLICT_CODE("Duplicate email error"));
      } else {
        next(DEFAULT_CODE); // pass to global error handler
      }
    });
};

// get items function
const getItems = (req, res, next) => {
  ClothingItem.find().then((items) => res.status(200).send((items)))
  .catch(() => {
    next(new DEFAULT_CODE ("An error has occurred on the server"));
  })
};

// lile items function
const likeItem = (req, res, next) => {
  const { itemId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BAD_REQUEST_CODE("Invalid ID format"));
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NOT_FOUND_CODE('Item not found'));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST_CODE('Item not found'));
      }
      return next(new DEFAULT_CODE("An error has occurred on the server"));
    });
};

// unlike items function
const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BAD_REQUEST_CODE("Invalid ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST_CODE('Item not found'));
      }
      if(err.statusCode === NOT_FOUND_CODE){
        return next(new NOT_FOUND_CODE("Internal server error"));
      }
      return next(new DEFAULT_CODE("An error has occurred on the server"));
    });
};

// delete item function
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
      const error = new Error("User ID not found");
      error.name = "DocumentNotFoundError";
      throw error;
    }
    if (item.owner.toString() !== userId) {
      // Return a 403 status if the user doesn't own the item
      return next(new FOREBIDDEN_CODE("Forbidden: You cannot delete this item"));
    }
    // Proceed to delete the item
    return item.deleteOne()
    .then(() => res.status(200).send({ message: "Deletion successful" }));
  })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BAD_REQUEST_CODE('Item not found'));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND_CODE("Internal server error"));
      }
      return next(new DEFAULT_CODE('An error has occurred on the server'));
    });
};


module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem
}