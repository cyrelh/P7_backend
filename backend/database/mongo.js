const mongoose = require('mongoose');

const PASSWORD ="VDZyvDyc05HfB6Yc";
const USER ='cyrelh';

const DATABASE_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.ft97nkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function connect(){ // promesses donc functin asynchrone
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to DB");
      } catch (e) {
        console.error(e);
      }
}

connect(); // on appelle notre fonciton connect




module.exports ={};