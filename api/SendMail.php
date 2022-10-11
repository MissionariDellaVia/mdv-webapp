<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (empty($_POST['nome']) && empty($_POST['cognome'])  && empty($_POST['mail'])  && empty($_POST['telefono']) ) die();

if ($_POST)
	{

	// set response code - 200 OK

	http_response_code(200);
	$subject = "Messaggio da ".$_POST['nome'];
	$to = "alessandro.macri95@gmail.com";
	$from = $_POST['mail'];;
	$nome = $_POST['nome'];
	$message = "";
	if (!empty($_POST['message'])) {
		$message = $_POST['message'];
	}

	// data
	$emailBody = "
    <html>
    <head>
    <title>$nome vorrebbe saperne di più!</title>
    </head>
    <body style=\"background-color:#fafafa;\">
	<div style=\"color:#888\">$message</div>
	</div>
    </body>
    </html>
	";

	// Headers

	$headers = "MIME-Version: 1.0\r\n";
	$headers.= "Content-type: text/html; charset=UTF-8\r\n";
	$headers.= "From: <" . $from . ">";

	if (mail($to, $subject, $emailBody, $headers)) {
		$sent = true;
	}

	}
  else
	{
		$errors = array();
		$errors[] = 'Qualcosa è andata storta';
	}

?>


<?php if (!empty($errors)) : ?> 

	{
	"sent": false,
	"message":  <?php echo json_encode($errors) ?>
	}

<?php endif; ?>


<?php if (isset($sent) && $sent === true) : ?> 

	{
	"sent": true,
	"message": "Il messaggio è stato inviato con successo"
	}

<?php endif; ?>