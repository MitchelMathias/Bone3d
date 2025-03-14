<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Mapeamento de cores RGB para nomes
    $colorMap = [
        'rgb(0, 0, 0)' => 'Preto',
        'rgb(245, 245, 220)' => 'Bege',
        'rgb(0, 123, 255)' => 'Azul',
        'rgb(255, 0, 0)' => 'Vermelho'
    ];

    // Função para traduzir RGB para nome da cor
    function getColorName($rgb, $colorMap) {
        return $colorMap[$rgb] ?? $rgb;
    }

    // Configurações de upload
    $uploadDir = __DIR__ . '/uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Função para processar uploads
    function processUpload($file, $uploadDir) {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $fileName = uniqid() . '_' . basename($file['name']);
            $targetPath = $uploadDir . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                return $fileName;
            }
        }
        return null;
    }

    // Processar dados do formulário
    $tipo_fecho = htmlspecialchars($_POST['fecho']);
    $tipo_bone = htmlspecialchars($_POST['tipo_bone']);
    
    // Traduzir cores usando o mapeamento
    $cor_corpo = getColorName(htmlspecialchars($_POST['cor_do_corpo']), $colorMap);
    $cor_frente = getColorName(htmlspecialchars($_POST['cor_da_frente']), $colorMap);
    $cor_aba_cima = getColorName(htmlspecialchars($_POST['aba_cima']), $colorMap);
    $cor_aba_baixo = getColorName(htmlspecialchars($_POST['aba_baixo']), $colorMap);
    
    $detalhes = htmlspecialchars($_POST['detalhes']);
    $telefone = htmlspecialchars($_POST['telefone']);

    // Processar arquivos
    $arquivos = [
        'frente' => processUpload($_FILES['logo_frente'], $uploadDir),
        'direito' => processUpload($_FILES['logo_direito'], $uploadDir),
        'esquerdo' => processUpload($_FILES['logo_esquerdo'], $uploadDir),
        'tras' => processUpload($_FILES['logo_tras'], $uploadDir)
    ];

    // Montar mensagem textual
    $mensagem = "Nova solicitação de boné:\n\n";
    $mensagem .= "Tipo de Fecho: $tipo_fecho\n";
    $mensagem .= "Tipo de Bone: $tipo_bone\n";
    $mensagem .= "Cor do Corpo: $cor_corpo\n";
    $mensagem .= "Cor da Frente: $cor_frente\n";
    $mensagem .= "Cor Aba Superior: $cor_aba_cima\n";
    $mensagem .= "Cor Aba Inferior: $cor_aba_baixo\n";
    $mensagem .= "Detalhes Adicionais:\n$detalhes\n";
    $mensagem .= "Telefone: $telefone\n";
    $mensagem .= "Arquivos Anexados:\n";
    
    foreach ($arquivos as $posicao => $arquivo) {
        $mensagem .= ucfirst($posicao) . ": " . ($arquivo ? $arquivo : 'Nenhum arquivo enviado') . "\n";
    }

    // Configurar email com anexos
    $boundary = uniqid('np');
    $headers = "From: hackerhtml01@gmail.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $body .= $mensagem . "\r\n\r\n";

    foreach ($arquivos as $arquivo) {
        if ($arquivo) {
            $filePath = $uploadDir . $arquivo;
            if (file_exists($filePath)) {
                $fileContent = file_get_contents($filePath);
                $fileBase64 = base64_encode($fileContent);
                $mimeType = mime_content_type($filePath);

                $body .= "--$boundary\r\n";
                $body .= "Content-Type: $mimeType; name=\"$arquivo\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"$arquivo\"\r\n\r\n";
                $body .= chunk_split($fileBase64) . "\r\n";
            }
        }
    }

    $body .= "--$boundary--";

    // Enviar email
    $para = "mitchelmathias2904@gmail.com";
    $assunto = "Nova Solicitação de Boné - Cap&Arte";

    if (mail($para, $assunto, $body, $headers)) {
        echo '<script>
                window.alert("Dados Enviados com Sucesso");
                window.location.href = "https://capearte.com.br/paginas/personalize";
            </script>';
    } else {
        echo '<script>
                window.alert("Houve um erro ao enviar os dados, por gentileza tente novamente");
                window.location.href = "https://capearte.com.br/paginas/personalize";
            </script>';
    }
    exit();
}
?>