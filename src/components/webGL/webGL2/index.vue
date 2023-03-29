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
  const geomtery = new THREE.PlaneBufferGeometry(100, 100);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      utime: scene.time,
      uRadius: { value: 49.0 },
      uMathPI: { value: Math.PI },
      uSpeed: {
        value: 0.0,
      },
    },
    vertexShader: `
      varying vec3 vP;
      void main(){
        vP = position;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vP;
      uniform float uRadius;
      uniform float uMathPI;
      uniform float utime;
      uniform float uSpeed;
      void main(){
        float d_opacity = 0.0;
        float r = distance(vP.xy,vec2(0,0));
        float unitAngle = uMathPI / 180.0;
        // if(r>uRadius && r<uRadius+0.2){
        //   gl_FragColor = vec4(1.0,0,0, 1.);
        //   if( (vP.x ==0.0 && vP.y<2.0) || (vP.y ==0.0 && vP.x <2.0)){
        //     gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        //   }
        // }else{
        //   gl_FragColor = vec4(1.0,0,0, 0.0);
        // }

        if(r<uRadius){
          if(atan(vP.y/vP.x)< unitAngle * 45.0 + unitAngle * utime*uSpeed && atan(vP.y/vP.x)> unitAngle * 0.0 + unitAngle * utime*uSpeed){
              gl_FragColor = vec4(1.0,0,0, vP.y/vP.x);
            }else{
              gl_FragColor = vec4(1.0,0,0, 0.0);
            }
        }

      }
    `,
  });
  const mesh = new THREE.Mesh(geomtery, material);
  scene.scene.add(mesh);
};
</script>
