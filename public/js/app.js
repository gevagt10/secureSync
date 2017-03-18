var app = angular.module('secureSync', [
    'ngRoute',
    'LocalStorageModule',
    'ngMessages',
    'ngMaterial',
    'ngFileUpload'
]);

app.config(function($routeProvider,$locationProvider) {

    $routeProvider.when('/', {
        title: 'Sign In',
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        resolve: {
            check: function ($location, sessionService) {
                if (sessionService.get('user')) {
                    $location.path('/home');
                }
            }
        }

    })
    .when('/home', {

        title: 'secureSync',
        templateUrl: '../views/home.html',
        controller: 'HomeCtrl',
        resolve: {
            check: function ($location, sessionService) {
                if (!sessionService.get('user')) {
                    $location.path('/');
                }
            }
        }
    })

    .when('/groups', {

        title: 'secureSync',
        templateUrl: '../views/groups.html',
        controller: 'GroupsCtrl',
        resolve: {
            check: function ($location, sessionService) {
                if (!sessionService.get('user')) {
                    $location.path('/');
                }
            }
        }

    })

    .when('/security', {

        title: 'Security policy',
        templateUrl: '../views/security.html',
        controller: 'SecurityCtrl',
        resolve: {
            check: function ($location, sessionService) {
                if (!sessionService.get('user')) {
                    $location.path('/');
                }
            }
        }
    })
    .when('/password', {

        title: 'Password policy',
        templateUrl: '../views/password.html',
        controller: 'PasswordCtrl',
        resolve: {
            check: function ($location, sessionService) {
                if (!sessionService.get('user')) {
                    $location.path('/');
                }
            }
        }

    })
    .when('/logout', {

        resolve: {
            logout: function ($location, sessionService) {
                sessionService.destroy();
                $location.path('/');
            }
        }

    })
    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});

app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('secureSync')
        .setStorageType('localStorage')
        .setNotify(true, true)
});

app.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$location', 'sessionService', function ($q, $location, sessionService) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if (sessionService.get('user') !== null) {
                    config.headers['x-access-token'] = sessionService.get('user').token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status == 401) {
                    sessionService.destroy();
                    $location.path('/');
                }
                return $q.reject(response);
            }
        };
    }]);

}]);

app.run(function($rootScope, $templateCache,sessionService) {

    // Page title
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title;
        }
    };

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setTitle(current.title);
        $rootScope.logged = (sessionService.get('user')) ? true: false;
        $templateCache.removeAll();
        //console.log('[EVENT] route changed.');
    });

});