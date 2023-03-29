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
    texture1 : {value : textureLoader.load('img/negx.jpg')},
    iTime: scene.time,
    speed: {value: 0.5}
  };
  //设置平铺方式
  uniforms.texture1.value.warpS = uniforms.texture1.value.warpT = THREE.RepeatWrapping;
  uniforms.texture1.value.repeat.set(1,1)
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
     varying vec2 vvv;
     //获取纹理
     uniform sampler2D texture1;
     uniform float iTime;
     uniform float speed;
     void main(){
      //texture2D()获取纹素
      // gl_FragColor = texture2D(texture1, vvv);
      vec4 col = texture2D(texture1, vec2(fract(vvv.x + iTime * speed), vvv.y));
      col.rgb *= 3.;
      gl_FragColor = col;
     }
     `,
    side:THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};
</script>
