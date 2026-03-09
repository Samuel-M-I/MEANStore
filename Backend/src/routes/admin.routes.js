const router = require('express').Router();
const { protect, authorizenRoles } = require('../middleware/auth.middleware');
const { validateDataBase }         = require('../middleware/dataBase.middleware');
const { getUsers, changeUserRole, toggleActive } = require('../controllers/admin.controller');

router.get('/users',                  validateDataBase, protect, authorizenRoles('admin'), getUsers);
router.put('/users/:userId/role',     validateDataBase, protect, authorizenRoles('admin'), changeUserRole);
router.patch('/users/:userId/active', validateDataBase, protect, authorizenRoles('admin'), toggleActive);

module.exports = router;