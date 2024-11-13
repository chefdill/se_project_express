const router = require('express').Router();


const { createItem, getItems, updateItem, deleteItem, likeItem, unlikeItem } = require('../controller/clothingItem')

//CRUD


//CREATE

router.post('/', createItem);

//READ

router.get('/', getItems);

//UPDATE

router.put('/:itemId', updateItem);

//LIKE ITEM

router.put(':itemId/likes', likeItem);

//UNLIKE

router.delete(':itemId/likes', unlikeItem);

//DELETE

router.delete('/:itemId', deleteItem);

module.exports = router;