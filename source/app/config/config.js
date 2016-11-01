app.config( function( $stateProvider, $urlRouterProvider, OAuthProvider, cfpLoadingBarProvider ){

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
//facebook--------------------------------------------------------------------------------

    OAuthProvider.setPublicKey('fXcnOqQF1RMTpdH-wHzMc1eVqZA');
    OAuthProvider.setHandler('facebook', function (OAuthData, $http, $rootScope, authFactory) {

        $http.get('https://graph.facebook.com/me?fields=email,name&access_token=' + OAuthData.result.access_token)
            .then(function (resp) {
                $rootScope.fbdata = resp.data;
                var name = $rootScope.fbdata.name.split(' ');

                authFactory.isFbExist($rootScope.fbdata.id)
                    .then( function ( data ){
                        console.log(data.data);
                        if(data.data !== 'false'){
                            var fbUserId = +data.data[0].user_id;

                            $rootScope.dataUser =  [{user_id:       fbUserId,
                                user_firstname: name[0],
                                user_lastname:  name[1]}];
                            authFactory.loginFB($rootScope.dataUser);
                            //console.log( $rootScope.fbdata );

                        } else {

                            var user = {
                                name: name[0],
                                lname: name[1],
                                email: $rootScope.fbdata.email,
                                pass: $rootScope.fbdata.id
                            };

                            authFactory.regFbExist( user )
                                .then(function( data){
                                    $rootScope.dataUser =  [{user_id:       data.data.id,
                                        user_firstname: data.data.user_firstname,
                                        user_lastname:  data.data.user_lastname}];
                                    authFactory.loginFB($rootScope.dataUser);

                                });
                        }
                    });
            });
    });

//facebook--------------------------------------------------------------------------------
    $urlRouterProvider.when("", '/home/list');
    $urlRouterProvider.otherwise('/home/list');



    $stateProvider
        .state('home', {
            url: '/home',
            abstract:true ,
            templateUrl: 'source/app/template/partial-home.html'
        })

        // nested lists
        .state('home.list',{
            url: '/list',
            templateUrl: 'source/app/template/partial-home-list.html',
            ncyBreadcrumb: {
                label: "Home page"
            },
            controller: 'cartController'
        })

        .state('home.albumCategory', {
            url: '/albums/:albumCategory',
            templateUrl: 'source/app/template/partial-home-category.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: '{{albumCategory}}',
                parent: 'home.list'
            },
            onEnter: function( $rootScope ){
            }
        })

        .state('home.albumSubCategory', {
            url: '/albums/:albumCategory/:subCategory',
            templateUrl: 'source/app/template/partial-home-category.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: '{{subCategory}}',
                parent: 'home.albumCategory'
            },
            onEnter: function( $rootScope ){
            }

        })

        .state('home.albumDetail', {
            url: '/album/:albumCategory/:albumID',
            templateUrl: 'source/app/template/albumdetails.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: '{{album.album_name}} album',
                parent: 'home.albumCategory'
            },
            onEnter: function( $rootScope ){
            }
        })

        .state('home.albumSubDetail', {
            url: '/album/:albumCategory/:subCategory/:albumID',
            templateUrl: 'source/app/template/albumdetails.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: '{{album.album_name}} album',
                parent: 'home.albumSubCategory'
            },
            onEnter: function( $rootScope ){
            }
        })

        .state('home.paragraph',{
            url: '/paragraph',
            templateUrl: 'source/app/template/partial-home-paragraph.html',
            ncyBreadcrumb: {
                label: 'Paragraph page',
                parent: 'home.list'
            },
            controller: function($scope) {
                $scope.ddd = 'eee';
            }
        })


        .state('cartDetails', {
            url: '/cartdetails',
            templateUrl: 'source/app/template/cartdetails.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: 'Shopping Cart',
                parent: 'home.list'
            },
            resolve: {
                security: ['$q','$rootScope', function($q, $rootScope){
                    if( !$rootScope.isAuth ){
                        return $q.reject("Is Authorized");
                    }
                }]
            }
        })

        .state('userdetails', {
            url: '/userdetails',
            templateUrl: 'source/app/template/userdetails.html',
            controller: 'userController',
            ncyBreadcrumb: {
                label: 'My Account',
                parent: 'home.list'
            },
            resolve: {
                security: ['$q','$rootScope', function($q, $rootScope){
                    if( !$rootScope.isAuth ){
                        return $q.reject("Is Authorized");
                    }
                }]
            }
        })

        .state('form', {
            url: '/buyform',
            abstract:true ,
            templateUrl: 'source/app/template/buyform.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: 'Buy form',
                parent: 'cartDetails'
            },
            resolve: {
                security: ['$q','$rootScope', function($q, $rootScope){
                    if( !$rootScope.isAuth ){
                        return $q.reject("Is Authorized");
                    }
                }]
            }

        })

        //form
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'source/app/template/form-profile.html',
            ncyBreadcrumb: {
                label: 'Address',
                parent: 'cartDetails'
            }
        })

        .state('form.payment', {
            url: '/payment',
            templateUrl: 'source/app/template/form-payment.html',
            ncyBreadcrumb: {
                label: 'Payment Method',
                parent: 'form.profile'
            }
        })

        .state('form.submitorder', {
            url: '/submitorder',
            templateUrl: 'source/app/template/form-submit.html',
            ncyBreadcrumb: {
                label: 'Submit order',
                parent: 'form.payment'
            }
        })

        .state('thankyou', {
            url: '/thankyou',
            templateUrl: 'source/app/template/thankyou-submit.html',
            ncyBreadcrumb: {
                label: 'Submit order',
                parent: 'home.list'
            }
        })

        //form

        .state('login',{
            url: '/login',
            templateUrl: 'source/app/template/login.html',
            ncyBreadcrumb: {
                label: 'login',
                parent: 'home.list'
            },
            resolve: {
                security: ['$q','$rootScope', function($q, $rootScope){
                    if( $rootScope.isAuth ){
                        return $q.reject("Is Authorized");
                    }
                }]
            },
            onEnter: function( $rootScope ){
                //console.log( $rootScope.isAuth )
            }
        })
        .state('registration',{
            url: '/registration',
            templateUrl: 'source/app/template/login.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: 'registration',
                parent: 'home.list'
            },
            //resolve: {
            //    security: ['$q','$rootScope', function($q, $rootScope){
            //        if( $rootScope.isAuth ){
            //            return $q.reject("Is Authorized");
            //        }
            //    }]
            //},
            onEnter: function( $rootScope ){
                //console.log( $rootScope.isAuth )
            }
        })
        .state('wishlist', {
            url: '/wishlist',
            templateUrl: 'source/app/template/wishlist.html',
            controller: 'cartController',
            ncyBreadcrumb: {
                label: 'Wishlist',
                parent: 'home.list'
            },
            resolve: {
                security: ['$q','$rootScope', function($q, $rootScope){
                    if( !$rootScope.isAuth ){
                        return $q.reject("Is Authorized");
                    }
                }]
            }
        });


    //$locationProvider.html5Mode(true);

});