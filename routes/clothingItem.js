const router = require('express').Router();
const { auth } = require("../middlewares/auth");
const {
  validateCardBody,
  validateCardId
} = require("../middlewares/validation")
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem
} = require('../controllers/clothingItem')

// CRUD

// CREATE
router.post('/', auth, validateCardBody, createItem);

// READ
router.get('/', getItems);

// LIKE ITEM
router.put('/:itemId/likes', auth, validateCardId, likeItem);

// UNLIKE
router.delete('/:itemId/likes', auth, validateCardId, auth, unlikeItem);

// DELETE
router.delete('/:itemId', auth, validateCardId, deleteItem);

module.exports = router;