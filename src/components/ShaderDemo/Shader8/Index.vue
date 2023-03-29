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
});

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

  const geomtery = new THREE.PlaneBufferGeometry(40, 10);
  shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      iTime: scene.time,
      iResolution: {
        value: new THREE.Vector3(100, 100, 1),
      },
    },
    vertexShader: `
        varying vec3 vP;
        varying vec2 vUv;
        void main(){
            vP = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
     uniform float iTime;
     varying vec2 vUv;
     varying vec3 vP;
     uniform vec2 iResolution;
    float sdCircle(vec2 p,float r){
        return length(p)-r;
      }
      void main(){
          float w = 1.0/ min(iResolution.x,iResolution.y);
          vec2 uv = vUv - 0.5;
          uv.x *= iResolution.x/iResolution.y;
          vec3 col = vec3(1.0);

          float c = smoothstep(w,-w,sdCircle(uv,0.1));
          col = mix(col,vec3(0.0,1.0,1.0),c);

          gl_FragColor = vec4(col,1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};
</script>
