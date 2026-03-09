const User = require('../models/user');

exports.getUsers = async(req,res)=>{
    try{
        usuarios= await User.find().select('-password -__v -createdAt -updatedAt')  ;
        res.json(usuarios);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

exports.changeUserRole = async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        if(!user){
            return res.status(404).json({message:'Usuario no encontrado'});
        }
        user.role = req.params.role;
        await user.save();
        res.json({message:'Rol actualizado',user});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};
exports.isActive = async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        if(!user){
            return res.status(404).json({message:'Usuario no encontrado'});
        }
        user.active = !user.active;
        await user.save();
        res.json({message:'Estado actualizado',user});  

    }catch(error){
        res.status(500).json({ message: error.message });
    }
};
