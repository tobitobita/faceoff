<?php
require_once 'viewLogic/loginCheck.php';
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
	<h1>Hello <?= $_SESSION['user'] ?></h1>
	<form action="logout.php" method="post">
		<button type="submit">Logout</button>
	</form>
</body>
</html>
