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

const BookSchema = new mongoose.Schema ({
    userId: String,
    title: String,
    author: String,
    imageUrl: String,
    year: Number,
    genre: String,
    ratings: [{
        userId: String,
        grade: Number
    }],
    averageRating: Number
});

const Book = mongoose.model("Book", BookSchema); // il va nous donner un Book en utilisant Bookschema


module.exports = { User, Book }; // on va exporter à la fois le User mais aussi le Book
 // Destructuring --> dans un {objet} on met tout  ce qu'on veut exporter
//et en import, on met aussi tout en {objet}