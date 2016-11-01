<?php
// namespace core\Model;
require dirname( __FILE__ ) . '/../vendor/autoload.php';

class ModelMusicStore extends Model {

    /**
     * function to add new album to DB
     * @param array $details
     * @return mixed
     */
    public function addAlbum(array $details ) {
        //------Insert Album data----------------------------------
        $data = array(
            'album_id' =>               $details['album_id'],
            'album_name' =>             $details['album_name'],
            'album_artist' =>           $details['album_artist'],
            'album_duration' =>         $details['album_duration'],
            'album_release_year' =>     $details['album_release_year'],
            'album_description' =>      $details['album_description'],
            'album_long_description' => $details['album_long_description'],
            'album_created' =>          $this->time_now(),
            'album_price' =>            $details['album_price'],
            'album_stock'=>             $details['album_stock'],
        );

        $albums = $this->_db->albums();
        $result = $albums->insert( $data );
        //------------------------------------------------------------

        //------Insert images data----------------------------------
        $pic = array(
            'image_path'  => $details['image_path'],
            'image_title' => $details['image_title']
        );
        $pics = $this->_db->images();
        $resultpics = $pics->insert( $pic );
        //------------------------------------------------------------

        //------Insert $images_to_albums data----------------------------------
        $imgtoalb = array(
            'image_id' => $result,
            'album_id' =>  $resultpics
        );
        $images_to_albums = $this->_db->images_to_albums();
        $resultpics = $images_to_albums->insert( $imgtoalb );


        return $resultpics;
        //------------------------------------------------------------
    }

    /**
     * @return array of all albums
     */
    public function getAllAlbums() {
        $fetch = array();
        $albums = $this->_db->albums();
        foreach ($albums as $album) {
            $fetch[] = array(
                'album_id' =>               $album['album_id'],
                'album_name' =>             $album['album_name'],
                'album_description' =>      $album['album_description'],
                'album_artist' =>           $album['album_artist'],
                'album_duration' =>         $album['album_duration'],
                'album_release_year' =>     $album['album_release_year'],
                'album_long_description' => $album['album_long_description'],
                'album_price' =>            $album['album_price'],
                'album_stock'=>             $this->inStock($album['album_id']),
                'album_count'=>             $album['album_stock'],
                'getAlbumImage'=>           $this->getAlbumImage($album['album_id']),
                'category'=>                $this->getGenresParentName($album['album_id']),
                'subcategory'=>             $this->getGenresName($album['album_id'])
            );
        }
        return $fetch;
    }

    /**
     * find albums in DB by album_name OR album_artist column
     * @param $val string
     * @return array
     */
    public function findAlbum( $val ){
            $list = $this->_db->albums();
            $results = $list->where('album_name like ?', "$val%")
                ->or('album_artist like ?', "$val%")
                ->limit(5);

            $fetch = array();
            foreach ($results as $album) {
                $fetch[] = array(
                    'album_id' =>               $album['album_id'],
                    'album_name' =>             $album['album_name'],
                    'album_description' =>      $album['album_description'],
                    'album_artist' =>           $album['album_artist'],
                    'album_duration' =>         $album['album_duration'],
                    'album_release_year' =>     $album['album_release_year'],
                    'album_long_description' => $album['album_long_description'],
                    'album_price' =>            $album['album_price'],
                    'album_stock'=>             $this->inStock($album['album_id']),
                    'album_count'=>             $album['album_stock'],
                    'getAlbumImage'=>           $this->getAlbumImage($album['album_id']),
                    'category'=>                $this->getGenresParentName($album['album_id']),
                    'subcategory'=>             $this->getGenresName($album['album_id'])
                );
            }
            return $fetch;
        }


    /**
     * return genres name bu album_id
     * @param $albumid
     * @return mixed
     */
    public function getGenresName($albumid ){
        $genres = $this->_db->genres()->select("genre_name")->where('genre_id', $this->getGenresIdbyName($albumid));
        foreach ($genres as $genre) {
            return $genre['genre_name'];
        }
    }

    /**
     * get parent of sub-genres by album id
     * @param $albumid
     * @return mixed
     */
    public function getGenresParentName($albumid ){
        $genres = $this->_db->genres()->select("genre_name")->where('genre_id', $this->getSubGenresId($albumid));
        foreach ($genres as $genre) {
            return $genre['genre_name'];
        }
    }


    /**
     * get genres id by name
     * @param $albumid
     * @return mixed
     */
    public function getGenresIdbyName( $albumid ){
        $albums = $this->_db->genres_to_albums()->select("genre_id")->where('album_id', $albumid);
        foreach ($albums as $album) {
            return $album['genre_id'];
        }
    }


    public function getSubGenresId( $id ){
        $albums = $this->_db->genres()->select("genre_parent_id")->where('genre_id', $this->getGenresIdbyName($id));
        foreach ($albums as $album) {
            return $album['genre_parent_id'];
        }
    }


    public function getAlbumCount( $id ) {
        $album_count = 0;
        $albums = $this->_db->albums->where('album_id', $id)->limit(1);
        foreach ($albums as $album) {
            $album_count = $album['album_stock'];
        }
        return $album_count;
    }

    public function getAlbumImage( $album_id ){
        $imgs = $this->_db->images()->where('image_id', $this->getImageId($album_id));
        foreach ($imgs as $img) {
            return $imgURL = $img['image_path'];
        }
    }


    public function getImageId( $albumId ){
        $imgs =  $this->_db->images_to_albums()->select("image_id")->where('album_id', $albumId);
        foreach ($imgs as $img) {
            return $img['image_id'];
        }
    }


    public function getAlbumById( $id ){

        $array = $this->getAllAlbums();

        foreach ($array as $a=>$value) {
            if ($value['album_id'] == $id ){
                return $array[$a];
            }
        }

        return $array;
    }

    private function getGenresId($genreName){
        $gnrs =  $this->_db->genres()->select("genre_id")->where('genre_name', $genreName);
        foreach ($gnrs as $gnr) {
            return $gnr['genre_id'];
        }
    }

    public function getGenresChildId($genreName){
        $fetch = array();
        $gnrs =  $this->_db->genres()->select("genre_id")->where('genre_parent_id', $this->getGenresId($genreName));
        foreach ($gnrs as $gnr) {
            $fetch[] = array(
                $gnr['genre_id']
            );
        }
        return $fetch;
    }


    public function getAlbumsChildeIdByGenres($genreName){
        $fetch = array();
        $imgs = $this->_db->genres_to_albums()->select("album_id")->where('genre_id', $this->getGenresChildId($genreName));
        foreach ($imgs as $img) {
            $fetch[] = array(
                $img['album_id']
            );
        }
        return $fetch;
    }


    public function getAlbumsIdByGenres($genreName){
        $fetch = array();
        $imgs = $this->_db->genres_to_albums()->select("album_id")->where('genre_id', $this->getGenresId($genreName));
        foreach ($imgs as $img) {
            $fetch[] = array(
                $img['album_id']
            );
        }
        return $fetch;
    }



    private function getArrayAlbumFromPDO($arrays, $category, $subcategory){
        $fetch = array();

        foreach ($arrays as $array) {
            $fetch[] = array(
                'album_id' =>               $array['album_id'],
                'album_name' =>             $array['album_name'],
                'album_description' =>      $array['album_description'],
                'album_artist' =>           $array['album_artist'],
                'album_duration' =>         $array['album_duration'],
                'album_release_year' =>     $array['album_release_year'],
                'album_long_description' => $array['album_long_description'],
                'album_price' =>            $array['album_price'],
                'album_stock'=>             $this->inStock($array['album_id']),
                'album_count'=>             $array['album_stock'],
                'getAlbumImage'=>           $this->getAlbumImage($array['album_id']),
                'category'=>                $category,
                'subcategory'=>             $subcategory

            );
        }

        return $fetch;
    }



    public function getAlbumByGanres( $category, $subcategory ){
        if($subcategory=='undefined'){
            $fetchParrent = $this->_db->albums()->where('album_id', $this->getAlbumsIdByGenres($category));
            $fetchChild = $this->_db->albums()->where('album_id',   $this->getAlbumsChildeIdByGenres($category));

            $parrent = $this->getArrayAlbumFromPDO($fetchParrent,$category, false);
            $child =   $this->getArrayAlbumFromPDO($fetchChild,$category, false);
          return array_merge($parrent, $child);

        } else {
            $albums = $this->_db->albums()->where('album_id', $this->getAlbumsIdByGenres($subcategory));
            return $this->getArrayAlbumFromPDO($albums,$category, $subcategory );
        }
    }

    private function inStock( $id ) {
        $fetch = array();
        $albums =  $this->_db->albums()->where('album_id', $id);
        foreach ($albums as $album) {
            $fetch[] = array(
                'album_stock'=>$album['album_stock'],
            );
        }
        return (int)$fetch[0]['album_stock'] > 0;
    }

//    pay -----------------------------------------------------------------
//        -----------------------------------------------------------------
    public function pay( $data ){

        $cart =     json_decode( $data[0] );
        $address =  json_decode( $data[1] );
        $user =     json_decode( $data[2] );

        $orders = $this->_db->orders();
        $data = array(
            "user_id"                      => (int)$user->user_id,
            "order_created"                => $this->time_now(),
            "order_shipping_address"       => $address->address,
            "order_shipping_city"          => $address->city,
            "order_shipping_zipcode"       => $address->zipcode,
            "order_shipping_phone"         => $address->phone,
            "order_payment_method"         => $address->type,
            "order_total"                  => $this->getOrderTotal($cart)
        );

        $result = $orders->insert( $data );
        $result2 = $this->insertOrderToAlbum( $cart, $result['id']);
        $result3 = $this->lessFromStock( $cart );
        return $result3;
    }

    private function lessFromStock( $array ){
        foreach ($array as $item) {
            $orders = $this->_db->albums->where('album_id', $item->album_id);
            $count = (int)$this->getAlbumCount($item->album_id);
            $newCount = $count - $item->countInStock;

            if ($orders) {
                $data = array(
                    "album_stock" => $newCount
                );
                $result = $orders->update($data);
            }
        }
        return $result;
    }


    /**
     * @param $array
     * @param $id
     * @return object
     * connection albums to order in table orders_to_albums
     */
    private function insertOrderToAlbum($array, $id){
        $orders = $this->_db->orders_to_albums();
        foreach ($array as $item) {
            $i = $item->countInStock;
            $data = array(
                "order_id"                     => (int)$id,
                "album_id"                     => (int)$item->album_id
            );
            while( $i > 0){
                $result = $orders->insert( $data );
                $i--;
            }
        }
        return $result;
    }

    /**
     *
     * return price of order
     * @param $array
     * @return int
     * take order total price
     */
    private function getOrderTotal( $array ){
        $sumTotal = 0;
        if(gettype($array) == 'array'){
            foreach ($array as $item) {
                $sumCount = $item->album_price * $item->countInStock;
                $sumTotal += $sumCount;
            }
            return $sumTotal;
        }
    }


    /**
     * @return bool|string
     * return current time in TIMESTAMP format
     */
    private function time_now(){
        date_default_timezone_set('Asia/Jerusalem');
        $mysqltime = date ("Y-m-d H:i:s");
        return $mysqltime;
    }

}

