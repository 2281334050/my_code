<?php 
//session_start();
require_once 'init_db.php';
$username = $_GET['username'];
$password = $_GET['password'];
$salt = 'Qiniu' . $username;
$password = crypt($password, $salt);
$stmt = $DB->query("select * from users where uname = $username");

    // if ($user['password'] !== $pwd)
    // {
    //   http_response_code(401);
    //   $resp = array('status' => 0, 'msg' => '账号或密码不正确');
    //   echo json_encode($resp);
    //   return;
    // }
// $_SESSION['uid'] = $user['uid'];
// $_SESSION['uname'] = $uname;
// $resp = array('status' => 1, 'uname' => $uname);
var_dump($stmt);