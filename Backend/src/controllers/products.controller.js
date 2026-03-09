const Products =requiere('../Models/Product.js');



exports.getProductsClient = async (req,res)=>{
    try{
        const products = await Products.find({stock:{$gt:0},isActive:true}).select('-description -cratedBy -updatedAt -__v -isActive');
        res.json(products);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsById = async(req,res)=>{
    try{
        const product = await Products.findById(req.params.id).select(' -__v -createdBy -createdAt -updatedAt');
        if(!product){
            return res.status(404).json({message:'Producto no encontrado'});
        }
        res.json(product)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}; 

exports.getProducts = async (req,res)=>{
    try{
        const products = await Products.find().select('-__v  -updatedAt');
        res.json(products);

    }catch(error){
        res.status(500).json({ message: error.message });
    }

}

exports.createProducts =async(req,res)=>{
    try{

        const {name,description,price,stock,category,imageUrl} = req.body;
        const newProduct = Products.create({
            name,
            description,
            price,
            stock,
            category,
            imageUrl,
            isActive:true,
            createdBy:req.user._id
        });
        res.status(201).json(newProduct);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

exports.updateProducts = async(req, res)=>{
    try{
        const Product = await Products.findById(req.params.id);
        if(!Product){
            return res.status(404).json({message:'Producto no encontrado'});
        }
        const {name,description,price,stock,category,imageUrl} = req.body;
        Product.name = name || Product.name;
        Product.description = description || Product.description;
        Product.price = price || Product.price;
        Product.stock = stock || Product.stock;
        Product.category = category || Product.category;
        Product.imageUrl = imageUrl || Product.imageUrl;
        await Product.save();
        res.json(Product);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};


exports.deleteProducts = async(req,res)=>{
    try{
        const Product = await Products.findById(req.params.id);
        if(!Product){
            return res.status(404).json({message:'Producto no encontrado'});
        }
        Product.isActive = false;
        await Product.save();
        res.json(Product);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};