const express = require('express');
const {getUsers,changeUserRole,isActive} = require('../controllers/admin.controller');

const router = express.Router();

//Ruta solo para admin para obtener la lista de usuario y trabajadores
router.get('/users',getUsers);
//Cambia el rol de un usuario a trabajador o viceversa
router.put('/users/:userId/role',changeUserRole);
//Desactiva o activa un los privilegios que tiene un trbajador
router.patch('/users/:userId/deactivate',isActive);

module.exports = router;