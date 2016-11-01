var app = angular.module('musicstore');

app.factory( 'albumsFactory', function( $http ) {
    var urlBase = '/core/getalbums';
    var albumsFactory = {};

    albumsFactory.getAlbums = function() {
        return $http.get( urlBase );
    };

    return albumsFactory;
});