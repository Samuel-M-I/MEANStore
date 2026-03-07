const express = require('express');
const {getSales,addSales,getSalesByUser} = require('../controllers/sales.controller');

const router = express.Router();

// Ruta para obtener Las ventas hechas solo Admins
router.get('/',getSales);
//Ruta para agregar una venta de un producto
router.post('/add',addSales);
//Ruta para eliminar un producto del carrito de compras del usuario
router.get('/mySales',getSalesByUser );

module.exports = router;