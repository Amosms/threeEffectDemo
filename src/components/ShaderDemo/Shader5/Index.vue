<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene,
  shaderMaterial,
  radius = 1,
  radius1 = 0,
  speed = 0.1,
  meshBoundingBox;
onMounted(() => {
  careteScene();
  createBox();
  animate();
});
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(() => {
    animate();
  });
  shaderMaterial.uniforms.uTime.value = elapsedTime;
};
const careteScene = () => {
  const el = document.getElementById("webGL");
  scene = new InitScene(el);

  scene.camera.position.set(2.5, 2.5, 168);
  scene.camera.setRotationFromEuler(
    new THREE.Euler(
      -0.013539780341756935,
      0.01437087739946032,
      0.00019458371433313175,
      "XYZ"
    )
  );
};
const createBox = () => {
  // const geomtery = new THREE.BoxBufferGeometry(50, 50, 50);
  // const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  const geomtery = new THREE.SphereGeometry(10, 30, 20);
  shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: {
        value: 0,
      },
    },
    vertexShader: `
        varying vec3 vNormal;
        void main(){
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,position.y*1.4,position.z, 1.0);
        }
    `,
    fragmentShader: `
    varying vec3 vNormal;
    void main(){
        float pr = (vNormal.x +1.0) / 2.0;
        float pg = (vNormal.y +1.0) / 2.0;
        float pb = (vNormal.z +1.0) / 2.0;
        gl_FragColor = vec4(pr,pg,pb,1.0);
    }
     `,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};
</script>
