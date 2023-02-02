const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://abhishek:abhishek@cluster0.i8n1k.mongodb.net/test";

const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;