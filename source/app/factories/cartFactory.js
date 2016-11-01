app.factory( 'cartFactory', [ '$http', '$cookies', '$cookieStore', '$rootScope', '$state', '$localStorage', '$sessionStorage',
    function($http, $cookies, $cookieStore, $rootScope, $state, $localStorage, $sessionStorage) {
        $rootScope.cartListLenght = $localStorage.cartListLenght || 0 ;
        $rootScope.alreadyInStock = false;
        var albumsList = $localStorage.storeCart || [];



        return {
            addtoCart: function( album, count ) {
                album.countInStock = count;
                albumsList.push( album );
                $rootScope.cartListLenght +=  count;

                delete $localStorage.storeCart;
                delete $localStorage.cartListLenght;
                $localStorage.$default({ storeCart: albumsList });
                $localStorage.$default({ cartListLenght: $rootScope.cartListLenght });
            },

            updatecartList: function () {
                delete $localStorage.cartListLenght;
                $localStorage.$default({ cartListLenght: $rootScope.cartListLenght });
            },


            removeFromCart: function( album ) {
                $rootScope.cartListLenght -= album.countInStock;
                _.pull(albumsList, album);

                delete $localStorage.storeCart;
                delete $localStorage.cartListLenght;
                $localStorage.$default({ storeCart: albumsList });
                $localStorage.$default({ cartListLenght: $rootScope.cartListLenght });
            },

            getCartList: function(){
                    return albumsList;
            },

            setCartList: function( listFromStorgate){
                albumsList = listFromStorgate;
            },

            isAlreadyInStock: function(item, pageId){
                $rootScope.alreadyInStock = item.album_id === pageId;
            },

            isAlreadyInCart: function(arr, pageId){
                var id = ""+pageId;
                var a = _.findKey( arr, { album_id: id });
                $rootScope.alreadyInStock = a >= 0;
            },

            chekLocalStorage: function(){
                if ( $localStorage.storeCart ){
                     this.setCartList = $localStorage.storeCart;
                     console.log($localStorage.storeCart)
                }
            },

            resetList: function(){
                $rootScope.albumsList = [];
            },

            summPrice: function(){
                var summ = 0;
                for (var key in $rootScope.cartList) {
                    summ += ( $rootScope.cartList[key]['album_price'] * $rootScope.cartList[key]['countInStock']);
                }
                return summ.toFixed(2);
            },

            addDataForm: function() {
                delete $localStorage.formData;
                delete $localStorage.linkActive;
                $localStorage.$default({ formData: $rootScope.submitData });
                $localStorage.$default({ linkActive: $rootScope.linkActive });
            },

            getDataForm: function(){
                return $localStorage.formData;
            },

            getlinkActive: function(){
                if ($localStorage.linkActive){
                    return $localStorage.linkActive;
                } else {
                    return {payment: true, submit: true}
                }
            },

            payingOrder: function( array ) {
                return $http({
                    url: '/core/payorder',
                    method: "POST",
                    //params: { data: array }
                    params: {
                        "data[]": array
                    }
                });
            },


        };
    }
]);