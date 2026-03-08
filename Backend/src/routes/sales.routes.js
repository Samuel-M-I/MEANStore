const express = require('express');
const {getSales,addSales,getSalesByUser} = require('../controllers/sales.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

//Cliente requiere LOG
//Ruta para agregar una venta de un producto
router.post('/add',protect,addSales);
//Ruta para mirar tus compras
router.get('/mySales',protect,getSalesByUser );

//REQUIERE AUTENTICACION Y ROL DE ADMIN O WORKER

// Ruta para obtener Las ventas hechas solo Admins
router.get('/',protect,getSales);

module.exports = router;