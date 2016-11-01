<?php
require dirname( __DIR__ ) . '/vendor/autoload.php';

class userController {
    public $model;

    public function __construct(){
        $this->model = new UserModel();
    }

    public function userLogin( $user ){

        $user = $this->model->userLogin( $user );

        if ( count($user) !== 0 )
            return $user;
        else
            return false;
    }

    public function getHistory( $id ){

        $user = $this->model->getHistory( $id );

        if ( $user )
            return $user;
        else
            return false;
    }

    public function newUserReg( $user ){

        $user = $this->model->userRegistration( $user );

        if ( $user )
            return $user;
        else
            return false;
    }

    public function ifExist( $email ){

        $user = $this->model->ifExist( $email );

        if ( $user )
            return false;
        else
            return true;
    }

    public function ifExistFb( $id ){
        $user = $this->model->ifExistFb( $id );

        if ( $user )
            return $user;
        else
            return false;
    }

    public function regExistFb( $user ){
        $user = $this->model->regExistFb( $user );
        if ( $user )
            return $user;
        else
            return '111';
    }
}