// Login & Register
app.controller('LoginCtrl', function($scope,$timeout,$location,proxyService,messageService,sessionService) {

    $scope.user = {};
    $scope.selected = 2;

    $scope.model = {
        email: 'ageva10@gmail.com',
        password: '102030'
    };

    $scope.login = false;
    $scope.isError = false;
    $scope.isSuccess = false;


    /** --------------  GUI -------------- **/
    $scope.selectedTab = function(n) {
        $scope.selected = n;
        $scope.isError = false;
        $scope.isSuccess = false;
    };

    $scope.registerForm = function(user) {
        register(user);
    };

    $scope.loginForm = function(user) {
        authenticate(user);
    };

    /** --------------  Functions -------------- **/
    function success() {
        $scope.isSuccess = true;
        $scope.isError = false;
    }

    function faield() {
        $scope.isSuccess = false;
        $scope.isError = true;
    }

    /** --------------  ASYNC Functions -------------- **/
    // Register
    function register(user){
        proxyService.register(user).then(function(response){
            // Clear user details
            $scope.user = "";
            $scope.selectedTab(2);
            messageService.set($scope, response.data.message);
            success();
        },function(error){
            if (error.status==403)
                messageService.set($scope, error.data);
            else
                messageService.set($scope, "There is a problem complete your request");
            faield();
        });
    }

    // Login
    function authenticate(user) {
        proxyService.authenticate(user).then(function(response) {

            sessionService.destroy();
            sessionService.set('user', response.data.user);

            $timeout(function() {
                $location.path('/home');
            }, 1000);

        },function(error) {
            messageService.set($scope, error.data);
            faield();
        });

    }

});