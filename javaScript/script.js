const viewer = $('#viewer');
const fecho = $('#fecho');
const tipo = $('#tipo_bone');
const corpo = $('#cor_do_corpo');
const frente = $('#cor_da_frente');
const cima = $('#aba_cima');
const baixo = $('#aba_baixo');
const detalhes = $('#detalhes');

const array_fecho = ['sanap_back', 'strap_back', 'fitted'];
const array_tipo = ['01_trucker', '02_americano', '03_aba_reta', '04_new_york', '05_viseira', '06_bucket'];

$(document).ready(function () {
    tipo.change(function troca_bone() {
        if (array_tipo.includes(tipo.val())) {
            const modelo = `models/${tipo.val()}.glb`;
            viewer.attr('src', modelo);

            carrega_partes(modelo);
        } else {
            alert('Deu merda');
        }
    });

    function carrega_partes(modelo) {
        const loader = new THREE.GLTFLoader();

        loader.load(
            modelo,
            function (gltf) {
                const model = gltf.scene;

                // Função para carregar as partes do modelo
                model.traverse((child) => {
                    if (child.isMesh) {
                        console.log('Parte encontrada:', child.name);
                        console.log('Material:', child.material);
                        console.log('Geometria:', child.geometry);
                    }
                });
            },
            undefined,
            function (error) {
                console.error('Erro ao carregar o modelo:', error);
            }
        );
    }
});
