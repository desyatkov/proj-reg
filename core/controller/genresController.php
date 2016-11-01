<?php
require dirname( __DIR__ ) . '/vendor/autoload.php';

class GenresController {
    public $model;

    public function __construct(){
        $this->model = new ModelGenres();
    }

    public function getAllGenres(){
        $albums = $this->model->getAllGenres();

        if ( $albums !== NULL )
            return $albums;
        else
            return false;
    }
}