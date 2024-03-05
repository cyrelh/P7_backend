const express = require('express');
const app = express();
require("./database/mongo");
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

const users =[]; // Array users vide


  function signUp(req, res){
    const body = req.body;
    console.log('body:', body);


    const email = req.body.email; // à pusher dans l'array de users
    const password = req.body.password;// à pusher dans l'array de users
    
    // verification avant de pusher les users
    const userDatabase = users.find(user => user.email === email);// Methode FIND pour chaque users, trouve moi le user tq user.email === email
    // FIND trouve soit un objet {x , x} soit un 'undefined'
    // console.log('userDatabase:', userDatabase);
    if (userDatabase != null){ // 
      res.status(400).send("Email déjà existant");
      return; // on ne va pas faire de nouveaux user (donc sil existe deja -> pas de push en dessous)
    }
    const user = {
      email: email,
      password: password
    };
    users.push(user); // Dans l'array users, on va se pusher un user
    // console.log('users:', users);
    res.send('User enregistré'); // qq soit le signup, on va lui renvoyer un resp.send 200 OK
  
    }

    function login(req, res){
      const body = req.body; // sur la requêt il y aura un body
      console.log('body:', body);
      console.log('users in database:', users);

      const userDatabase = users.find(user => user.email === email);
      if  (userDatabase == null) { // si userdatabase est égal à null ou undefined --> on cherche à se logger alors qu'on n'est pas encore dans la base de données
        res.status(401).send('Mauvais email');
        return;
      }
      const passwordDatabase = userDatabase.password;
      if (passwordDatabase =! body.password) {
        res.status(401).send('Mauvais password');
        return;
      }


      // if (body.email != 'elhakim.cyril@outlook.com'){
      //   res.status(401).send('Erreur');
      //   return; // IMPORTANT si c pas bon, la requete ne s'envoie pas, on s'arret là
      // }
      // if (body.password != '123456'){
      //   res.status(401).send('Erreur');
      //   return; // IMPORTANT si c pas bon, la requete ne s'envoie pas, on s'arret là
      // }
        res.send({      // qq soit le signup, on va lui renvoyer un resp.send 200 OK
          userId:"12345",
          token:'token'
        });       
    
    
      }
    