var mongoose = require('mongoose');
var securitySchema = new mongoose.Schema({
    name: String,
    password: Object,
    readwrite: String,
    lock: String,
    userId:String
});
var Security = mongoose.model('security',securitySchema);
module.exports = Security;