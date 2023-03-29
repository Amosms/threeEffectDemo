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
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: {
        value: new THREE.Vector2(
          scene.renderer.domElement.width,
          scene.renderer.domElement.height
        ),
      },
    },
    vertexShader: `
    void main(){
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
    }`,
    fragmentShader: `
    // u_resolution.xy, 当前屏幕的xy, eg: u_resolution.xy=(100, 200)
    uniform vec2 u_resolution;
    void main(){
        // gl_FragCoord.xy 当前像素的xy, eg: gl_FragCoord.xy=(50, 50)
        // st 归一化的坐标(x,y都映射到了0~1), eg: st=(0.5, 0.25)
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        // aspect 宽高比, eg: aspect = 100/200 = 0.5
        float aspect = u_resolution.x / u_resolution.y;
        // 保持宽高比统一, eg: st=(0.25, 0.25)
        // 也可以这样理解:
        //    像素 x 的范围是0~100,像素 y 的范围是0～200,
        //    归一化后, st.x 和 st.y 的映射都是0~1范围,
        //    归一化后, st.x 和 st.y 应该保持归一化后相同的宽高比,
        //    所以, 需要 st.x *= u_resolution.x / u_resolution.y;
        st.x *= aspect;
       vec3 color = vec3(0.0);

        float left = step(0.6,st.x); // st.x > 0.5 ? 1. : .0;
        float bottom = step(0.4,st.y);  //st.y > 0.5 ? 1. : .0;
        color = vec3(left * bottom);
        color = vec3(left * bottom);

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
  width: 1200px;
  height: 800px;
}
</style>
