let scene, camera, renderer, modelo_atual = null;

$(document).ready(function(){
    criarCena();
    carregarModelo('01_trucker');
    configurarInteracoes();
    $('#logo_frente, #logo_direito, #logo_esquerdo, #logo_tras').on('change', function() {
        aplicarAlteracoes();
    });
});

function criarCena() {
    const container = $('.modelo');
    let largura = container.width();
    let altura = container.height();

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(largura, altura);

    $(window).resize(function() {
        largura = container.width();
        altura = container.height();

        camera.aspect = largura / altura;
        camera.updateProjectionMatrix();
        renderer.setSize(largura, altura);
    });
    
    container.append(renderer.domElement);

    const aspect = largura / altura;
    camera = new THREE.PerspectiveCamera(75, largura / altura, 0.1, 1000);
    camera.position.set(0, 1, 4);
    scene.background = new THREE.Color(0xD3D3D3);

    const luzPonto = new THREE.PointLight(0xffffff, 0.5);
    luzPonto.position.set(10, 10, 10);
    scene.add(luzPonto);

    const luzDirecional = new THREE.DirectionalLight(0xffffff, 0.8);
    luzDirecional.position.set(100, 0, 0);
    scene.add(luzDirecional);

    const luzAmbiente = new THREE.AmbientLight(0x111111, 5);
    scene.add(luzAmbiente);

    const controles = new THREE.OrbitControls(camera, renderer.domElement);

    function animar() {
        requestAnimationFrame(animar);
        controles.update();
        if (modelo_atual) {
            modelo_atual.rotation.y += 0.0004;
        }
        renderer.render(scene, camera);
    }

    animar();
}

function carregarModelo(tipo) {
    if (modelo_atual) {
        scene.remove(modelo_atual);
    }

    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').prop('checked', false);
    $('input[name="logo_frente"], input[name="logo_tras"], input[name="logo_esquerdo"], input[name="logo_direito"]').val('');

    const loader = new THREE.GLTFLoader();
    loader.load(`../models/${tipo}.glb`,
        function (gltf) {
            const modelo = gltf.scene;

            modelo.position.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(modelo);
            const tamanho = Math.max(
                box.max.x - box.min.x,
                box.max.y - box.min.y,
                box.max.z - box.min.z
            );

            const escala = 5 / tamanho;
            modelo.scale.set(escala, escala, escala);

            modelo.traverse(obj => {
                if (obj.name.includes('logo')) {
                    obj.visible = false;
                }
            });

            scene.add(modelo);
            modelo_atual = modelo;
        },
        undefined,
        function () {
            alert('Erro ao carregar o modelo.');
        }
    );
}

function configurarInteracoes() {
    $('#tipo_bone').change(function() {
        const tipo = $(this).val();
        carregarModelo(tipo);
    });

    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').change(aplicarAlteracoes);

    $('input[name="logo"]').change(aplicarAlteracoes);
}

function aplicarAlteracoes() {
    if (!modelo_atual) return;

    const cores = {
        corpo: $('input[name="cor_do_corpo"]:checked').val(),
        frente: $('input[name="cor_da_frente"]:checked').val(),
        aba_cima: $('input[name="aba_cima"]:checked').val(),
        aba_baixo: $('input[name="aba_baixo"]:checked').val()
    };

    const logos = {
        logo_frente: $('#logo_frente')[0]?.files[0],
        logo_esquerdo: $('#logo_esquerdo')[0]?.files[0],
        logo_direito: $('#logo_direito')[0]?.files[0],
        logo_tras: $('#logo_tras')[0]?.files[0]
    };

    const loader = new THREE.TextureLoader();

    Object.entries(logos).forEach(([logoNome, logoArquivo]) => {
        if (logoArquivo) {
            const logoURL = URL.createObjectURL(logoArquivo);
            loader.load(logoURL, (textura) => {
                textura.repeat.x = -1;
                textura.offset.x = 1;
                modelo_atual.traverse((obj) => {
                    if (obj.isMesh && obj.name === logoNome) {
                        obj.material.map = textura;
                        obj.material.needsUpdate = true;
                        obj.visible = true;
                        console.log(`Logo aplicado em ${obj.name}`);
                    }
                });
                renderer.render(scene, camera);
            });
        } else {
            console.log(`Nenhum arquivo selecionado para ${logoNome}`);
        }
    });

    modelo_atual.traverse((obj) => {
        if (obj.isMesh) {
            const parte = Object.keys(cores).find((p) => obj.name.includes(p));
            if (parte && cores[parte]) {
                obj.material.color.set(cores[parte]);
                console.log(`Cor aplicada em ${obj.name}: ${cores[parte]}`);
            }
        }
    });
}



