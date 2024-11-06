const router = require('express').Router();


const { createItem } = require('../controller/clothingItem')

//CRUD


//CREATE

router.post('/', createItem);

module.exports = router;