app.controller('userController', function($scope, $http, $rootScope){
    $scope.loader = true;

    $http.get("/core/getuserhistory/"+$rootScope.dataUser[0].user_id)
        .then(function(response) {

            if (response.data != 'false'){
                $scope.history = response.data.reverse();
                console.log(response);
            }

            $scope.loader = false;
        }
    );

});
