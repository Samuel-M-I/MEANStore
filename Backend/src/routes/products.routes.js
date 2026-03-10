const router = require('express').Router();
const { protect, authorizenRoles }               = require('../middleware/auth.middleware');
const { validateDataBase }                       = require('../middleware/dataBase.middleware');
const { validateProduct, validateUpdateProduct } = require('../middleware/productValidator.middleware');
const {
    getProductsClient,
    getProductsUser,
    getProducts,
    getProductsById,
    createProducts,
    updateProducts,
    deleteProducts
} = require('../controllers/products.controller');

// ── Públicas ──────────────────────────────────
router.get('/public',  validateDataBase, getProductsClient);

// ── Cliente loggeado ──────────────────────────
router.get('/user',    validateDataBase, protect, authorizenRoles('client'), getProductsUser);

// ── Worker / Admin ────────────────────────────
router.get('/',        validateDataBase, protect, authorizenRoles('admin','worker'), getProducts);
router.get('/:id',     validateDataBase, protect, authorizenRoles('admin','worker'), getProductsById);
router.post('/',       validateDataBase, protect, authorizenRoles('admin','worker'), validateProduct,       createProducts);
router.put('/:id',     validateDataBase, protect, authorizenRoles('admin','worker'), validateUpdateProduct, updateProducts);
router.delete('/:id',  validateDataBase, protect, authorizenRoles('admin','worker'), deleteProducts);

module.exports = router;