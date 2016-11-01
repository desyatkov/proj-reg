app.controller('findController', function($scope, $rootScope, getAlbumFactory){
    $scope.textFind = '';
    $scope.showFind = false;
    $scope.notf = false;



    $scope.findText = function(text){


        if(text.length >= 2){
            var promiseAlbum = getAlbumFactory.getAlbum('/core/findAlbum/'+$scope.textFind );
            promiseAlbum.then( function (data){
                $scope.notf = false;
                $scope.findAlbum =  data.data ;
                $scope.notf = data.data != 0;
                $scope.showFind = true;
            });
        } else if(text.length < 2){
            $scope.showFind = false;
            $scope.notf = false;
        }
    };

    $scope.blurField = function(){
        $scope.showFind = false;
        $scope.textFind = '';
    }
});