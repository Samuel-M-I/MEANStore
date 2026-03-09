const express = require('express');
const {getCart,addToCart,remove,updateCart} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();


//CLiente Log

// Ruta para obtener el carrito de compras del usuario
router.get('/',protect,getCart);
//Ruta para agregar un producto al carrito de compras del usuario
router.post('/add/:id',protect,addToCart);
router.put('/update/:id',protect,updateCart);
//Ruta para eliminar un producto del carrito de compras del usuario
router.delete('/delete/:id',protect,remove );

module.exports = router;