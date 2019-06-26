<?php
header('Content-type: text/html; charset=utf-8');

setlocale(LC_ALL, "russian");
$monthes = array(
    1 => 'Января', 2 => 'Февраля', 3 => 'Марта', 4 => 'Апреля',
    5 => 'Мая', 6 => 'Июня', 7 => 'Июля', 8 => 'Августа',
    9 => 'Сентября', 10 => 'Октября', 11 => 'Ноября', 12 => 'Декабря'
);
$message = "";
$data = (date('d ') . $monthes[(date('n'))] . date(' Y, H:i:s'));

$message = "<br> Дата: $data";
if(!empty($_POST['name'])){
    $message .= "<br> Имя: ".trim(strip_tags($_POST['name']));
}


if(!empty($_POST['email'])){
    $message .= "<br> Email: ".trim(strip_tags($_POST['email']));
}

if(!empty($_POST['phone'])){
    $message .= "<br> Телефон: ".trim(strip_tags($_POST['phone']));
}

if(!empty($_POST['message'])){
    $message  .= "<br> Сообщение:".trim(strip_tags($_POST['message']));
}


$body = $message;
require_once($_SERVER['DOCUMENT_ROOT'] . '/phpmailer/PHPMailerAutoload.php'); //подключаем класс
$mail = new PHPMailer(); //вызываем класс


$mail->CharSet = 'utf-8';   //Устанавливаем кодировку
$mail->SetLanguage('ru');   //для ошибок итд.
$mail->addAddress("phpner@gmail.com","phpner"); //куда отправлять список
$mail->FromName = 'Мой сайт';
$mail->Subject = "Кто-то хочет что-то спросить";
$mail->Body = $body;
$mail->IsHTML(true);

//отправка
$ph = $_POST['phone'];
$leng = strlen($ph);
if ($leng <= 16){
    $json = json_encode([
        "message" => "Телефон — укажите телефон с кодом города или моб. оператора. например: 8 926 1234567, 926 123-45-67",
        "phone" => $ph,
        "status" => false
    ]);
    echo $json;
    die();
}

if(!$mail->Send()) {
    echo 'false ';
    echo $mail->ErrorInfo;
} else {

    if (!empty($_POST['phone'])){
        $json = json_encode([
            "message" => "Спасибо за заявку. Мы вам перезвоним по номеру $ph.",
            "phone" => $ph,
            "status" => true
        ]);
    }else {
        $json = json_encode([
            "message" => "Телефон — это поле обязательно.",
            "status" => false
        ]);
    }


    echo $json;
}
/*header( 'Refresh: 0; url=http://kuban-hostel.ru/' );*/
/*exit;*/
?>