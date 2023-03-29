import * as THREE from "three";
export default function (option) {
  const { source, target, height, size, color, range, speed } = option;
  const positions = [];
  const attrPositions = [];
  const attrCindex = [];
  const attrCnumber = [];

  const _source = new THREE.Vector3(source.x, source.y, source.z);
  const _target = new THREE.Vector3(target.x, target.y, target.z);
  const _center = _target.clone().lerp(_source, 1);
  _center.y += height;

  const number = parseInt(
    _source.distanceTo(_target)
  ); //起点到中点的距离 + 终点到中点的距离
  const curv = new THREE.LineCurve3(_source, _target); //三维二次贝塞尔曲线
  console.log('number', number)
  const points = curv.getPoints(number); //要将曲线划分为的分段数。默认是 5.
  points.forEach((elem, i) => {

    const index = i / (number - 1); //索引
    positions.push({
      x: elem.x,
      y: elem.y,
      z: elem.z,
    });
    attrCindex.push(index); // 当前索引集合
    attrCnumber.push(i); //当前显示索引
  });

  positions.forEach((p) => {
    attrPositions.push(p.x, p.y, p.z);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(attrPositions, 3)
  );
  // 传递当前所在位置
  geometry.setAttribute(
    "index",
    new THREE.Float32BufferAttribute(attrCindex, 1)
  );
  geometry.setAttribute(
    "current",
    new THREE.Float32BufferAttribute(attrCnumber, 1)
  );

  console.log('color',color)
  const shader = new THREE.ShaderMaterial({
    transparent: true,
    dashSize: 1,
    gapSize: 1,
    depthWrite: false, //渲染此材质是否对深度缓冲区有任何影响。默认为true。
    depthTest: false, //是否在渲染此材质时启用深度测试。默认为 true。
    blending: THREE.AdditiveBlending, //在使用此材质显示对象时要使用何种混合。
    uniforms: {
      uColor: {
        value: new THREE.Color(color),
      },
      uRange: {
        value: range || 100, //当前范围显示的个数
      },
      uSize: {
        value: size, //粒子大小
      },
      uTotal: {
        value: number, //当前粒子的所有的总数
      },
      time: {
        value: 0,
      },
      uSpeed: {
        value: speed,
      },
      uDirection: {
        value: 1.0,
      },
    },
    vertexShader: `
        attribute float index;
        attribute float current;
        uniform float time;
        uniform float uRange;
        uniform float uSize;
        uniform float uTotal;
        uniform float uSpeed;
        uniform float uDirection;
        uniform vec3 uColor;
        varying vec3 vColor;
        varying float vOpacity;
        void main(){
            //当前要现实的索引
            float size = uSize;
            float showNumber = uTotal * mod(time * uSpeed * uDirection,1.1);   //显示的粒子数量
            vec4 mvPosition = modelViewMatrix * vec4(position , 1.0);
            if(showNumber> current && showNumber < current + uRange){
                float uIndex = ( (uRange + current * uDirection ) - showNumber *uDirection ) / uRange;
                size *= uIndex;
                vOpacity = 1.0;
            }else{
                vOpacity = 0.1;
                mvPosition *=4.5;
            }
            // 顶点着色器计算后的Position
            vColor = uColor;
            gl_Position = projectionMatrix * mvPosition;

            //大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
        }`,
    fragmentShader: `
            varying vec3 vColor;
            varying float vOpacity;
            void main(){
                gl_FragColor = vec4(vColor, vOpacity);
            }`,
  });
  const flayMesh = new THREE.Points(geometry, shader);
  return flayMesh;
}
