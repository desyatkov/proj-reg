<?php
require dirname( __DIR__ ) . '/vendor/autoload.php';

/**
 * return connection to mySQL
 * file configuration in config/db_config.ini
 */

class DB
{
    private static $instance = NULL;


    /**
     * Static function return PDO connection to DB
     * to use this function use construction DB::getInstance()
     * @return null|\PDO
     */
    public static function getInstance()
    {
        $config = parse_ini_file( dirname( __FILE__ ) . '/db_config.ini' );

        if ( !self::$instance ) {
            self::$instance = new PDO( $config[ 'db.conn' ], $config[ 'db.user' ], $config[ 'db.pass' ] );
        }
        return self::$instance;
    }

    private function __construct(){}
    private function __clone(){}
    private function __wakeup(){}
}