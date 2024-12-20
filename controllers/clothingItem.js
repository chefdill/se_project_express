const mongoose = require("mongoose");
const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, DEFAULT, FOREBIDDEN_CODE } = require('../utils/errors');

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find().then((items) => res.status(200).send((items)))
  .catch((err) => {
      console.error(err);
      // if (err.name === "ValidationError") {
      //   res.status(BAD_REQUEST).send({ message: err.message });
      // }
    res.status(DEFAULT).send({ message:"An error has occurred on the server" })
  })
};

const likeItem = (req, res) => {
  const itemId = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Item not found" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  const itemId = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Item not found" });
      }
      if(err.statusCode === NOT_FOUND){
        return res
        .status(NOT_FOUND)
        .send({ message: "Internal server error" });
      }
      return res
      .status(DEFAULT)
      .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const itemId = req.params;
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
      return res.status(FOREBIDDEN_CODE).send({ message: "Forbidden: You cannot delete this item" });
    }
    // Proceed to delete the item
    return item.deleteOne()
    .then(() => res.status(200).send({ message: "Deletion successful" }));
  })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: "An error has occurred on the server" });
    });
};


module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem
}