app.factory( 'authFactory', [ '$http', '$cookies', '$cookieStore', '$rootScope',
                              '$state', '$localStorage', '$sessionStorage', 'cartFactory', 'wishFactory',
    function($http, $cookies, $cookieStore, $rootScope, $state, $localStorage, $sessionStorage, cartFactory, wishFactory) {
        var _identity = undefined,
            _authenticated = false;

        return {
            isAuthenticated: function() {
                return _authenticated;
            },

            isIdentity: function() {
                return _identity;
            },

            isLogin: function( user ) {
                return $http({
                    url: '/core/login',
                    method: "GET",
                    params: { user_name: user.name, user_pass: user.pass }
                });
            },

            setIdentity: function( data ) {
                $cookieStore.put( 'SessionData', data);
            },

            getIdentity: function(  ) {
                return $cookieStore.get('SessionData');
            },

            getSession: function( data ) {
                if (data === 'false' || data === undefined || data === false || data === 'undefined'){
                    _identity = undefined;
                    _authenticated = false;
                }
                else {
                    _identity = data[0]['user_lastname'];
                    _authenticated = true;
                    $state.go('home.list');
                }
            },

            logOut: function() {
                _identity = undefined;
                _authenticated = false;
                $cookieStore.remove('SessionData');
                $localStorage.$reset();
                $rootScope.cartListLenght = 0;
                $rootScope.alreadyInStock = 0;
                cartFactory.setCartList( [] );
                wishFactory.setWishList( [] );
                cartFactory.resetList();
                $rootScope.cartList = [];
                $rootScope.wishList = [];
                $state.go('home.list');
            },

            isFbExist: function(id){
                return $http({
                    url: '/core/fbexist/'+id,
                    method: "GET"
                });
            },
            regFbExist: function( user ){
                return $http({
                    url: '/core/newuserfb',
                    method: "POST",
                    params: { user_name: user.name, user_lname: user.lname, user_email: user.email, user_pass: user.pass }
                });
            },
            loginFB: function( user ){
                $rootScope.loginError = user == 'false';
                this.setIdentity( user );
                this.getSession( user);
                $rootScope.isAuth = this.isAuthenticated();
                console.log(user);
            }
        };
    }
]);