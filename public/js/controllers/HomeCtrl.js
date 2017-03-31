// Home controller
app.controller('HomeCtrl', function($scope, $location, sessionService, cookieService, proxyService, Upload) {

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
            $scope.files.push(response.data.file);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.status = 'progress: ' + progressPercentage + '% ';
        });
    };

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