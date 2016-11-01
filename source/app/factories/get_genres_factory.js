var app = angular.module('musicstore');

app.factory( 'genresFactory', function( $http ) {
    var urlBase = '/core/getganres';
    var genresFactory = {};

    genresFactory.getGenres = function() {
        return $http.get( urlBase );
    };

    return genresFactory;
});