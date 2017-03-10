// Messages Service
app.factory('messageService', function ($sce) {

    return {
        set: function (scope, response, numbers) {

            if (typeof response == 'object') {

                var i = 1, text = '';
                angular.forEach(response, function (value) {
                    text += (numbers) ? i + '. ' + value : value;
                });
                scope.response = $sce.trustAsHtml(text);

            } else {
                scope.response = $sce.trustAsHtml(response);
            }

        }
    }

});
// Storage Service
app.factory('sessionService', function(localStorageService) {

    return {
        set: function(key, value) {
            return localStorageService.set(key, value);
        },
        get: function(key) {
            return localStorageService.get(key);
        },
        update: function(key, obj) {
            localStorageService.set(key, angular.extend(localStorageService.get(key), obj));
        },
        destroy: function() {
            return localStorageService.clearAll();
        }
    }
});

app.factory('dialogService', function() {
    var _passwordPolicy = {};
    function getPassword(){
        return _passwordPolicy;
    }
    function setPassword(policy) {
        _passwordPolicy = policy;
    }
    return{
        getPassword:getPassword,
        setPassword:setPassword
    }
});
