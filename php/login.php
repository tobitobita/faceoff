<?php
$error = array();
if($_SERVER['REQUEST_METHOD'] == 'POST') {
	if(isset($_POST['userId']) && $_POST['userId'] == 'user1' && isset($_POST['password']) && $_POST['password'] == 'password') {
		session_start();
		$_SESSION['user'] = $_POST['userId'];
		header('Location: http://' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . '/');
		exit;
	}
	$error['LOGIN_ERROR'] = 'ユーザーID、もしくは、パスワードが違います';
}
?><!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<title>Login | FaceOff</title>
</head>
<body>
	<h1>Login</h1><?php
if(isset($error['LOGIN_ERROR'])) { ?>
	<p><?= $error['LOGIN_ERROR']; ?></p><?php
}?>	<form action="login.php" method="post">
		<p>
			<input type="text" name="userId" placeholder="ユーザーID" />
		</p>
		<p>
			<input type="password" name="password" placeholder="パスワード" />
		</p>
		<button type="submit">ログイン</button>
	</form>
</body>
</html>