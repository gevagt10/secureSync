app.directive("ngEqual", function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {

            scope.$watch(function() {

                if (ctrl.$viewValue == scope.$eval(attrs.ngEqual)) {
                    ctrl.$setValidity('verify', true);
                } else {
                    ctrl.$setValidity('verify', false);
                }

            });

        }
    };
});