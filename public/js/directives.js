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


/// http://blog.brunoscopelliti.com/angularjs-directive-to-test-the-strength-of-a-password //
/// AngularJS Directive to test the strength of a password
app.directive('checkStrength', function () {

    return {
        replace: false,
        restrict: 'EACM',
        link: function (scope, iElement, iAttrs) {

            var strength = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                measureStrength: function (p) {
                    var _force = 0;
                    var _regex = /[$-/:-?{-~!"^_`\[\]]/g;

                    var _lowerLetters = /[a-z]+/.test(p);
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _symbols = _regex.test(p);
                    //
                    var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                    var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

                    _force += 2 * (p.length) + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;

                    // penality (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                    // penality (poor variety of characters)
                    _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                    return _force;
                },
                getColor: function (s) {

                    var idx = 0;
                    if (s <= 10) { idx = 0; }
                    else if (s <= 20) { idx = 1; }
                    else if (s <= 30) { idx = 2; }
                    else if (s <= 40) { idx = 3; }
                    else { idx = 4; }

                    return { idx: idx + 1, col: this.colors[idx] };
                },
                getComplexity: function(complexity) {
                    if (complexity<=10) return "Easy";
                    if (complexity<=40) return "Medium";
                    if (complexity>40) return "Hard";
                }
            };

            scope.$watch(iAttrs.checkStrength, function () {
                if (scope.user.password === '') {
                    iElement.css({ "display": "none"  });
                } else {
                    var force = strength.measureStrength(scope.user.password);
                    var c = strength.getColor(force);
                    var complexity = strength.getComplexity(force);
                    // Add comploixity to DOM
                    scope.complexity = complexity;
                    iElement.css({ "display": "inline" });
                    iElement.children('li')
                        .css({ "background": "#DDD" })
                        .slice(0, c.idx)
                        .css({ "background": c.col });
                }
            });
        },
        template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><p class="complexity">{{complexity}}</p>'
    };

});
