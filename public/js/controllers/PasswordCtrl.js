// Home controller
app.controller('PasswordCtrl', function($scope,$mdDialog,proxyService,sessionService,dialogService) {

    // User session
    var User = sessionService.get('user');


    $scope.policies = [];
    $scope.headers = [
        {title:"Name"},
        {title:"Complaxity"},
        {title:"History"},
        {title:"Expired"},
        {title:"Minimum length"}
    ];

    /** ------------ Events ------------ **/
    $scope.showConfirm = function(ev) {
        // Get password deatiles from server
        getPasswordDetilas(User);
        // Dialog
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialog/dialog-password.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(policy) {
                policy.token = User.token;
                policy.userId = User._id;
                createPasswordPolicy(policy);
            }, function() {

            });
    };

    // Remove from server
    $scope.remove = function(item) {
        removePolicy(item);
    };

    /** ------------ Main ------------ **/

    getPasswordPolicies(User);

    /** ------------ Async functions ------------ **/
    // Get all password policies
    function getPasswordPolicies(User) {
        proxyService.getPasswordPolicies(User).then(function(response) {
            $scope.policies = response.data;
        },function(error) {

        });
    }

    // Get static options for dialog popup - create new policy
    function getPasswordDetilas(User){
        proxyService.getPasswordDetilas(User).then(function(response){
            console.log(response);
            dialogService.setPassword(response.data);
        },function(error){

        });
    }

    // Create new policy password
    function createPasswordPolicy(policy) {
        proxyService.createPasswordPolicy(policy).then(function(response){
            $scope.policies.push(response.data.password);
        },function(error){

        });
    }

    function removePolicy(item) {
        proxyService.removePasswordPolicy(item).then(function(response){
            var index = $scope.policies.indexOf(item);
            $scope.policies.splice(index, 1);
        },function(error){

        });
    }
    /** ------------ dialog functions ------------ **/
    function DialogController($scope, $mdDialog) {
        $scope.model = dialogService.getPassword();

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function(policy) {
            $mdDialog.hide(policy);
        };
    }
});
