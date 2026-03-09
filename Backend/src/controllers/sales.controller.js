<<<<<<< HEAD
const Sale    = require('../models/sale');
const Cart    = require('../models/cart');
const Product = require('../models/product');

// GET /sales — solo admin
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .select('-__v');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /sales/mySales — cliente loggeado
exports.getSalesByUser = async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.user._id })
            .populate('items.productId', 'name price')
            .select('-__v');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /sales/add — confirmar compra
exports.addSales = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        for (const item of userCart.items) {
            const foundProduct = item.productId;
            if (foundProduct.stock < item.qty) {
                return res.status(400).json({
                    message: `Stock insuficiente para ${foundProduct.name}`
                });
            }
        }

        const items = userCart.items.map(item => ({
            productId: item.productId._id,
            qty:       item.qty,
            unitPrice: item.price
        }));

        const newSale = await Sale.create({ userId: req.user._id, items });

        for (const item of userCart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.qty }
            });
        }

        userCart.items = [];
        await userCart.save();

        res.status(201).json({ message: 'Compra realizada con éxito', sale: newSale });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
=======
const User = require('../models/user.model');
const Sale = require('../models/sale.model');
const Cart= require('../models/cart.model');

exports.addSales = async (req, res,next) => {
    try{
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if(!cart || cart.items.length === 0){
            return res.status(400).json({message: 'El carrito de compras está vacío'});
        }
        const user = await  User.findOne(req.user._id); // Obtener el ID del usuario autenticado
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        // Crear una nueva venta
        const newSale = Sale.create({
            userId:user._id,
            items:cart.items,
            total:0
        });
        await newSale.save();
        await cart.cleanItems();
        await cart.save();
        res.status(201).json({message: 'Venta agregada exitosamente', sale: newSale});
        
    }catch(error){
        res.status(500).json({message: 'Error al agregar la venta', error: error.message});
    }
};

exports.getSalesByUser = async (req, res) => {
    try{
        const sales = await Sale.find({ userId: req.user._id }).populate('items.productId', 'name price');
        if(!sales){
            return res.status(404).json({message: 'No se encontraron ventas para este usuario'});
        }
        res.status(200).json({sales});

    }catch(error){
        res.status(500).json({message: 'Error al obtener las ventas del usuario', error: error.message});
    }
};

exports.getSales =async(req,res)=>{
    try{
        const sales = await Sale.find().populate('userId', 'name email').populate('items.productId', 'name price');
        if(!sales){
            return res.status(404).json({message: 'No se encontraron ventas'});
        }
        res.status(200).json({sales});

    }catch(error){
        res.status(500).json({message:'Error al obtener las ventas',error:error.message});
    }
};
>>>>>>> 523e13c37b7bd3e694cfa6e88b0b84d6f356a12b
