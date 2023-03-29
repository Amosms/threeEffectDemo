<template>
    <div id="webGL"></div>
    <div class="test" @click="test"> test</div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene, mixers = [];
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

const loadMeshs = ['EJXB666', '12']
const loadModel = () => {

    for (let i = 0; i < loadMeshs.length; i++) {
        scene.loadFbx(`model/${loadMeshs[i]}.fbx`).then((m) => {
            const axesHelper = new THREE.AxesHelper(1000);
            scene.scene.add(m);
            console.log(m)
            if (m.name.includes('EJXB')) {
                console.log(m)
                m.mixer = new THREE.AnimationMixer(m);
                mixers.push(m.mixer);
                console.log(m.animations)
                var action = m.mixer.clipAction(m.animations[0]);
                // action.timeScale = 5
                console.log(mixers)
                action.play();
            }

        });
    }
};
var clock = new THREE.Clock();
const animation = () => {
    requestAnimationFrame(animation);
    if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.getDelta());
        }
    }
}

const test = () => {
    console.log(scene)
}

</script>

<style>
.test {
    position: absolute;
    left: 50px;
    top: 50px;
}
</style>
