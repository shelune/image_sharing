 <?php

 session_start();

if(isset( $_SESSION['user_id'] ))
{
    header("Location: home.html");
}

if(isset($_POST['submit'])){
    $dbHost     = "localhost";  //Location Of Database usually its localhost
    $dbUser     = $_POST['username'];   //Database User Name
    $dbPass     = $_POST['password'];;   //Database Password
    $dbDatabase = "Sharimage"; //Database Name
    //Connect to the databasse
    $db         = new PDO("mysql:dbname=$dbDatabase;host=$dbHost;port=3306", $dbUser, $dbPass);

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare("SELECT * FROM USER WHERE UNAME = :UNAME AND UPASS = :UPASS");

    $stmt->bindParam(':UNAME', $dbUser, PDO::PARAM_STR);
    $stmt->bindParam(':UPASS', $dbPass, PDO::PARAM_STR);

    $stmt->execute();

    $user_id = $stmt->fetchColumn();

    //Lets search the databse for the user name and password
    //Choose some sort of password encryption, I choose sha256
    //Password function (Not In all versions of MySQL).
    
    if($user_id == false){
		$message = 'Login Failed';
        header("Location: index.html"); // Modify to go to the page you would like
    } else {
    	$_SESSION['user_id'] = $user_id;
        $message = 'You are now logged in';
        header("Location: home.html");
    }
}else{ //If the form button wasn't submitted go to the index page, or login page
    header("Location: index.html");
    echo("wrong username or password");
} 
?>

<html>
	<head>
		<title>PHPRO Login</title>
	</head>
	<body>
		<p><?php echo $message; ?>
	</body>
</html>