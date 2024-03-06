// require('dotenv').config();
const { app } = require('./config/app'); // app qui a été définie dans le dossier config
const { usersRouter } = require ('./controllers/users');
const { booksRouter } = require ('./controllers/books');

const PORT = process.env.PORT || 4000; // soit on a un PORT dans le .env soit sur le port par défaut 4000

// Req GET sur app, ensuite  on renvoie une réponse message "Serveur fonctionnel"
app.get('/', (req, res) => res.send ("Serveur fonctionnel !") );

app.use('/api/auth', usersRouter); // dorénavant tout ce qui passe par api/auth, ça passera par usersRouter
app.use('/api/books', booksRouter); // dorénavant tout ce qui passe par api/books ça passera par booksRouter

// on fait tourner notre PORT
app.listen(PORT, function() {
    console.log(`Serveur tourne sur: ${PORT}`);
  });


// app.post('/api/auth/signup', signUp); // quand on se connecte au path et donc l'url ou route, ça déclence la fonciton "signup"
// app.post('/api/auth/login', login);
// app.get ('/api/books', booksGET); // à chaque fois qu'on fait un booksGET, ça va d'abord passer par une fonction logReq
// app.post("/api/books", upload.single("image"), booksPOST);// besoin d'un middleware qui va recupérer les données du formData, et c'est la fonction upload qui contient ce middleware
// quand on met une uatre fonction on appelle ça un middleware, et il faut que ce middleware appelle la fct next(), la req passera tjs d'un middleware à celui d'après jusqu'à la fct finale q'uon appele le controller
// "image" --> Image: binary--> le nom du champ de la requete 

// console.log('password in .env', process.env); // process .env recupere toutes les variables d'environnement dans fichier .env
// variables d'environnement = tout ce qu'on passe dans le runtime
// avec package dotenv package qui va charger toutes nos const d'env et le mettre dans notre process env

