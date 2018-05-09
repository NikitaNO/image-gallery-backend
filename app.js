const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

let albums, photos;

MongoClient.connect("mongodb://localhost:27017/imageGallery", (err, db) => {
  if (!err) {
    albums = db.collection('albums');
    photos = db.collection('photos');
    console.log("We are connected to db");
  } else {
    console.log("error connection", err);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('uploads'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('something hapend');
  next();
});

app.get('/albums', function (req, res, next) {
  albums.find({}).toArray((err, albums) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success', albums: albums ? albums : []});
    }
  })
})

app.get('/photos/:id', function (req, res, next) {
  console.log(req.params.id);
  photos.find({album_id: req.params.id}).toArray((err, photos) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success', photos: photos ? photos : []});
    }
  });
})

app.post('/albums', upload.single('avatar'), function (req, res, next) {
  albums.insert({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    cover_image: 1
  }, (err) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success'});
    }
  });
})

app.post('/photos', upload.single('avatar'), function (req, res, next) {
  photos.insert({
    id: 3,
    album_id: req.body.album_id,
    title: req.body.title,
    description: req.body.description,
    hash_tags: req.body.location,
  }, (err) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success'});
    }
  });
})

app.post('/photos/update', function (req, res, next) {
  photos.updateOne(
    {_id: ObjectId(`${req.body.photo}`)},
    { $set: req.body.data},
    (err, result) => {
    if (err) {
      res.send("error");
    } else {
      console.log(result);
      res.json({message: 'success'});
    }
  });
})

app.listen(8080);