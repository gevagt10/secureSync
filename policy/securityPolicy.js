var utils = require('../config/utils');
var moment = require('moment');
// Models
var User = require('../models/user');

module.exports = {

    isSecurityPolicyPermitted: function(policy) {
        if (!policy.complexity && !policy.history && !policy.expired && policy.length) return false;
        return true;
    },
    getSecurityPolicy: function (securityPolicy, user) {
        var policy = {};
        if (typeof securityPolicy !== 'undefined' && securityPolicy !== null){
            // Password policy
            policy.complexity = isPasswordComplexity(user.password, securityPolicy.password.complexity);
            policy.history = isPasswordHistoryEqual(securityPolicy.password.history, user.oldPasswords);
            policy.expired = isPasswordExpired(securityPolicy.password.expired, user.oldPasswords[0].date);
            policy.length = (securityPolicy.password.length >= getPasswordLength(user.password));
            // Security policy
            policy.readwrite = securityPolicy.readwrite ? securityPolicy.readwrite : 'undefined';
            policy.lock = securityPolicy.lock ? 'true' : 'false';
            //console.log(policy)
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
function isPasswordComplexity(userPassword,passwordComplexity) {
    var userPasswordComplexity = getPasswordComplexity(userPassword);
    if (passwordComplexity === "Easy") {
        return false;
    } else if (passwordComplexity === "Medium" && (userPasswordComplexity === "Medium" || userPasswordComplexity === "Hard")) {
        return false;
    } else if (userPasswordComplexity === "Hard") {
        return false;
    }
    return true
}
// return password length
function getPasswordLength(password) {
    return password.length;
}
// Check password history
function isPasswordHistoryEqual(passwordHistory, userPasswords) {
    var i;
    if (userPasswords.length > 0) {
        for (i = 1; i < userPasswords.length - 1 && i < passwordHistory; i++) {
            if (userPasswords[0].pass === userPasswords[i].pass) {
                return true;
            }
        }
    }
    return false;
}

// Check password expired time
function isPasswordExpired(userTimePassword,passwordExpired) {
    // Current date
    var CurrentDate = moment();
    //
    var temp = moment(passwordExpired);
    var userPasswordTime = temp.clone().add(1, 'minute');
    //console.log(temp.format());
    //console.log(userPasswordTime.format());

    if (userTimePassword === "1 hour") {
        userPasswordTime = temp.clone().add(1, 'hour');
    } else if (userTimePassword === "1 week") {
            userPasswordTime = temp.clone().add(1, 'week');
    }

    if (CurrentDate.isSameOrAfter(userPasswordTime)) {
        return true;
    } else {
        return false;
    }

}