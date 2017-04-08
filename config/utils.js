module.exports = {
    getDate: function () {
        var date = new Date().toISOString().replace(/T/, ' ').  // replace T with a space
        replace(/\..+/, '');                                    // delete the dot and everything after)
        return date;
    }
    // getPasswordComplaxity: function() {
    //     this.Easy = "easy";
    //     this.Medium = "easy";
    //     this.Hard = "Hard";
    // }

};