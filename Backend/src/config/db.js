//aqui va la configiuracion de la base de datos
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected to mongoDB");
    }
    catch (error) {
        console.log("Error connecting to mongoDB", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;