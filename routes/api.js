var express  = require('express');
var router   = express.Router();
var jwt      = require('jsonwebtoken');
var config   = require('../config/config');
var utils = require('../config/utils');

var User     = require('../models/user');
var Password = require('../models/password');
var Security = require('../models/security');
var Group    = require('../models/group');
// Routes
var Files    = require('../routes/files');
// Date and time
var moment = require('moment');

/* MIDDLEWARE */
router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });

            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else { // Check if request is a file for download
        var fileToken = JSON.parse(req.cookies.token);
        if (fileToken) {
            jwt.verify(fileToken, config.fileSecret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'No token provided.'
                    });
                }
                req.decoded = decoded;
                next();
            });
        }   else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }



    }
});




// Files
router.use('/files', Files);

// Password
router.post('/getPasswordDetilas', function(req,res){getPasswordDetilas(req,res)});
router.post('/getPasswordPolicies', function(req,res){getPasswordPolicies(req,res)});
router.post('/createPasswordPolicy', function(req,res){createPasswordPolicy(req,res)});
router.post('/removePasswordPolicy', function(req,res){removePasswordPolicy(req,res)});

// Security
router.post('/createSecurityPolicy', function(req,res){createSecurityPolicy(req,res)});
router.post('/getSecurityPolicies', function(req,res){getSecurityPolicies(req,res)});
router.post('/removeSecurityPolicy', function(req,res){removeSecurityPolicy(req,res)});

// Groups
router.post('/createGroup', function(req,res){createGroup(req,res)});
router.post('/getGroups', function(req,res){getGroups(req,res)});
router.post('/deleteGroup', function(req,res){deleteGroup(req,res)});


//Profile
router.post('/updateProfile', function(req,res){updateProfile(req,res)});

/**=====================================================**/
/**                     Password                        **/
/**==================================================== **/

// static function for password policy detiles
function getPasswordDetilas(req,res) {

    return res.json({
        Complexity: [{id:"1",name:"Easy"},{id:"2",name:"Medium"},{id:"3",name:"Hard"}],
        History: [{id:"1",name:"1"},{id:"2",name:"2"},{id:"3",name:"3"}],
        Expired: [{id:"1",name:"1 min"},{id:"2",name:"1 hour"},{id:"3",name:"1 week"},{id:"4",name:"never"}],
        Length: [{id:"1",name:"5"},{id:"2",name:"6"},{id:"3",name:"7"}]
    });
}

// Create password policy
function createPasswordPolicy(req,res) {
    //console.log(req.body.complixity['name']);
    // Check first if name exist
    Password.findOne({
        name: req.body.name
    }, function(err, password) {
        if (err) throw err;
        if (password) {
            return res.status(403).send('Name already exists');
        } else  {
            Password.create({
                name : req.body.name,
                complexity: req.body.complexity.name,
                history: req.body.history.name,
                expired: req.body.expired.name,
                length: req.body.length.name,
                userId: req.body.userId
            }, function(err, password) {
                if (err)
                    return res.send(err);
                // Return
                return res.json({'password':password,'message':"Policy added successfully"});
            });
        }
    });
}

// Get all password policy
function getPasswordPolicies(req,res) {
    Password.find({userId:req.body._id},function(err,password){
        if (err) throw err;
        if (password) {
            res.send(password);
        }
    });
}

// Remove password policy
function removePasswordPolicy(req,res) {
    Password.remove({_id: req.body._id},function(err){
        if (err) res.status(404).send('There is an error remove policy');
        return res.json({'message':"Policy removed"});
    });
}

/** =====================================================**/
/**                     Security                         **/
/** ==================================================== **/

function createSecurityPolicy(req,res) {
    //console.log(req.body.password._id);
    Security.findOne({
        name: req.body.name
    }, function(err, security) {
        if (err) throw err;
        if (security) {
            return res.status(403).send('Name already exists');
        } else  {
            Security.create({
                name : req.body.name,
                password: req.body.password,
                readwrite: req.body.readwrite,
                lock: req.body.lock,
                userId: req.body.userId
            }, function(err, security) {
                if (err)
                    return res.send(err);
                // Return
                return res.json({'security':security,'message':"Security policy added successfully"});
            });
        }
    });
}

function getSecurityPolicies(req,res) {
    Security.find({userId:req.body._id},function(err,security){
        if (err) throw err;
        if (security) {
            res.send(security);
        }
    });
}

// Remove security policy
function removeSecurityPolicy(req,res) {
    Security.remove({_id: req.body._id},function(err){
        if (err) res.status(404).send('There is an error remove policy');
        return res.json({'message':"Policy removed"});
    });
}



/** =====================================================**/
/**                     Group                            **/
/** ==================================================== **/
// Groups
function createGroup(req, res) {
    Group.findOne({
        'name': req.body.name,
        'user._id': req.body.user._id
    }, function(err, group) {
        if (group) {
            return res.json({
                success: false
            });
        } else {
            Group.create({
                name : req.body.name,
                user : req.body.user,
                emails : req.body.emails
            }, function(err, group) {

                return res.json({
                    success: true,
                    group: group
                });
            });
        }
    });
}
function getGroups(req, res) {
    Group.find({'user._id': req.body._id}, function (err, groups) {
        if (err) throw err;
        return res.json({
            success: true,
            groups: groups
        });

    });
}
// Remove security policy
function deleteGroup(req,res) {
    Group.remove({_id: req.body._id},function(err){
        if (err) res.status(404).send('There is an error remove policy');
        return res.json({
            success: true
        });
    });
}
/** =====================================================**/
/**                     Profile                         **/
/** ==================================================== **/

function updateProfile(req, res) {
    //console.log(req.body);
    User.update({_id:req.body._id},{name:req.body.name,password:req.body.password,$push:{oldPasswords: { $each: [{date:moment(),pass:req.body.password}],$position:0}}},{upsert: true}, function (err, records) {
        if (records) {
            return res.json({
                success: true
            });
        } else {
            return res.json({
                success: false
            });
        }
    });

}


/* ANY POST */
router.post('*', function(req, res) {
    return res.status(403).send({
        success: false,
        message: 'There was a problem completing this request.'
    });
});

module.exports = router;