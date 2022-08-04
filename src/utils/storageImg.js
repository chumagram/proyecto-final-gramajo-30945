const multer = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + req.body.alias)
    }
})

let upload = multer({storage: storage});

module.exports = upload