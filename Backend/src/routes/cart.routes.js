const router = require('express').Router();
const { protect }                               = require('../middleware/auth.middleware');
const { validateDataBase }                      = require('../middleware/dataBase.middleware');
const { validateAddToCart, validateUpdateCart } = require('../middleware/cartValidator.middleware');
const { getCart, addToCart, updateCart, remove } = require('../controllers/cart.controller');

router.get('/',       validateDataBase, protect, getCart);
router.post('/:id',   validateDataBase, protect, validateAddToCart,  addToCart);
router.put('/:id',    validateDataBase, protect, validateUpdateCart, updateCart);
router.delete('/:id', validateDataBase, protect, remove);

module.exports = router;