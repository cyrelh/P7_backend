const express = require('express');
const app = express();
const { User } = require("./database/mongo");// avec cet user, on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const cors = require('cors');
const bcrypt = require('bcrypt');


const PORT = 4000;

app.use(cors()); //les middleware vont etre exécutés ici
app.use(express.json()); // capable de lire les body en JSON

function sayHi(req,res){
  res.send("Hello");
}

app.get('/', sayHi );
app.post('/api/auth/signup', signUp); // récupéré du headers RequestURL
app.post('/api/auth/login', login);

// console.log('password in .env', process.env); // process .env recupere toutes les variables d'environnement dans fichier .env
// variables d'environnement = tout ce qu'on passe dans le runtime
// avec mackage dotenv package qui va charger toutes nos var d'env et le mettre dans notre process env
app.listen(PORT, function(){
  console.log(`Server is running on: ${PORT}`);
});

    /*FONCTION SIGNUP*/

  async function signUp(req, res){
    // const body = req.body;
    // console.log('body:', body);

    const email = req.body.email; // à pusher dans l'array de users
    const password = req.body.password;// à pusher dans l'array de users
    if(email == null || password == null){
      res.status(400).send("Email et password requis");
      return;
    }

    try{
    const userDatabase = await User.findOne({ // User est un modele de mongo importé
      // .find renvoie toujours une array []
      //.findOne renvoie un seul objet
      email: email // il faut vérifier l'email qu'on a reçu
    });
    // console.log('userDatabase:', userDatabase);

    if (userDatabase != null){ // une array est toujours !=null
      res.status(400).send("Email déjà existant");
      return; // on ne va pas faire de nouveaux user (donc sil existe deja -> pas de push en dessous)
    } // il va donc return sinon il va essayer de le fabriquer
        // Si je cherche à faire un user à partir de l'email qui existe dejà
        // il va dire email deja existant et va rien mettre dans base de données
    
    const user = {
      email: email,
      password: hashPassword(password)
    };
      await User.create(user);
      res.send('User enregistré'); // qq soit le signup, on va lui renvoyer un resp.send 200 OK
    } catch(e){
      console.error(e);
      res.status(500).send('Erreur Serveur');
    }
  
    }


    /*FONCTION LOGIN*/
    async function login(req, res){
      const body = req.body; // sur la requêt il y aura un body
      if (body.email == null || body.password == null) {
        res.status(400).send("Email ET password requis");
        return;
      }
      try{



      const userDatabase = await User.findOne({
        email: body.email // trouve moi un email utilisateur dans la base de données dont email = body.email
      });
      if  (userDatabase == null) { // si userdatabase est égal à null ou undefined --> on cherche à se logger alors qu'on n'est pas encore dans la base de données
        res.status(401).send('Mauvais email');
        return;
      }
      const passwordDatabase = userDatabase.password;
      if (!isPasswordGood(req.body.password, passwordDatabase)) { // si le password n'est pas correct alors
        // req.body.password = mdp canrd saisi et passwordDatabase = mdp de base de données
        res.status(401).send('Mauvais password');
        return;
      }
// si cest bon on me renvoie un userid et un token de la base de donnée mongodb
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

      function isPasswordGood(password, hash){
       return bcrypt.compareSync(password, hash);
        // console.log('password:', password);
        // console.log('hash:', hash);
        // const isOk = bcrypt.compareSync(password, hash);
        // console.log('isOk:', isOk);
        // return isOk;
      }
    