var mongoose = require('mongoose');
var passwordSchema = new mongoose.Schema({
    name: String,
    complexity: String,
    history: String,
    expired: String,
    length: String,
    userId:String
});
var Password = mongoose.model('password',passwordSchema);
module.exports = Password;