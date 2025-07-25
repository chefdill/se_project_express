const router = require('express').Router();
const { auth } = require("../middlewares/auth");
const {
  validateCardBody,
  validateCardId
} = require("../middlewares/validation")
const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  unlikeItem
} = require('../controllers/clothingItem')

// CRUD

// CREATE
router.post('/', validateCardBody, auth, createItem);

// READ
router.get('/', getItems);

// UPDATE
// router.put('/:itemId', updateItem);

// LIKE ITEM
router.put('/:itemId/likes', validateCardId, auth, likeItem);

// UNLIKE
router.delete('/:itemId/likes', validateCardId, auth, unlikeItem);

// DELETE
router.delete('/:itemId', validateCardId, auth, deleteItem);

module.exports = router;