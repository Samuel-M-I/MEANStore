const express = require('express');
const {protect,authorizenRoles} = require('../middleware/auth.middleware');
const {getUsers,changeUserRole,isActive} = require('../controllers/admin.controller');

const router = express.Router();

//Ruta solo para admin para obtener la lista de usuario y trabajadores
router.get('/users',protect,authorizenRoles('admin'),getUsers);
//Cambia el rol de un usuario a trabajador o viceversa
router.put('/users/:userId/role',protect,authorizenRoles('admin'),changeUserRole);
//Desactiva o activa un los privilegios que tiene un trbajador
router.patch('/users/:userId/deactivate',authorizenRoles('admin'),protect,isActive);

module.exports = router;