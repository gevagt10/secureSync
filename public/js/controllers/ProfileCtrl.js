// Profile controller
app.controller('ProfileCtrl', function($scope,sessionService,proxyService) {
    // User session
    var User = sessionService.get('user');
    $scope.user = User;
    $scope.user.password = [];

    $scope.isSuccess = false;

    /** ------------ Events ------------ **/
    $scope.saveProfile = function(user){
        proxyService.updateProfile(user).then(function(response){
            if(response.data.success) {
                $scope.isSuccess = true;
            }
        },function(error){

        });
    }
});
