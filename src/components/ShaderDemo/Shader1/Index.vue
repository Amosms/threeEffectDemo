<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene,
  shaderMaterial,
  radius = 1,
  radius1 = 0,
  speed = 0.1,
  meshBoundingBox;
onMounted(() => {
  careteScene();
  createBox();
  animate();
});

const animate = () => {
  requestAnimationFrame(() => {
    animate();
  });
  // radius += speed;
  // radius1 += speed;
  // shaderMaterial.uniforms.uRadius.value = radius;
  // shaderMaterial.uniforms.uRadius1.value = radius1;
  // if (
  //   radius1 >
  //   Math.sqrt(
  //     Math.pow(meshBoundingBox.max.x, 2) + Math.pow(meshBoundingBox.max.y, 2)
  //   )
  // ) {
  //   radius = 1;
  //   radius1 = 0;
  // }
};
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
const createBox = () => {
  const geomtery = new THREE.BoxBufferGeometry(50, 50, 50);
  // const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  geomtery.computeBoundingBox();
  meshBoundingBox = geomtery.boundingBox;
  shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uColor: {
        value: new THREE.Color(0x99ee55),
      },
      uColor1: {
        value: new THREE.Color(0xffffff),
      },
      uRadius: {
        value: 1,
      },
      uRadius1: {
        value: 0,
      },
      uSweepType: {
        value: 1, //1:圆环  2：左右  3：上下
      },
    },
    vertexShader: `
     varying vec3 vPosition;
     void main(){
       vPosition = position;
          // vec4 modelPosition = modelMatrix * vec4(position,1.0);
          // vec4 viewPosition = viewMatrix * modelPosition;
          // vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
     }`,
    fragmentShader: `
     uniform float uRadius;
     uniform float uRadius1;
     uniform vec3 uColor;
     uniform vec3 uColor1;
     varying vec3 vPosition;
     uniform int uSweepType;
     float getLeng(float x, float z){
          // return  sqrt((x-sweepCenter.x)*(x-sweepCenter.x)+(z-sweepCenter.z)*(z-sweepCenter.z)); //sqrt开根号 取R
          return  sqrt((x-0.0)*(x-0.0)+(z-0.0)*(z-0.0)); //sqrt开根号 取R
      }
     void main(){
       if(uSweepType ==1){
          vec3 vCenter = vec3(0.0, 0.0, 0.0);
          // float len = distance(vCenter, vPosition);
          float cr = getLeng(vPosition.x,vPosition.y);
          if(cr<uRadius && cr>uRadius1){
            gl_FragColor = vec4(uColor1, 1.0);
          }else{
            gl_FragColor = vec4(uColor, 1.0);
          };
        }else if(uSweepType==2){
          vec3 vCenter = vec3(.0, .0, .0);
          if((vPosition.x < uRadius && vPosition.x>uRadius1)|| (vPosition.x > -uRadius && vPosition.x<-uRadius1)){
            gl_FragColor = vec4(uColor1, 1.0);
          }else{
            gl_FragColor = vec4(uColor, 1.0);
          }
        }else if(uSweepType==3){
          vec3 vCenter = vec3(.0, .0, .0);
          if((vPosition.y < uRadius && vPosition.y>uRadius1)|| (vPosition.y > -uRadius && vPosition.y<-uRadius1)){
            gl_FragColor = vec4(uColor1, 1.0);
          }else{
            gl_FragColor = vec4(uColor, 1.0);
          }
        }
     }
     `,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};
</script>
