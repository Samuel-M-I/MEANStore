const express = require('express');
const {getProductsClient, getProducts, getProductsById,createProducts,updateProducts,deleteProducts} = require('../controllers/products.controller');
const { protect ,authorizenRoles} = require('../middleware/auth.middleware');
const router = express.Router();

// Obtener el catalogo publico de productos de stock>0 y productos Activos
router.get('/public', getProductsClient);
//Obtener la descripción de un producto por su id
router.get('/:id',getProductsById);



//REQUIERE AUTENTICACION Y ROL DE ADMIN O WORKER    
// Obtner el catalogo de los productos para admin/workkers incluyendo productos con stock=0 y productos inactivos
router.get('/', protect,authorizenRoles('worker','admin'),getProducts);
//Crear un nuevo producto (solo para admin/workers)
router.post('/',protect,authorizenRoles('worker','admin'),createProducts);
//Actualizar un producto (solo para admin/workers)
router.put('/:id',protect,authorizenRoles('worker','admin'),updateProducts);
//Eliminar un producto (solo para admin/workers) - Desactiva un proudcto isActive.
router.delete('/:id',protect,authorizenRoles('worker','admin'),deleteProducts);

module.exports = router;