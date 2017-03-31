var express  = require('express');
var router   = express.Router();

var multer = require('multer');
var jwt      = require('jsonwebtoken');

// Models
//var User     = require('../models/user');
var File     = require('../models/file');

// Encrypt files
var fs = require('fs');
var encryptor = require('file-encryptor');
var key = 'fdfdfdfdf';
var option = { algorithm : 'aes256' };
var path = '../uploads/';
var config   = require('../config/config');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

/** Get all files **/
router.post('/get', function (req, res) {

    File.find({ 'user._id': req.body.userid },function(err, files) {
        if (err) throw err;

        return res.json({
            success: true,
            files: files
        });

    });

});




/** Check file before download file **/
router.post('/download', function (req, res) {
    File.findOne({_id: req.body.fileid}, function (err, file) {
        // Genrate temp token for files
        var token = jwt.sign({file: 'file'}, config.fileSecret, {
            expiresIn: '10s'
        });
        if (file) {
            return res.json({
                success: true,
                filename: file.name,
                token:token
            });
        } else {
            return res.json({
                success: false
            });
        }
    });
});

// Download File
router.get('/download/:filename/:token', function (req, res,next) {
    var filename = path + req.params.filename;
    // Change suffix file to DAT
    var customFile = filename.substr(0, filename.lastIndexOf(".")) + ".dat";
    if (fs.existsSync(customFile)) {
        encryptor.decryptFile(customFile, filename, key, option, function (err) {
            if (err) {
                console.log("ERROR");
                return res.json({
                    success: false,
                    message: 'File not found.'
                });
            } else {
                // Callback for file download
                res.download(filename, function(err){
                    if (err) {
                        return res.json({
                            success: false
                        });
                    } else {
                        fs.unlink(filename);
                    }
                });
            }

        });
    } else {
        return res.json({
            success: false,
            message: 'File not found.'
        });
    }
});


/** Delete file **/
router.post('/delete', function (req, res) {
    File.findOne({_id: req.body.fileid}, function (err, file) {
        if (file) {
            File.remove({_id: req.body.fileid}, function (err) {
                if (err) {
                    return res.json({
                        success: false
                    });
                } else {
                    var filename =  path + file.name;
                    var customFile = filename.substr(0, filename.lastIndexOf(".")) + ".dat";
                    fs.unlink(customFile, function () {
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


/** Upload file **/
router.post('/upload', upload.single('file'), function (req, res) {
    //Check if file exist
    File.findOne({name: req.file.originalname}, function (err, file) {
        if (file) {
            return res.json({
                success: false
            });
        } else {
            var filename = path + req.file.filename;
            var customFile = filename.substr(0, filename.lastIndexOf(".")) + ".dat";
            if (fs.existsSync(filename)) {
                // Encrypt files
                encryptor.encryptFile(filename, customFile, key, option, function (err) {
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
                                // Delete regular file
                                fs.unlink(filename);
                                // Return notice to user
                                return res.json({
                                    success: true,
                                    file: newFile
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});


module.exports = router;



