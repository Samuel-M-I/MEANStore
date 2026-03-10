const router = require('express').Router();
const { protect, authorizenRoles }               = require('../middleware/auth.middleware');
const { validateDataBase }                       = require('../middleware/dataBase.middleware');
const { validateProduct, validateUpdateProduct } = require('../middleware/productValidator.middleware');
const {
    getProductsClient,
    getProducts,
    getProductsById,
    createProducts,
    updateProducts,
    deleteProducts
} = require('../controllers/products.controller');

router.get('/public',  validateDataBase, getProductsClient);
router.get('/',        validateDataBase, protect, getProducts);
router.get('/:id',     validateDataBase, protect, getProductsById);
router.post('/',       validateDataBase, protect, authorizenRoles('admin','worker'), validateProduct,       createProducts);
router.put('/:id',     validateDataBase, protect, authorizenRoles('admin','worker'), validateUpdateProduct, updateProducts);
router.delete('/:id',  validateDataBase, protect, authorizenRoles('admin','worker'), deleteProducts);

module.exports = router;