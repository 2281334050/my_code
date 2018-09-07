<?php
$dbms='mysql';     //数据库类型
$host='47.100.213.47'; //数据库主机名
$dbName='my_code';    //使用的数据库
$user='root';      //数据库连接用户名
$pass='123456';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";
$DB = new PDO($dsn, $user, $pass); //初始化一个PDO对象