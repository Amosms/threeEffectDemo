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

        mat2 rotate2d(float _angle){
            return mat2(
                cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)
            );
        }

        mat2 scale(vec2 _scale){
            return mat2(
                _scale.x, 0.0,
                0.0, _scale.y
            );
        }

        float box(in vec2 _st,in vec2 _size){
            _size = vec2(0.5) - _size * 0.5;
            vec2 uv = smoothstep(_size,_size+vec2(0.001),_st);
            uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
            return uv.x * uv.y;
        }

        float cross(in vec2 _st,float _size){
            return box(_st,vec2(_size, _size/4.0)) + box(_st,vec2(_size/4.0,_size));
        }

        mat3 yuv2rgb = mat3(
            1.0, 0.0, 1.13983,
            1.0, -0.39465, -0.58060,
            1.0, 2.03211, 0.0
        );

        mat3 rgb2yuv = mat3(
            0.2126, 0.7152, 0.0722,
            -0.09991, -0.33609, 0.43600,
            0.615, -0.5586, -0.05639
        );

        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            vec3 color = vec3(0.0);

            st -= 0.5;
            st *= 2.0;
            color = yuv2rgb * vec3(0.5, st.x, st.y);

            // color = vec3(st.x,st.y, 0.0);
            // color += vec3(cross(st,0.2));
            gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
