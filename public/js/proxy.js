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

    /** ------------------------------------------------------------ **/
    /** ---------------------- Files functions --------------------- **/
    /** ------------------------------------------------------------ **/

    var getFiles = function(data) {
        var deferred = $q.defer();
        $http.post(url + 'files/get', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var deleteFile = function (data) {
        var deferred = $q.defer();
        $http.post(url + 'files/delete', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var downloadFile = function (data) {
        var deferred = $q.defer();
        $http.post(url + 'files/download' ,data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var shareFile = function (data) {
        var deferred = $q.defer();
        $http.post(url + 'files/shareFile', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var removeSharedFile = function (data) {
        var deferred = $q.defer();
        $http.post(url + 'files/removeSharedFile', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /** ------------------------------------------------------------ **/
    /** -------------------- Password functions -------------------- **/
    /** ------------------------------------------------------------ **/

    var getPasswordDetilas = function(user) {
        var deferred = $q.defer();
        $http.post(url + 'getPasswordDetilas',user).then(function(response) {
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

    /* ------------------------------------------------------------ */
    /* -------------------- Groups functions ---------------------- */
    /* ------------------------------------------------------------ */
    var createGroup = function (group) {
        var deferred = $q.defer();
        $http.post(url + 'createGroup', group).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var getGroups = function (user) {
        var deferred = $q.defer();
        $http.post(url + 'getGroups', user).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var deleteGroup = function (data) {
        var deferred = $q.defer();
        $http.post(url + 'deleteGroup', data).then(function(response) {
            deferred.resolve(response);
        }).catch(function(data, status, headers, config) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /* ------------------------------------------------------------ */
    /* ---------------------------- Profile ----------------------- */
    /* ------------------------------------------------------------ */
    var updateProfile = function (user) {
        var deferred = $q.defer();
        $http.post(url + 'updateProfile', user).then(function(response) {
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
        downloadFile:downloadFile,
        deleteFile: deleteFile,
        removeSharedFile:removeSharedFile,
        getPasswordDetilas:getPasswordDetilas,
        createPasswordPolicy:createPasswordPolicy,
        getPasswordPolicies:getPasswordPolicies,
        removePasswordPolicy:removePasswordPolicy,
        createSecurityPolicy:createSecurityPolicy,
        getSecurityPolicies:getSecurityPolicies,
        removeSecurityPolicy:removeSecurityPolicy,
        createGroup: createGroup,
        getGroups:getGroups,
        deleteGroup:deleteGroup,
        shareFile:shareFile,
        updateProfile:updateProfile
    }

});
