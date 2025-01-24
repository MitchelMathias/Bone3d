$(document).ready(function(){
    criar_cena()
    carregar_3d('01_trucker')
    troca_bone()

    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').change(function(){
        troca_cor();
    });

    $('input[name="logo"]').change(function() {
        let logo = this.files[0];
        if (logo) {
            const logoUrl = URL.createObjectURL(logo);
            mudar_cor('logo', logoUrl);
        }
    });
});

let scene, camera, renderer, tipo, modelo_atual = null

function criar_cena(){
    const container = $('.modelo')
    let width = container.width()
    let height = container.height()
    scene = new THREE.Scene()

    renderer = new THREE.WebGLRenderer({
        canvas: document.createElement('canvas'),
        antialias: true,
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0); 

    container.append(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000) 
    //scene.background = new THREE.Color(0xffffff) para teste
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
    const pointLight = new THREE.PointLight(0xffffff, 0.5); 
    pointLight.position.set(10, 10, 10); 
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
    directionalLight.position.set(100, 0, 0); 
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x111111, 5); 
    scene.add(ambientLight);
}

function carregar_3d(tipo_bone) {
    if (modelo_atual !== null) {
        scene.remove(modelo_atual);
    }

    $('input[name="cor_do_corpo"], input[name="cor_da_frente"], input[name="aba_cima"], input[name="aba_baixo"]').prop('checked', false);

    const loader = new THREE.GLTFLoader();

    loader.load(`models/${tipo_bone}.glb`, function (carregou) { 

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

        // Tornar logo invisível inicialmente
        carregou.scene.traverse(function(obj) {
            if (obj.name.includes('logo')) {
                obj.visible = false;
            }
        });

        scene.add(carregou.scene);
        modelo_atual = carregou.scene;

    }, undefined, function(deu_ruim){ 
        alert('Recarregue a Página'); 
    });
}

function troca_bone(){
    let bone = $('#tipo_bone')
    let array_bone = ['01_trucker', '02_americano', '03_aba_reta', '04_new_york', '05_viseira', '06_bucket','teste']

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

function troca_cor(){
    let corpo = $('input[name="cor_do_corpo"]:checked').val();
    let frente = $('input[name="cor_da_frente"]:checked').val();
    let aba_cima = $('input[name="aba_cima"]:checked').val();
    let aba_baixo = $('input[name="aba_baixo"]:checked').val();
    let logo = $('input[name="logo"]')[0].files[0];

    if (logo) {
        const logoUrl = URL.createObjectURL(logo);
        logo = logoUrl;
    }
    
    mudar_cor("corpo", corpo);
    mudar_cor("frente", frente);
    mudar_cor("aba_cima", aba_cima);
    mudar_cor("aba_baixo", aba_baixo);
    mudar_cor('logo', logo)
}

function mudar_cor(parte, cor) {
    if (modelo_atual) {
        modelo_atual.traverse(function (obj) {
            if (obj.isMesh && obj.name.includes(parte)) {
                if (cor) {
                    // Se for a logo, aplicar a textura da imagem
                    if (parte === 'logo') {
                        const textureLoader = new THREE.TextureLoader();
                        textureLoader.load(
                            cor,
                            function (texture) {
                                obj.material.map = texture; // Adiciona a textura
                                obj.material.needsUpdate = true; // Atualiza o material
                                obj.visible = true; // Torna a logo visível
                            },
                            undefined,
                            function (err) {
                                console.error('Erro ao carregar a textura:', err);
                            }
                        );
                    } else {
                        // Para outras partes (como corpo, frente, etc.), aplica a cor normalmente
                        obj.material.color.set(cor);
                        obj.visible = true; // Garante que esteja visível
                    }
                } else {
                    obj.visible = true; // Mantém visível se nenhuma cor for passada
                }
            }
        });
    }
}



