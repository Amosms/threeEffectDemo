<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import CANNON from "cannon";
import InitScene from "@/utils/initScene.js";
let scene, skyBg;
onMounted(() => {
  careteScene();
  createBox();
});
const careteScene = () => {
  const el = document.getElementById("webGL");
  scene = new InitScene(el);
  scene.camera.position.set(0, 30, 70);
  scene.camera.lookAt(0, 20, 0);
  // scene.scene.background = new THREE.Color(0, 0, 0)
  // scene.scene.background = txt
  skyBg = new THREE.CubeTextureLoader().load([
    "img/posx.jpg",
    "img/negx.jpg",
    "img/posy.jpg",
    "img/negy.jpg",
    "img/posz.jpg",
    "img/negz.jpg",
  ]);
  skyBg.format = THREE.RGBFormat;
  skyBg.mapping = THREE.CubeReflectionMapping;
  //   scene.scene.background = skyBg;
  scene.initStats();
};

const createBox = () => {
  // const txt = new THREE.TextureLoader().load('img/env.jpg')
  // txt.needsUpdate = true
  //   const pointLight = new THREE.PointLight(0xffffff);
  //   pointLight.position.set(0, 0, -50);
  //   scene.scene.add(pointLight);

  const boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
  const material1 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0, 0),
  });
  const material = new THREE.MeshPhysicalMaterial({
    // metalness: 1,
    // roughness: 0.0,
    metalness: 1, //金属性
    roughness: 0.2, //粗糙度
    clearcoat: 0.75, //涂抹的清漆光亮层的程度
    clearcoatRoughness: 0.05, //光泽层的粗糙程度
    color: new THREE.Color(1, 0, 0),
  });

  const box = new THREE.Mesh(boxGeometry, material);
  // material.envMap = skyBg
  // material.needsUpdate = true
  // const txt = asyncLoadTxture('img/env.jpg')
  // txt.mapping = THREE.EquirectangularReflectionMapping
  // txt.needsUpdate = true
  // material.envMap = txt
  // material.needsUpdate = true
  // new THREE.TextureLoader().load('img/env.jpg', txt => {
  //     txt.mapping = THREE.EquirectangularReflectionMapping
  //     txt.needsUpdate = true
  //     material.envMap = txt
  //     material.needsUpdate = true
  // })

  //
  console.log(box);
  scene.scene.add(box);
};

const asyncLoadTxture = (url) => {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (txture) => {
        resolve(txture);
      },
      () => {},
      (error) => {
        reject(error);
      }
    );
  });
};
</script>
