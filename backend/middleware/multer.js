// gestion des données formulaires multipart/form-data
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({ // appel de diskstorage dans un objet avec ses 2 keys destination et filename
    destination: function (req, file, callback){
      callback(null,"uploads");
    },
    filename: function (req, file, callback) {
      // const fileName = file.originalname.toLowerCase().split(" ").join("-") + Date.now() + ".webp";
      callback(null, file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "") + Date.now() + '.' + MIME_TYPES[file.mimetype]);
    }
  });
  const upload = multer({storage}); // on appelle la fonction multer et on lui passe un obj qui a une key storage et sa valeur est storage: storage
  
  module.exports ={ upload };