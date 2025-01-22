$(document).ready(function(){
    criar_cena()
    carregar_3d('01_trucker')
    troca_bone()

    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').change(function(){
        troca_cor();
    });
});

let scene, camera, renderer, tipo, modelo_atual = null

function criar_cena(){
    const container = $('.modelo')
    let width = container.width()
    let height = container.height()
    scene = new THREE.Scene()

    // Configurar o fundo como transparente
    renderer = new THREE.WebGLRenderer({
        canvas: document.createElement('canvas'),
        antialias: true,
        alpha: true // Habilita a transparência
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0); // Cor de fundo transparente

    container.append(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000) 
    //scene.background = new THREE.Color(0xffffff)
    camera.position.y = 1

    adicionarLuzes();

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    function animate(){
        requestAnimationFrame(animate)
        controls.update();
        if (modelo_atual){
            modelo_atual.rotation.y += 0.0004;
        } 
        renderer.render(scene, camera)
        
    }

    animate()
}

function adicionarLuzes() {
    // Luz Pontual (PointLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.5); // Cor branca e intensidade 1.0
    pointLight.position.set(10, 10, 10); // Posição da luz
    scene.add(pointLight);

    // Luz Direcional (DirectionalLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Cor branca e intensidade 0.5
    directionalLight.position.set(100, 0, 0); // Posição da luz
    scene.add(directionalLight);

    // Luz Ambiente (AmbientLight)
    const ambientLight = new THREE.AmbientLight(0x111111, 5); // Cor suave e intensidade 0.5
    scene.add(ambientLight);
}

function troca_bone(){
    let bone = $('#tipo_bone')
    let array_bone = ['01_trucker', '02_americano', '03_aba_reta', '04_new_york', '05_viseira', '06_bucket']

    bone.change(function(){

        if(array_bone.includes(bone.val())){
            tipo = bone.val()
            carregar_3d(tipo)
        }
        else{
            alert('Modelo não encontrado')
        }   
    })
}

function carregar_3d(tipo_bone){
    if(modelo_atual !== null){
        scene.remove(modelo_atual)
    }

    const loader = new THREE.GLTFLoader()

    loader.load(`models/${tipo_bone}.glb`, function (carregou){ 

        carregou.scene.position.set(0, 0, 0);
        carregou.scene.rotation.set(0, 0, 0);

        const box = new THREE.Box3().setFromObject(carregou.scene);
        const tamanho = Math.max(
            box.max.x - box.min.x,
            box.max.y - box.min.y,
            box.max.z - box.min.z
        );

        const tamanhoMaximo = 5; 
        const escala = tamanhoMaximo / tamanho;
        carregou.scene.scale.set(escala, escala, escala);

        camera.position.z = tamanhoMaximo * 0.8; 

        scene.add(carregou.scene);
        modelo_atual = carregou.scene;

    }, undefined, function(deu_ruim){ 
        alert('Recarregue a Página'); 
    })
}

function troca_cor(){
    let corpo = $('input[name="cor_do_corpo"]:checked').val();
    let frente = $('input[name="cor_da_frente"]:checked').val();
    let aba_cima = $('input[name="aba_cima"]:checked').val();
    let aba_baixo = $('input[name="aba_baixo"]:checked').val();

    mudar_cor("corpo", corpo);
    mudar_cor("frente", frente);
    mudar_cor("aba_cima", aba_cima);
    mudar_cor("aba_baixo", aba_baixo);
}

function mudar_cor(tipo_cor, cor) {
    if (modelo_atual) {
        modelo_atual.traverse(function(obj) {
            if (obj.isMesh) {
                if (obj.name.includes(tipo_cor)) {
                    obj.material.color.set(cor);
                }
            }
        });
    }
}
