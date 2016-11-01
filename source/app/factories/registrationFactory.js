app.factory( 'registrationFactory', [ '$http', '$cookies', '$cookieStore', '$rootScope',
    '$state', '$localStorage', '$sessionStorage', 'cartFactory',
    function($http, $cookies, $cookieStore, $rootScope, $state, $localStorage, $sessionStorage, cartFactory) {

        return {

            registrationNewUser: function( user ) {
                return $http({
                    url: '/core/registration',
                    method: "GET",
                    params: { user_name: user.name, user_lname: user.lname, user_email: user.email, user_pass: user.pass }
                    });
                }
        };
    }
]);