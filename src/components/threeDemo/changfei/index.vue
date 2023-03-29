<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import InitScene from '@/utils/initScene.js';
let scene, mapModel, ring, showTag, el;
onMounted(() => {
  careteScene();
  loadModel();
  //   addMouseOver();
});
const careteScene = () => {
  el = document.getElementById('webGL');
  scene = new InitScene(el);
  // const sceneBackTexture = new THREE.TextureLoader().load('img/sceneBack.jpg');
  // scene.scene.background = sceneBackTexture;
  // scene.scene.background2 = sceneBackTexture;
  scene.initStats();
  scene.camera.position.set(
    -3400.4108018052793394,
    1350.06436676730902,
    377.56278628732065
  );
  //   scene.camera.setRotationFromEuler(
  //     new THREE.Euler(
  //       0.48712935168633703,
  //       -0.01870423288101392,
  //       0.009906850386902729,
  //       'XYZ'
  //     )
  //   );

  // scene.isPostProcessing = false;
  // scene.postProcessing.bloomEnable(false);
  // scene.postProcessing.setBloomPass({ strength: 2 });
};

const loadModel = () => {
  // scene.loadFbx('changfei2/shebei.fbx').then(m => {
  //   console.log(m);
  //   scene.scene.add(m);
  // });
  scene.loadFbx('changfei2/changfei.fbx').then(m => {
    console.log(m);
    mapModel = m;
    scene.scene.add(m);
    // const ring = createRing()
    // mapModel.add(ring)
    // tagAnimate()
  });
};
</script>

<style>
.flyDirectionBtn {
  position: absolute;
  left: 50px;
  top: 50px;
}
</style>
