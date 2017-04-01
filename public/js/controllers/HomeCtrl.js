// Home controller
app.controller('HomeCtrl', function($scope, $location, $mdDialog,sessionService, cookieService,dialogService, proxyService, Upload) {

    // User session
    var User = sessionService.get('user');

    $scope.files = [];
    $scope.status = "";
    $scope.currentTab = 1;

    $scope.selectTab = function (i) {
        $scope.currentTab = i;
    };

    /** ------------ Main ------------ **/
    getFiles(User);

    /** ------------ Async functions ------------ **/
    // Get all password policies
    function getFiles(User) {
        proxyService.getFiles({ userid: User._id }).then(function(response) {
            $scope.files = response.data.files;
        },function() {
            $scope.files = [];
        });
    }

    /** ------------ Events ------------ **/
    $scope.uploadFile = function(file) {

        file.upload = Upload.upload({
            method: 'POST',
            url: 'api/files/upload',
            data:{file:file,user:User}
        }).then(function (response) {
            if (response.data.success) {
                $scope.files.push(response.data.file);
            }
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.status = 'progress: ' + progressPercentage + '% ';
        });
    };

    // Download event
    $scope.download = function(file) {
        proxyService.downloadFile({ fileid: file._id }).then(function(response){

            var fileToken = response.data.token;
            // Send token to remote server
            cookieService.set('token',fileToken);
            // Download file
            window.location.href = 'http://localhost:3000/api/files/download/' + response.data.filename + '/' + fileToken;

        },function(error){

        });
        // Remove token
        //cookieService.destroy('token');
    };

    // Delete
    $scope.deleteFile = function (file) {
        console.log(file);
        var box = confirm('Are you sure you want to delete this file?');
        if (box) {

            proxyService.deleteFile({ fileid: file._id }).then(function(response) {
                $scope.files.splice($scope.files.indexOf(file), 1);
            });
        }
    };

    // Share
    $scope.share = function(file,ev) {
        // Pass file to dialog service
        dialogService.setFile(file);
        // Popup file sharing
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialog/dialog-share.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(group) {
            //$scope.groups.push(group);
        }, function() {

        });
    };


    /** ------------ dialog functions ------------ **/
    function DialogController($scope, $mdDialog, proxyService) {

        // Varibels
        $scope.groups = [];
        $scope.emails = [];
        $scope.selectedEmails = [];

        $scope.file = dialogService.getFile();

        //var share = {};

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        // Remove email from form email list
        $scope.removeEmail = function (email) {
            var index = $scope.selectedEmails.indexOf(email);
            if (index > -1) {
                $scope.selectedEmails.splice(index, 1);
            }
        };

        $scope.addGroup = function(group) {
            //console.log(group);
            angular.forEach(group.emails,function(key,val){
                addSelectedEmails(key);
            });
        };

        $scope.addEmail = function(email) {
            addSelectedEmails(email);

        };

        // Save dialog details
        $scope.save = function(share) {
            //var share = {};
            share.selectedEmails = $scope.selectedEmails;
            share.file =  $scope.file;

            //$mdDialog.hide(group);
        };


        /** ------------ functions ------------ **/
        function addSelectedEmails(email) {
            if ($scope.selectedEmails.indexOf(email) == -1) {
                $scope.selectedEmails.push(email);
            }
        }
        // $scope.save = function(group) {
        //     delete group.email;
        //     //group.name = group.name.toLowerCase();
        //     group.user = User;
        //     group.emails = $scope.emails;
        //
        //     delete group.user.token;
        //
        //     proxyService.createGroup(group).then(function(response) {
        //         if (response.data.success){
        //             $mdDialog.hide(group);
        //         } else {
        //             $scope.isExist = true;
        //         }
        //     },function(error) {
        //
        //     });
        // };

        /** ------------ Async ------------ **/
        // Async function - get groups
        proxyService.getGroups(User).then(function(response){
            $scope.groups = response.data.groups;
        },function(error){

        });

        proxyService.getSecurityPolicies(User).then(function(response){
            $scope.securityPolicies = response.data;
        },function(error){

        });
    }




}).filter( 'filesize', function () {

  var units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  return function( bytes, precision ) {
    if ( isNaN( parseFloat( bytes )) || ! isFinite( bytes ) ) {
      return '?';
    }

    var unit = 0;

    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }

    return bytes.toFixed( + precision ) + ' ' + units[ unit ];
  };

});