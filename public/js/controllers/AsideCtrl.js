// Home controller
app.controller('AsideCtrl', function($scope) {

    $scope.menus = [
      {title:"Home"},
      {title:"Groups",url:'groups'},
      {title:"Password policy",url:'password'},
      {title:"Security policy",url:'security'},
      {title:"Logout", url:'logout'}
    ];

});