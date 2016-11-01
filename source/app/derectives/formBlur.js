app.directive('formBlur', function() {
    return function(scope, element, attributes) {
        //scope.$watch(attributes.lengthChecker, function(newVal, oldVal) {
        //    if (newVal.length >= 5) element[0].blur();
        //});
        console.log(element);
    };
});
