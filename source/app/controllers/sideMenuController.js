app.controller('ItemController',  function ($scope,
                                            $stateParams,
                                            albumsFactory,
                                            genresFactory,
                                            $location,
                                            $state,
                                            $rootScope,
                                            cartFactory,
                                            $localStorage,
                                            $sessionStorage,
                                            $modal, $log, $window, getAlbumFactory, authFactory) {

    $scope.$parent.isopen = ($scope.$parent.default === $scope.item);

    $scope.$watch('isopen', function (newvalue, oldvalue, scope) {
        $scope.$parent.isopen = newvalue;
    });


    //infinity loading ganres--------------------------------------------------------
    //-------------------------------------------------------------------------------
    $rootScope.cartList =   cartFactory.getCartList();
    $scope.albumCategory =  $stateParams.albumCategory;
    $scope.subCategory =    $stateParams.subCategory;
    //-------------------------------------------------------------------------------
    $scope.busyGanres = false;
    $scope.lambdaGanres = [];
    $scope.loadGanres = false;



    $scope.nextPageCategory = function(){
        //if ($scope.busy) return;
        $scope.busyGanres = true;
        $scope.loadGanres = true;

        $scope.afterGanres = $scope.lambdaGanres.length;
        url = "core/getalbumsbyganre/"+ $scope.albumCategory +"/"+$scope.subCategory+"/"+$scope.afterGanres;

        getAlbumFactory.getAlbum(url).then(function(data){

            var itemsGanres = data.data;
            for (var i = 0; i < itemsGanres.length; i++) {
                $scope.lambdaGanres.push(itemsGanres[i]);
            }
            if (data.data.length) {
                $scope.busyGanres = false;
                $scope.loadGanres = true;
            } else {
                $scope.busyGanres = true; // Disable further calls if there are no more items
                $scope.loadGanres = false;
            }
        });
    };
//infinity loading ganres  -----------------------------------------------------
//------------------------------------------------------------------------------
});