<template>
  <div id="webGL"></div>
  <!-- <div class="test" @click="test">点击</div> -->
  <div class="buttonGroup">
    <div class="play" @click="play">指令1</div>
    <div class="stop" @click="stop">指令2</div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import InitScene from '@/utils/initScene.js';
const synth = window.speechSynthesis;
let sceneInstance,
  animationMixer = [];
onMounted(() => {
  careteScene();
  loadModel();
  animation();
  //   createParticles();
});
const careteScene = () => {
  const el = document.getElementById('webGL');
  sceneInstance = new InitScene(el);
  sceneInstance.camera.position.set(
    -3807.371115807667,
    1008.3080313909493,
    -623.0536354728637
  );
  sceneInstance.controls.target = new THREE.Vector3(
    -3807.371115807667,
    815.6808334319059,
    -815.6808334319071
  );
  sceneInstance.camera.lookAt(0, 20, 0);
  sceneInstance.scene.background = new THREE.Color(0, 0, 0);
  sceneInstance.initStats();
};

const loadModel = async () => {
  const url = '/animation/dh1.fbx';
  const model = await sceneInstance.loadFbx(url);
  console.log(model);
  model.name = 'dh1';
  sceneInstance.scene.add(model);
  if (model.animations.length) {
    for (let i = 0; i < model.animations.length; i++) {
      // animationMixer
      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(model.animations[i]);
      mixer.addEventListener('finished', e => {
        console.log(e);
        play();
      });
      //   action.play();
      //   if (model.animations[i - 1]) {
      //     mixer['startTime'] = model.animations[i - 1].duration;
      //   } else {
      //     mixer['startTime'] = 0;
      //   }
      animationMixer.push({
        modelName: 'dh1',
        mixer: mixer,
        actions: action,
        animation: model.animations[i],
        duration: model.animations[i].duration,
      });
    }
  }
};

const play = async () => {
  //   const model = sceneInstance.scene.getObjectByName('dh1');
  // const text = 'hello,你好';

  // const u = new SpeechSynthesisUtterance(text);
  // const voices = await getVoices();
  // console.log(u, voices);
  // const voice = voices.filter(
  //   i => i.name == 'Microsoft Yaoyao - Chinese (Simplified, PRC)'
  // );

  // const localVoices = voices.filter(i => i.localService);
  // console.log(localVoices);
  //   u.lang = 'zh';

  //   u.voice = voices[langIndex];
  //   u.lang = voices[langIndex].lang;
  // console.log(voice);
  // if (voice.length) {
  //   u.voice = voice[0];
  //   u.lang = voice[0].lang;
  //   u.pitch = 1;
  //   u.volume = 1;
  //   u.rate = 1;
  //   console.log('changed');
  //   synth.speak(u);
  // }
  //   console.log(voices);
  //   console.log('speak');
  const mixer = animationMixer.find(i => i.modelName === 'dh1');
  if (mixer) {
    mixer.actions.stop();
    mixer.actions.setDuration(mixer.duration);
    mixer.actions.setLoop(THREE.LoopOnce);
    mixer.actions.time = 20;
    // mixer.actions.startAt(20);
    // mixer.actions.setDuration(3);
    // mixer.actions.timeScale = 1; //设置播放速度
    mixer.animation.duration = 60;
    mixer.actions.play();
  }
};

const getVoices = () => {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    resolve(voices);
  });
};

const stop = () => {
  const mixer = animationMixer.find(i => i.modelName === 'dh1');
  if (mixer) {
    // const text = '接受指令，停止播放动画';
    // const u = new SpeechSynthesisUtterance(text);
    // u.lang = 'zh';
    // u.rate = 1;
    // synth.speak(u);
    // mixer.actions.stop();
    mixer.actions.setLoop(THREE.LoopOnce);
    const running = mixer.actions.isRunning();
    console.log(running);
    mixer.actions.setDuration(1);
  }
};
const clock = new THREE.Clock();
const animation = () => {
  const time = clock.getDelta();
  for (let i = 0; i < animationMixer.length; i++) {
    animationMixer[i] && animationMixer[i].mixer.update(time);
  }
  requestAnimationFrame(animation);
};
const test = () => {
  console.log(sceneInstance);
};
</script>
<style>
.test {
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 99;
  color: white;
}

.buttonGroup {
  position: absolute;
  top: 50px;
  right: 20px;
  z-index: 99;
  color: white;
}
</style>
