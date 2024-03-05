const express = require('express');
const app = express();
const { User } = require("./database/mongo");// avec cet user, on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const cors = require('cors');
const bcrypt = require('bcrypt');
const { books } = require ('./database/books');
const multer = require('multer');

const storage = multer.diskStorage({ // appel de diskstorage dans un objet avec ses 2 keys destination et filename
  destination: function (req, file, cb){
    cb(null,"uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(" ").join("-") + Date.now() + ".jpg";
    cb(null, Date.now() + "-" + fileName);
  }
});
const upload = multer({storage}); // on appelle la fonction multer et on lui passe un obj qui a une key storage et sa valeur est storage: storage

const PORT = 4000;

app.use(cors()); //Autoriser au front et le backend à communiquer
app.use(express.json()); // capable de lire les body en JSON
app.use(express.static('public')); // dossier puclic (images;etc) fichiers statiques


// function sayHi(req,res){
//   res.send("Hello");
// }

// app.get('/', sayHi );
app.post('/api/auth/signup', signUp); // quand on se connecte au path et donc l'url ou route, ça déclence la fonciton "signup"
app.post('/api/auth/login', login);
app.get ('/api/books', booksGET); // à chaque fois qu'on fait un booksGET, ça va d'abord passer par une fonction logReq
app.post("/api/books", upload.single("image"), booksPOST);// besoin d'un middleware qui va recupérer les données du formData, et c'est la fonction upload qui contient ce middleware
// quand on met une uatre fonction on appelle ça un middleware, et il faut que ce middleware appelle la fct next(), la req passera tjs d'un middleware à celui d'après jusqu'à la fct finale q'uon appele le controller
// "image" --> Image: binary--> le nom du champ de la requete 
// function logReq (req, res, next){ // next = manière d'appeler le middleware d'après
// console.log("request:", req.body);
// next();
// }

function booksGET(req, res){
  res.send(books); // La réponse de la requete HTTP GET quand on fait appelle à la route api/books 
}

function booksPOST(req, res){
  const book = req.body.book;
  console.log("book:", book); // String, récupéré brut du body 
  const bookObj = JSON.parse(book); // transformation via JSON.parse qui va lire la string et la transformer en objet JSON
  console.log("bookJson:", bookObj);
  res.send('ok')
}

// console.log('password in .env', process.env); // process .env recupere toutes les variables d'environnement dans fichier .env
// variables d'environnement = tout ce qu'on passe dans le runtime
// avec package dotenv package qui va charger toutes nos var d'env et le mettre dans notre process env
app.listen(PORT, function(){
  console.log(`Server is running on: ${PORT}`);
});

    /*FONCTION SIGNUP*/

  async function signUp(req, res){
    // const body = req.body;
    // console.log('body:', body);

    const email_received = req.body.email; // à pusher dans l'array de users
    const password = req.body.password;// à pusher dans l'array de users
    if(email_received == null || password == null){ // si pas d'email ou pas de password
      res.status(400).send("Email et password requis"); //alors l'url répond une erreur avec statust 400 avec un message 
      return; // permet d'arreter à ce niveau
    }

    try{ // essaie de faire tout ce qui à l'interieur
      const userDatabase = await User.findOne({ // Methode pourchercher  un seul utilisateur ^par son email avec l'email qu'on a recu de l'user
        email: email_received // il faut vérifier l'email qu'on a reçu
      });
      // console.log('userDatabase:', userDatabase);

      if (userDatabase != null){ // si il trouve un user avec cet email-received dans la base de donnée
        res.status(400).send("Email déjà existant"); // alors il dit qu'il y a deja un user dans la base de données
        return; // on ne va pas faire de nouveaux user (donc sil existe deja -> pas de push en dessous)
      } 
      
      const user = { // là on prépare à créer un user dans l base de données
        email: email_received,
        password: hashPassword(password)
      };
        await User.create(user); // ici je crée le user qui veut s'inscrire
        res.send('User enregistré'); // qq soit le signup, on va lui renvoyer un resp.send 200 OK
    } catch(e){
      console.error(e);
      res.status(500).send('Erreur Serveur');
    }
  
    }


    /*FONCTION LOGIN*/
    async function login(req, res){
      const body = req.body; // sur la requêt il y aura un body
      const email_received = body.email;
      const password_received = body.password;

      if (email_received == null || password_received == null) {
        res.status(400).send("Email ET password requis");
        return;
      }
      try{
      const userDatabase = await User.findOne({ // Methode pourchercher  un seul utilisateur ^par son email avec l'email qu'on a recu de l'user
        email: email_received // trouve moi un email utilisateur dans la base de données dont email = body.email
      });
      if  (userDatabase == null) { // si userdatabase est égal à null ou undefined --> on cherche à se logger alors qu'on n'est pas encore dans la base de données
        res.status(401).send('Mauvais email'); // identifiant introuvable ou incorrect
        return;
      }
      const passwordDatabase = userDatabase.password; // on récupére le mdp de la db
      if (!isPasswordGood(password_received, passwordDatabase)) { // si le password n'est pas correct alors
        // req.body.password = mdp canrd saisi et passwordDatabase = mdp de base de données
        res.status(401).send('Mauvais password');
        return;
      }
// si cest bon on me renvoie un userid et un token de la base de donnée mongodb et donc on cosidère que le user est connecté
        res.send({
          userId: userDatabase._id,  // le userid ça sera l'_id du userdatabase
          token:'token'
        });
      }catch (e) {
    console.error(e);
    res.status(500).send("Erreur serveur");
  }
}
      function hashPassword(password) {
        const salt = bcrypt.genSaltSync(10); // salt : pourle meme mdp saisi, le hahs va rajouter quand meme de new caractere
        const hash = bcrypt.hashSync(password, salt); // pas besoin d'utiliser une promesse, il utilise tout de manière asynchrone
        console.log('hash:', hash);
        return hash;
      }

      function isPasswordGood(password, hash){ // function qui permet de comparer 2 mots de passe
       return bcrypt.compareSync(password, hash);
      }

      User.deleteMany({}).then(() => {
        console.log('Supression de tous les users dans la Database')
      });
    