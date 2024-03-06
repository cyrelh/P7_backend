const express = require('express');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 4000; // soit on a un PORT dans le .env soit sur le port par défaut 4000

// On a ensuite tous les middleware qu'on utilise
app.use(cors()); //Autoriser au front et le backend à communiquer
app.use(express.json()); // capable de lire les body en JSON
app.use('/images', express.static('uploads')); //l'utilisateur doit aller sur l'Url uploads et là il aura le dossier uploads

// on fait tourner notre PORT
app.listen(PORT, function() {
    console.log(`Serveur tourne sur: ${PORT}`);
  });

  module.exports = { app };