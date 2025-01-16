$(document).ready(function () {
    const viewer = document.querySelector('#viewer');

    // Garante que o viewer esteja carregado antes de executar o restante do código
    viewer.addEventListener('load', () => {
        // Acessa os materiais do modelo (verifique se o modelo realmente tem materiais na posição indicada)
        const aba_topo = viewer.model.materials[0]; // Acessa o material da aba
        const corpo = viewer.model.materials[1]; 
        const tampa = viewer.model.materials[2]   // Acessa o material do corpo

        // Evento para atualizar as cores dinamicamente
        $('.cor-input').on('change', function () {
            // Captura as cores diretamente em RGBA, convertendo de string para array
            const cor_corpo = $('.cores_corpo .cor-input:checked').val()
            const cor_aba = $('.cores_aba .cor-input:checked').val()

            // Verifique se as cores foram capturadas corretamente
            console.log('Cor do Corpo:', cor_corpo);
            console.log('Cor da Aba:', cor_aba);

            // Define as cores nos materiais diretamente
            corpo.pbrMetallicRoughness.setBaseColorFactor(cor_corpo);
            tampa
            aba_topo.pbrMetallicRoughness.setBaseColorFactor(cor_aba);

        });
    });
});
