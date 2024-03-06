const express = require('express');
const cors = require('cors');
const app = express();
require('./../database/mongo'); // IMPORTANT POUR CONNECTER APP A MONGODB

// On a ensuite tous les middleware qu'on utilise
app.use(cors()); //Autoriser au front et le backend à communiquer
app.use(express.json()); // capable de lire les body en JSON
app.use('/images', express.static('uploads')); //l'utilisateur doit aller sur l'Url uploads et là il aura le dossier uploads



  module.exports = { app };