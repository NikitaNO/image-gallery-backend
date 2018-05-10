const  express = require("express");
const multer  = require('multer');
const controller = require("./album.controller")
const avatarStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.mimetype.replace(/\w*\//, "."));
  },
});
const upload = multer({ storage: avatarStorage });

const router = new express.Router();


router.get('/albums', controller.getAlbums)

router.get('/search', controller.search)

router.get('/photos/:id', controller.getPhoto)

router.post('/photos', upload.single('image_file'), controller.cteatePhoto)

router.post('/albums', upload.single('cover_image'), controller.createAlbum)

router.post('/photos/copy', controller.copyPhoto)

router.post('/photos/update', controller.updatePhoto)

router.delete('/photos/:id', controller.deletePhoto)

module.exports = router;