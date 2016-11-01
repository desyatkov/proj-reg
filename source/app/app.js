var app = angular.module( 'musicstore', [
    'ui.bootstrap' ,
    'ngAnimate' ,
    'ui.router' ,
    'ui.highlight' ,
    'ncy-angular-breadcrumb' ,
    'ngCookies',
    'ngStorage',
    'oauth.io',
    'ngMessages',
    'angular-noty',
    'ngMask',
    'angular-loading-bar',
    'infinite-scroll',
    'ngSanitize'
]);


app.controller('albumsController', function( $scope,
                                             albumsFactory,
                                             genresFactory,
                                             $location,
                                             $state,
                                             $rootScope,
                                             cartFactory,
                                             $localStorage,
                                             $sessionStorage,
                                             $modal, $log, $window, getAlbumFactory, wishFactory){


    var promise = albumsFactory.getAlbums();
    var promiseGenre = genresFactory.getGenres();


    promise.then( function (data){
        $scope.albums =         _.shuffle( data.data );
        $scope.randomAlbums =   _.slice( _.shuffle( data.data ), 1, 9 );
        //console.log($scope.albums);
        //$scope.lambda = _.slice(data.data, 0, 5);
    });







//infinity loading  ---------------------
    $scope.busy = false;
    $scope.lambda = [];
    $scope.load = false;

    $scope.nextPage = function(){
        //if ($scope.busy) return;
        $scope.busy = true;
        $scope.load = true;

        $scope.after = $scope.lambda.length;
        url = "core/getalbums/"+$scope.after;

        getAlbumFactory.getAlbum(url).then(function(data){

            var items = data.data;
            for (var i = 0; i < items.length; i++) {
                $scope.lambda.push(items[i]);
            }
            if (data.data.length) {
                $scope.busy = false;
                $scope.load = true;
            } else {
                $scope.busy = true; // Disable further calls if there are no more items
                $scope.load = false;
            }
        });
        console.log($scope.lambda.length);
    };
//infinity loading  -----------------------------------------------------


    promiseGenre.then( function (data){
        $scope.items = data.data;
    });

    $scope.hideMe = function (element) {
        element.hide = !element.hide;
    };

    $scope.showHeader = false;
    $scope.url = $location.url();


    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            event.preventDefault();
            $scope.showHeader = ($state.current.name == 'home.list');
        });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
        if (error === "Is Authorized") {
            $state.go("login");
        }
    });

    $rootScope.isUserExist = false;
    $rootScope.successRegistration = false;
    $rootScope.successEvent = "";

    //cart methods-----------------------------------------
    $scope.removeFromCart = function(item){
        cartFactory.removeFromCart(item);
        cartFactory.isAlreadyInStock(item, item.album_id + 1);
        $rootScope.summedPrice = cartFactory.summPrice();
    };

    $scope.removeFromWishList = function( wishitem ){
        wishFactory.removeFromWish( wishitem );
        $rootScope.notifyWishRemove();
        $rootScope.wishList = wishFactory.getWish();
    };

    //modal open
    $scope.open = function () {
        $scope.userForm = true;
        var modalInstance = $modal.open({
            templateUrl: 'source/app/template/modal.tmpl.html',
            controller: ModalInstanceCtrl,
            animation: false
        });
    };
});

