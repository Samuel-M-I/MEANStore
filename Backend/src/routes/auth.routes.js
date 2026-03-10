const router = require('express').Router();
const { register, login, promoteAdmin }       = require('../controllers/auth.controller');
const { validateRegister, validateLogin }     = require('../middleware/authValidator.middleware');
const { validateDataBase }                    = require('../middleware/dataBase.middleware');
const { validateAdminSecret }                 = require('../middleware/adminSecret.middleware');

// 🌐 PÚBLICO ──────────────────────────────────
router.post('/register', validateDataBase, validateRegister, register);
router.post('/login',    validateDataBase, validateLogin,    login);

// 🔑 CLAVE SECRETA (x-admin-secret en header) ─
router.patch('/promote-admin', validateDataBase, validateAdminSecret, promoteAdmin);

module.exports = router;