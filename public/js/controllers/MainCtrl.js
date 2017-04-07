app.controller('MainCtrl', function($rootScope) {

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