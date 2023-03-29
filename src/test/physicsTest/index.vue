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
world.gravity.set(0, -9.82, 0);
onMounted(() => {
    careteScene();
    createMesh()
    createCannonMesh()
    animation()
});

const careteScene = () => {
    const el = document.getElementById("webGL");
    scene = new InitScene(el);
    scene.camera.position.set(0, 10, 50);
    scene.camera.lookAt(0, 0, 0);
};

const createMesh = () => {
    const material = new THREE.MeshStandardMaterial();

    sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 16, 16), material.clone());
    sphere.position.setY(1);
    sphere.castShadow = true;
    scene.scene.add(sphere);

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(15, 15), material.clone());
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.scene.add(plane);

    scene.directionalLight.castShadow = true
    scene.directionalLight.position.set(5, 5, 0)

    const directionLightHelper = new THREE.DirectionalLightHelper(scene.directionalLight, 2)
    directionLightHelper.visible = true
    scene.scene.add(directionLightHelper)
}

const createCannonMesh = () => {
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 1.2,
        restitution: 0.7
    })

    world.addContactMaterial(defaultContactMaterial)


    const sphereShape = new CANNON.Sphere(1);
    sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 10, 0),
        shape: sphereShape,
        material: defaultMaterial
    })
    world.addBody(sphereBody)

    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
        mass: 0,
        shape: floorShape,
        material: defaultMaterial
    })
    world.addBody(floorBody)
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)


}
const animation = () => {
    world.step(1 / 60, scene.time.value, 3)
    if (sphere && sphereBody) {
        sphere.position.copy(sphereBody.position)
    }
    requestAnimationFrame(() => animation())
}
</script>