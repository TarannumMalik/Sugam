<?php
// send-mail.php
header('Content-Type: application/json');

// ── EDIT THESE ────────────────────────────────────────────────
$recipients = ["maliktarannum883@gmail.com"];
$fromDomain = "sugamtravel.com";
// ─────────────────────────────────────────────────────────────

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["errors" => [["message" => "Method not allowed."]]]);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');
$mailSubject = trim($_POST['_subject'] ?? "New Travel Inquiry — Sugam Travel Website");
$replyTo     = trim($_POST['_replyto'] ?? $email);

$errors = [];
if ($name === '') $errors[] = ["message" => "Name is required."];
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = ["message" => "A valid email is required."];
if ($subject === '') $errors[] = ["message" => "Subject is required."];
if ($message === '') $errors[] = ["message" => "Message is required."];

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(["errors" => $errors]);
    exit;
}

$body  = "You have a new inquiry from the Sugam Travel website:\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Subject: $subject\n\n";
$body .= "Message:\n$message\n";

$headers   = [];
$headers[] = "From: Sugam Travel Website <noreply@$fromDomain>";
$headers[] = "Reply-To: " . ($replyTo !== '' ? $replyTo : $email);
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$to = implode(",", $recipients);
$sent = mail($to, $mailSubject, $body, implode("\r\n", $headers));

if ($sent) {
    http_response_code(200);
    echo json_encode(["ok" => true]);
} else {
    http_response_code(500);
    echo json_encode(["errors" => [["message" => "The server could not send the email."]]]);
}