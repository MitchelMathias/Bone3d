<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tipo_fecho = htmlspecialchars($_POST['fecho']);
    $tipo_bone = htmlspecialchars($_POST['tipo_bone']);
    $cor_corpo = htmlspecialchars($_POST['cor_corpo']);
    $cor_frente = htmlspecialchars($_POST['cor_da_frente']);
    $cor_aba_cima = htmlspecialchars($_POST['aba_cima']);
    $cor_aba_baixo = htmlspecialchars($_POST['aba_baixo']);
    $detalhes = htmlspecialchars($_POST['detalhes']);


    $para = "mitchel.mathias.dev@gmail.com";
    $assunto = "Nova Solicitação de Boné";
    $mensagem = "Tipo de Fecho: $tipo_fecho\nTipo de Bone: $tipo_bone\nCor do Corpo: $cor_corpo\nCor da Aba Cima: $cor_aba_cima\nCor da Aba Baixo: $cor_aba_baixo\nDetalhes: $detalhes";
    $headers = "From: hackerhtml01@gmail.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n"; 

    if (mail($para, $assunto, $mensagem, $headers)) {
        echo "Dados enviados com sucesso!";
    } else {
        echo "Falha no envio dos dados!";
    }
}
?>