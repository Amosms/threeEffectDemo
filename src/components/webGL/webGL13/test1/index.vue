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
    scene.renderer.domElement.height,
    1
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
      #define PI2 6.28318530718

        uniform vec2 uResolution;
        uniform float uTime;

        vec3 hsb2rgb(in vec3 c){
            vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
            rgb = rgb*rgb*(3.0-2.0*rgb);
            return c.z * mix(vec3(1.0), rgb, c.y);
        }

        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;
            float radius = abs(sin(uTime)) * 0.1 + 0.2;

            float pct = 0.0;


            // pct = distance(st,vec2(0.4)) + distance(st,vec2(0.6));
            // pct = distance(st,vec2(0.4)) * distance(st,vec2(0.6));
            pct = min(distance(st,vec2(0.4)),distance(st,vec2(0.6)));
            // pct = max(distance(st,vec2(0.4)),distance(st,vec2(0.6)));
            // pct = pow(distance(st,vec2(0.4)),distance(st,vec2(0.6)));
            vec3 color = vec3(1.0);
            color = vec3(1.0- step(0.5,pct));
            gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
