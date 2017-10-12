<?php
$servername = "54.207.55.241";
$username = "livplay";
$password = "*yowExtSzoh2H";
$dbname = "livplay";

$name = $_POST["nome"];
$email = $_POST["email"];
date_default_timezone_set('America/Sao_Paulo');
$date = date ("d-m-Y");


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO registros (nome, email, data)
VALUES ('$name', '$email', '$date')";

if ($conn->query($sql) === TRUE) {
    header('Location: ../confirmacao.html');
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>