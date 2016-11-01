app.controller('getAlbumByID', function($scope, $stateParams, getAlbumFactory, albumsFactory){
    $scope.albumId = $stateParams.albumID;

    //var promiseAlbum = getAlbumFactory.getAlbum('/core/getalbum/'+$scope.albumId );
    //
    //promiseAlbum.then( function (data){
    //    $scope.album = ( data.data );
    //});

    var promiseAlbum = albumsFactory.getAlbums();

    promiseAlbum.then( function (data){
        $scope.album = _.find( data, _.matchesProperty('album_id', $scope.albumId) );
    });

    $scope.ctrl = {};
});