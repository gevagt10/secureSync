var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../models/user');

var path = '../uploads/';
var mime = require('mime');
var utils = require('../config/utils');

var policy = require('../policy/securityPolicy');
// Date and time
var moment = require('moment');

//var sleep = require('sleep');
// Login
router.post('/authenticate', function (req, res) {

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.status(403).send('Authentication failed. email not found.');
        } else if (user) {
            // check if password.js matches
            if (user.password != req.body.password) {
                return res.status(403).send('Authentication failed. Wrong password');
            } else {
                // if user is found and password.js is right
                // create a token

                var token = jwt.sign(user, config.secret, {
                    expiresIn: '1h' // expires in 1 hour
                });
                user.token = token;

                user.oldPasswords = 'undefined';
                user.password = 'undefined';

                return res.json({
                    success: true,
                    user: user
                });

            }
        }
    });
});

// Register
router.post('/register', function (req, res) {

    User.find({'email': req.body.email}, function (err, user) {
        if (err) throw err;

        //User found.
        if (user.length != 0) {
            if (user[0].email) {
                //Forbidden error
                return res.status(403).send('Email already exists, Email: ' + user[0].email);
            }
        }
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            oldPasswords: {'date': moment(), 'pass': req.body.password}
        }, function (err, user) {
            if (err) return res.send(err);
            // Return
            return res.json({
                user: user,
                message: "Registration successfully"
            });
        });
    });


});

/* ANY GET */
router.get('/*', function (req, res) {
    //console.log("ANY GET");
    var path = __dirname.replace('routes', '');
    res.sendFile(path + '/public/index.html');
});

module.exports = router;