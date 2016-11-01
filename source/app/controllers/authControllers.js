app.controller('authController', function($scope, authFactory, $rootScope, OAuth){
    $rootScope.isAuth = false;
    $scope.formData = {};
    $rootScope.dataUser = authFactory.getIdentity();
    authFactory.getSession( $rootScope.dataUser );
    $rootScope.isAuth = authFactory.isAuthenticated();


    $scope.login = function() {
        authFactory.isLogin( $scope.formData )
            .then( function ( data ){
                $rootScope.dataUser =  data.data;
                console.log(JSON.stringify($rootScope.dataUser));
                $rootScope.loginError = $rootScope.dataUser == 'false';
                authFactory.setIdentity( $rootScope.dataUser );
                authFactory.getSession( $rootScope.dataUser);
                $rootScope.isAuth = authFactory.isAuthenticated();
            });
    };

    $scope.logout = function(){
        authFactory.logOut();
        $rootScope.isAuth = authFactory.isAuthenticated();
        $rootScope.dataUser = {};
    };

//FacebookLoogin---------------------------------------------------------------
    $scope.fblogin = function(){
        OAuth.popup('facebook');
    };

    $scope.fbloginprint = function(){
        console.log($rootScope.fbdata);
    };

//FacebookLoogin---------------------------------------------------------------


});

