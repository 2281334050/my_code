<?php 
//session_start();
require_once 'init_db.php';
$username = $_GET['username'];
$password = $_GET['password'];
$salt = 'Qiniu' . $username;
$password = crypt($password, $salt);
$sql = "select * from users where uname = '$username'";
$stmt = $DB->prepare($sql);
$stmt->execute();
$result=$stmt->fetch(PDO::FETCH_ASSOC);

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
var_dump($result);