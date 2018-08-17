<?php
header("Access-Control-Allow-Origin:");
require 'php-sdk/autoload.php';
use Qiniu\Auth;
  // 用于签名的公钥和私钥
$accessKey = 'hjg1HilDmR9A-KZf6hFX-lEa93tJISxj_r9_J5i7';
$secretKey = 'ClF9513RwX8NYqlt_L2cm0D-kTyL27PqGPQ2qnP0';
$bucket = 'kingdisk';

  // 初始化签权对象
$auth = new Auth($accessKey, $secretKey);

// 简单上传凭证
$expires = 3600;

$policy = null;
$upToken = $auth->uploadToken($bucket, null, $expires, $policy, true);
$data['status']=1;
$data['upToken']=$upToken;
echo json_encode($data)
?>
