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
  //     radius1 >
  //     Math.sqrt(
  //         Math.pow(meshBoundingBox.max.x, 2) + Math.pow(meshBoundingBox.max.y, 2)
  //     )
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
  const geomtery = new THREE.BoxBufferGeometry(80, 80, 80);
  // const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  geomtery.computeBoundingBox();
  meshBoundingBox = geomtery.boundingBox;

  var textureLoader = new THREE.TextureLoader();
  //配置shaderMaterial中的uniforms属性
  console.log('scene.time', scene.time)
  var uniforms = {
    texture1 : {value : textureLoader.load('img/xunjianluxiantuAA.png')},
    iTime: scene.time,
    speed: {value: 0.5}
  };
  uniforms.texture1.value.wrapT = THREE.RepeatWrapping
  uniforms.texture1.value.wrapS = THREE.RepeatWrapping
      //设置平铺方式
  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
     varying vec2 vvv;
     void main(){
          vvv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
     }`,
    fragmentShader: `
     //纹理坐标
     #define PI 3.1415
     varying vec2 vvv;
     //获取纹理
     uniform sampler2D texture1;
     uniform float iTime;
     uniform float speed;

     vec2 rotate(vec2 r, float angle){
        vec2 q;
        q.x =   cos(angle)*r.x + sin(angle)*r.y;
        q.y = - sin(angle)*r.x + cos(angle)*r.y;
        return q;
     }
     void main(){
      //texture2D()获取纹素
      // gl_FragColor = texture2D(texture1, vvv);
      vec2 uv = vvv;
      vec2 st = uv*5.;
      vec4 col = texture2D(texture1, st);
      gl_FragColor = col;
     }
     `,
    side:THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};
</script>
