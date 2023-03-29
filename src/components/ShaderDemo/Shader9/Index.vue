<template>
  <div id="webGL"></div>
  <button class="flyDirectionBtn" @click="changeFlyDirection">
    飞线反方向
  </button>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
import fly from "@/utils/fly.js";
import sweep from "@/utils/sweep.js";
let scene;
const startTime = {
  value: 0,
};
const flyGroup = new THREE.Group();
const flyData = [
  {
    source: {
      x: -150,
      y: 15,
      z: 0,
    },
    target: {
      x: -666,
      y: 25,
      z: 0,
    },
    range: 120,
    height: 600, //飞线最高点
    color: "#0073ff",
    speed: 0.2,
    size: 30,
  },
];
onMounted(() => {
  careteScene();
  loadModel();
});
const careteScene = () => {
  const el = document.getElementById("webGL");
  scene = new InitScene(el);
  scene.scene.add(flyGroup);
  scene.camera.position.set(
    -2.4108018052793394,
    -207.06436676730902,
    377.56278628732065
  );
  scene.camera.setRotationFromEuler(
    new THREE.Euler(
      0.48712935168633703,
      -0.01870423288101392,
      0.009906850386902729,
      "XYZ"
    )
  );
};
const loadModel = () => {
  scene.loadFbx("chinaMap/chinaMap.FBX").then((m) => {
    scene.scene.add(m);
    m.traverse((child) => {
      if (child.name === "jiuduan") {
        child.material.transparent = true;
        child.material.map = new THREE.TextureLoader().load(
          "chinaMap/jiuduan.png"
        );
      }

      if (child.name === "quanguowang") {
        const axesHelper = new THREE.AxesHelper(1000);
        child.add(axesHelper);
        setMeshSweep(child);
      }
    });
  });
};

const setMeshSweep = (mesh) => {
  const { geometry } = mesh;
  geometry.computeBoundingBox();
  const { max, min } = geometry.boundingBox;
  const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
  const shaderMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      iTime: scene.time,
      iResolution: {
        value: new THREE.Vector3(size.x, size.y, 1),
      },
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float iTime;
      uniform vec3 iResolution;
      varying vec2 vUv;
      float sdCircle(vec2 uv,float r){
        return length(uv)-r;
      }
      void main(){
        float w = 1.0/iResolution.y;
        vec2 uv = vUv;
        uv = uv-0.5;
        uv = 50.*uv;
        vec3 col =vec3(1.0);
        uv.x *=iResolution.x/iResolution.y;

        float cir = sdCircle(uv,5.*iTime);
        col *=100. -exp(-90. * abs(cir));
        float s = abs(sin(cir * 0.2)) - 0.82;
        s = clamp(s,0.,1.)*0.45;
        col *=s;
        col *=vec3(0.2,0.8,0.9);
        float alpha = 0.;
        if(s>0.02){
          alpha = 1.;
        }
        gl_FragColor = vec4(col,alpha);
      }
    `,
  });
  mesh.material = shaderMat;
};
</script>

<style>
.flyDirectionBtn {
  position: absolute;
  left: 50px;
  top: 50px;
}
</style>
