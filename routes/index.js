var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    cors = require('cors'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

aws.config.update({
    secretAccessKey: 'iwwwbjGd3uHeo/3iAGkps80HENNVkYx0IIc7aK6H',
    accessKeyId: 'AKIAIM45AOCRXJ5UHGPA',
    region: 'us-east-1'
});

var router = express.Router();
var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'uploadsbfiles',
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gagan' });
});

// router.post('/upload', upload.array('upl',1), function (req, res, next) {
//   console.log(req.file.filename);
//   res.send("Uploaded!");
// });

router.post( "/upload", multipartyMiddleware, function( req, res, next ) {
  fs.readFile(req.files.file.path, function (err, data) {
    // set the correct path for the file not the temporary one from the API:
    var file_path = "/public/images/" + req.body.name;

    // copy the data from the req.files.file.path and paste it to file.path
    fs.writeFile(file_path, data, function (err) {
      if (err) {
        return console.warn(err);
      }
      //console.log("The file: " + req.files.file.name + " was saved to " + file_path);
    });
  });
  res.send("Uploaded!");
});

router.get( "/upload/*", function(req, res, cb) {
  res.sendFile("/public/images/" + req.params[0]);

});

module.exports = router;
