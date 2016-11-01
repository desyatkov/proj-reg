<?php
require dirname( __FILE__ ) . '/vendor/autoload.php';
\Slim\Slim::registerAutoloader();

session_start();
$app = new \Slim\Slim();

$album = new AlbumController();
$genres = new GenresController();
$users = new userController();

$app->get('/getalbums', function () use ($app, $album) {
    echo json_encode($album->getAllAlbums());
});

$app->get('/findAlbum/:album', function ($alb) use ($app, $album) {
    echo json_encode($album->findAlbum($alb));
});

$app->get('/getalbums/:page', function ($page) use ($app, $album) {
    sleep(1);
    echo json_encode($album->getAllAlbumsInfinity($page));
});

$app->get('/getalbumsbyganre/:category/:subcategory/:page', function ($category, $subcategory, $page) use ($app, $album) {
    echo json_encode($album->getAlbumByGanres($category, $subcategory, $page));

});

$app->get('/getganres', function () use ($app, $genres) {
    echo json_encode($genres->getAllGenres());
});

$app->get('/getalbum/:id', function ( $id ) use ($app, $album) {
    sleep(2);
    echo json_encode( $album->getAlbumById($id) );
});

$app->get('/login', function () use ($app, $users) {
    $user = $app->request->params();
    echo json_encode(  $users->userLogin($user)  );
});

$app->post('/registration', function () use ($app, $users) {
    $user = $app->request->params();
    echo json_encode(  $users->newUserReg($user)  );
});

$app->get('/ifexist/:data', function ( $data ) use ($app, $users) {
    echo  json_encode( $users->ifExist($data) ) ;
//    echo $data;
});

$app->get('/fbexist/:data', function ( $data ) use ($app, $users) {
    echo  json_encode( $users->ifExistFb($data) );
//    echo $data;
});

$app->get('/getuserhistory/:id', function ( $id ) use ($app, $users) {
    sleep(2);
    echo  json_encode( $users->getHistory($id) ) ;
});

$app->post('/newuserfb', function (  ) use ($app, $users) {
    $user = $app->request->params();
    echo  json_encode( $users->regExistFb($user) ) ;
//    echo $data;
});

$app->post('/payorder', function ( ) use ($app, $album) {
    $data = $app->request->params();
    $res = $album->pay($data['data']);
    echo json_encode( $res );
//    echo json_encode(array_keys($data));
});

$app->run();