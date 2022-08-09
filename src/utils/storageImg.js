const multer = require('multer')

/* 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/images/products"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
  },
});
*/

let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + req.user.alias + '.webp')
    }
})

let upload = multer({storage: storage});

module.exports = upload