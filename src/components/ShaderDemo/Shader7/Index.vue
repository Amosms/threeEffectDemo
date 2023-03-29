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
    range: 520,
    height: 600, //飞线最高点
    color: "#0073ff",
    speed: 0.2,
    size: 30,
  },
];
onMounted(() => {
  careteScene();
  loadModel();
  // animate();
  createFly();
});

// const clock = new THREE.Clock();
// const animate = () => {
//   const dt = clock.getDelta();
//   if (dt < 1) {
//     time.value += dt;
//     startTime.value = Math.abs(0.5 * Math.cos(0.5 * time.value));
//     // if (
//     //   roadMesh &&
//     //   roadMesh.material &&
//     //   roadMesh.material.uniforms &&
//     //   roadMesh.material.uniforms.iTime
//     // ) {
//     //   roadMesh.material.uniforms.iTime.value = clock.getElapsedTime();
//     //   // roadMesh.material.uniforms.iTime = time
//     // }
//   }
//   requestAnimationFrame(() => {
//     animate();
//   });
// };
const careteScene = () => {
  const el = document.getElementById("webGL");
  scene = new InitScene(el);
  scene.scene.add(flyGroup);
  scene.camera.position.set(
    1340.9141923758748,
    916.551571541793,
    574.2999978806894
  );
  scene.camera.setRotationFromEuler(
    new THREE.Euler(
      -1.4792774243627391,
      0.9305729228834174,
      1.4568536194891324,
      "XYZ"
    )
  );
};
const loadModel = () => {
  scene.loadFbx("model/shanghai.FBX").then((m) => {
    scene.scene.add(m);
    m.traverse((child) => {
      if (child.name === "CITY_UNTRIANGULATED") {
        setCityMaterial(child);
        // 添加包围线条效
        surroundLine(child);
        const axesHelper = new THREE.AxesHelper(1000);
        child.add(axesHelper);
      }
      if (child.name === "LANDMASS") {
        setFloor(child);
      }
      if (child.name === "ROADS") {
        setRoads(child);
      }
    });
  });
  window.camera = scene.camera;
};

const setFloor = (mesh) => {
  mesh.material.color.setStyle("#040912");
};

const setCityMaterial = (mesh) => {
  mesh.geometry.computeBoundingBox();
  mesh.geometry.computeBoundingSphere();

  const { geometry } = mesh;
  const { center, radius } = geometry.boundingSphere;
  const { max, min } = geometry.boundingBox;

  const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
  mesh.material.transparent = true;
  mesh.material.color.setStyle("#1B3045");
  mesh.material.onBeforeCompile = (shader) => {
    shader.uniforms.time = scene.time;
    shader.uniforms.uCenter = {
      value: center,
    };
    shader.uniforms.uSize = {
      value: size,
    };
    shader.uniforms.uMax = {
      value: max,
    };
    shader.uniforms.uMin = {
      value: min,
    };
    // 流动
    shader.uniforms.uFlow = {
      value: new THREE.Vector3(
        1.0, // 0 1开关
        10.0, // 范围
        20.0 // 速度
      ),
    };
    shader.uniforms.uFlowColor = {
      value: new THREE.Color("#5588AA"),
    };
    shader.uniforms.uTopColor = {
      value: new THREE.Color("#FFFFDC"),
    };
    /**
     * 对顶点着色器进行修改
     */
    const vertex = `
    varying vec4 vPositionMatrix;
    varying vec3 vPosition;
    void main() {
            vPositionMatrix = projectionMatrix * vec4(position, 1.0);
            vPosition = position;
            `;

    shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);
    /**
     * 对片元着色器修改
     */
    const fragment = `
      uniform float time;
      varying vec3 vPosition;
      uniform vec3 uFlowColor;
      uniform vec3 uTopColor;
      uniform vec3 uFlow;
      uniform vec3 uSize;
      void main(){`;
    const fragmentColor = `
      vec3 distColor = outgoingLight;
      float distOpacity = diffuseColor.a;

      float indexMix = vPosition.z / (uSize.z * 0.6);
      distColor = mix(distColor, uTopColor, indexMix);
      if(uFlow.x ==1.0){
        float bottmY =  mod(time * uFlow.z, uSize.z/2.0);
        float topY = vPosition.z + uFlow.y;  //流动线框的高点
        if(bottmY > vPosition.z && bottmY <topY){
          //颜色渐变
          float dIndex = sin((topY - bottmY)/uFlow.y * PI);
          distColor = mix(distColor , uFlowColor,dIndex);
        }
      }
      gl_FragColor = vec4(distColor,distOpacity * vPosition.z * 0.7);
      `;

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      fragment
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      fragmentColor
    );
  };
};

const surroundLine = (mesh) => {
  const lineMaterial = new THREE.LineBasicMaterial({
    // 线的颜色
    color: "#4C8BF5",
    transparent: true,
    linewidth: 1,
    opacity: 0.7,
    // depthFunc: THREE.AlwaysDepth,
  });
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const lines = new THREE.LineSegments(edges, lineMaterial);
  mesh.add(lines);
  //     // 获取线条geometry
  // const geometry = Effects.surroundLineGeometry(object);
  // // 获取物体的世界坐标 旋转等
  // const worldPosition = new THREE.Vector3();
  // object.getWorldPosition(worldPosition);

  // // 传递给shader重要参数
  // const { max, min } = object.geometry.boundingBox;

  // const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);

  // // this.effectGroup.add();
  // const material = this.createSurroundLineMaterial({
  //   max,
  //   min,
  //   size,
  // });

  // const line = new THREE.LineSegments(geometry, material);

  // line.name = "surroundLine";

  // line.scale.copy(object.scale);
  // line.rotation.copy(object.rotation);
  // line.position.copy(worldPosition);

  // this.effectGroup.add(line);
};
const setRoads2 = (mesh) => {
  const { geometry } = mesh;
  geometry.computeBoundingBox();
  const { max, min } = geometry.boundingBox;
  const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
  const shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      iTime: scene.time,
      iResolution: {
        value: new THREE.Vector3(size.x, size.y, 1),
      },
    },
    vertexShader: `
      varying vec3 vP;
        varying vec2 vUv;
        void main(){
            vP = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
    fragmentShader: `
      uniform float iTime;
      varying vec2 vUv;
      varying vec3 vP;
      uniform vec2 iResolution;
      float sdCircle(vec2 p,float r){
        return length(p)-r;
      }
      void main(){
          float w = 1.0/ min(iResolution.x,iResolution.y);
          vec2 uv = vUv - 0.5;
          uv.x *= iResolution.x/iResolution.y;
          vec3 col = vec3(1.0);

          float c = smoothstep(w,-w,sdCircle(uv,0.5));
          col = mix(col,vec3(0.0,1.0,1.0),c);

          gl_FragColor = vec4(col,1.0);
      }`,
  });

  mesh.material = shaderMaterial;
};
const setRoads = (mesh) => {
  mesh.geometry.computeBoundingBox();
  mesh.geometry.computeBoundingSphere();

  const { geometry } = mesh;
  const { center, radius } = geometry.boundingSphere;
  const { max, min } = geometry.boundingBox;
  const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);

  const shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      iTime: scene.time,
      uRadius: {
        value: 150.0,
      },
      uCenter: {
        value: center,
      },
      uColor: {
        value: new THREE.Color(0x456adf),
      },
      uSpeed: {
        value: 200.0,
      },
      uColor1: {
        value: new THREE.Color(0xffffff),
      },
      uSize: {
        value: size,
      },
      uSweepType: {
        value: 1, //1:圆环  2：左右  3：上下
      },
    },
    vertexShader: `
     varying vec3 vP;
     void main(){
        vP = position;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
     }`,
    fragmentShader: `
     uniform float iTime;
     uniform float uRadius;
     uniform vec3 uCenter;
     uniform vec3 uSize;
     uniform float uSpeed;
     varying vec3 vP;
     uniform vec3 uColor1;
     uniform vec3 uColor;
     uniform int uSweepType;

      float getLeng(float x, float z){
          return  sqrt((x-uCenter.x)*(x-uCenter.x)+(z-uCenter.y)*(z-uCenter.y)); //sqrt开根号 取R
      }
     void main(){
          float cr = getLeng(vP.x,vP.y);
          float minC =  mod(iTime * uSpeed, getLeng(uSize.x,uSize.y) / 2.0);  //内环边缘
          float maxC = minC + uRadius;    //外环边缘
          if(cr> minC   && cr< maxC){
            vec3 color = mix(uColor1,uColor,0.8);
            gl_FragColor = vec4(color,abs(cr -minC) /(uRadius*1.5));
          }
          else{
            gl_FragColor = vec4(uColor, 0.0);
          };
     }`,
  });
  mesh.material = shaderMaterial;
  // sweep({
  //   mesh: mesh,
  //   color: 0x99ee55,
  //   radius: 0.5,
  //   speed: 2.0,
  //   type: 1,
  //   time: time,
  // });
};
let flyMesh;
const createFly = () => {
  flyData.forEach((item) => {
    flyMesh = fly(item);
    flyMesh.material.uniforms.time = scene.time;
    flyMesh.renderOrder = 10;
    flyGroup.add(flyMesh);
  });
};

const changeFlyDirection = () => {
  flyMesh.material.uniforms.uDirection.value =
    flyMesh.material.uniforms.uDirection.value * -1;
  console.log(flyMesh.material.uniforms.uDirection);
};
</script>

<style>
.flyDirectionBtn {
  position: absolute;
  left: 50px;
  top: 50px;
}
</style>
