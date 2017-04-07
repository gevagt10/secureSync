// Home controller
app.controller('AsideCtrl', function($scope,sessionService) {

    var User = sessionService.get('user');
    $scope.user = User;

    $scope.menus = [
        {title: "Home"},
        {title: "Groups", url: 'groups'},
        {title: "Password policy", url: 'password'},
        {title: "Security policy", url: 'security'},
        {title: "Profile", url: 'profile'},
        {title: "Logout", url: 'logout'}
    ];

});