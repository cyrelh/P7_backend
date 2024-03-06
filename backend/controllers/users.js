const { User } = require('../models/User');// avec cet User , on va pouvoir utiliser ce modèle de mongo pour pouvoir enregistrer des data en base de données 
const bcrypt = require('bcrypt');
const express = require('express');

const usersRouter = express.Router(); //dans le usersRouter on a seulement 2 requetes
usersRouter.post('signUp', signUp);
usersRouter.post('login', login);

/*FONCTION SIGNUP*/

   async function signUp(req, res){
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
        // console.log('hash:', hash);
        return hash;
      }

      function isPasswordGood(password, hash){ // function qui permet de comparer 2 mots de passe
       return bcrypt.compareSync(password, hash);
      }

      // User.deleteMany({}).then(() => {
      //   console.log('Supression de tous les users dans la Database')
      // });
    



module.exports = { usersRouter };