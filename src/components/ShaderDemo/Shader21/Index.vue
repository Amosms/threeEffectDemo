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
  loadModel();
  animate();
});

const loadModel = () => {
  scene.loadFbx("model/xun_jian_lu_xian.fbx").then((m) => {
    const textureLoader = new THREE.TextureLoader();
    m.traverse(el => {
      if (el.isMesh) {
        console.log(el.material)
        el.material.onBeforeCompile = shader => {
          shader.uniforms.texture1 = {value: textureLoader.load('img/xunjianluxiantuAA.png')}
          shader.uniforms.texture1.value.wrapS = shader.uniforms.texture1.value.wrapT = THREE.RepeatWrapping
          shader.vertexShader = shader.vertexShader.replace('#include <common>', [
            '#include <common>',
            'varying vec2 verUv;'
          ].join('\n'));
          shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>', [
            '#include <fog_vertex>',
            'verUv = uv;',
            'gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);',
          ].join('\n'));

          shader.fragmentShader = shader.fragmentShader.replace(
              "#include <common>",
              `
                #include <common>
                varying vec2 verUv;
                uniform sampler2D texture1;
                vec2 rotate(vec2 r, float angle){
                    vec2 q;
                    q.x =   cos(angle)*r.x + sin(angle)*r.y;
                    q.y = - sin(angle)*r.x + cos(angle)*r.y;
                    return q;
                }
              `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
              "#include <dithering_fragment>",
              `
                #include <dithering_fragment>
                vec2 uv = verUv;
                uv.y*= 140.;
                vec2 st = rotate(uv, 0.);
                vec4 color = texture2D(texture1, st);
                gl_FragColor = color;
              `
          );
        }
      }
    })
    const axesHelper = new THREE.AxesHelper(1000);
    m.add(axesHelper)
    scene.scene.add(m);
    console.log('m', m)
  });
};

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
  const geomtery = new THREE.CylinderGeometry( 5, 5, 200, 32, 1, true );
  // const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  geomtery.computeBoundingBox();
  meshBoundingBox = geomtery.boundingBox;

  var textureLoader = new THREE.TextureLoader();
  //配置shaderMaterial中的uniforms属性
  console.log('scene.time', scene.time)
  var uniforms = {
    texture1 : {value : textureLoader.load('img/arrow.jpg')},
    iTime: scene.time,
    speed: {value: 2.}
  };
  //设置平铺方式
  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
     varying vec2 vvv;
     void main(){
          vvv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
          transformed.x += 2.0;
     }`,
    fragmentShader: `
     //纹理坐标
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
        vec2 uv = vvv;
        uv *= 5.;
        uv = rotate(uv, 0.);
        float v1 = smoothstep(0., 1., fract(uv.x * 0.4));
        float v2 = smoothstep(0., 0.5, fract(uv.y));
        vec4 color = texture2D(texture1, vec2(v1, v2));

        gl_FragColor = vec4(color.x, color.y, color.z, 1.);
     }
     `,
    side:THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geomtery, shaderMaterial);
  console.log(mesh)
  scene.scene.add(mesh);
};
</script>
