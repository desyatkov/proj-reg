<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
<pre>
    <?php
    require_once dirname( __DIR__ ) . '/core/vendor/autoload.php';


     $album = new UserModel();

//    print_r(  $album->getAlbumByGanres( 'pop', 'undefined' ) );
//    print_r(  $album->getGenresParentName( 3 ) );
//    print_r(  $album->getSubGenresId( 3 ) );
//    $album = new AlbumController();
//    print_r( $album->getAlbumById(14));

    print_r( $album->getHistory(34));




    ?>
</body>
</html>
