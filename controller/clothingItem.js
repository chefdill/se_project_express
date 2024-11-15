const mongoose = require("mongoose");
const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  console.log(req)
  console.log(req.body)

  const {name, weather, imageURL} = req.body;

  ClothingItem.create({name, weather, imageURL}).then((item) => {
    console.log(item);
    res.send({data:item})
  }).catch((e) => {
    res.status(500).send({message: 'Error from createItem', e})
  })
};

const getItems = (req, res) => {
  ClothingItem.find().then((items) => res.status(200).send((items)))
  .catch((e) => {
    res.status(500).send({message:"Error from getItems", e})
  })
};

const updateItem = (req, res) => {
  const {itemId} = req.params;
  const {imageURL} = req.body;

  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item}))
  .catch((e) => {
     res.status(500).send({message:"Error from updateItem", e})})
}

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Item not found" });
      }
      return res
        .status(500)
        .send({ message: "Internal server error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Item not found" });
      }
      return res
        .status(500)
        .send({ message: "Internal server error" });
    });
};


const deleteItem = (req, res) => {
  const {itemId} =req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => res.status(204).send({}))
  .catch((e) => {
    res.status(500).send({message:"Error from deleteItem", e})})
}

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem
}