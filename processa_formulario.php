<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitiza os dados para evitar injeções
    $tipo_tecido = htmlspecialchars($_POST['tipo_tecido']);
    $tipo_fecho = htmlspecialchars($_POST['tipo_fecho']);
    $cor_corpo = htmlspecialchars($_POST['cor_corpo']);
    $cor_aba = htmlspecialchars($_POST['cor_aba']);

    // Configuração para enviar o email para o administrador
    $para = "nunesmicael234@gmail.com"; // Email do administrador
    $assunto = "Nova Solicitação de Boné";
    $mensagem = "Tipo de Tecido: $tipo_tecido\nTipo de Fecho: $tipo_fecho\nCor do Corpo: $cor_corpo\nCor da Aba: $cor_aba";
    $headers = "From: hackerhtml01@gmail.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";  // Garante que o e-mail seja enviado corretamente

    // Enviar o e-mail
    if (mail($para, $assunto, $mensagem, $headers)) {
        echo "Dados enviados com sucesso!";
    } else {
        echo "Falha no envio dos dados!";
    }
}
?>
