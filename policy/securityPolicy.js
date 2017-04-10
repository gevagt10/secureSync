var utils = require('../config/utils');
// Models
var User = require('../models/user');
module.exports = {


    // Return password lentgh

    getPasswordExpired: function (expiredTime, lastPasswordTime) {
        var nowTime = utils.getDate();
        console.log(nowTime);
        // console.log(expiredTime);
        // console.log(lastPasswordTime[0].date);
        //if (expiredTime=="1 min") console.log("fdfd");
        //console.log(time);
    },
    isSecurityPermited: function (securityPolicy, user) {
        var policy = {};
        //console.log(user);
        if (securityPolicy.password.complexity === getPasswordComplexity(user.password)) {
            policy.complexity = false;
        } else {
            policy.complexity = true;
        }
        if (securityPolicy.password.length <= getPasswordLength(user.password)) {
            policy.length = false;
        }   else {
            policy.length = true;
        }
        if (isPasswordHistoryExpired(securityPolicy.password.history,user.oldPasswords)) {
            policy.history = true;
        } else {
            policy.history = false;
        }
        return policy;
    },

};
/**  Private functions for security policy **/
// Password complexity
function getPasswordComplexity(password) {
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
    return "Easy";
}
// return password length
function getPasswordLength(password) {
    return password.length;
}
// Check password history
function isPasswordHistoryExpired(passwordHistory, userPasswords) {
    var i;
    if (userPasswords.length > 0) {
        for (i = 0; i < userPasswords.length - 1 && i < passwordHistory; i++) {
            if (userPasswords[0].pass === userPasswords[i + 1].pass) {
                return true;
            }
        }
    }
    return false;
}