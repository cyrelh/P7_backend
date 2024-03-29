const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email: {type : String, required : true},
    password: {type : String, required : true}
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };  // Destructuring --> dans un {objet} on met tout  ce qu'on veut exporter
//et en import, on met aussi tout en {objet}