// Home controller
app.controller('SecurityCtrl', function($scope,$mdDialog,proxyService,sessionService) {

    // User session
    var User = sessionService.get('user');

    $scope.policies = [];
    $scope.headers = [
        {title:"Name"},
        {title:"Password policy"},
        {title:"Read/Write"},
        {title:"Lock"}
    ];


    /** -------------- Main -------------- **/
    getSecurityPolicies(User);

    /** ------------ Events ------------ **/
    $scope.showConfirm = function(ev) {
        // Dialog
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialog/dialog-security.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(policy) {
            //policy.token = User.token;
            policy.userId = User._id;
            createSecurityPolicy(policy);
        }, function() {

        });
    };

    $scope.remove = function(policy) {
        removePolicy(policy);
    };
    /** ------------ Async functions ------------ **/
    function createSecurityPolicy(policy) {
        proxyService.createSecurityPolicy(policy).then(function(response){
            $scope.policies.push(response.data.security);
           console.log(response);
        },function(error){

        });
    }

    function getSecurityPolicies(User) {
        proxyService.getSecurityPolicies(User).then(function(response){
           $scope.policies = response.data;
        },function(error){

        });
    }

    function removePolicy(policy) {
        proxyService.removeSecurityPolicy(policy).then(function(response){
            var index = $scope.policies.indexOf(policy);
            $scope.policies.splice(index, 1);
        },function(error){

        });
    }

    /** ------------ dialog functions ------------ **/
    function DialogController($scope, $mdDialog) {

        $scope.policies = [];
        $scope.readwrite = ['read','readwrite'];

        getAllPoliciesPassword(User);
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function(policy) {
            $mdDialog.hide(policy);
        };

        /** ------------ Async dialog functions ------------ **/
        function getAllPoliciesPassword(User){
            proxyService.getPasswordPolicies(User).then(function(response){
                $scope.policies = response.data;
            },function(error){

            });
        }
    }

});