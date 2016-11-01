<?php
require dirname( __DIR__ ) . '/vendor/autoload.php';

class AlbumController {
    public $model;

    public function __construct(){
        $this->model = new ModelMusicStore();
    }

    public function getAllAlbums(){
        $albums = $this->model->getAllAlbums();

        if ( $albums !== NULL )
            return $albums;
        else
            return false;
    }

    public function findAlbum($album){
        $albums = $this->model->findAlbum( $album );

        if ( $albums !== NULL )
            return $albums;
        else
            return false;
    }

    public function getAlbumByGanres($category, $subcategory, $page){
        $albums = $this->model->getAlbumByGanres($category, $subcategory);

        if ( $albums !== NULL )
            return array_slice($albums, $page, 3);
        else
            return false;
    }

    public function getAllAlbumsInfinity( $page ){
        $albums = $this->model->getAllAlbums();

        if ( $albums !== NULL )
            return array_slice($albums, $page, 6);
//            return $albums;
        else
            return false;
    }

    public function getAlbumById( $id ){
        $album = $this->model->getAlbumById( $id );

        if ( $album !== NULL )
            return $album;
        else
            return false;
    }

    public function pay( $data ){
        $data = $this->model->pay( $data );

        if ( $data !== NULL )
            return $data;
        else
            return false;
    }

}