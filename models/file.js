var mongoose = require('mongoose');
var fileSchema = new mongoose.Schema({
    name: String,
    user: Object,
    path: String,
    size: String,
    emails: Array,
    security: Object
});
var File = mongoose.model('file',fileSchema);
module.exports = File;