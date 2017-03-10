// Data Service
app.factory('proxyService', function($http, $q) {

    var auth = 'http://localhost:3000/';
    var url = 'http://localhost:3000/api/';

    var register = function(data) {
        var deferred = $q.defer();
        $http.post(auth + 'register', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    var authenticate = function(data) {
        var deferred = $q.defer();
        $http.post(auth + 'authenticate', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    var getFiles = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'getfiles',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /** ------------------------------------------------------------ **/
    /** -------------------- Password functions -------------------- **/
    /** ------------------------------------------------------------ **/
    var getPasswordDetilas = function() {
        var deferred = $q.defer();
        $http.get(url + 'getPasswordDetilas').then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var createPasswordPolicy = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'createPasswordPolicy',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var getPasswordPolicies = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'getPasswordPolicies',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var removePasswordPolicy = function(data) {
        //var r = {_id:"sdsdsd"};
        var deferred = $q.defer();
        $http.post(url + 'removePasswordPolicy',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /** ------------------------------------------------------------ **/
    /** -------------------- Security functions -------------------- **/
    /** ------------------------------------------------------------ **/
    var createSecurityPolicy = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'createSecurityPolicy',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var getSecurityPolicies = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'getSecurityPolicies',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var removeSecurityPolicy = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'removeSecurityPolicy',data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    return {
        register: register,
        authenticate: authenticate,
        getFiles:getFiles,
        getPasswordDetilas:getPasswordDetilas,
        createPasswordPolicy:createPasswordPolicy,
        getPasswordPolicies:getPasswordPolicies,
        removePasswordPolicy:removePasswordPolicy,
        createSecurityPolicy:createSecurityPolicy,
        getSecurityPolicies:getSecurityPolicies,
        removeSecurityPolicy:removeSecurityPolicy
    }

});
