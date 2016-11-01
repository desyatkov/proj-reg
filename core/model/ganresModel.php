<?php
// namespace core\Model;
require dirname( __FILE__ ) . '/../vendor/autoload.php';

class ModelGenres extends Model {


    /**
     * @return array All genres and sub-genres
     */
    public function getAllGenres() {
        $fetch = array();
        $genres = $this->_db->genres->where( 'genre_parent_id', 0 );
        foreach ($genres as $genre) {
            $fetch[] = array(
                'name' => $genre['genre_name'],
                'desc' => $genre['genre_name'],
                'subitems'=> $this->getSubitems( $genre['genre_id'] )
            );
        }
        return $fetch;
    }

    /**
     * @param $genre_id
     * @return array sub-genres to use in function getAllGenres()
     */
    private function getSubitems($genre_id ){
        $fetch = array();
        $subgenres = $this->_db->genres->where( 'genre_parent_id', $genre_id );
        foreach ($subgenres as $subgenre) {
            $fetch[] = array(
                'name' => $subgenre['genre_name']
            );
        }
        return $fetch;
    }

}
