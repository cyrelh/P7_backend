const express = require('express');
const cors = require('cors'); //gérer les requêtes d'origine croisée et permettre à un serveur d'indiquer à un navigateur s'il peut ou non accepter une demande 
const app = express();
require('../database/mongo'); // IMPORTANT POUR CONNECTER APP A MONGODB

// On a ensuite tous les middleware qu'on utilise
app.use(cors()); //Autoriser au front et le backend à communiquer
app.use(express.json()); // capable de lire les body en JSON
app.use('/'+ process.env.IMAGES_PATH, express.static('uploads')); //l'utilisateur doit aller sur l'Url uploads et là il aura le dossier uploads



  module.exports = { app };