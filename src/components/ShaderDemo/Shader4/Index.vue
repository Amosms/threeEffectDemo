<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene, shaderMaterial, meshBoundingBox;
onMounted(() => {
  careteScene();
  createBox();
  animate();
});

const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  if (shaderMaterial) {
    shaderMaterial.uniforms.iTime.value = elapsedTime;
  }
  requestAnimationFrame(() => {
    animate();
  });
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
  const geomtery = new THREE.BoxBufferGeometry(70, 70, 70);
  // const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  geomtery.computeBoundingBox();
  meshBoundingBox = geomtery.boundingBox;
  shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      iTime: {
        value: 0.0,
      },
      uDiffRadius: {
        value: 0.2,
      },
      uColor: {
        value: new THREE.Color(0x99ee55),
      },
      uSpeed: {
        value: 2.0,
      },
      uColor1: {
        value: new THREE.Color(0xffffff),
      },
      uSweepType: {
        value: 1, //1:圆环  2：左右  3：上下
      },
    },
    vertexShader: `
     varying vec3 vPosition;
     varying vec2 vUv;
     void main(){
        vUv = uv;
        vPosition = position;
        // vec4 modelPosition = modelMatrix * vec4(position,1.0);
        // vec4 viewPosition = viewMatrix * modelPosition;
        // vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
     }`,
    fragmentShader: `
     uniform float iTime;
     uniform float uDiffRadius;
     uniform float uSpeed;
     varying vec3 vPosition;
     uniform int uSweepType;
     varying vec2 vUv;


     void main(){

        vec2 uv = (vUv - 0.5) * 8.0;
        float r = length(uv) * 0.8;
        vec3 color = vec3(0.24, 0.7, 0.4);
        float a = pow(r , 0.8);
        float b = sin(r * 0. - 1.6);
        float c = sin(r - 0.020);
        // float s = sin(a - iTime * uSpeed + b) * c;
        float s = sin(a*2.5 - iTime *  uSpeed + b);

        color*=abs((1.0 *  uDiffRadius)/s  - 0.2);
        gl_FragColor = vec4(color,color);

     }`,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};
</script>
