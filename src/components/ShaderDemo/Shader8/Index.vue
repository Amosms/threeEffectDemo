<template>
  <div>
    <div class="pos">雨</div>
    <div class="pos">雪</div>
    <div id="webGL"></div>
  </div>


</template>
<script setup lang="ts">
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
import {WeatherRainOptions} from "./constant";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {rainShader} from "./rainShader";
let scene,
  radius = 1,
  speed = 0.1,
    pass = null;
onMounted(() => {
  careteScene();
  createBox();
  createRain();
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
  scene.scene.background = new THREE.Color(0x000000);
};

/**
 * 雨效果后处理
 * @param options
 * @returns
 */
const rainPass = ( options : WeatherRainOptions ) => {
  scene.isPostProcessing = true;
  scene.postProcessing.composer.renderToScreen = true;

  let rainPass = new ShaderPass( rainShader );
  rainPass.uniforms[ 'iResolution' ].value = new THREE.Vector2( scene.el.clientWidth , scene.el.clientHeight );
  rainPass.enabled = options.enabled;
  rainPass.uniforms.angle.value =THREE.MathUtils.degToRad(options.angle);
  rainPass.uniforms.speed.value = options.speed;
  rainPass.uniforms.quantity.value = options.quantity;
  rainPass.uniforms.color.value = new THREE.Color('#ffffff');
  rainPass.uniforms.iTime = scene.time
  scene.postProcessing.composer.addPass(rainPass);

  return rainPass;
}

const createBox = () => {
  const geomtery = new THREE.BoxBufferGeometry(80, 80, 80);
  // const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  geomtery.computeBoundingBox();
  const meshBoundingBox = geomtery.boundingBox;

  var textureLoader = new THREE.TextureLoader();
  //配置shaderMaterial中的uniforms属性
  console.log('scene.time', scene)
  var uniforms = {
    texture1 : {value : textureLoader.load('img/negx.jpg')},
    iTime: scene.time,
    speed: {value: 0.5}
  };
  //设置平铺方式
  const shaderMaterial = new THREE.ShaderMaterial({
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
      gl_FragColor = col;
     }
     `,
    side:THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  scene.scene.add(mesh);
};

const createRain = () => {
  const rainOption = {
    "enabled": true,
    "speed": 0.5,
    "quantity": 1000,
    "angle": 60
  }

  pass = rainPass( rainOption );
}
</script>
<style>
.pos{
  position: absolute;
  display: inline-block;
  width: 20px;
  z-index: 99;
}
</style>
