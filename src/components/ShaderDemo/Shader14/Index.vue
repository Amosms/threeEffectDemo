<template>
    <div id="webGL"></div>
    <div class="test" @click="test"> test111</div>
</template>
<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
let scene, mixers = null;
onMounted(() => {
    careteScene();
    loadModel();
    animation()
});
const careteScene = () => {
    const el = document.getElementById("webGL");
    scene = new InitScene(el);
    scene.camera.position.set(
        3.380403189925746,
        -0.5629014518097183,
        1.8931324337478843
    );
    scene.camera.setRotationFromEuler(
        new THREE.Euler(
            0.28901340879529647,
            1.0420280949576277,
            -0.25130348142357606,
            "XYZ"
        )
    );
    scene.controls.target = new THREE.Vector3(0, 0, 0)
};

const loadMeshs = ['EJXB666']

const loadModel = () => {
    scene.loadGltf('A22.gltf').then(m => {
        console.log(m)

        scene.scene.add(m.scene);
        mixers = new THREE.AnimationMixer(m.scene.children[0]);
        const action = mixers.clipAction(m.animations[0]);
        action.play()
        console.log(mixers)
    })
}
// const loadModel = () => {
//     for (let i = 0; i < loadMeshs.length; i++) {
//         scene.loadFbx(`model/${loadMeshs[i]}.fbx`).then((m) => {
//             const axesHelper = new THREE.AxesHelper(1000);
//             scene.scene.add(m);
//             console.log(m)
//             if (m.name.includes('EJXB')) {
//                 console.log(m)
//                 m.position.y -= 500
//                 scene.controls.target = m.position
//                 scene.controls.update()
//                 m.mixer = new THREE.AnimationMixer(m);
//                 mixers.push(m.mixer);
//                 // const am0 = m.animations[0].tracks
//                 // let am0Times = 0, am0Vlues = 0
//                 // am0Times = am0.reduce((pre, cur) => {
//                 //     return pre + cur.times.length
//                 // }, am0Times)
//                 // am0Vlues = am0.reduce((pre, cur) => {
//                 //     return pre + cur.values.length
//                 // }, am0Times)
//                 // console.log(`第1个动作:tracks:${am0.length};times:${am0Times};values:${am0Vlues}`)

//                 // const am1 = m.animations[1].tracks
//                 // let am1Times = 0, am1Vlues = 0
//                 // am1Times = am1.reduce((pre, cur) => {
//                 //     return pre + cur.times.length
//                 // }, am1Times)
//                 // am1Vlues = am1.reduce((pre, cur) => {
//                 //     return pre + cur.values.length
//                 // }, am1Times)
//                 // console.log(`第2个动作:tracks:${am1.length};times:${am1Times};values:${am1Vlues}`)

//                 var action = m.mixer.clipAction(m.animations[0]);
//                 // action.timeScale = 5
//                 console.log(mixers)
//                 action.play();
//             }

//         });
//     }
// };
var clock = new THREE.Clock();
const animation = () => {
    requestAnimationFrame(animation);
    var delta = clock.getDelta();
    if (mixers) {
        mixers.update(delta);

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
