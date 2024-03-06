const { upload } = require('../middleware/multer');// Importation du middleware Multer pour gérer le téléchargement de fichiers
const { Book } = require('../models/Book');// avec cet User , on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const express = require('express');
const sharp = require('sharp'); // Importation de la bibliothèque Sharp pour le traitement d'images


const booksRouter = express.Router(); //on crée le routeur Express et dans le booksRouter on a seulement 2 requetes à la racine
booksRouter.get('/:id', BookGETById); // Route pour récupérer un livre par son ID  et on nomme le params par :id
booksRouter.get('/', booksGET); // Route pour récupérer tous les livres
booksRouter.post('/', upload.single('image'), booksPOST); // Route pour ajouter un livre avec téléchargement d'image


async function BookGETById(req, res){   // Fonction pour récupérer un livre par son ID

  const id = req.params.id; // notre requete a une propriété qui s'appelle params
  // console.log("params:", params); //ça affiche ceci params: { id: '65e8980790e4c4edca39b3a0' }
  // pas de body dans une req GET mais des params
  try{
    const book = await Book.findById(id);
    console.log("book:", book);
    if (book == null) {
      res.status(404).send("Livre non trouvé");// l'id avait une bonne longueur mais pas trouvé dans la base de données
      return;
    }
    book.imageUrl =imagesPath(book.imageUrl) ; // Ajout du chemin de l'image pour l'affichage - on a besoin de changer l'imageUrl avant de lui envoyer
    res.send(book);
  } catch (e){
    console.error(e);
    res.status(500).send("Erreur Serveur:" + " " + e.message);
  }
  }

async function booksGET(req, res){   // Fonction pour récupérer tous les livres
  try {
    const booksDatabase = await Book.find();
    console.log("booksDatabase:", booksDatabase);
  
  // Pour chaque book on va lui rajouter une propriété dessus et on va lui modifier l'imageUrl
    booksDatabase.forEach(book => { // pour chacun d'entre eux
      book.imageUrl =imagesPath(book.imageUrl) ; // à la place du book.imageUrl, tu vas mettre le resultat de la fonction imagesPath à partir de l'argument book.imageUrl
    });
    res.send(booksDatabase); // La réponse de la requete HTTP GET quand on fait appelle à la route api/books
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur Serveur:" + " " + e.message);
  } 
  }
  function imagesPath (nomFichier){   // Fonction pour générer le chemin complet de l'image
return process.env.URL + '/' + process.env.IMAGES_PATH + '/'+ nomFichier;
  }
  async function booksPOST(req, res){   // Fonction pour ajouter un livre
    try{
      if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé');
      }
      const { filename } = req.file;


    // const file = req.file;
    // console.log("file:", file);
    // const filename = req.file.filename;

    
    const book = req.body.book; // String, récupéré brut du body 
    const bookObj = JSON.parse(book); // transformation via JSON.parse qui va lire la string et la transformer en objet JSON
    bookObj.imageUrl = filename; //  on enregistre directement le filename dans l'imageURL -  but : avoir juste le nom du fichier

    const resizedFilename = `resized_${filename}`;

    await sharp(req.file.path) // Utilisation de Sharp pour redimensionner l'image
      .resize(200, 200) // Redimensionnement de l'image à 200x200 pixels
      .toFile(`uploads/${resizedFilename}`); // Enregistrement de l'image redimensionnée sur le serveur

      const result = await Book.create(bookObj); // le create nous renvoie à une promesse d'où le await
      res.send({message:'Livre posté', bookObj:result }); // type de réponse attendue { message: String } + ajout facultatif bookObj:result aidepour frontend ils ont tout l'objet de la fiche book de la base de donnée
     
    }catch (e){      // dans le cas où le client fait une erreur dans la saisie year :string au lieu de number, ça evite que le serveur crash mais plutot affiche message erreur 500
      console.error(e);
      res.status(500).send("Erreur Serveur" + " " + e.message);
    }
  }



      //   Book.deleteMany({}).then(() => {
      //   console.log('Supression de tous les Books dans la Database')
      // });


  module.exports = { booksRouter };