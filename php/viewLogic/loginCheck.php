<?php
session_start();
if(!isset($_SESSION['user'])) {
	header('Location: http://' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . '/login.php');
		exit;
}
