// Função para trocar o modelo 3D baseado na seleção do usuário
document.getElementById('tipo_fecho').addEventListener('change', function () {
    const modelViewer = document.getElementById('viewer');
    const selectedValue = this.value;

    // Troca o modelo de acordo com a seleção do usuário
    if (selectedValue === 'snapback') {
        modelViewer.src = 'models/bone.glb';  // Caminho para o modelo Bone
    } else if (selectedValue === 'bucket') {
        modelViewer.src = 'models/hat.glb';   // Caminho para o modelo Hat (no formato GLB)
    }
});
document.getElementById('colorPicker').addEventListener('input', function(event) {
    if (model) {
        const color = event.target.value;
        const hexColor = new THREE.Color(color);  // Converter a cor do input para um objeto THREE.Color

        // Modificar a cor de todos os materiais do modelo
        model.traverse(function(child) {
            if (child.isMesh) {
                child.material.color.set(hexColor);  // Alterar a cor do material
            }
        });