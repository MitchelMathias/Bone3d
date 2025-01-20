$(document).ready(function () {
    const viewer = document.querySelector('#viewer');

    // Espera o carregamento do modelo para poder modificar
    viewer.addEventListener('load', function () {

        // Função para converter a cor RGB para o formato normalizado (0-1)
        function rgbToNormalized(r, g, b) {
            return [r / 255, g / 255, b / 255];
        }

        // Alterar a cor do corpo e da aba quando o usuário selecionar uma nova cor
        $('#cor_corpo').on('input', function () {
            const corCorpo = this.value; // Pega a cor do corpo selecionada pelo usuário
            const rgbCorpo = corCorpo.match(/\w\w/g).map(x => parseInt(x, 16));
            const normalizedCorpo = rgbToNormalized(rgbCorpo[0], rgbCorpo[1], rgbCorpo[2]);

            // Aplica a cor no corpo do modelo
            viewer.model.materials.forEach((material, index) => {
                if (index === 0) { // 0 para o corpo
                    material.pbrMetallicRoughness.setBaseColorFactor(normalizedCorpo);
                }
            });
        });

        // Alterar a cor da aba quando o usuário selecionar uma nova cor
        $('#cor_aba').on('input', function () {
            const corAba = this.value; // Pega a cor da aba selecionada pelo usuário
            const rgbAba = corAba.match(/\w\w/g).map(x => parseInt(x, 16));
            const normalizedAba = rgbToNormalized(rgbAba[0], rgbAba[1], rgbAba[2]);

            // Aplica a cor na aba do modelo
            viewer.model.materials.forEach((material, index) => {
                if (index === 1) { // 1 para a aba
                    material.pbrMetallicRoughness.setBaseColorFactor(normalizedAba);
                }
            });
        });

        // Trocar o modelo 3D baseado no tipo de fecho
        $('#tipo_bone').change(function () {
            const selectedValue = $(this).val();
            const lista = ['01_trucker', '02_americano', '03_aba_reta','04_new_york', '05_viseira', '06_bucket']
            
            if (lista.includes(selectedValue) === true){
                viewer.src = `models/${selectedValue +'.glb'}`
            }
            else{
                alert('Error:Recarregue a Pagina')
            }
        });

        // Submissão do formulário para enviar os dados para o servidor
        $('#controls-form').submit(function (e) {
            e.preventDefault(); // Previne o envio do formulário para que possamos processá-lo via AJAX

            const tipo_fecho =  $('#fecho').val()
            const tipo_bone =  $('#tipo_bone').val()
            const cor_corpo =  $('#cor_corpo').val()
            const cor_frente =  $('#cor_da_frente').val()
            const cor_cima = $('#aba_cima').val()
            const cor_baixo = $('#aba_baixo').val()
            const detalhes = $('#detalhes').val()


            // Enviar dados via AJAX
            $.ajax({
                url: 'processa_formulario.php',
                type: 'POST',
                data: {
                    tipo_fecho: tipo_fecho,
                    tipo_bone: tipo_bone,
                    cor_corpo: cor_corpo,
                    cor_frente: cor_frente,
                    cor_cima: cor_cima,
                    cor_baixo: cor_baixo,
                    detalhes: detalhes
                },
                success: function (response) {
                    alert("Dados enviados com sucesso!");
                    console.log(response);
                },
                error: function (xhr, status, error) {
                    console.error("Erro ao enviar os dados:", error);
                }
            });
        });
    });
});