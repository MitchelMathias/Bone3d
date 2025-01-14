const viewer = document.querySelector('#viewer');
        viewer.addEventListener('load', () => {
          const aba_topo = viewer.model.materials[0]; // Acessa o primeiro material
          const corpo = viewer.model.materials[1]; // Acessa o primeiro material
          aba_topo.pbrMetallicRoughness.setBaseColorFactor([0.2, 0.5, 0.8, 1.0]); // Define a cor (RGBA)
          corpo.pbrMetallicRoughness.setBaseColorFactor([0.2, 0.5, 0.8, 1.0]); // Define a cor (RGBA)
        });