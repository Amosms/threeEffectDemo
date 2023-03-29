<template>
    <div id="webGL"></div>
    <div class="test" @click="test"> test</div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene;
onMounted(() => {
    careteScene();
    loadModel();

});
const careteScene = () => {
    const el = document.getElementById("webGL");
    scene = new InitScene(el);
    scene.camera.position.set(
        231.21721224881117,
        316.5226008390294,
        2355.751633056858
    );
    scene.camera.setRotationFromEuler(
        new THREE.Euler(
            -0.1335617191564017,
            0.09697084677165047,
            0.01300801610892281,
            "XYZ"
        )
    );
};
const loadModel = () => {
    scene.loadFbx("model/meidiDemo.FBX").then((m) => {
        const axesHelper = new THREE.AxesHelper(1000);
        m.add(axesHelper)
        scene.scene.add(m);
        m.traverse((child) => {
            if (child.isMesh && child.name) {
                child.material.side = THREE.DoubleSide
                // child.material.color = new THREE.Color(0x005699)
                if (child.name.includes('shu_ju_po_sui')) {
                    const copyMesh = child.clone()
                    m.add(copyMesh)
                    setTransitionShader(copyMesh);
                    setMeshShader(child, true)
                }

                if (child.name == 'guang_wei_lan') {
                    setWeiLanShader(child)
                }
            }
        })
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
    mesh.material = mesh.material.clone();
    mesh.material.transparent = true;
    mesh.material.onBeforeCompile = (shader) => {
        const vertex = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        `;
        shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);

        const fragment = `
            varying vec2 vUv;
            void main(){
        `;
        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            fragment
        );

        const fragmentColor = `

            vec2 uv = vec2(1.-vUv.y,1.-vUv.x);
            float d =1.- smoothstep(0.4,.7,uv.x);
            gl_FragColor =vec4(diffuse,d*opacity);
        `;
        shader.fragmentShader = shader.fragmentShader.replace(
            "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
            fragmentColor
        );


    }
}

const setMeshShader = (mesh, change) => {
    const { geometry } = mesh
    geometry.computeBoundingBox();
    const { max, min } = geometry.boundingBox;
    const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    mesh.material = mesh.material.clone();
    mesh.material.transparent = true;
    mesh.material.onBeforeCompile = (shader) => {
        shader.uniforms.iTime = scene.time;
        shader.uniforms.iResolution = {
            value: new THREE.Vector3(size.x, size.y, 1),
        };
        const vertex = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        `;
        shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);

        const fragment = `
            uniform float iTime;
            uniform vec3 iResolution;
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

            void main(){`;
        const fragmentColor = `
                vec2 uv = vec2(1.-vUv.y,1.-vUv.x);
                vec3 color = vec3(0.);

                float d =1.- smoothstep(0.,0.9,uv.x);

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
                color = color*diffuse;

                d = d*(0.5-s);
                d= d*opacity;

                gl_FragColor =vec4(color,d);
            `;

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            fragment
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
            fragmentColor
        );
    }
}

const setWeiLanShader = (mesh) => {
    const { geometry } = mesh
    geometry.computeBoundingBox();
    const { max, min } = geometry.boundingBox;
    const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    const grColorList = [0xFF8080, 0xFFF080, 0xFFB980]
    const shaderMat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: {
            iTime: scene.time,
            iResolution: {
                value: new THREE.Vector3(size.x, size.y, 1),
            },
            iColor: {
                value: new THREE.Color(0xFF8080)
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
            uniform vec3 iColor;
            varying vec2 vUv;

            float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 3758.5357); }

            void main(){
                vec2 uv = vec2(1.-vUv.x,1.-vUv.y);
                vec3 col = vec3(0.);
                float d = .2+uv.y;
                // uv.x *= 3.;
                // uv.y *= 50.;
                uv*=5.;
                vec2 id = floor(uv);
                vec2 gv = fract(uv);

                // col+=iColor;
                col.r += step(.98, gv.x) + step(.98, gv.y);
                gl_FragColor =vec4(col, 1.);
            }`
    })
    mesh.material = shaderMat;
}
</script>

<style>
.test {
    position: absolute;
    left: 50px;
    top: 50px;
}
</style>
