const cart = require('../models/cart.model');

exports.getCart = async (req, res) => {
    try{
        const userId = req.user._id; // Obtener el ID del usuario autenticado
        const userCart = await cart.findOne({ user: userId }).populate('items.product').select('-description -createdAt -updatedAt -__v');
        if(!userCart){
            return res.status(404).json({message:'Carrito de compras no encontrado'});
        }
        res.status(200).json(userCart);
    }catch(error){
        res.status(500).json({message:'Error al obtener el carrito de compras',error:error.message});
    }
};
exports.addToCart = async (req, res) => {
    try{
        const Product = await Products.findById(req.params.id);
        const cart = await Cart.findOne({ userId: req.user._id });
        if(!Product && !cart){
            return res.status(404).json({message:'Producto o carrito no encontrado'});
        }
        cart.items.push({productId:Product._id,qty: req.item.qty,price:Product.price});
        await cart.save();
        res.status(200).json({message:'Producto agregado al carrito de compras',cart});
        
    }catch(error){
        res.status(500).json({message:'Error al agregar el producto al carrito de compras',error:error.message});
    }
};
exports.updateCart = async (req, res) => {
    try{
        const Product = await Products.findById(req.params.id);
        const cart = await Cart.findOne({ userId: req.user._id });

        if(!Product && !cart){
            return res.status(404).json({message:'Producto o carrito no encontrado'});
        }
        cart.items.updateOne({productId:Product._id},{$set:{qty:req.item.qty,price:Product.price}});
        await cart.save();
        res.status(200).json({message:'Carrito de compras actualizado',cart});
    }catch(error){
        res.status(500).json({message:'Error al actualizar el carrito de compras',error:error.message});
    }
};
exports.remove = async (req, res) => {
    try{
        const Product = await Products.findById(req.params.id);
        const cart = await Cart.findOne({ userId: req.user._id });

        if(!Product && !cart){
            return res.status(404).json({message:'Producto o carrito no encontrado'});
        }
        cart.items.updateOne({productId:Product._id},{$pull:{productId:Product._id,qty:req.item.qty,price:Product.price}});
        await cart.save();
        res.status(200).json({message:'Carrito de compras actualizado',cart});

    }catch(error){
        res.status(500).json({message:'Error al eliminar el producto del carrito de compras',error:error.message});
    }
};