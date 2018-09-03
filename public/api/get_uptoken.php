<?php
require 'php-sdk/autoload.php';
require 'config.php';
use Qiniu\Auth;
  // 用于签名的公钥和私钥
$accessKey = Config::ACCESS_KEY;
$secretKey = Config::SECRET_KEY;
$bucket = Config::BUCKET_NAME;

  // 初始化签权对象
$auth = new Auth($accessKey, $secretKey);
$returnBody = '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"name":"$(x:name)"}';
$policy = array(
    'returnBody' => $returnBody
);
// 简单上传凭证
$expires = 3600;

$upToken = $auth->uploadToken($bucket, null, $expires, $policy, true);
echo json_encode($upToken)
?>
