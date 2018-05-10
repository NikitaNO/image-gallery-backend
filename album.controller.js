const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

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

const getAlbums = (req, res, next) => {
  albums.find({}).toArray((err, albums) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success', albums: albums ? albums : []});
    }
  })
}

const getPhoto = (req, res, next) => {
  console.log(req.params.id);
  photos.find({album_id: req.params.id}).toArray((err, photos) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success', photos: photos ? photos : []});
    }
  });
};

const createAlbum = (req, res, next) =>  {
  albums.insert({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    cover_image: req.file.filename,
    date: new Date().toISOString()
  }, (err) => {
    console.log('result',album._id);
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success'});
    }
  });
}

const cteatePhoto = (req, res, next) =>{
  photos.insert({
    album_id: req.body.album_id,
    title: req.body.title,
    description: req.body.description,
    hash_tags: req.body.hash_tags,
    image_file: req.file.filename,
    date: new Date().toISOString()
  }, (err) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success'});
    }
  });
}

const copyPhoto = (req, res, next) => {
  photos.insert({
    album_id: req.body.album_id,
    title: req.body.title,
    description: req.body.description,
    hash_tags: req.body.hash_tags,
    image_file: req.body.image_file,
    date: new Date().toISOString()
  }, (err) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success'});
    }
  });
}

const updatePhoto = (req, res, next) => {
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
}

const deletePhoto = (req, res, next) => {
  console.log('remove', req.params.id);
  photos.remove({_id: ObjectId(`${req.params.id}`)}, true, (err) => {
    if (err) {
      res.send("error");
    } else {
      res.json({message: 'success'});
    }
  })
}

const search = (req, res, next) => {
  const result = {};
  console.log('remove', req.query);
  albums.find({ $or:[
    {"name": {$regex: new RegExp(req.query.name)}},
    {"description": {$regex: new RegExp(req.query.name)}}
  ]}).toArray((err, albums) => {
      if (err){
        console.log(err);
        res.send("error");
      } else {
        result.albums = albums;
        photos.find({ $or:[
          {"title": {$regex: new RegExp(req.query.name)}},
          {"description": {$regex: new RegExp(req.query.name)}},
          {"hash_tags": {$regex: new RegExp(req.query.name)}},
        ]}).toArray((err, photos) => {
            if (err){
              console.log(err);
              res.send("error");
            } else {
              result.photos = photos;
              res.json({message: 'success', result: result});
            }
          }
        )
      }
    }
  )
}



module.exports = {
  getAlbums,
  search,
  getPhoto,
  createAlbum,
  cteatePhoto,
  copyPhoto,
  updatePhoto,
  deletePhoto
}