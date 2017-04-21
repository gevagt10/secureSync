// Home controller
app.controller('HomeCtrl', function($scope, $location, $mdDialog,sessionService, cookieService,dialogService, proxyService, Upload) {

    // User session
    var User = sessionService.get('user');

    $scope.myFiles = [];
    $scope.shareFiles = [];
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
        proxyService.getFiles(User).then(function(response) {
            if (response.data.success) {

                $scope.myFiles = response.data.myFiles;
                $scope.shareFiles = [];

                angular.forEach(response.data.sharedFiles,function(key,value){
                    key.isFilePermitted = true;
                    if (key.securityPolicy.complexity) key.isFilePermitted = false;
                    else if (key.securityPolicy.history) key.isFilePermitted = false;
                    else if (key.securityPolicy.expired) key.isFilePermitted = false;
                    else if (key.securityPolicy.length) key.isFilePermitted = false;
                    $scope.shareFiles.push(key);
                });
                //console.log($scope.shareFiles);
            }
        },function(error) {
            $scope.myFiles = [];
            $scope.shareFiles = [];
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
                $scope.myFiles.push(response.data.file);
            }
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.status = 'progress: ' + progressPercentage + '% ';
        });
    };


    $scope.download = function(file,ev) {
        download(file,ev,0)
    };

    $scope.preview = function(file,ev) {
        download(file,ev,1)
    };

    // Download event
    function download(file,ev,isPreview) {
        var lock = file.security.lock;
        if (lock) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Policy enforcment')
                .textContent('Please insert password for start downloading')
                .placeholder('Password')
                .ariaLabel('Dog name')
                .targetEvent(ev)
                .ok('Download')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (result) {
                if (angular.equals(lock,result)) {
                    downloadFile();
                } else {
                    $scope.status = 'Password invalid';
                }
            }, function () {

            });
        } else { // No password needed
            downloadFile();
        }
        // Download function
        function downloadFile(){
            proxyService.downloadFile({ file: file,user:User }).then(function(response){
                if (response.data.success) {
                    var fileToken = response.data.token;
                    // Send token to remote server
                    cookieService.set('token',fileToken);

                    // Check if preview reqeust or download
                    if (isPreview) {
                        proxyService.filePreview({ filename: file.name }).then(function(response){
                            if (response.data.success) {
                                // Dialog service
                                dialogService.setFile({name:file.name ,data:response.data.file});
                                // Show Dialog
                                $mdDialog.show({
                                    controller: DialogFileEditController,
                                    templateUrl: 'views/dialog/dialog-file-edit.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose:true
                                }).then(function() {
                                    //$scope.groups.push(group);
                                }, function() {

                                });
                            }

                        });
                    } else {
                        // Download file
                        window.location.href = 'http://localhost:3000/api/files/download/' + response.data.filename + '/' + fileToken;
                    }
                }
            },function(error){

            });
            //Remove token
            cookieService.destroy('token');
        }

    };

    // Delete file
    $scope.deleteFile = function (file) {
        var box = confirm('Are you sure you want to delete this file?');
        if (box) {

            proxyService.deleteFile({ fileid: file._id }).then(function(response) {
                $scope.myFiles.splice($scope.myFiles.indexOf(file), 1);
            });
        }
    };

    // Remove shared file
    $scope.removeSharedFile = function(file) {
        var box = confirm('Are you sure you want to remove this file?');
        if (box) {
            proxyService.removeSharedFile({ file: file.data,user:User }).then(function(response) {
                if (response.data.success) {
                    console.log($scope.shareFiles);
                    $scope.shareFiles.splice($scope.shareFiles.indexOf(file), 1);
                }
            });
        }
    };

    // Email group
    $scope.emails = function(emails) {
        var list = '';
        angular.forEach(emails,function(key,value){
            //console.log(key);
            list += key + '\n';
        });
        return list
    };


    // Share
    $scope.share = function(file,ev) {
        // Pass file to dialog service
        dialogService.setFile(file);
        // Popup file sharing
        $mdDialog.show({
            controller: DialogShareController,
            templateUrl: 'views/dialog/dialog-share.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function() {
            //$scope.groups.push(group);
        }, function() {

        });
    };




    // View files
    $scope.viewPolicy = function(file,ev) {
        getFiles(User);
        // Forward file to dialog service
        dialogService.setFile(file);
        // Popup file sharing
        $mdDialog.show({
            controller: DialogViewPolicyController,
            templateUrl: 'views/dialog/dialog-policy-view.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function() {
            //$scope.groups.push(group);
        }, function() {

        });
    };


    /** ------------ dialog functions ------------ **/
    // File editor dialog
    function DialogFileEditController($scope, $mdDialog, $timeout, proxyService) {
        // Service
        $scope.file = dialogService.getFile();

        $scope.save = function(file) {
            $mdDialog.hide();
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    // Policy view dialog controller
    function DialogViewPolicyController($scope, $mdDialog, $timeout, proxyService) {
        // Service
        $scope.file = dialogService.getFile();

        $scope.linkTo = function(item) {
            $mdDialog.hide();
            $location.path('/' + item);
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.close = function() {
            $mdDialog.cancel();
        };
    }

    // Share dialog controller
    function DialogShareController($scope, $mdDialog, $timeout, proxyService) {

        // Varibels
        $scope.groups = [];

        // Alerts
        $scope.isSuccess = false;
        $scope.isFailad = false;
        // Service
        $scope.file = dialogService.getFile();

        $scope.user = User;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        // Remove email from form email list
        $scope.removeEmail = function (email) {
            var index = $scope.file.emails.indexOf(email);
            if (index > -1) {
                $scope.file.emails.splice(index, 1);
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
        $scope.save = function(file) {
            //var share = {};
            //console.log(file);
           // if (User._id==$scope.file.user._id) {
                proxyService.shareFile({file:file,user:User}).then(function(response){
                    if (response.data.success) {
                        $scope.isSuccess = true;
                        $scope.isFailad = false;
                        $timeout(function() {
                            $mdDialog.hide();
                        }, 500);

                    } else {
                        $scope.isSuccess = false;
                        $scope.isFailad = true;
                    }
                },function(error){

                })
           // }
        };


        /** ------------ Dialog functions ------------ **/
        function addSelectedEmails(email) {
            if ($scope.file.emails.indexOf(email) == -1) {
                $scope.file.emails.push(email);
            }
        }


        /** ------------ Dialog Async ------------ **/
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