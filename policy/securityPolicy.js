var utils = require('../config/utils');
module.exports = {

    // Return password complixity
    getPasswordComplixity: function (password) {
        var i, j;
        var _force = 0;
        var _regex = /[$-/:-?{-~!"^_`\[\]]/g;

        for (i = 0; i < password.length; i++) {

            var _lowerLetters = /[a-z]+/.test(password);
            var _upperLetters = /[A-Z]+/.test(password);
            var _numbers = /[0-9]+/.test(password);
            var _symbols = _regex.test(password);
            //
            var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];

            var _passedMatches = 0;
            for (j = 0; j < _flags.length; j++) {
                if (_flags[j]) {
                    _passedMatches++;
                }
            }
            _force += 2 * (password.length) + ((password.length >= 10) ? 1 : 0);
            _force += _passedMatches * 10;
            // penality (short password)
            _force = (password.length <= 6) ? Math.min(_force, 10) : _force;

            // // penality (poor variety of characters)
            _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
            _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
            _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;
        }
        if (_force <= 10) return "Easy";
        if (_force <= 40) return "Medium";
        if (_force > 40) return "Hard";
    },

    // Return password lentgh
    getPasswordLength: function (password) {
        return password.length;
    },
    getPasswordExpired: function(expiredTime,lastPasswordTime) {
        var time = utils.getDate();
        if (expiredTime=="1 min") console.log("fdfd");
        //console.log(time);
    }
};