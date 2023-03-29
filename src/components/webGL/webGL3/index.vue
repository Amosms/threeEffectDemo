<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene;
onMounted(() => {
  careteScene();
  createMesh();
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
const createMesh = () => {
  console.log(
    scene.renderer.domElement.width,
    scene.renderer.domElement.height
  );
  const geomtery = new THREE.PlaneBufferGeometry(50, 50);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: scene.time,
      uRadius: { value: 49.0 },
      uMathPI: { value: Math.PI },
      uSpeed: {
        value: 0.0,
      },
      uResolution: {
        value: new THREE.Vector2(
          scene.renderer.domElement.width,
          scene.renderer.domElement.height
        ),
      },
    },
    vertexShader: `
      varying vec3 vP;
      void main(){
        vP = position;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 uResolution;
      uniform float uTime;
      void main(){
        vec2 st = gl_FragCoord.xy / uResolution;
        gl_FragColor = vec4(st.x,st.y,0.0,1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geomtery, material);
  scene.scene.add(mesh);
};
</script>
<style>
#webGL {
  width: 800px;
  height: 800px;
}
</style>
