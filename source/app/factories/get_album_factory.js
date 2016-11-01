var app = angular.module('musicstore');

app.factory( 'getAlbumFactory', function( $http ) {
    var getAlbumFactory = {};

    getAlbumFactory.getAlbum = function(urlBase) {
        return $http.get( urlBase );
    };

    return getAlbumFactory;
});