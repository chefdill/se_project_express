const router = require('express').Router();
const { auth } = require("../middlewares/auth");
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
router.post('/', auth, createItem);

// READ
router.get('/', getItems);

// UPDATE
// router.put('/:itemId', updateItem);

// LIKE ITEM
router.put('/:itemId/likes', auth, likeItem);

// UNLIKE
router.delete('/:itemId/likes', auth, unlikeItem);

// DELETE
router.delete('/:itemId', auth, deleteItem);

module.exports = router;