const router = require('express').Router();
const { protect, authorizenRoles }           = require('../middleware/auth.middleware');
const { validateDataBase }                   = require('../middleware/dataBase.middleware');
const { getSales, addSales, getSalesByUser } = require('../controllers/sales.controller');

// 🔒 JWT (todos los roles) ─────────────────────
router.post('/add',    validateDataBase, protect, addSales);
router.get('/mySales', validateDataBase, protect, getSalesByUser);

// 🔒 ADMIN ────────────────────────────────────
router.get('/',        validateDataBase, protect, authorizenRoles('admin'), getSales);

module.exports = router;