var express  = require('express');
var router   = express.Router();

var multer = require('multer');

// Models
//var User     = require('../models/user');
var File     = require('../models/file');

// Encrypt files
var fs = require('fs');
var encryptor = require('file-encryptor');
var key = 'fdfdfdfdf';
var option = { algorithm : 'aes256' };
var path = '../uploads/';
var pa = require("path");

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
    //console.log(req.body.fileid);
    // var fileToSend = fs.readFileSync(filePath);
    File.findOne({_id: req.body.fileid}, function (err, file) {
        if (file) {
            return res.json({
                success: true,
                filename: file.name
            });
            // var filename = path + file.name;
            // console.log(filename);
            // return res.download(filename);
        } else {
            return res.json({
                success: false
            });
        }
    });
});

// Download File
router.get('/download/:filename', function (req, res,next) {
    var filename = path + req.params.filename;
    console.log(filename);
    var customFile = filename.substr(0, filename.lastIndexOf(".")) + ".dat";
    //res.download(filename);
    encryptor.decryptFile(customFile, '../uploads/fr.jpg', key, option, function (err) {
        if (err) {
            console.log("ERROR");
            return res.json({
                success: false,
                message: 'File not found.'
            });
        } else {
            res.download('../uploads/fr.jpg');
        }

    });
    //res.download(filename);
    //return res.download(filename);
    //var file = fs.createWriteStream(filename);
    // if (fs.existsSync(filename)) {
    //     fs.readFile(filename, function (error, pgResp) {
    //         if (!error) {
    //             //console.log("dfdfd");
    //             //res.writeHead(200, { 'Content-Type': mime.lookup(filename) });
    //             //res.write(pgResp);
    //             res.download(filename);
    //             // encryptor.decryptFile(filename, '../uploads/sec.jpg', key, options, function(err) {
    //             //     if (err) {
    //             //         console.log("ERROR");
    //             //         return res.json({
    //             //             success: false,
    //             //             message: 'File not found.'
    //             //         });
    //             //     } else {
    //             //         res.download('../uploads/sec.jpg');
    //             //     }
    //             //
    //             // });
    //
    //             //next();
    //         }
    //         //res.end();
    //     });
    // } else {
    //     return res.json({
    //         success: false,
    //         message: 'File not found.'
    //     });
    // }
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
            console.log(customFile);
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



