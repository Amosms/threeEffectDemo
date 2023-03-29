<template>
  <div id="webGL"></div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import InitScene from '@/utils/initScene.js';
let scene, particlesGeometry, points;
const sceneHeight = 5,
  count = 300000;
const parameters = {
  count: 300000,
  size: 0.05,
  radius: 7,
  branches: 3,
  spin: 0.9,
  randomness: 0.4,
  randomnessPower: 2,
  insideColor: '#d53707',
  outsideColor: '#00288f',
};
onMounted(() => {
  careteScene();
  animation();
  createParticles();
});

const careteScene = () => {
  const el = document.getElementById('webGL');
  scene = new InitScene(el);
  scene.camera.position.set(0, 10, 10);
  scene.camera.lookAt(0, 20, 0);
  scene.scene.background = new THREE.Color(0, 0, 0);
  scene.initStats();
};

const createParticles = () => {
  particlesGeometry = new THREE.BufferGeometry();
  const position = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const branchesAngle =
      ((Math.PI * 2) / parameters.branches) * (i % parameters.branches);
    const spinAngle = radius * parameters.spin;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, (radius / parameters.radius) * 1.2);

    const randomX =
      Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY = Math.random() * sceneHeight;
    // const randomY = Math.random() ** parameters.randomnessPower
    //     * (Math.random() < 0.5 ? 1 : -1)
    //     * parameters.randomness
    //     * radius
    const randomZ =
      Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    position[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
    position[i3 + 1] = randomY;
    position[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(position, 3)
  );
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(particlesGeometry, material);
  scene.scene.add(points);
};
const animation = () => {
  if (particlesGeometry) {
    for (let i = 0; i < count; i++) {
      const currentY = particlesGeometry.attributes.position.getY(i);
      if (currentY <= (Math.random() - 0.5) * 2) {
        particlesGeometry.attributes.position.setY(
          i,
          (Math.random() + 0.1) * sceneHeight
        );
      } else {
        particlesGeometry.attributes.position.setY(
          i,
          currentY - Math.random() * 0.005
        );
      }
    }
    particlesGeometry.attributes.position.needsUpdate = true;
  }

  if (points) {
    points.rotateY((Math.PI / 360) * 0.1);
    // points.rotation.y += Math.PI / 360 * 0.1
  }
  requestAnimationFrame(() => animation());
};
</script>
