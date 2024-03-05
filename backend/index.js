const express = require('express');
const app = express();
const { User } = require("./database/mongo");// avec cet user, on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const cors = require('cors');
const PORT = 4000;

app.use(cors()); //les middleware vont etre exécutés ici
app.use(express.json()); // capable de lire les body en JSON

function sayHi(req,res){
  res.send("Hello");
}

app.get('/', sayHi );
app.post('/api/auth/signup', signUp); // récupéré du headers RequestURL
app.post('/api/auth/login', login);



app.listen(PORT, function(){
  console.log(`Server is running on: ${PORT}`);
});


  async function signUp(req, res){
    const body = req.body;
    console.log('body:', body);

    const email = req.body.email; // à pusher dans l'array de users
    const password = req.body.password;// à pusher dans l'array de users
    
    const userDatabase = await User.findOne({ // User est un modele de mongo importé
      // .find renvoie toujours une array []
      //.findOne renvoie un seul objet
      email: email // il faut vérifier l'email qu'on a reçu
    });
    console.log('userDatabase:', userDatabase);

    if (userDatabase != null){ // une array est toujours !=null
      res.status(400).send("Email déjà existant");
      return; // on ne va pas faire de nouveaux user (donc sil existe deja -> pas de push en dessous)
    } // il va donc return sinon il va essayer de le fabriquer
        // Si je cherche à faire un user à partir de l'email qui existe dejà
        // il va dire email deja existant et va rien mettre dans base de données
    
    const user = {
      email: email,
      password: password
    };
    // users.push(user); // Dans l'array users, on va se pusher un user
    // console.log('users:', users);
    try{
      await User.create(user);
      throw new Error ('Panne database') // si ça marche pas, panne d'internet
    } catch(e){
      console.error(e);
      res.status(500).send('Erreur Serveur');
      return;
    }
    res.send('User enregistré'); // qq soit le signup, on va lui renvoyer un resp.send 200 OK
  
    }

    async function login(req, res){
      const body = req.body; // sur la requêt il y aura un body

      const userDatabase = await User.findOne({
        email: body.email // trouve moi un email utilisateur dans la base de données dont email = body.email
      });
      if  (userDatabase == null) { // si userdatabase est égal à null ou undefined --> on cherche à se logger alors qu'on n'est pas encore dans la base de données
        res.status(401).send('Mauvais email');
        return;
      }
      const passwordDatabase = userDatabase.password;
      if (passwordDatabase != body.password) {
        res.status(401).send('Mauvais password');
        return;
      }
// sil est bon on me renvoie un userid et un token
        res.send({
          userId: userDatabase._id,  // le userid ça sera l'_id du userdatabase
          token:'token'
        });
      }
    