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

        vec2 random2(in vec2 p){
           return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)))) * 43758.5453);
        }

        void main() {
            vec2 vv = vP.xy;
            vec2 vvP = vec2( vv.x + 50.0 , vv.y + 50.0);
            vec2 st = vvP.xy/uResolution;

            vec2 mvvP = vec2(uMouse.x +50.0,uMouse.y + 50.0);

            vec3 color = vec3(0.0);

            st*=3.0;

            vec2 i_st = floor(st);
            vec2 f_st = fract(st);

            float mDist = 1.0;
            for(int y=-1;y<=1;y++){
                for(int x=-1;x<=1;x++){
                    vec2 neighbor = vec2(float(x),float(y));
                    vec2 point = random2(i_st+neighbor);
                    point += vec2(fract(sin(uTime)));
                    point = 0.5 + 0.5*sin(uTime + 6.2831 * point);

                    vec2 diff = neighbor + point - f_st;
                    float dist = length(diff);
                    mDist = min(mDist,dist);
                }
            }

            color +=mDist;

            color += 0.6 - step(0.02,mDist);
            // color = 1.0-color;

            color += vec3(0.0,0.4,0.6);

            // color -=step(0.7,abs(sin(27.0*mDist)))*5.0;
            gl_FragColor = vec4(color,1.0);
        }
    `,
  });
  const mesh = new THREE.Mesh(geometry, ShaderMaterial);
  scene.scene.add(mesh);
};
</script>
<style></style>
