const express = require('express');
const {getSales,addSales,getSalesByUser} = require('../controllers/sales.controller');

const router = express.Router();

//Cliente requiere LOG
//Ruta para agregar una venta de un producto
router.post('/add',addSales);
//Ruta para mirar tus compras
router.get('/mySales',getSalesByUser );

//REQUIERE AUTENTICACION Y ROL DE ADMIN O WORKER

// Ruta para obtener Las ventas hechas solo Admins
router.get('/',getSales);

module.exports = router;