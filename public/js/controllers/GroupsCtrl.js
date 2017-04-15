// Home controller
app.controller('GroupsCtrl', function($scope, $mdDialog, sessionService,proxyService) {

    var User = sessionService.get('user');

    $scope.groups = [];

    $scope.createGroup = function(ev) {

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialog/dialog-groups.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(group) {
            $scope.groups.push(group);
        }, function() {

        });

    };

    $scope.deleteGroup = function (group) {
        var box = confirm('Are you sure you want delete this group?');
        if (box) {
            proxyService.deleteGroup(group).then(function (response) {
                if (response.data.success) {
                    $scope.groups.splice($scope.groups.indexOf(group), 1);
                }
            });
        }
    };


    /** ------------ Main functions ------------ **/
    getGroups(User);


    /** ------------ Async functions ------------ **/
    // Get all password policies
    function getGroups(User) {
        proxyService.getGroups(User).then(function(response) {
            $scope.groups = response.data.groups;
        }, function(error) {

        });
    }

    /** ------------ dialog functions ------------ **/
    function DialogController($scope, $mdDialog, proxyService) {

        $scope.emails = [];
        $scope.isExist = false;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function(group) {
            delete group.email;
            //group.name = group.name.toLowerCase();
            group.user = User;
            group.emails = $scope.emails;

            delete group.user.token;

            proxyService.createGroup(group).then(function(response) {
                if (response.data.success){
                    $mdDialog.hide(group);
                } else {
                    $scope.isExist = true;
                }

            },function(error) {

            });

        };

        $scope.delete = function (email) {
            var index = $scope.emails.indexOf(email);
            if (index > -1) {
                $scope.emails.splice(index, 1);
            }
        };

        $scope.add = function(email) {
            if ($scope.emails.indexOf(email) == -1) {
                $scope.emails.push(email);
                delete $scope.group.email;
            }
        };

    }
});