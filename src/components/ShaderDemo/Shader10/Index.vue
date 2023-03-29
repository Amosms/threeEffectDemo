<template>
    <div id="webGL"></div>
    <div class="test" @click="test"> test</div>
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
        -116.90494321822591,
        275.97996711434047,
        1444.010623219409
    );
    scene.camera.setRotationFromEuler(
        new THREE.Euler(
            -0.18884313967986868,
            -0.07935225583943642,
            -0.015148769333399318,
            "XYZ"
        )
    );
};
const loadModel = () => {
    scene.loadFbx("model/affb.FBX").then((m) => {
        const axesHelper = new THREE.AxesHelper(1000);
        m.add(axesHelper)
        scene.scene.add(m);
        m.traverse((child) => {
            if (child.isMesh && child.name) {
                // child.material.side = THREE.DoubleSide
                // child.material.color = new THREE.Color(0x005699)
                console.log(child)
                if (child.name === 'xu') {
                    const copyMesh = child.clone()
                    m.add(copyMesh)
                    setTransitionShader(copyMesh);
                    setMeshShader(child, true)
                }

                if (child.name == 'shi') {
                    setMeshShader(child, false)
                }
            }
        })
        // m.traverse((child) => {
        //     if (child.name === "jiuduan") {
        //         child.material.transparent = true;
        //         child.material.map = new THREE.TextureLoader().load(
        //             "chinaMap/jiuduan.png"
        //         );
        //     }

        //     if (child.name === "quanguowang") {
        //         const axesHelper = new THREE.AxesHelper(1000);
        //         child.add(axesHelper);
        //         setMeshSweep(child);
        //     }
        // });
    });
};

const test = () => {
    console.log(scene)
}

const setTransitionShader = (mesh) => {
    const { geometry } = mesh
    geometry.computeBoundingBox();
    const { max, min } = geometry.boundingBox;
    const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    const shaderMat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
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

                void main(){
                    vec3 color = vec3(0.0,.56,.85);
                    

                    vec2 uv = vec2(vUv.y,vUv.x);
                    uv.x *= iResolution.x/iResolution.y;
                     float d =1.- smoothstep(0.7,1.2,uv.x);
                     gl_FragColor =vec4(color,d);
                }
            `
    })
    mesh.material = shaderMat;
}

const setMeshShader = (mesh, change) => {
    const { geometry } = mesh
    geometry.computeBoundingBox();
    const { max, min } = geometry.boundingBox;
    const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    const shaderMat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: {
            iTime: scene.time,
            iResolution: {
                value: new THREE.Vector3(size.x, size.y, 1),
            },
            iChange: {
                value: change
            }
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
            uniform bool iChange;
            varying vec2 vUv;

            float random (in float x) {
                return fract(sin(x)*1e4);
            }

            float random (in vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
            }

            float pattern(vec2 st, vec2 v, float t) {
                vec2 p = floor(st+v);
                return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
            }

            void main(){
                if(!iChange){
                    vec3 color = vec3(0.0,.56,.85);
                    gl_FragColor =vec4(color,1.);
                }else{

                    vec2 uv = vec2(vUv.y,vUv.x);
                    uv.x *= iResolution.x/iResolution.y;
                    vec3 color = vec3(uv,0.);
                    float d =1.- smoothstep(1.,1.5,uv.x);

                    vec2 grid = vec2(100.,50.0);
                    uv *= grid;

                    vec2 ipos = floor(uv);  // integer
                    vec2 fpos = fract(uv);  // fraction

                    vec2 vel = vec2(iTime*2.*max(grid.x,grid.y)); // time
                    vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction

                    vec2 offset = vec2(0.1,0.);

                    float s =  pattern(uv+offset,vel,0.5) * pattern(uv+offset,vel,0.5) *pattern(uv-offset,vel,0.5);
                    color = vec3(s);
                    color = 1.-color;


                    color *=step(0.,fpos.x);
                    color = color*vec3(0.0,.56,.85);

                    d = d*(1.-s);
                    
                    gl_FragColor =vec4(color,d);
                }
            }
        `
    })
    mesh.material = shaderMat;
}

// const setMeshSweep = (mesh) => {
//     const { geometry } = mesh;
//     geometry.computeBoundingBox();
//     const { max, min } = geometry.boundingBox;
//     const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
//     const shaderMat = new THREE.ShaderMaterial({
//         transparent: true,
//         uniforms: {
//             iTime: scene.time,
//             iResolution: {
//                 value: new THREE.Vector3(size.x, size.y, 1),
//             },
//         },
//         vertexShader: `
//       varying vec2 vUv;
//       void main(){
//         vUv = uv;
//          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//         fragmentShader: `
//       uniform float iTime;
//       uniform vec3 iResolution;
//       varying vec2 vUv;
//       float sdCircle(vec2 uv,float r){
//         return length(uv)-r;
//       }
//       void main(){
//         float w = 1.0/iResolution.y;
//         vec2 uv = vUv;
//         uv = uv-0.5;
//         uv = 50.*uv;
//         vec3 col =vec3(1.0);
//         uv.x *=iResolution.x/iResolution.y;

//         float cir = sdCircle(uv,5.*iTime);
//         col *=100. -exp(-90. * abs(cir));
//         float s = abs(sin(cir * 0.2)) - 0.82;
//         s = clamp(s,0.,1.)*0.45;
//         col *=s;
//         col *=vec3(0.2,0.8,0.9);
//         float alpha = 0.;
//         if(s>0.02){
//           alpha = 1.;
//         }
//         gl_FragColor = vec4(col,alpha);
//       }
//     `,
//     });
//     mesh.material = shaderMat;
// };
</script>

<style>
.test {
    position: absolute;
    left: 50px;
    top: 50px;
}
</style>
