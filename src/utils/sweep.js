import * as THREE from "three";
export default function (option) {
  const { color, color1, radius, speed, mesh, type, time, size, center } =
    option;

  const meshMaterial = mesh.material;
  meshMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uColor = {
      value: new THREE.Color(color),
    };
    shader.uniforms.uColor1 = {
      value: new THREE.Color(color1),
    };
    shader.uniforms.uDiffRadius = {
      value: radius,
    };
    shader.uniforms.uSpeed = {
      value: speed,
    };
    shader.uniforms.uType = {
      value: type,
    };
    shader.uniforms.uSize = {
      value: size,
    };
    shader.uniforms.uCenter = {
      value: center,
    };
    shader.uniforms.iTime = time;

    //重写顶点着色器
    const vertex = `
    varying vec3 vP;
    void main(){
       vP = position;
       gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
    `;
    shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);

    //重写片元着色器

    const fragment = `
    uniform float iTime;
     uniform float uRadius;
     uniform vec3 uCenter;
     uniform vec3 uSize;
     uniform float uSpeed;
     varying vec3 vP;
     uniform vec3 uColor1;
     uniform vec3 uColor;
     uniform int uSweepType;

      float getLeng(float x, float z){
          return  sqrt((x-uCenter.x)*(x-uCenter.x)+(z-uCenter.y)*(z-uCenter.y)); //sqrt开根号 取R
      }
     void main(){
          float cr = getLeng(vP.x,vP.y);
          float minC =  mod(iTime * uSpeed, getLeng(uSize.x,uSize.y) / 2.0);  //内环边缘
          float maxC = minC + uRadius;    //外环边缘
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      fragment
    );

    const fragmentColor = `          
    if(cr> minC   && cr< maxC){
      vec3 color = mix(uColor1,uColor,0.8);
      gl_FragColor = vec4(color,abs(cr -minC) /(uRadius*1.5));
    }
    else{
      gl_FragColor = vec4(uColor, 0.0);
    };`;
    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      fragmentColor
    );
  };
  return meshMaterial;
}
