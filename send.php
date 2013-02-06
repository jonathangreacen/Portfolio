<?php 
$ToEmail = 'contact@yoursite.com'; 
$EmailSubject = $_POST["subject"];
$mailheader = "From: ".$_POST["from"]."\r\n"; 
$mailheader .= "Reply-To: ".$_POST["from"]."\r\n"; 
$mailheader .= "Content-type: text/html; charset=iso-8859-1\r\n"; 
$MESSAGE_BODY .= "From: ".$_POST["from"]."\r\n"; 
$MESSAGE_BODY .= "Comment: ".nl2br($_POST["body"]).""; 
mail($ToEmail, $EmailSubject, $MESSAGE_BODY, $mailheader) or die ("Failure"); 
?>
