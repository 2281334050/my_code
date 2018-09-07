<?php 
require_once 'db.php';
session_start();
$username = $_POST['username'];
$password = $_POST['password'];
$salt = 'Qiniu' . $uname;
$pwd = crypt($_pwd, $salt);
$stmt = $DB->prepare('select * from users where uname = :name');
$stmt->execute(array('name' => $uname));
$user = $stmt->fetch();
    if ($user['password'] !== $pwd)
    {
      http_response_code(401);
      $resp = array('status' => 0, 'msg' => '账号或密码不正确');
      echo json_encode($resp);
      return;
    }
$_SESSION['uid'] = $user['uid'];
$_SESSION['uname'] = $uname;
$resp = array('status' => 1, 'uname' => $uname);
echo json_encode($resp);