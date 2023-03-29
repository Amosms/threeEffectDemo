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
  const geometry = new THREE.PlaneBufferGeometry(100, 100);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: scene.elapsedTime,
      uRadius: { value: 49.0 },
      uMathPI: { value: Math.PI },
      uSpeed: {
        value: 0.0,
      },
      uResolution: {
        value: new THREE.Vector2(100, 100),
      },
    },
    vertexShader: `
      varying vec3 vP;
      varying vec3 vMp;
      void main(){
        vP = position;
        vec4 modelPosition = modelMatrix * vec4(position,1.0);
        vMp = modelPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
      }
    `,
    fragmentShader: `
    varying vec3 vP;
    varying vec3 vMp;
    #ifdef GL_ES
        precision mediump float;
    #endif
    #define PI 3.14159265359
    #define PI2 6.28318530718

        uniform vec2 uResolution;
        uniform float uTime;

        float random(in vec2 st){
            return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
            // return fract(sin(dot(st.xy,vec2(sin(uTime) * 13.,cos(uTime)*17.))) * (sin(uTime)  *6234.4321 + 2000.0));
        }

        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            st *= 10.0;
            vec2 ipos = floor(st);
            vec2 fpos = fract(st);

            vec3 color = vec3(random(ipos));

            // color  = vec3(random(fpos));
            // float rnd = random(st);


            gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
