<template>
    <div id="webGL"></div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import InitScene from "@/utils/initScene.js";
import { createSpriteTextImg, getContainerXY, getObjectAndPoint } from "@/utils/untils.js"
let scene, mapModel, ring, showTag, el;
const pickArr = []
const provincesModel = {
    "shaanxi": {
        "province_name": "陕西",
        "city_name": "西安",
        warn: true,
        province_id: 1
    },
    "hebei": {
        "province_name": "河北",
        "city_name": "石家庄",
        province_id: 2
    },
    "shanghai": {
        "province_name": "上海",
        "city_name": "上海",
        province_id: 3
    },
    "xinjiang": {
        "province_name": "新疆",
        "city_name": "乌鲁木齐"
    },
    "xizang": {
        "province_name": "西藏",
        "city_name": "拉萨"
    },
    "qinghai": {
        "province_name": "青海",
        "city_name": "西宁"
    },
    "gansu": {
        "province_name": "甘肃",
        "city_name": "兰州"
    },
    "neimenggu": {
        "province_name": "内蒙古",
        "city_name": "呼和浩特"
    },
    "ningxia": {
        "province_name": "宁夏",
        "city_name": "银川"
    },
    "heilongjiang": {
        "province_name": "黑龙江",
        "city_name": "哈尔滨"
    },
    "jilin": {
        "province_name": "吉林",
        "city_name": "长春"
    },
    "liaoning": {
        "province_name": "辽宁",
        "city_name": "沈阳"
    },
    "beijing": {
        "province_name": "北京",
        "city_name": "北京"
    },
    "tianjin": {
        "province_name": "天津",
        "city_name": "天津"
    },
    "shanxi": {
        "province_name": "山西",
        "city_name": "太原"
    },
    "henan": {
        "province_name": "河南",
        "city_name": "郑州"
    },
    "shandong": {
        "province_name": "山东",
        "city_name": "济南"
    },
    "sichuan": {
        "province_name": "四川",
        "city_name": "成都"
    },
    "chongqing": {
        "province_name": "重庆",
        "city_name": "重庆"
    },
    "hubei": {
        "province_name": "湖北",
        "city_name": "武汉"
    },
    "hunan": {
        "province_name": "湖南",
        "city_name": "长沙"
    },
    "jiangsu": {
        "province_name": "江苏",
        "city_name": "南京"
    },
    "anhui": {
        "province_name": "安徽",
        "city_name": "合肥"
    },
    "zhejiang": {
        "province_name": "浙江",
        "city_name": "杭州"
    },
    "fujian": {
        "province_name": "福建",
        "city_name": "福州"
    },
    "taiwan": {
        "province_name": "台湾",
        "city_name": "台北"
    },
    "guangdong": {
        "province_name": "广东",
        "city_name": "广州"
    },
    "hainan": {
        "province_name": "海南",
        "city_name": "海口"
    },
    "jiangxi": {
        "province_name": "江西",
        "city_name": "南昌"
    },
    "guangxi": {
        "province_name": "广西",
        "city_name": "南宁"
    },
    "yunnan": {
        "province_name": "云南",
        "city_name": "昆明"
    },
    "guizhou": {
        "province_name": "贵州",
        "city_name": "贵阳"
    }
}
onMounted(() => {
    careteScene();
    loadModel();
    addMouseOver()
});
const careteScene = () => {
    el = document.getElementById("webGL");
    scene = new InitScene(el);
    const sceneBackTexture = new THREE.TextureLoader().load('img/sceneBack.jpg')
    scene.scene.background = sceneBackTexture
    scene.scene.background2 = sceneBackTexture
    scene.initStats();
    scene.camera.position.set(
        -2.4108018052793394,
        -207.06436676730902,
        377.56278628732065
    );
    scene.camera.setRotationFromEuler(
        new THREE.Euler(
            0.48712935168633703,
            -0.01870423288101392,
            0.009906850386902729,
            "XYZ"
        )
    );

    scene.isPostProcessing = false;
    scene.postProcessing.bloomEnable(false);
    scene.postProcessing.setBloomPass({ strength: 2 });
};

/**
 * 使用mesh创建背景圆环
 */
const createRing = () => {
    const ringTexture = new THREE.TextureLoader().load('img/ring.png')
    ringTexture.wrapS = ringTexture.wrapT = THREE.ClampToEdgeWrapping; //拉伸

    const geometry = new THREE.RingGeometry(180, 230, 64);
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, map: ringTexture });
    const mesh = new THREE.Mesh(geometry, material);
    //@ts-ignore
    mesh.isPicked = false
    ring = mesh
    // mesh.rotation.x = -60 * Math.PI/180
    // // mesh.rotation.z = -7 *Math.PI/180
    mesh.position.z = -10
    mesh.position.y = 65
    mesh.position.x = -40
    scene.postProcessing.setEntireMesh(mesh)
    return mesh
}

/**地图持续动画
 * @param {number} currentAngle 当前角度
 * @param {number} maxAngle 转动的最大角度
 * @param {number} direction 转动方向
 * @param {number} speed 转动速度
 */
const speed = 0.05
const maxAngle = 5
let currentAngle = 0
let direction = 1
const mapAnimate = () => {
    if (mapModel) {
        if (direction === 1) {
            currentAngle += speed
        } else {
            currentAngle -= speed
        }
        if (currentAngle >= maxAngle) {
            direction = 2
        } else if (currentAngle <= -maxAngle) {
            direction = 1
        }
        mapModel.rotation.y = currentAngle * Math.PI / 180
    }
}

const tagAnimate = () => {
    if (mapModel) {

        mapModel.traverse(child => {

            if (child.userData.isProvince && !child.userData.hasData) {
                child.traverse(childItem => {
                    if (childItem.name.includes('-tag')) {
                        if (child.name !== showTag) {
                            if (childItem.material.opacity > 0) {
                                childItem.material.opacity = childItem.material.opacity - 0.1
                            }
                            if (childItem.position.y > 0) {
                                childItem.position.y -= 0.4
                            }
                        } else {
                            if (child.name == showTag) {
                                if (childItem.material.opacity < 1) {
                                    childItem.material.opacity = childItem.material.opacity + 0.1
                                }
                                if (childItem.position.y < 9) {
                                    childItem.position.y += 1
                                }
                            }
                        }
                    }
                })
            }
        })

    }
}

const cityRing = () => {
    const centerCircle = new THREE.Group();
    const insideCirCleGeometry = new THREE.RingGeometry(1, 2, 8)
    const outsideCirCleGeometry = new THREE.RingGeometry(3.5, 4, 16)
    const centerCircleMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    const insideMesh = new THREE.Mesh(insideCirCleGeometry, centerCircleMat);
    const outsideMesh = new THREE.Mesh(outsideCirCleGeometry, centerCircleMat)
    centerCircle.add(insideMesh)
    centerCircle.add(outsideMesh)
    centerCircle.position.z = 2;
    // @ts-ignore
    centerCircle.isPicked = false
    return centerCircle.clone()
}

const loadModel = () => {
    scene.loadFbx("chinaMap/chinaMap.FBX").then((m) => {
        mapModel = m;
        scene.scene.add(m);
        m.position.y -= 5
        m.position.x += 5
        m.traverse((child) => {
            if (child.name === "jiuduan") {
                child.material.transparent = true;
                child.material.map = new THREE.TextureLoader().load(
                    "chinaMap/jiuduan.png"
                );
            } else if (child.name === "quanguowang") {
                scene.postProcessing.setBloomMesh(child)
                setMeshSweep(child);
            } else if (child.name === 'miaobian') {
                scene.postProcessing.setBloomMesh(child)
                console.log(scene)
            } else if (child.name.includes('2')) {  //名字含2的是各省边线  名字含3的是各省模型块，主要看需求是给边线还是块增加辉光
                // child.parent.traverse((childItem: THREE.Mesh) => {
                //   if (childItem.isMesh && childItem.name.includes('3')) {
                //     // @ts-ignore
                //     textureMap[child.parent.name] = (childItem.material as THREE.MeshLambertMaterial).map
                //   }
                // })

                const provinceModelName = child.parent.name;
                // @ts-ignore
                child.parent.isPicked = true
                let nameTag;
                // @ts-ignore
                pickArr.push(child.parent);
                if (provincesModel[provinceModelName]) {

                    let textImgParam = {
                        fontSize: 180,
                        fontColor: "#ffffff",
                        text: [provincesModel[provinceModelName].city_name],
                        offsetY: 1,
                        url: 'img/name_tag.png',
                        scale: new THREE.Vector3(30, 30, 30),
                        position: new THREE.Vector3(0, 0, 0),
                    }
                    const provinceRing = cityRing()
                    child.add(provinceRing)
                    const sprite = createSpriteTextImg(textImgParam, (sprite) => {
                        sprite.name = `${provincesModel[provinceModelName].city_name}-tag`
                        sprite.userData.isNameTag = true
                        sprite.position.z = 10
                        sprite.position.y = 10
                        sprite.position.x = 3
                        nameTag = sprite
                        nameTag.material.opacity = 0
                        child.parent.add(sprite)
                        child.parent.userData.isProvince = true
                        if (provincesModel[provinceModelName] && provincesModel[provinceModelName].province_id) {
                            scene.postProcessing.setBloomMesh(child)
                            // scene3D.postProcessing.setBloomMesh(child)
                            nameTag.material.opacity = 1
                            const meshWarn = provincesModel[provinceModelName].warn
                            Object.assign(child.parent.userData, {
                                hasData: true,
                                isWarn: meshWarn,
                                tagShow: true,
                                province_name: provincesModel[provinceModelName].province_name,
                                city_name: provincesModel[provinceModelName].city_name,
                                province_id: provincesModel[provinceModelName].province_id,
                                city_id: provincesModel[provinceModelName].city_id
                            })

                            if (meshWarn) {
                                //告警
                                updateMeshStatus((child.parent), true)
                            } else {
                                //正常
                                updateMeshStatus((child.parent), false)
                            }
                        }
                    })
                }
            }
        });
        // const ring = createRing()
        // mapModel.add(ring)
        // tagAnimate()
    });
};
/**
 * 更新模型状态
 * @param mesh 模型
 * @param status 是否告警   true：告警   false：正常
 */
const updateMeshStatus = (mesh, status) => {
    if (mesh.children.length > 0) {
        mesh.traverse((child) => {
            if (child.isMesh && child.name.includes('3')) {
                const name = child.name.split('_')[0]
                if (status) {
                    child.material.map = new THREE.TextureLoader().load(`chinaMap/${name}3.jpg`)
                } else {
                    child.material.map = new THREE.TextureLoader().load(`chinaMap/${name}2.jpg`)
                }
                child.material.needsUpdate = true
            }
        })
    }
}

/**
 * 模型移动
 */
const maxZ = 20, moveSpeed = 1;
const meshMove = () => {
    if (mapModel) {
        mapModel.traverse(child => {
            //@ts-ignore
            if (child.type === 'Group' && child.isPicked) {
                if (child.userData.isUp && child.position.z !== maxZ) {
                    child.position.z += moveSpeed
                }
                if (!child.userData.isUp && child.position.z !== 0) {
                    child.position.z -= moveSpeed
                }
            }
        })
    }
}

let beginTime = Date.now();
let prevTime = beginTime;
let frames = 0;
let ringSpeed = 0.5,
    mapSpeed = 0.05;
const animate = () => {

    let time = Date.now();
    frames++
    if (time >= prevTime + 1000) {
        let fps = (frames * 1000) / (time - prevTime)
        prevTime = time
        frames = 0
        if (fps) {
            ringSpeed = 0.5;
            mapSpeed = 0.05;
        }
    }

    mapAnimate()
    requestAnimationFrame(animate)
    if (ring) {
        ring.rotation.z += ringSpeed * Math.PI / 180
    }
    meshMove()
    tagAnimate()
}
animate()



const addMouseOver = () => {
    //悬浮模型
    el.addEventListener(
        'mousemove', (event) => {
            if (mapModel) {
                const mouse = getContainerXY(event, el)
                const object = getObjectAndPoint(mouse, scene.raycaster, scene.camera, pickArr)
                let mouseOnMesh
                if (object.object) {
                    if (object.object.parent.userData.hasData) {
                        mouseOnMesh = object.object.parent.name
                        showTag = null
                    } else {
                        mouseOnMesh = object.object.parent.name
                        showTag = object.object.parent.name
                    }
                } else {
                    mouseOnMesh = null
                    showTag = null;
                }
                moveOnMeshAction(mouseOnMesh)
            }
        }
    )
}


/**
 * 鼠标悬浮模型后执行的动作
 * @param mouseOnMesh 模型名称
 */
const moveOnMeshAction = (mouseOnMesh) => {
    mapModel.traverse((child) => {
        //@ts-ignore
        if (child.userData.isProvince && child.isPicked) {
            if (child.name === mouseOnMesh) {
                if (child.userData.hasData) {
                    child.userData.isUp = true
                }
            } else {
                if (child.userData.hasData) {
                    child.userData.isUp = false
                }
            }
        }
    })
}



const setMeshSweep = (mesh) => {
    const { geometry } = mesh;
    geometry.computeBoundingBox();
    const { max, min } = geometry.boundingBox;
    const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    const shaderMat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            iTime: scene.time,
            iResolution: {
                value: new THREE.Vector3(size.x, size.y, 1),
            },
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
      varying vec2 vUv;
      float sdCircle(vec2 uv,float r){
        return length(uv)-r;
      }
      void main(){
        float w = 1.0/iResolution.y;
        vec2 uv = vUv;
        uv = uv-0.5;
        uv = 50.*uv;
        vec3 col =vec3(1.0);
        uv.x *=iResolution.x/iResolution.y;

        float cir = sdCircle(uv,5.*iTime);
        col *=100. -exp(-90. * abs(cir));
        float s = abs(sin(cir * 0.2)) - 0.82;
        s = clamp(s,0.,1.)*0.45;
        col *=s;
        col *=vec3(0.2,0.8,0.9);
        float alpha = 0.;
        if(s>0.02){
          alpha = 1.;
        }
        gl_FragColor = vec4(col,alpha);
      }
    `,
    });
    mesh.material = shaderMat;
};
</script>

<style>
.flyDirectionBtn {
    position: absolute;
    left: 50px;
    top: 50px;
}
</style>
