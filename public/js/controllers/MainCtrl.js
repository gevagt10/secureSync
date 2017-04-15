app.controller('MainCtrl', function($rootScope,sessionService) {

    if (sessionService.get('user') != null) {
        //console.log(sessionService.get('user').name);
        $rootScope.name = sessionService.get('user').name;
    }

    $rootScope.$on('userReady', function (event, user) {
        $rootScope.name = user.name;
    });

    $rootScope.getImage = function (user) {
        return 'public/images/female.png';
        // if (user.image == null) {
        //
        //     if (user.gender == 0 || (typeof user.gender !== 'undefined' && user.gender.value == 0)) {
        //         return 'app/img/male.png';
        //     } else {
        //         return 'app/img/female.png';
        //     }
        //
        // } else {
        //     if (typeof user.user_id == 'undefined') {
        //         return 'app/server/uploads/' + user.id + '/' + user.image;
        //     }
        //     return 'app/server/uploads/' + user.user_id + '/' + user.image;
        // }
    };
});