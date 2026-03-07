const express = require('express');
const {getCart,addToCart,remove} = require('../controllers/cart.controller');

const router = express.Router();

// Ruta para obtener el carrito de compras del usuario
router.get('/',getCart);
//Ruta para agregar un producto al carrito de compras del usuario
router.post('/add',addToCart);
//Ruta para eliminar un producto del carrito de compras del usuario
router.delete('/:ItemId',remove );

module.exports = router;