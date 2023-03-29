<template>
    <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import CANNON from 'cannon';
import InitScene from "@/utils/initScene.js";
let scene, sphere, sphereBody;
const world = new CANNON.World();
const sceneWidth = 800, sceneHeight = 100, count = 300000;
world.gravity.set(0, -9.82, 0);
onMounted(() => {
    careteScene();
    createFloor()
    createRain()
    animation()
});

const careteScene = () => {
    const el = document.getElementById("webGL");
    scene = new InitScene(el);
    scene.camera.position.set(0, 10, 50);
    scene.camera.lookAt(0, 0, 0);
    scene.initStats()
    const fog = new THREE.Fog('#262837', 1, 300)
    scene.scene.fog = fog
};

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 1.2,
    restitution: 0.5
})
world.addContactMaterial(defaultContactMaterial)


const createFloor = () => {
    const material = new THREE.MeshStandardMaterial();
    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(sceneWidth, sceneWidth), material);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.scene.add(plane);

    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
        mass: 0,
        shape: floorShape,
        material: defaultMaterial
    })
    world.addBody(floorBody)
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
}

let particlesGeometry;
const createRain = () => {
    particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    let y = 1;
    for (let i = 0; i < count * 3; i++) {
        if (i === y) {
            positions[i] = Math.random() * sceneHeight
            // positions[i] = 40
        } else {
            positions[i] = (Math.random() - 0.5) * sceneWidth
        }

        if (i !== 0 && i % 3 === 0) {
            y += 3;
        }
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const texture = new THREE.TextureLoader().load('img/muzzle_04.png')
    texture.repeat.set(1, 1)
    texture.needsUpdate = true
    const pointMaterial = new THREE.PointsMaterial({
        size: 0.7,
        sizeAttenuation: true,
        alphaMap: texture,
        color: new THREE.Color(0.1, 0.3, 0.4),
        opacity: 0.7,
        transparent: true
    })
    const particles = new THREE.Points(particlesGeometry, pointMaterial)
    scene.scene.add(particles)
}

const animation = () => {
    world.step(1 / 60, scene.time.value, 3)
    if (sphere && sphereBody) {
        sphere.position.copy(sphereBody.position)
    }

    if (particlesGeometry) {
        for (let i = 0; i < count; i++) {
            const currentY = particlesGeometry.attributes.position.getY(i)
            if (currentY <= 0) {
                particlesGeometry.attributes.position.setY(i, sceneHeight)
            } else {
                particlesGeometry.attributes.position.setY(i, currentY - Math.random() * 0.1);
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true
    }
    requestAnimationFrame(() => animation())
}
</script>