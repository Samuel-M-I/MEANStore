require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/user');
const Product  = require('./models/product');
const Cart     = require('./models/cart');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB conectado');

        // ── Limpiar colecciones ───────────────────
        await User.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});
        console.log('🗑️  Colecciones limpiadas');

        // ── Crear usuarios ────────────────────────
        const admin = await User.create({
            username: 'admin',
            email:    'admin@meanstore.com',
            password: 'Admin1234',
            role:     'admin',
            active:   true
        });

        const worker = await User.create({
            username: 'worker',
            email:    'worker@meanstore.com',
            password: 'Worker1234',
            role:     'worker',
            active:   true
        });

        const client = await User.create({
            username: 'client',
            email:    'client@meanstore.com',
            password: 'Client1234',
            role:     'client',
            active:   true
        });

        // ── Crear carrito para el cliente ─────────
        await Cart.create({ userId: client._id, items: [] });
        console.log('👥 Usuarios creados');

        // ── Crear productos ───────────────────────
        await Product.insertMany([
            {
                name:        'iPhone 15 Pro',
                description: 'Smartphone Apple con chip A17 Pro y cámara de 48MP',
                price:       4500000,
                stock:       10,
                category:    'Celulares',
                isActive:    true,
                createdBy:   admin._id
            },
            {
                name:        'MacBook Air M2',
                description: 'Laptop ultradelgada con chip M2 y 8GB de RAM',
                price:       6800000,
                stock:       5,
                category:    'Laptops',
                isActive:    true,
                createdBy:   admin._id
            },
            {
                name:        'AirPods Pro',
                description: 'Auriculares inalámbricos con cancelación de ruido',
                price:       1200000,
                stock:       20,
                category:    'Audífonos',
                isActive:    true,
                createdBy:   worker._id
            },
            {
                name:        'iPad Air',
                description: 'Tablet con pantalla Liquid Retina de 10.9 pulgadas',
                price:       3200000,
                stock:       8,
                category:    'Tablets',
                isActive:    true,
                createdBy:   worker._id
            },
            {
                name:        'Cable USB-C',
                description: 'Cable de carga rápida 100W longitud 2 metros',
                price:       45000,
                stock:       50,
                category:    'Accesorios',
                isActive:    true,
                createdBy:   worker._id
            },
            {
                name:        'Sony Alpha A7',
                description: 'Cámara mirrorless full frame con sensor de 33MP',
                price:       9500000,
                stock:       3,
                category:    'Cámaras',
                isActive:    true,
                createdBy:   admin._id
            },
            {
                name:        'Control PS5',
                description: 'Control DualSense con vibración háptica',
                price:       380000,
                stock:       15,
                category:    'Gaming',
                isActive:    true,
                createdBy:   admin._id
            }
        ]);
        console.log('📦 Productos creados');

        // ── Resumen ───────────────────────────────
        console.log('\n🌱 Seed completado exitosamente');
        console.log('─────────────────────────────────');
        console.log('👤 admin@meanstore.com   / Admin1234');
        console.log('👷 worker@meanstore.com  / Worker1234');
        console.log('🛒 client@meanstore.com  / Client1234');
        console.log('─────────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seed:', error.message);
        process.exit(1);
    }
};

seed();