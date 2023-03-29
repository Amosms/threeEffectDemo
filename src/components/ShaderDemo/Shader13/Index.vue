<template>
    <div id="webGL"></div>
    <div class="test" @click="test"> test</div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene, texture;
onMounted(() => {
    careteScene();
    loadModel();
    animation()
});
const careteScene = () => {
    const el = document.getElementById("webGL");
    scene = new InitScene(el);
    scene.camera.position.set(
        -114.7788463259813,
        3393.004065927199,
        4479.773733361599
    );
    scene.camera.setRotationFromEuler(
        new THREE.Euler(
            -0.6482236360630409,
            -0.020421590993630116,
            -0.015465111757410466,
            "XYZ"
        )
    );
    scene.controls.target = new THREE.Vector3(0, 0, 0)
};
const loadModel = () => {
    scene.loadFbx("model/yang_tiao.FBX").then((m) => {
        const axesHelper = new THREE.AxesHelper(1000);
        // m.add(axesHelper)
        // scene.scene.add(m);
        console.log(m)

        m.traverse((child) => {
            if (child.name == "yang_tiao") {
                setLineShader2(child)
            }
        })
    });
};

const setLineShader2 = (mesh) => {
    const { geometry } = mesh
    const linePositions = geometry.attributes.position.array //样条顶点信息，一维数组
    mesh.material.color = new THREE.Color(0x002299)
    mesh.material.transparent = true
    mesh.material.opacity = 0.5
    scene.scene.add(mesh)
    const positions = []; // 样条顶点坐标 一维向量数组
    // 申明变量用于存点的索引信息
    const current = [];
    // 申明变量用于存点的信息
    const positionsArr = [];
    let distance = 0;
    for (let i = 0; i < linePositions.length; i += 3) {
        positions.push(new THREE.Vector3(linePositions[i], linePositions[i + 1], linePositions[i + 2]))
    }
    for (let i = 0; i < positions.length - 1; i++) {
        distance += parseInt(positions[i].distanceTo(positions[i + 1]));
    }
    console.log(distance)

    const curve = new THREE.CatmullRomCurve3(positions);
    const points = curve.getPoints(distance) ////要将曲线划分为的分段数。默认是 5.这里取线条的总长度
    console.log(points)
    points.forEach((item, index) => {
        positionsArr.push(
            item.x,
            item.y,
            item.z
        );
        current.push(index);
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArr, 3));
    console.log(current)
    lineGeometry.setAttribute('current', new THREE.Float32BufferAttribute(current, 1));
    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uSize: { // 点的大小
                value: 10
            },
            uTime: scene.time, // 时间
            uColor: { // 颜色
                value: new THREE.Color('#002299')
            },
            uRange: { // 飞线长度
                value: 60
            },
            uTotal: { // 轨迹总长度，（点的总个数）
                value: distance
            },
            uSpeed: { // 飞行速度
                value: .1
            },
            subsection: {
                value: 10
            }
        },
        vertexShader: `
            // 接收js传入的attribute值，会经过线性插值
            attribute float current;

            // 接收js传入的uniform值
            uniform float uSize;
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uRange;
            uniform float uTotal;
            uniform float uSpeed;
            uniform float subsection;

            // 向片元着色器传值颜色和透明度
            varying vec3 vcolor;
            varying float vopacity;

            void main () {

                float size = uSize;
                float interval = uTotal/subsection;
                // 根据时间确定当前飞线的位置， 以结束点为准
                float currentEnd = mod(uTotal * fract(uTime * uSpeed),interval);
                float modCurrent = mod(current,interval);
                // 判断当前像素点是否在飞线范围内，如果在范围内设置尺寸和透明度
                if (modCurrent < currentEnd && modCurrent >  currentEnd - uRange) {
                    // 设置渐变的尺寸，头大尾小
                    float sizePct = (uRange - (currentEnd - modCurrent)) / uRange;
                    size *= sizePct;
                    vopacity = 1.0;
                } else { 
                    vopacity = 0.0;
                }
                // 将颜色传递给片元着色器
                vcolor = uColor;
                // 设置点的大小
                gl_PointSize = size * 0.4;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: ` precision mediump float;
     // 接收顶点着色器传入的值
     varying float vopacity;
     varying vec3 vcolor;

     void main () {
         // 设置颜色
         gl_FragColor = vec4(vcolor, vopacity);
     }`
    });
    // 创建并添加到场景中
    const flyPoints = new THREE.Points(lineGeometry, material);
    scene.scene.add(flyPoints);
}

const setLineShader = (mesh) => {
    const { geometry } = mesh
    const linePositions = geometry.attributes.position.array
    const points = []
    for (let i = 0; i < linePositions.length; i += 3) {
        points.push(new THREE.Vector3(linePositions[i], linePositions[i + 1], linePositions[i + 2]))
    }
    console.log(points)
    texture = new THREE.TextureLoader().load('txt/spark.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    texture.needsUpdate = true
    const material = new THREE.MeshPhongMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(0x0576AE),
        sizeAttenuation: false,
        map: texture
    });
    const curve = new THREE.CatmullRomCurve3(points, false/*是否闭合*/, 'catmullrom', 0.000000001);
    const curveGeometry = new THREE.TubeGeometry(curve, points.length, 3, 50, false);
    const curveMesh = new THREE.Mesh(curveGeometry, material)
    scene.scene.add(curveMesh)
}

const test = () => {
    console.log(scene)
}

const animation = () => {
    requestAnimationFrame(animation)
    if (texture) {
        texture.offset.x += 0.001;
    }
}

</script>

<style>
.test {
    position: absolute;
    left: 50px;
    top: 50px;
}
</style>
