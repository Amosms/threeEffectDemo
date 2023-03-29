import * as THREE from "three";
import {
  EffectComposer
} from "three/examples/jsm/postprocessing/EffectComposer";
import {
  RenderPass
} from "three/examples/jsm/postprocessing/RenderPass";
import {
  ShaderPass
} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {
  FXAAShader
} from "three/examples/jsm/shaders/FXAAShader.js";
import {
  OutlinePass
} from "three/examples/jsm/postprocessing/OutlinePass.js";
import {
  UnrealBloomPass
} from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  SSAARenderPass
} from "three/examples/jsm/postprocessing/SSAARenderPass.js";
import {
  CopyShader
} from "three/examples/jsm/shaders/CopyShader.js";

//后处理shader特效集合
import Shaders from './Shaders.js';



//bloom相关
let ENTIRE_SCENE = 0,
  BLOOM_SCENE = 1;
let darkMaterial = new THREE.MeshBasicMaterial({
  color: "black"
});
let materials = {};
let bloomParams = {
  exposure: 1,
  strength: 5,
  threshold: 0.02,
  radius: 0.6,
  focusShaderSampleDistance: 0.2,
};

//outLine相关
let outLineParams = {
  edgeStrength: 3.0, //边缘强度
  edgeGlow: 0.0, //边缘流
  edgeThickness: 1.0, //边缘厚度
  pulsePeriod: 4, //呼吸周期
  usePatternTexture: false, //网格模式 使用图案纹理
  visibleEdgeColor: "#ffffff", //可见边缘颜色
  hiddenEdgeColor: "#ffffff" //隐藏边缘颜色
};

let maskParams = {
  tDiffuse: new THREE.Color(0xffffff),
  maskColor: new THREE.Color(0x000000),
  maskAlpha: 1,
  markRadius: 0.15,
  smoothSize: 0.5
}

export default class PostProcessing {
  constructor(scene3D) {
    console.log('PostProcessing');

    this.scene3D = scene3D;
    this.scene = scene3D.scene;
    this.camera = scene3D.camera;
    this.renderer = scene3D.renderer;

    this.width = scene3D.el.clientWidth;
    this.height = scene3D.el.clientHeight;

    this.isEnable = false;
    this.isOutlineEnable = false;
    this.isBloomEnable = false;
    this.isMaskEnable = false;

    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(BLOOM_SCENE);

    // this.target = new THREE.WebGLRenderTarget({
    //     minFilter: THREE.LinearFilter,
    //     magFilter: THREE.LinearFilter,
    //     format: THREE.RGBAFormat,
    //     encoding: THREE.sRGBEncoding
    // });

    // this.scene.traverse( this.disposeMaterial );
    // this.scene.children.length = 0;

    this.rendererTarget0 = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      encoding: THREE.sRGBEncoding,
      stencilBuffer: true,
    });
    // this.renderer.render(this.scene, this.camera, this.rendererTarget0, true);

    // this.renderer.toneMapping = THREE.ReinhardToneMapping;

    this.renderPass = new RenderPass(this.scene, this.camera);

    //composer
    this.creatComposer();

    //outline
    this.creatOutlinePass();

    // //mask
    this.creatMaskPass();

    // //ssaa
    //  this.creatSsaaRenderPass();
    //  this.creatFxaaRenderPass();


    //bloom
    this.creatBloomPass();

    //copyPass
    //  this.creatShaderPass();



    //composer- pass
    this.addPass();

    //finalPass
    this.creatFinalPass();

    // // // FinalComposer
    this.creatFinalComposer();

    // addFinalComposerPass
    this.addFinalComposerPass();

  }

  enableAntialias() {
    this.creatFinalPass();

    this.creatFinalComposer();

    this.addFinalComposerPass();
  }

  creatSsaaRenderPass(level) {
    if (this.ssaaRenderPass) return;
    this.ssaaRenderPass = new SSAARenderPass(this.scene, this.camera);
    this.ssaaRenderPass.sampleLevel = level ? level : 1;
    this.ssaaRenderPass.unbiased = true;
    this.ssaaRenderPass.enabled = false;
  }

  creatShaderPass() {
    if (this.copyPass) return;
    //渲染器开启sRGBEncoding 会变黑
    this.copyPass = new ShaderPass(CopyShader);
    // this.copyPass = new ShaderPass(GammaCorrectionShader);
    // this.copyPass = new ShaderPass(Shaders.mask);
    // 让effectCopy渲染到屏幕上 没这句不会再屏幕上渲染
    this.copyPass.renderToScreen = false;
  }

  creatOutlinePass() {
    if (this.outlinePass) return;
    this.outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), this.scene, this.camera);
    this.outlinePass.enabled = false;
  }


  creatBloomPass() {
    if (this.bloomPass) return;
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.5, 0.4, 0.85);
    this.renderer.toneMappingExposure = bloomParams.exposure;
    this.bloomPass.threshold = bloomParams.threshold;
    this.bloomPass.strength = bloomParams.strength;
    this.bloomPass.radius = bloomParams.radius;
    this.bloomPass.enabled = false;
  }

  creatMaskPass() {
    this.maskPass = new ShaderPass(Shaders.mask);
    this.maskPass.uniforms.smoothSize.value = maskParams.smoothSize;
    this.maskPass.uniforms.markRadius.value = maskParams.markRadius;
    this.maskPass.uniforms.maskAlpha.value = maskParams.maskAlpha;
    this.maskPass.uniforms.maskColor.value = maskParams.maskColor;
    this.maskPass.uniforms.tDiffuse.value = maskParams.tDiffuse;
    this.maskPass.enabled = false;
  }

  creatComposer() {
    if (this.composer) return;
    // this.composer = new EffectComposer(this.renderer,this.rendererTarget0);
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);
    this.composer.renderToScreen = false;
  }


  // outlinePass 与 bloomPass 顺序不同，效果也不同，具体还在摸索
  addPass() {

    // this.outlinePass && this.composer.insertPass(this.outlinePass, 1);
    this.composer && this.composer.addPass(this.renderPass);

    // this.outlinePass && this.composer.addPass(this.outlinePass);

    // this.maskPass && this.composer.addPass(this.maskPass);

    this.bloomPass && this.composer.addPass(this.bloomPass);

    // this.ssaaRenderPass && this.composer.addPass(this.ssaaRenderPass);
    // this.effectFXAA && this.composer.addPass(this.effectFXAA);

    // this.copyPass && this.composer.addPass(this.copyPass);

  }

  creatFinalPass() {
    if (this.finalPass) return;
    let uniforms = THREE.UniformsUtils.clone(Shaders.bloom.uniforms);
    uniforms = {
      baseTexture: {
        value: null
      },
      bloomTexture: {
        value: this.composer.renderTarget2.texture
      }
    };
    this.finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: Shaders.bloom.vertexShader,
        fragmentShader: Shaders.bloom.fragmentShader,
        defines: {}
      }),
      "baseTexture"
    );
    this.finalPass.needsSwap = true;
    this.finalPass.enabled = false;
  }


  creatFinalComposer() {
    if (this.finalComposer) return;
    // this.finalComposer = new EffectComposer(this.renderer,this.rendererTarget0);
    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.enabled = false;
  }


  addFinalComposerPass() {

    this.renderPass && this.finalComposer.addPass(this.renderPass);

    // this.ssaaRenderPass && this.composer.addPass(this.ssaaRenderPass);
    // this.ssaaRenderPass && this.finalComposer.addPass(this.ssaaRenderPass);
    // this.effectFXAA && this.composer.addPass(this.effectFXAA);

    this.finalComposer && this.finalComposer.addPass(this.finalPass);

    this.effectFXAA && this.finalComposer.addPass(this.effectFXAA);

    // this.outlinePass && this.composer.addPass(this.outlinePass);

    // this.maskPass && this.finalComposer.addPass(this.maskPass);

  }


  resize() {
    this.composer && this.composer.setSize(this.width, this.height);
    this.finalComposer && this.finalComposer.setSize(this.width, this.height);
    this.effectFXAA && this.effectFXAA.material.uniforms["resolution"].value.set(1 / this.width, 1 / this.height);
  }


  fxaaEnabled(enabled) {
    if (enabled) {
      if (!this.effectFXAA) {
        this.effectFXAA = new ShaderPass(FXAAShader);
        this.effectFXAA.material.uniforms["resolution"].value.set(1 / this.width, 1 / this.height);
        this.composer.addPass(this.effectFXAA);
      }
      this.effectFXAA.enabled = enabled;
    } else {
      if (!this.effectFXAA) return;
      this.effectFXAA.enabled = false;
    }
  }

  creatFxaaRenderPass() {
    if (this.effectFXAA) return;
    this.effectFXAA = new ShaderPass(FXAAShader);
    this.effectFXAA.material.uniforms["resolution"].value.set(1 / this.width, 1 / this.height);
  }

  ssaaRenderPassEnabled(enabled) {
    if (enabled) {
      if (!this.ssaaRenderPass) this.creatSsaaRenderPass();
      this.ssaaRenderPass.enabled = true;
    } else {
      if (!this.ssaaRenderPass) return;
      this.ssaaRenderPass.enabled = false;
    }
  }

  outlineEnable(enabled) {
    this.isOutlineEnable = enabled;
    if (this.outlinePass) this.outlinePass.enabled = enabled;
    if (this.outlinePass.enabled) this.outlinePass.selectedObjects = [];
  }

  setOutLinePass(params) {
    if (!this.outlinePass) return;
    outLineParams = Object.assign({}, outLineParams, params);
    console.log("setOutLinePass")
    const {
      edgeStrength,
      edgeGlow,
      edgeThickness,
      pulsePeriod,
      usePatternTexture,
      visibleEdgeColor,
      hiddenEdgeColor
    } = outLineParams;
    // this.renderer.toneMappingExposure = outLineParams.exposure;
    if (edgeStrength) this.outlinePass.edgeStrength = edgeStrength;
    if (edgeGlow) this.outlinePass.edgeGlow = edgeGlow;
    if (edgeThickness) this.outlinePass.edgeThickness = edgeThickness;
    // if (pulsePeriod) this.outlinePass.pulsePeriod = pulsePeriod;
    if (pulsePeriod) this.outlinePass.pulsePeriod = 4;
    this.outlinePass.usePatternTexture = usePatternTexture;
    visibleEdgeColor && this.outlinePass.visibleEdgeColor.set(visibleEdgeColor);
    hiddenEdgeColor && this.outlinePass.hiddenEdgeColor.set(hiddenEdgeColor);
  }


  setOutLineMesh(object) {
    if (!this.outlinePass) return;
    // this.outlinePass.selectedObjects = [];
    this.outlinePass.selectedObjects.push(object);
  }

  //bloom
  bloomEnable(enabled) {
    this.isBloomEnable = enabled;

    if (this.bloomPass) this.bloomPass.enabled = enabled;
    if (this.ssaaRenderPass) this.ssaaRenderPass.enabled = true;
    if (this.finalPass) this.finalPass.enabled = true;
    if (this.finalComposer) this.finalComposer.enabled = true;
  }

  setBloomPass(params) {
    bloomParams = Object.assign({}, bloomParams, params);
    // this.renderer.toneMappingExposure = bloomParams.exposure;
    this.bloomPass.threshold = bloomParams.threshold;
    this.bloomPass.strength = bloomParams.strength;
    this.bloomPass.radius = bloomParams.radius;
  }

  setBloomMesh(mesh) { //发光 
    mesh.layers.enable(BLOOM_SCENE);
  }

  setEntireMesh(mesh) { //不发光
    mesh.layers.enable(ENTIRE_SCENE);
  }

  maskEnable(enabled) {
    this.isMaskEnable = enabled;
    this.maskPass && (this.maskPass.enabled = enabled);
  }

  setMaskPass(params) {
    maskParams = Object.assign({}, maskParams, params);
    this.maskPass.uniforms.smoothSize.value = maskParams.smoothSize;
    this.maskPass.uniforms.markRadius.value = maskParams.markRadius;
    this.maskPass.uniforms.maskAlpha.value = maskParams.maskAlpha;
    this.maskPass.uniforms.maskColor.value = maskParams.maskColor;
    this.maskPass.uniforms.tDiffuse.value = maskParams.tDiffuse;
  }


  render() {
    if (this.composer && this.finalComposer && this.isBloomEnable) {
      this.renderBloom(true);
      this.finalComposer.render();
    } else {
      this.composer.render();
    }
  }

  renderBloom(mask) {
    if (mask === true) {
      this.scene.traverse(child => {
        this.darkenNonBloomed(child);
      });
      this.scene.background = new THREE.Color(0x000000);
      this.composer.render();
      this.scene.traverse(child => {
        this.restoreMaterial(child);
      });

      this.scene.background = this.scene.background2;


    } else {
      this.camera.layers.set(BLOOM_SCENE);
      this.composer.render();
      this.camera.layers.set(ENTIRE_SCENE);
    }
  }


  darkenNonBloomed(obj) {
    if ((obj instanceof THREE.Mesh || obj.isLineSegments || obj.isSprite || obj.isLine) && this.bloomLayer.test(obj.layers) === false) {
      materials[obj.uuid] = obj.material;
      if (obj.isSprite) {
        obj.material = darkMaterial.clone();
        obj.material.visible = false;
      } else {
        obj.material = darkMaterial;
      }
    }
  }

  restoreMaterial(obj) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  }

  disposeMaterial(obj) {
    if (obj.material) {
      obj.material.dispose();
    }
  }


  dispose() {
    if (this.renderPass) {
      this.renderPass.enabled = false;
      this.renderPass.renderToScreen = false;
      // this.renderPass.dispose();
      this.renderPass.clear = true;
      this.renderPass = null;
    }

    if (this.outlinePass) {
      this.outlinePass.selectedObjects = [];
      this.outlinePass.enabled = false;
      this.outlinePass.dispose();
      this.outlinePass.clear = true;
      this.outlinePass = null;
    }

    if (this.bloomPass) {
      this.bloomPass.enabled = false;
      this.bloomPass.dispose();
      this.bloomPass.clear = true;
      this.bloomPass = null;
    }

    if (this.effectFXAA) {
      this.effectFXAA.enabled = false;
      this.effectFXAA.clear = true;
      // this.effectFXAA.dispose();
      this.effectFXAA = null;
    }

    if (this.ssaaRenderPass) {
      this.ssaaRenderPass.enabled = false;
      this.ssaaRenderPass.renderToScreen = false;
      // this.ssaaRenderPass.dispose();
      this.ssaaRenderPass.clear = true;
      this.ssaaRenderPass = null;
    }

    if (this.copyPass) {
      this.copyPass.enabled = false;
      this.copyPass.renderToScreen = false;
      // this.copyPass.dispose();
      this.copyPass.clear = true;
      this.copyPass = null;
    }
    if (this.composer) {
      this.composer.renderToScreen = false;
      // this.composer.dispose();
      this.composer.clear = true;
      this.composer = null;
    }

    if (this.finalPass) {
      this.finalPass.renderToScreen = false;
      // this.finalPass.dispose();
      this.finalPass.clear = true;
      this.finalPass = null;
    }

    if (this.finalComposer) {
      this.finalComposer.renderToScreen = false;
      // this.finalComposer.dispose();
      this.finalComposer.clear = true;
      this.finalComposer = null;
    }
  }
}