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
        -17.15926285009862,
        4349.296574725734,
        -3560.5264135878015
    );
    scene.camera.setRotationFromEuler(
        new THREE.Euler(
            -1.2511769931097225,
            -0.0037454694439412266,
            -0.011316236801769344,
            "XYZ"
        )
    );
    scene.controls.target = new THREE.Vector3(0, 0, -5000)
};
const loadModel = () => {
    scene.loadFbx("model/meidiDemo2.FBX").then((m) => {
        const axesHelper = new THREE.AxesHelper(1000);
        m.add(axesHelper)
        scene.scene.add(m);
        m.traverse((child) => {
            if (child.isMesh && child.name) {
                child.material.side = THREE.DoubleSide
                // child.material.color = new THREE.Color(0x005699)
                if (child.name.includes('shu_ju_po_sui') || child.name == 'pu_bu') {
                    const copyMesh = child.clone()
                    m.add(copyMesh)
                    setTransitionShader(copyMesh);
                    setMeshShader(child, true)
                }

                if (child.name == 'guang_wei_lan') {
                    setWeiLanShader(child)
                }

                if (child.name == 'liu_bian_xing') {
                    console.log(child)
                    const copyFloor = child.clone();
                    copyFloor.position.y -= 0.1;
                    m.add(copyFloor);
                    setCopyFloorShader(copyFloor);
                    setFloorShader(child)
                }

                if (child.name == 'da_mian') {
                    child.material.polygonOffset = true
                    child.material.polygonOffsetFactor = -0.2
                    child.material.polygonOffsetUnits = -2.0
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
            float d =1.- smoothstep(0.2,.5,uv.x);
            gl_FragColor =vec4(diffuse,d*opacity);
        `;
        shader.fragmentShader = shader.fragmentShader.replace(
            "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
            fragmentColor
        );


    }
}

const setMeshShader = (mesh) => {
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
                value: new THREE.Color(0.2, 0.42, 0.68)
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

            float rand(float x) { return fract(sin(x) * 4358.5453); }
            float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 3758.5357); }

            float invader(vec2 p, float n)
            {
               	p.x = abs(p.x);
                p.y = -floor(p.y - 5.0);
                return step(p.x, 2.0) * step(1.0, floor(mod(n/(exp2(floor(p.x + p.y*3.0))),2.0)));
            }

            void main(){
                vec2 uv = vec2(1.-vUv.x,1.-vUv.y);
                vec3 color = vec3(0.);
                vec2 p = uv.xy * iResolution.xy;
                uv -=0.5;
                uv.x *=iResolution.x/iResolution.y;

                float a = rand(floor(p.x / iResolution.x));

                p.y -= 180.0*iTime;
                float r = rand(floor(p/8.0));
                float inv = invader(mod(p,8.0)-4.0, 809999.0*r);
                a += (0.06 + max(0.0, 0.2*sin(10.0*r*iTime))) * inv;

                color = color + iColor;

                // float d = smoothstep(-0.2,0.3,uv.y);
                float d = .5+uv.y;

                color = color+a;

                gl_FragColor =vec4(color, 1.-d);
            }
        `
    })
    mesh.material = shaderMat;
}

const setFloorShader = (mesh) => {
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
            iColor: {
                value: new THREE.Color(0.3, 0.4, 0.7)
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

            bool hex(vec2 p) {
                p.x *= 0.57735 * 2.0;
                p.y += mod(floor(p.x), 2.0) * 0.5;
                p = abs((mod(p, 1.0) - 0.5));
                return abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0) >fwidth(p.x)*1.2;
            }

            vec2 fixUV(vec2 c) {
                return 50. * (2.0 * c - iResolution.xy) / min(iResolution.x, iResolution.y);
            }

            float sdCircle(vec2 uv, float r) {
                return length(uv) - r;
            }
            #define AA 4
            void main(){
                vec2 uv = vUv;
                uv-=0.5;
                float count = 0.;
                uv*=400.;
                
                bool h = hex(uv);
                vec2 p = uv.xy * iResolution.xy;
                vec3 col = vec3(uv,0.);
                col =vec3(h);
                col*=vec3(0.1,0.22,0.33);

                gl_FragColor =vec4(col, h);
            }
        `
    })
    mesh.material = shaderMat;
}

const setCopyFloorShader = (mesh) => {
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
            iColor: {
                value: new THREE.Color(0.3, 0.4, 0.7)
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
            float sdCircle(vec2 uv, float r) {
                return length(uv) - r;
            }
            void main(){
                vec2 uv = vUv;
                uv-=0.5;

                vec3 col = vec3(0.3, 0.4, 0.7);
                float d = sdCircle(uv,iTime * 0.3);
                col *= clamp(sin(d * 15.) - .5,0.3,1.)+clamp(sin((d-0.1) * 15.) - .5,0.3,1.);
                col *= iColor;

                gl_FragColor =vec4(col, 1.);
            }
        `
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
