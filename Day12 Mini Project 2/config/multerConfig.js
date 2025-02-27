const multer = require('multer');
const crypto = require('crypto');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploaded')
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12, (err, buff) => {
        const filename =  buff.toString('hex') + path.extname(file.originalname);
        cb(null, filename);
      })
    }
  })
  
const upload = multer({ storage: storage })

module.exports = upload;