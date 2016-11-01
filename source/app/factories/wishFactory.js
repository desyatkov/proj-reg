app.factory( 'wishFactory', [ '$http', '$cookies', '$cookieStore', '$rootScope', '$state', '$localStorage', '$sessionStorage',
    function($http, $cookies, $cookieStore, $rootScope, $state, $localStorage, $sessionStorage) {

        var wishList = $localStorage.wishList || [];

        return {
            addtoWish: function( album ) {
                wishList.push( album );
                $rootScope.alreadyInWish = true;
                console.log( wishList );

                delete $localStorage.wishList;
                $localStorage.$default({ wishList: wishList });
            },

            getWish: function(){
                return wishList;
            },
            removeFromWish: function( wish ) {
                wishList = wishList
                    .filter(function (el) {
                        return el.album_id !== wish.album_id;
                    });

                //_.pull( wishList, wish);
                $rootScope.alreadyInWish = false;
                delete $localStorage.wishList;
                $localStorage.$default({ wishList: wishList });
                console.log( wishList );

            },

            isAlreadyInWish: function(arr, pageId){
                var a = _.findKey( arr, { album_id: pageId });
                $rootScope.alreadyInWish = a >= 0;
                console.log($rootScope.alreadyInWish);
            },

            getWishList: function(){
                console.log(wishList);
                return wishList;
            },

            setWishList: function( listFromStorgate ){
                wishList = listFromStorgate;
            }

        };
    }
]);