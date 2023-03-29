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
    #ifdef GL_ES
        precision mediump float;
        #endif
        uniform vec2 uResolution;
        uniform float uTime;
        // Plot a line on Y using a value between 0.0-1.0
        float plot(vec2 st) {    
            return smoothstep(0.02, 0.0, abs(st.y - st.x));
        }
        void main() {
            vec2 st = gl_FragCoord.xy/uResolution;
            float y = st.x;
            vec3 color = vec3(y);
            // Plot a line
            float pct = plot(st);
            color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
            gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geomtery, material);
  scene.scene.add(mesh);
};
</script>
<style>
#webGL {
  width: 100%;
  height: 100%;
}
</style>
