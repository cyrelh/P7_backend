require('dotenv').config(); // prio n°1
const mongoose = require('mongoose');
const DATABASE_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DATABASE_DOMAIN}`;
console.log('DATABASE_URL:',DATABASE_URL);

async function connect(){ // promesses donc functin asynchrone
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to DB");
      } catch (e) {
        console.error(e);
      }
}

connect(); // on appelle notre fonciton connect

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', UserSchema);


module.exports = { User }; // Destructuring --> dans un {objet} on met tout  ce qu'on veut exporter
//et en import, on met aussi tout en {objet}