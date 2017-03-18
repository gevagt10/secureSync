var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./config/database');

//Util
const util = require('util');

// Route
var auth = require('./routes/auth');  // Login && Register
var api = require('./routes/api'); // API

var app = express();
// configuration ===============================================================

//DB
mongoose.Promise = global.Promise;
mongoose.connect(database.url, function (err) {
    if (err) throw err;
});

// uncomment after placing your favicon in /public
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(function(req,res,next) {
    var _send = res.send;
    var sent = false;
    res.send = function(data) {
        if (sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

// Routing
app.use('/', auth);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
