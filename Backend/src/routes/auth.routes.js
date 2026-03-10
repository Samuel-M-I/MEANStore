const router = require('express').Router();
const { register, login, promoteAdmin }       = require('../controllers/auth.controller');
const { validateRegister, validateLogin }     = require('../middleware/authValidator.middleware');
const { validateDataBase }                    = require('../middleware/dataBase.middleware');
const { validateAdminSecret }                 = require('../middleware/adminSecret.middleware');

router.post('/register',      validateDataBase, validateRegister, register);
router.post('/login',         validateDataBase, validateLogin,    login);
router.patch('/promote-admin', validateDataBase, validateAdminSecret, promoteAdmin);

module.exports = router;