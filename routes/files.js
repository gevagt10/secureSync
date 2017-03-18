var express  = require('express');
var router   = express.Router();

var multer = require('multer');

// Models
//var User     = require('../models/user');
var File     = require('../models/file');

// Encrypt files
var fs = require('fs');
var encryptor = require('file-encryptor');
var key = '12345';
var options = { algorithm: 'aes256' };
var path = '../uploads/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

router.post('/get', function (req, res) {

    File.find({ 'user._id': req.body.userid },function(err, files) {
        if (err) throw err;

        return res.json({
            success: true,
            files: files
        });

    });

});

router.post('/delete', function (req, res) {

    File.findOne({ _id: req.body.fileid }, function (err, file) {

        if (file) {

            File.remove({ _id: req.body.fileid }, function(err) {

                if (err) {

                    return res.json({
                        success: false
                    });

                } else {

                    fs.unlink(path + file.name, function () {
                        if (err) throw err;

                        return res.json({
                            success: true
                        });

                    });

                }

            });

        } else {

            return res.json({
                success: false
            });

        }

    });

    /*
    File.remove({ _id: req.body.fileid }, function(err) {

        if (err) {

            return res.json({
                success: false
            });

        } else {

            fs.unlink('/tmp/hello', function () {
                if (err) throw err;

                return res.json({
                    success: true
                });

            });

        }

    });
    */

});

router.post('/upload', upload.single('file'), function (req, res) {

    // Check if file exist
    File.findOne({ name: req.file.originalname }, function (err, file) {

        if (file) {

            return res.json({
                success: false
            });

        } else {

            // Encrypt files
            encryptor.encryptFile(path + req.file.filename, path + req.file.filename, key, options, function (err) {

                if (err) {

                    return res.json({
                        success: false
                    });

                } else {

                    delete req.body.user.password;
                    delete req.body.user.token;

                    File.create({
                        name: req.file.originalname,
                        user: req.body.user,
                        path: req.file.destination,
                        size: req.file.size
                    }, function (err, newFile) {
                        if (newFile) {
                            return res.json({
                                success: true,
                                file: newFile
                            });
                        }
                    });

                }

            });

        }

    });

});

module.exports = router;


// encryptor.decryptFile(req.file.filename, req.file.filename, key, options, function(err) {
//
// });
// Return