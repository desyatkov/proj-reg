<?php
// namespace core\Model;
require dirname( __FILE__ ) . '/../vendor/autoload.php';

class UserModel extends Model {
    public function userLogin( $user ) {
        $fetch = array();
        $users = $this->_db->users->where("user_email", $user['user_name'])->where("user_password", $user['user_pass']);
        foreach ($users as $user) {
            $fetch[] = array(
                'user_id'           =>  $user['user_id'],
                'user_firstname'    =>  $user['user_firstname'],
                'user_lastname'     =>  $user['user_lastname'],
                );
        }
        return $fetch;
    }

    public function userRegistration ( $user ) {
        $newUser = $this->_db->users();
        $data = array(
            "user_email"            => $user['user_email'],
            "user_lastname"         => $user['user_lname'],
            "user_firstname"        => $user['user_name'],
            "user_password"         => $user['user_pass']
        );
        $result = $newUser->insert( $data );
        return $result;
    }

    public function regExistFb ( $data ) {

        $id = $this->userRegistration( $data );

        $newUser = $this->_db->fb_users();
        $dataFB = array(
            "user_id"                => $id['id'],
            "user_fb_uid"            => $data['user_pass']
        );
        $result = $newUser->insert( $dataFB );
        return $id;
    }

    public function ifExist ( $email ) {
        $count = $this->_db->users->where("user_email", $email)->count("*");
        return $count;
    }

    public function ifExistFb ( $id ) {
        $fetch = [];
        $count = $this->_db->fb_users->where("user_fb_uid", (int)$id);
        foreach ($count as $user) {
            $fetch[] = array(
                'user_id'           =>  $user['user_id']
            );
        }
        return $fetch;
    }

    public function getHistory( $id )
    {
        $fetch = [];
        $orders = $this->_db->orders->where("user_id", $id);
        foreach ($orders as $order) {
            $fetch[] = array(
                'order_id'           =>  $order['order_id'],
                'order_created'      =>  $order['order_created'],
                'order_total'        =>  $order['order_total'],
                'order_albums'       =>  $this->getOrdersAlbums( $order['order_id'] )
            );
        }
        return $fetch;
    }

    public function getOrdersAlbums( $order_id ){
        $fetch = [];
        $orders = $this->_db->orders_to_albums->select('DISTINCT album_id, order_id')->where("order_id", $order_id);

        foreach ($orders as $order) {
            $fetch[] = array(
                'album_id'           =>  $order['album_id'],
                'count'              =>  $this->getCount( $order['order_id'], $order['album_id'] ),
                'album_name'         =>  $this->getNameAlbums( $order['album_id'] )
            );
        }
        return $fetch;

    }

    public function getNameAlbums( $album_id ){
        $musicstore = new ModelMusicStore();
        $album = $musicstore->getAlbumById($album_id);

        return $album['album_name'];
    }


    public function getCount( $order_id, $album_id ) {
        $count = $this->_db->orders_to_albums->where("order_id", $order_id)->and("album_id", $album_id)->count("*");
        return $count;
    }
}
