<?php
// namespace core\Model;
require dirname( __DIR__ ) . '/vendor/autoload.php';

class Model {
    protected $pdo;
    protected $_db;

    public function __construct() {
        $pdo = DB::getInstance();
        $this->_db = new NotORM($pdo);
    }
}
