const express = require('express');
const {getCart,addToCart,remove,updateCart} = require('../controllers/cart.controller');

const router = express.Router();


//CLiente Log

// Ruta para obtener el carrito de compras del usuario
router.get('/',getCart);
//Ruta para agregar un producto al carrito de compras del usuario
router.post('/add',addToCart);
router.put('/update',updateCart);
//Ruta para eliminar un producto del carrito de compras del usuario
router.delete('/delete',remove );

module.exports = router;