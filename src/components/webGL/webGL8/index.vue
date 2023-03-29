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
        value: new THREE.Vector2(
          // scene.renderer.domElement.width,
          // scene.renderer.domElement.height
          100,
          100
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

        uniform vec2 uResolution;
        uniform float uTime;
        vec3 colorA = vec3(1.0 ,1.0 ,.0);
        vec3 colorB = vec3(.0,1.0,1.);
        float plot(vec2 st, float pct){
            return smoothstep(pct - 0.01,pct,st.y) - smoothstep(pct,pct+0.01,st.y);
        }
        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            vec3 color = vec3(.0);
            vec3 pct = vec3(st.x);
            // pct.r = smoothstep(0.0,1.0,st.x);
            // pct.b = pow(st.x, sin(st.x +uTime));
            pct.b = abs(sin(st.x * 5.0 + uTime * 2.0));
            
            color = mix(colorA, colorB, pct);
            gl_FragColor = vec4(color,smoothstep(0.3,0.5,sin(st.x + uTime)) - smoothstep(0.5,0.8,sin(st.x + uTime)));
            // gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
