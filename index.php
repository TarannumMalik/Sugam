<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    $to = "maliktarannum883@gmail.com";

    $mail_subject = "New Message: " . $subject;
    $mail_body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    $headers = "From: $email";

    mail($to, $mail_subject, $mail_body, $headers);

    // Auto reply
    mail($email, "We received your message", "Hello $name,\nThanks! We will contact you soon.");

    echo "success";
}
?>