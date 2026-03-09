const router = require('express').Router();
const { protect }          = require('../middleware/auth.middleware');
const { validateDataBase } = require('../middleware/dataBase.middleware');
const { getCart, addToCart, updateCart, remove } = require('../controllers/cart.controller');

router.get('/',       validateDataBase, protect, getCart);
router.post('/:id',   validateDataBase, protect, addToCart);
router.put('/:id',    validateDataBase, protect, updateCart);
router.delete('/:id', validateDataBase, protect, remove);

module.exports = router;