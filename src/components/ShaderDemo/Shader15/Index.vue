<template>
  <div id="webGL"></div>
  <div class="test" @click="test"> test</div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene, mixers = [];
onMounted(() => {
  careteScene();
  loadModel();
  animation()
});
const careteScene = () => {
  const el = document.getElementById("webGL");
  scene = new InitScene(el);
  scene.camera.position.set(
      -1854.629, 28.8555, -469.2208
  );
  // scene.camera.setRotationFromEuler(
  //     new THREE.Euler(
  //         -1.2064593340663885,
  //         1.4147673693678655,
  //         1.2023714948816102,
  //         "XYZ"
  //     )
  // );
  scene.controls.target = new THREE.Vector3(-1454.629, 28.8555, -469.2208)
};

const loadMeshs = ['EJXB_e', '12']
const loadModel = () => {

  scene.loadFbx(`test3.fbx`).then((m) => {
    const axesHelper = new THREE.AxesHelper(1000);
    m.traverse(e => {
      if(e.isMesh && e.name === 'F_1_dian_ti_B_1') {
        console.log('3', e)
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3( 0, -1, 0 ), new THREE.Vector3( -1454.629, 88.8555, -469.2208 ) );
        e.material.clippingPlanes = [plane]
      }
    })
    scene.scene.add(m);
    console.log('20', m.name)
    console.log(m)
    scene.controls.target = m.position
    m.mixer = new THREE.AnimationMixer(m);
    mixers.push(m.mixer);
    console.log(m.animations)
    var action = m.mixer.clipAction(m.animations[0]);
    action.timeScale = 5
    console.log(mixers)
    action.play();

  });
};
var clock = new THREE.Clock();
const animation = () => {
  requestAnimationFrame(animation);
  if (mixers.length > 0) {
    for (var i = 0; i < mixers.length; i++) {
      mixers[i].update(clock.getDelta());
    }
  }
}

const test = () => {
  console.log(scene)
}

</script>

<style>
.test {
  position: absolute;
  left: 50px;
  top: 50px;
}
</style>
