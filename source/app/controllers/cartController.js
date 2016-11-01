app.controller('cartController', function($scope, $stateParams, getAlbumFactory, cartFactory, $rootScope, $localStorage, $sessionStorage, authFactory,$state,noty,$sce,wishFactory){
    $scope.albumAddCount = 1;
    $scope.albumId = $stateParams.albumID;
    $scope.addErr = false;
    $scope.addErrMassage = '';
    $rootScope.cartList = cartFactory.getCartList();
    $rootScope.wishList = wishFactory.getWishList();


    //$scope.summedPrice = _.sum( _.pluck($rootScope.cartList, 'album_price') ).toFixed(2);
    $rootScope.summedPrice = cartFactory.summPrice();

    $scope.albumCategory =  $stateParams.albumCategory;
    $scope.subCategory =  $stateParams.subCategory;

    var albums = {};
    var id = $stateParams.albumID;
    var promiseAlbum = getAlbumFactory.getAlbum('/core/getalbum/'+$scope.albumId );

    $scope.loader = true;

    promiseAlbum.then( function (data){
        $scope.album =  data.data ;
        cartFactory.isAlreadyInCart( $rootScope.cartList, id);
        wishFactory.isAlreadyInWish( $rootScope.wishList, $stateParams.albumID );
        $scope.loader = false;
        console.log($scope.album);
    });

    $rootScope.addToCard = function( album ){
        if( !authFactory.isAuthenticated() ){
            console.log(authFactory.isAuthenticated() );
            $state.go("login");
        } else {
            albums = album;
            var userId = parseInt($rootScope.dataUser[0].user_id);

            cartFactory.addtoCart( album, $scope.albumAddCount );
            //new foo

            //cartFactory.addtoCart( album, $scope.albumAddCount, parseInt($rootScope.dataUser[0].user_id) );
            $rootScope.summedPrice = cartFactory.summPrice();
            cartFactory.isAlreadyInStock(albums);
        }
    };

    $scope.instock = function(bool){
        return (bool == true)? 'In stock' : 'Out of Stock';
    };

    $scope.addCount = function(){
        var count = $scope.album['album_count'];
        if($scope.albumAddCount < count){
            ++$scope.albumAddCount;
            $scope.addErr = false;
            $scope.addErrMassage = '';
        }
        else {
            $scope.addErr = true;
            $scope.addErrMassage = 'Max. Available';
            return $scope.albumAddCount;
        }
    };

    $scope.lessCount = function(){
        if($scope.albumAddCount != 1 ){
            --$scope.albumAddCount;
            $scope.addErr = false;
            $scope.addErrMassage = '';
        } else
            $scope.albumAddCount = 1;
    };

    $scope.addCountCart = function(item){
        var count = item['album_count'];
        if( item.countInStock < count){
            ++item.countInStock;
            ++$rootScope.cartListLenght;
            cartFactory.updatecartList(); //update cart count in coockies
            $rootScope.summedPrice = cartFactory.summPrice();
        } else {
            console.log(count);
        }

    };

    $scope.lessCountCart = function(item){
        if(item.countInStock > 1){
            --item.countInStock;
            --$rootScope.cartListLenght;
            cartFactory.updatecartList(); //update cart count in coockies
            $rootScope.summedPrice = cartFactory.summPrice();
        } else item.countInStock = 1;

    };

    $rootScope.submitData = cartFactory.getDataForm() || {};

    $rootScope.notyf = function(elem , nameInput){
        if(elem.required){
            noty.showNoty({
                text: "Your "+ nameInput +" is required.",
                ttl: 3000, //time to live in miliseconds
                type: "warning", //success, warning
                optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                    optionClicked.elem.focus();
                }
            });
        }
    };


    $rootScope.linkActive = cartFactory.getlinkActive();
    $rootScope.isAuthen = authFactory.isAuthenticated();


    $scope.saveFormData = function(){
        $rootScope.linkActive.payment=false;
        cartFactory.addDataForm();
    };

    $scope.saveFormDataSubmit = function(){
        $rootScope.linkActive.submit=false;
        cartFactory.addDataForm();
    };



    $scope.placeOrder = function(){
        var dataArray = [$rootScope.cartList, $rootScope.submitData, $rootScope.dataUser[0]];
        //console.log($rootScope.dataUser[0]);

        cartFactory.payingOrder( dataArray ).
            then( function ( data ){
                if( +data.data > 0){
                    delete $localStorage.linkActive;
                    delete $localStorage.cartListLenght;
                    delete $localStorage.storeCart;
                    $rootScope.cartListLenght = 0;
                    $rootScope.alreadyInStock = 0;
                    cartFactory.setCartList( [] );
                    cartFactory.resetList();
                    $state.go('thankyou');
                }
                else {
                    console.log('errror');
                }
            });
    };


    $rootScope.notifyWish = function(){
        noty.showNoty({
            text: "Album added to wishlist",
            ttl: 3000, //time to live in miliseconds
            type: "success", //success, warning
            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                optionClicked.elem.focus();
            }
        });
    };

    $rootScope.notifyWishRemove = function(){
        noty.showNoty({
            text: "Album removed from you wishlist",
            ttl: 3000, //time to live in miliseconds
            type: "warning" //success, warning
        });
    };

    //wish list
    $scope.addToWishList = function(wish){
        if( !authFactory.isAuthenticated() ){
            $state.go("login");
        } else {
            wishFactory.addtoWish(wish);
            $rootScope.notifyWish();
        }
    };

    $rootScope.ifInCard = function(id){
        //$rootScope.cartList
        var a = _.findKey( $rootScope.cartList, { album_id: id });
        return parseInt(a) >= 0;

    }



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
});
