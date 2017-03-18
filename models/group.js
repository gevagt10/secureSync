var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    name: String,
    user: Object,
    emails: Array
});

var Group = mongoose.model('group',groupSchema);

module.exports = Group;