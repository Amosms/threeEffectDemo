import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import PostProcessing from './PostProcessing.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
const clock = new THREE.Clock();
export default class InitScene {
  constructor(el) {
    this.el = el;
    this.initWidhtHeight();
    this.time = {
      value: 0,
    };
    this.elapsedTime = {
      value: 0,
    };
    this.startTime = {
      value: 0,
    };
    this.fbxLoader = new FBXLoader();
    this.gltfLoader = new GLTFLoader().setPath('model/');
    this.raycaster = new THREE.Raycaster();

    this.createScene();
    this.createRender();
    this.createCamera();
    this.createLight();
    this.createControl();
    this.render();

    this.resize();
    //后处理特效
    this.isPostProcessing = false;
    this.postProcessing = new PostProcessing(this);
  }

  initWidhtHeight() {
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createRender() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      // logarithmicDepthBuffer: true
    });
    this.renderer.autoClear = false;
    this.renderer.toneMapping = THREE.LinearToneMapping; // NoToneMapping  LinearToneMapping  ReinhardToneMapping  CineonToneMapping  ACESFilmicToneMapping
    this.renderer.outputEncoding = THREE.sRGBEncoding;  // LinearEncoding sRGBEncoding
    this.renderer.toneMappingExposure = 1;
    this.renderer.toneMappingWhitePoint = 1;
    this.renderer.localClippingEnabled = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor('#32373E');
    this.renderer.setSize(this.width, this.height);
    this.el.appendChild(this.renderer.domElement);
  }
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      100000
    );
    this.camera.position.set(0, 0, 0);
  }
  createLight() {
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    // ambientLight.name = "ambientLight";
    // this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.7);
    this.directionalLight.position.set(0, -50, 100);
    // this.directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.directionalLight);
    // this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
    // this.scene.add(this.hemisphereLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x202020);
    hemisphereLight.name = 'hemisphereLight ';
    this.scene.add(hemisphereLight);

    // const light = new THREE.AmbientLight(0xffffff); // soft white light
    // this.scene.add(light);
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    // directionalLight.position.set(100, 100, 0);
    // this.scene.add(directionalLight);
  }
  createControl() {
    this.controls = new OrbitControls(this.camera, this.el);
    this.controls.screenSpacePanning = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = true; //启用或禁用摄像机平移，默认为true
    this.controls.autoRotate = false; //自动旋转
    this.controls.autoRotateSpeed = 0.1;
    this.controls.update();
  }

  loadGltf(url) {
    return new Promise((resolve, reject) => {
      try {
        this.gltfLoader.load(url, obj => {
          resolve(obj);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  loadFbx(url) {
    return new Promise((resolve, reject) => {
      try {
        this.fbxLoader.load(url, obj => {
          resolve(obj);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getMousePoint(mouse, pickArr) {
    this.raycaster.setFromCamera(mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children);
    if (!intersects) return false;
    let intersectObj = {};
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.isMesh) {
          intersectObj = intersects[i];
          break;
        }
      }
    }
    if (!intersectObj) return false;
    return {
      object: intersectObj.object ? intersectObj.object : null,
      point: intersectObj.point,
    };
  }

  render() {
    TWEEN.update();
    this.stats && this.stats.update();
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.postProcessing && this.isPostProcessing) {
      this.postProcessing.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    this.controls.update();
    const dt = clock.getDelta();
    if (dt < 1) {
      this.time.value += dt;
      this.elapsedTime.value = clock.getElapsedTime();
      // console.log('this.elapsedTime', this.elapsedTime)
    }
  }

  initStats() {
    this.stats = new Stats();
    this.el.appendChild(this.stats.dom);
  }

  resize() {
    window.addEventListener('resize', () => {
      this.initWidhtHeight();
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
}
