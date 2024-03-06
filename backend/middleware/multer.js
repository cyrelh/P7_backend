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
  
  module.exports ={ upload };