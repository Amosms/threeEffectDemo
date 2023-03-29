<template>
  <div id="webGL"></div>
  <router-view></router-view>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene, ShaderMaterial;
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

  el.addEventListener("mousemove", (e) => {
    const point = scene.getMousePoint({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
    if (point.point)
      if (ShaderMaterial) {
        ShaderMaterial.uniforms.uMouse.value = new THREE.Vector2(
          point.point.x,
          point.point.y
        );
      }
  });
};
const createMesh = () => {
  const geometry = new THREE.PlaneBufferGeometry(100, 100);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  ShaderMaterial = new THREE.ShaderMaterial({
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
      uMouse: {
        value: new THREE.Vector2(0, 0),
      },
      uRenderResolution: {
        value: new THREE.Vector2(
          scene.renderer.domElement.width,
          scene.renderer.domElement.height
        ),
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
        uniform vec2 uRenderResolution;
        uniform float uTime;
        uniform vec2 uMouse;

        float random(in float x){
            return fract(sin(x) * 1e4);
        }

        float random(in vec2 st){
            return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
        }

        float randomSerie(float x,float freq,float t){
            return step(0.8,random(floor(x * freq) - floor(t)));
        }

        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            vec2 mvvP = vec2(uMouse.x +50.0,uMouse.y + 50.0);

            vec3 color = vec3(0.0);
           
            float cols = 2.0;
            float freq = random(floor(uTime)) + abs(atan(uTime) * 0.1);
            float t = 60.0 + uTime * (1.0 - freq) * 5.0;
            if(fract(st.y * cols * 0.5)<0.5){
                t *= -1.0;
            };
            freq += random(floor(st.y));

            float offset = 0.025;
            color = vec3(
                randomSerie(st.x,freq * 100.0, t+offset),
                randomSerie(st.x,freq * 100.0,t),
                randomSerie(st.x, freq * 100.0, t-offset)
            );
            gl_FragColor = vec4(1.0-color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, ShaderMaterial);
  scene.scene.add(mesh);
};
</script>
<style></style>
