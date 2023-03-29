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
      #define PI2 6.28318530718

        uniform vec2 uResolution;
        uniform float uTime;

        float drawBox(float left, float width ,vec2 st){
            vec2 bl = step(vec2(left),st);
            vec2 tr = step(vec2(left), 1.0 - st);
            float pct = bl.x * bl.y * tr.x * tr.y;
            vec2 bl2 = step(vec2(left-width),st);
            vec2 tr2 = step(vec2(left-width), 1.0 - st);
            float pct2 = bl2.x * bl2.y * tr2.x * tr2.y;
            return 1.0 - (pct2 - pct) ;
        }

        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            vec3 color = vec3(1.0,1.0,1.0);

            //左边和下边小于0.1为黑色
            float border = drawBox(0.01, 0.1, st) + abs(tan(uTime )) * st.x * st.y;
            float border1 = drawBox(0.1, 0.01, st) + abs(sin(uTime ))*color.r;
            float border2 = drawBox(0.2, 0.01, st) + abs(sin(uTime ))*color.g;
            float border3 = drawBox(0.3, 0.01, st)+ abs(sin(uTime))*color.b;
            float border4 = drawBox(0.4, 0.01, st)+ abs(sin(uTime))*color.r;
            float border5 = drawBox(0.5, 0.03, st)+ abs(sin(uTime))*color.g;
            gl_FragColor = vec4(vec3(border * border1* border2 * border3 * border4 * border5),1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.scene.add(mesh);
};
</script>
<style></style>
