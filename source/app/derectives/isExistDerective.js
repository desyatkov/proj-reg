app.directive('isExist', function (formHelper) {
    return {
        require: 'ngModel',
        restrict: "A",
        link: function (scope, element, attr, ctrl) {
            console.log(attr);
        }
    };
});