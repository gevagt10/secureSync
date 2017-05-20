var fs = require('fs');
module.exports = {
    getDate: function () {
        var date = new Date().toISOString().replace(/T/, ' ').  // replace T with a space
        replace(/\..+/, '');                                    // delete the dot and everything after)
        return date;
    },
    getKey: function () {

        return fs.readFileSync('F://key.txt', 'utf8', function (err, data) {
            if (err) throw err;
            return data;
        });

    }

    // getPasswordComplaxity: function() {
    //     this.Easy = "easy";
    //     this.Medium = "easy";
    //     this.Hard = "Hard";
    // }

};