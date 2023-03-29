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

        mat2 rotate2d(float _angle,float speed){
          return mat2(
            cos(_angle *speed),-sin(_angle * speed),
            sin(_angle * speed),cos(_angle * speed)
          );
        }


        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            st -=vec2(0.5);
            st*= rotate2d(PI - uTime * PI,0.5);
            st+=vec2(0.50);

            vec3 color = vec3(0.0);
            vec2 pos = vec2( 0.5) - st;

            float r = length(pos) * 2.2;
            float a = atan(sin(pos.y * 5.0) ,sin(pos.x * 5.0));
            // float a = atan(sin(pos.y ) ,sin(pos.x ));

            float f = sin(a * 4.0 );

            color = vec3(st.x,st.y,0.0);
            color *= vec3(1.0 - smoothstep(f,f+0.01,r));
            gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
