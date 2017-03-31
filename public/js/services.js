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

// Storage Service
app.factory('cookieService', function($cookieStore) {

    return {
        set: function(key, value) {
            return $cookieStore.put(key, value);
        },
        get: function(key) {
            return $cookieStore.get(key);
        },
        update: function(key, obj) {
            $cookieStore.put(key, angular.extend($cookieStore.get(key), obj));
        },
        destroy: function(key) {
            return $cookieStore.remove(key);
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

    var _file = {};
    function getFile(){
        return _file;
    }
    function setFile(file) {
        _file = file;
    }

    return{
        getPassword:getPassword,
        setPassword:setPassword,
        setFile:setFile,
        getFile:getFile
    }
});
