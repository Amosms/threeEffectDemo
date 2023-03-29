<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
import shortid from 'shortid'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { NodeExpandOutlined } from "@ant-design/icons-vue";
const _orderid = shortid.generate();
_orderid.replace("_", "A").replace("-", "a");
console.log(_orderid);
let scene;
onMounted(() => {
  careteScene();
  createBox()
});
const careteScene = () => {
  const el = document.getElementById("webGL");
  scene = new InitScene(el);
  // scene.camera.lookAt(0, 0, 0)
  scene.camera.position.set(4.5, 2.5, 168);
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
  const group = new THREE.Group()
  scene.scene.add(group)
  const geo = new THREE.BoxBufferGeometry(20, 20, 20);
  const material = new THREE.MeshLambertMaterial()
  material.color = new THREE.Color(0xff0000);
  const box = new THREE.Mesh(geo, material)
  box.name = 'box'
  // box.traverse(child => {
  //   console.log(child)
  // })
  group.add(box)
  const matType = 'MeshLambertMaterial'
  const mat = new THREE[matType]()
  console.log(mat)
  box.position.set(10, 50, 0)
  box.visible = Boolean(1)
  // box.rotation.x = 30 * Math.PI / 180;
  // const v = { x: 100, y: 20, z: 30 }
  // const ov = box.position
  // const nv = new THREE.Vector3(v.x, v.y, v.z);
  // new TWEEN.Tween(ov)
  //   .to(v, 1000)
  //   .easing(TWEEN.Easing.Cubic.Out)
  //   .onUpdate((res) => {
  //     console.log(res)
  //     box.position.set(res.x, res.y, res.z)
  //     // box.position.x = res.value
  //   }).start()

}
</script>
<style>

</style>
