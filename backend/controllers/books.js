const { upload } = require('../middleware/multer');
const { Book } = require('../models/Book');// avec cet User , on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const express = require('express');


async function booksGET(req, res){
  const booksDatabase = await Book.find();
  console.log("booksDatabase:", booksDatabase);
  res.send(booksDatabase); // La réponse de la requete HTTP GET quand on fait appelle à la route api/books 
  }
  
  async function booksPOST(req, res){
    const file = req.file;
    const book = req.body.book; // String, récupéré brut du body 
    const bookObj = JSON.parse(book); // transformation via JSON.parse qui va lire la string et la transformer en objet JSON
    bookObj.imageUrl = file.path;
    
    try{ // dans le cas où le client fait une erreur dans la saisie year :string au lieu de number, ça evite que le serveur crash mais plutot affiche message erreur 500
      const result = await Book.create(bookObj); // le create nous renvoie à une promesse d'où le await
      res.send({message:'Livre posté', bookObj:result }); // type de réponse attendue { message: String } + ajout facultatif bookObj:result aidepour frontend ils ont tout l'objet de la fiche book de la base de donnée
    } catch (e){
      console.error(e);
      res.status(500).send("Erreur Serveur" + " " + e.message);
    }
  }

  const booksRouter = express.Router(); //dans le booksRouter on a seulement 2 requetes à la racine
  booksRouter.get('/', booksGET);
  booksRouter.post('/', upload.single('image'), booksPOST);


  module.exports = { booksRouter };