const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 4000;

app.use(cors()); //les middleware vont etre exécutés ici
app.use(express.json()); // capable de lire les body en JSON

function sayHi(req,res){
  res.send("Hello");
}

app.get('/', sayHi );
app.post('/api/auth/signup', signUp);

app.listen(PORT, function(){
  console.log(`Server is running on: ${PORT}`);
});

function signUp(req, res){
  const body = req.body;
  console.log('body:', body);
    res.send({message:'OK SignUp'}); // qq soit le signup, on va lui renvoyer un resp.send 200 OK

  }