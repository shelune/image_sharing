<?php
session_start();

$dbhost = "localhost";
$dbname = "Sharimage";
$dbuser = "username";
$dbpass = "password";

mysql_connect($dbhost, $dbuser, $dbpass) or die("MySQL Error: " . mysql_error());
mysql_select_db($dbname) or die("MySQL Error: " . mysql_error());
?>