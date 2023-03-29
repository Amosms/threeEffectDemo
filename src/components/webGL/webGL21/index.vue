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

        vec2 rotate2d(float _angle, vec2 _st){
            _st -= 0.5;
            _st *= mat2(
                cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)
            );
            _st += 0.5;
            return _st;
        }

        mat2 scale(vec2 _scale){
            return mat2(
                _scale.x, 0.0,
                0.0, _scale.y
            );
        }

        float circle(in vec2 _st,in float _radius){
            vec2 l = _st - vec2(0.5);
            return 1.0 - smoothstep(_radius * 0.01, _radius + (_radius * 0.01), dot(1.0,1.0) * 4.0);
        }

        vec2 spaceWrap(in float rows,in float column,in vec2 _st){
            _st.x *= rows;
            _st.y *= column;
            return fract(_st);
        }
        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            vec3 color = vec3(0.0);
            st = spaceWrap(3.0,3.0,st);

            st *= rotate2d(PI*0.5, st);
            color += vec3(abs(sin(st.x + uTime) * 0.2), abs(cos(st.y + uTime)) ,abs(sin(st + uTime)));

            gl_FragColor = vec4(color,abs(cos(uTime)) * 0.2 + 0.5);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
