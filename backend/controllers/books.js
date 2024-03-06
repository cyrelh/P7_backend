const { upload } = require('../middleware/multer');
const { Book } = require('../models/Book');// avec cet User , on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const express = require('express');

async function booksGET(req, res){
  const booksDatabase = await Book.find();
  console.log("booksDatabase:", booksDatabase);

// Pour chaque book on va lui rajouter une propriété dessus et on va lui modifier l'imageUrl

  booksDatabase.forEach(book => { // pour chacun d'entre eux
    book.imageUrl =imagesPath(book.imageUrl) ; // à la place du book.imageUrl, tu vas mettre le resultat de la fonction imagesPath à partir de l'argument book.imageUrl
  });
  res.send(booksDatabase); // La réponse de la requete HTTP GET quand on fait appelle à la route api/books 
  }
  function imagesPath (nomFichier){
return process.env.URL + '/' + process.env.IMAGES_PATH + '/'+ nomFichier;
  }
  
  async function booksPOST(req, res){
    const file = req.file;
    console.log("file:", file);
    const filename = req.file.filename;

    
    const book = req.body.book; // String, récupéré brut du body 
    const bookObj = JSON.parse(book); // transformation via JSON.parse qui va lire la string et la transformer en objet JSON
    
    bookObj.imageUrl = filename; //  on enregistre directement le filename dans l'imageURL -  but : avoir juste le nom du fichier

    
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
  booksRouter.post('/', upload.single('image'), booksPOST); // quand on fait un post sur le booksRouter, 
  //multer va d'abord etre appele ce middlweare et upload.single('image')
  // puis il va rajouter uen propriété file su rnotre req pour que le booksPOST y est accès

      //   Book.deleteMany({}).then(() => {
      //   console.log('Supression de tous les Books dans la Database')
      // });


  module.exports = { booksRouter };