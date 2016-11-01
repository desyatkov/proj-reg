var ModalInstanceCtrl = function ($scope, $modalInstance, $timeout, registrationFactory, $http, $rootScope) {

    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };


    $scope.ok = function (user) {
        $modalInstance.close(user);
        $scope.userData = user;
        $http({
            url: '/core/registration',
            method: "POST",
            params: { user_name: user.name, user_lname: user.lname, user_email: user.email, user_pass: user.pass }
        }).then(function(data){
            console.log(data.data['id']);
            if( data.data['id']>0 ){
                $rootScope.successRegistration = true;
                $rootScope.successEvent = "Registration Success, please login";

            } else {
                $rootScope.successRegistration = true;
                $rootScope.successEvent = "Registration Error, try latter";

            }
        });
    };


    $scope.isExist = function(data) {
        if(data){
            $http({
                url: '/core/ifexist/'+data,
                method: "GET"
            }).then(function(data){
                (data.data == 'false') ? $rootScope.isUserExist = true : $rootScope.isUserExist = false;

                //console.log($rootScope.isUserExist);
            });
        }

    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



};
