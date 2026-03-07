const express = require('express');
const {getProductsClient, getProducts, getProductsById,createProducts} = require('../controllers/products.controller');

const router = express.Router();

// Obtener el catalogo publico de productos de stock>0 y productos Activos
router.get('/public', getProductsClient);
// Obtner el catalogo de los productos para admin/workkers incluyendo productos con stock=0 y productos inactivos
router.get('/', getProducts);
//Obtener la descripción de un producto por su id
router.get('/:id',getProductsById);
//
router.post('/',createProducts);


module.exports = router;