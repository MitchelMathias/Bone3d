// Variáveis globais
let scene, camera, renderer, tipo, modelo_atual = null;

// Inicialização quando o documento estiver pronto
$(document).ready(function(){
    inicializarAplicacao();
    configurarEventListeners();
});

// Função principal de inicialização
function inicializarAplicacao() {
    criar_cena();
    carregar_3d('01_trucker');
    troca_bone();
}

// Configuração de event listeners
function configurarEventListeners() {
    // Event listener para mudança de cores
    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').change(troca_cor);

    // Event listener para mudança de logo
    $('input[name="logo"]').change(function() {
        let logo = this.files[0];
        if (logo) {
            const logoUrl = URL.createObjectURL(logo);
            mudar_cor('logo', logoUrl);
        }
    });
}

// Criação da cena 3D
function criar_cena(){
    const container = $('.modelo');
    let width = container.width();
    let height = container.height();
    
    // Configuração da cena
    scene = new THREE.Scene();
    
    // Configuração do renderer
    renderer = criarRenderer(width, height);
    container.append(renderer.domElement);
    
    // Configuração da câmera
    camera = criarCamera(width, height);
    
    adicionarLuzes();
    
    // Configuração dos controles de órbita
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Função de animação
    function animate(){
        requestAnimationFrame(animate);
        controls.update();
        if (modelo_atual){
            modelo_atual.rotation.y += 0.0004;
        } 
        renderer.render(scene, camera);
    }
    
    animate();
}

// Criação do renderer
function criarRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.createElement('canvas'),
        antialias: true,
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);
    return renderer;
}

// Criação da câmera
function criarCamera(width, height) {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.y = 1;
    return camera;
    
}

// Adição de luzes à cena
function adicionarLuzes() {
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 0, 0);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x111111, 5);
    scene.add(ambientLight);
}

// Carregamento do modelo 3D
function carregar_3d(tipo_bone) {
    if (modelo_atual !== null) {
        scene.remove(modelo_atual);
    }

    resetarSelecaoCores();

    const loader = new THREE.GLTFLoader();

    loader.load(`models/${tipo_bone}.glb`, 
        function (carregou) {
            processarModeloCarregado(carregou);
        }, 
        undefined, 
        function(erro){ 
            console.error('Erro ao carregar o modelo:', erro);
            alert('Erro ao carregar o modelo. Por favor, recarregue a página.'); 
        }
    );
}

// Processamento do modelo carregado
function processarModeloCarregado(carregou) {
    posicionarEEscalarModelo(carregou.scene);
    ajustarCamera();
    tornarLogoInvisivel(carregou.scene);
    adicionarModeloACena(carregou.scene);
}

// Posicionamento e escala do modelo
function posicionarEEscalarModelo(modelo) {
    modelo.position.set(0, 0, 0);
    modelo.rotation.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(modelo);
    const tamanho = Math.max(
        box.max.x - box.min.x,
        box.max.y - box.min.y,
        box.max.z - box.min.z
    );

    const tamanhoMaximo = 5;
    const escala = tamanhoMaximo / tamanho;
    modelo.scale.set(escala, escala, escala);
}

// Ajuste da câmera
function ajustarCamera() {
    camera.position.z = 5 * 0.8; // 5 é o tamanhoMaximo definido anteriormente
}

// Tornar a logo invisível inicialmente
function tornarLogoInvisivel(modelo) {
    modelo.traverse(function(obj) {
        if (obj.name.includes('logo')) {
            obj.visible = false;
        }
    });
}

// Adicionar o modelo à cena
function adicionarModeloACena(modelo) {
    scene.add(modelo);
    modelo_atual = modelo;
}

// Resetar seleção de cores
function resetarSelecaoCores() {
    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').prop('checked', false);
}

// Troca de tipo de boné
function troca_bone(){
    let bone = $('#tipo_bone');
    let array_bone = ['01_trucker', '02_americano', '03_aba_reta', '04_new_york', '05_viseira', '06_bucket', 'teste'];

    bone.change(function(){
        if(array_bone.includes(bone.val())){
            tipo = bone.val();
            carregar_3d(tipo);
        } else {
            alert('Modelo não encontrado');
        }   
    });
}

// Troca de cor
function troca_cor(){
    let cores = {
        corpo: $('input[name="cor_do_corpo"]:checked').val(),
        frente: $('input[name="cor_da_frente"]:checked').val(),
        aba_cima: $('input[name="aba_cima"]:checked').val(),
        aba_baixo: $('input[name="aba_baixo"]:checked').val()
    };

    let logo = $('input[name="logo"]')[0].files[0];
    if (logo) {
        cores.logo = URL.createObjectURL(logo);
    }

    Object.keys(cores).forEach(parte => mudar_cor(parte, cores[parte]));
}

// Mudar cor ou aplicar textura
function mudar_cor(parte, cor) {
    if (!modelo_atual) return;

    modelo_atual.traverse(function (obj) {
        if (obj.isMesh && obj.name.includes(parte)) {
            if (cor) {
                if (parte === 'logo') {
                    aplicarTexturaLogo(obj, cor);
                } else {
                    aplicarCor(obj, cor);
                }
            }
            obj.visible = true;
        }
    });
}

// Aplicar textura à logo
function aplicarTexturaLogo(obj, cor) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        cor,
        function (texture) {
            obj.material.map = texture;
            obj.material.needsUpdate = true;
        },
        undefined,
        function (err) {
            console.error('Erro ao carregar a textura:', err);
        }
    );
}

// Aplicar cor a uma parte do modelo
function aplicarCor(obj, cor) {
    obj.material.color.set(cor);
}