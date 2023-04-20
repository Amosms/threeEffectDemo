import * as THREE from 'three';
const rainShader = {
    uniforms: {
        'tDiffuse': { value: '' },
        'iResolution': { value: new THREE.Vector2(  window.innerWidth, window.innerHeight ) },
        'iTime': { value: 0 },
        'angle': { value: 0 },
        'speed': { value: 0.4 },
        'color': { value: new THREE.Color( 1, 1, 1 ) },
        'quantity': { value: 1000 },
    },

    vertexShader: /* glsl */`

        varying highp vec2 vUv;

            void main() {

                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }`,

    fragmentShader: /* glsl */`

        uniform sampler2D tDiffuse;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float speed;
        uniform vec3 color;
        uniform float angle;
        uniform float quantity;
        varying highp vec2 vUv;
        float hash(vec2 p){
            p  = 30.0*fract( p*0.3183099 + vec2(0.71,0.113));
            return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
        }
        float noise( in vec2 p ){
            vec2 i = floor( p );
            vec2 f = fract( p );
            vec2 u = f*f*(3.0-2.0*f);
            return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
        }
        
        void main(){
            vec3 col=texture(tDiffuse,vUv).rgb;
            vec2 q = gl_FragCoord.xy/iResolution.xy;
            vec2 p = -1.0 + 2.0 * q;
            p.x *= iResolution.x/iResolution.y;
            vec2 st =  (p * vec2(.5, .01)+vec2(iTime)*0.05*speed)-vec2(q.y*cos(angle),0.0);
            st*= quantity;
            float f = noise(st) * noise(st*.773)* 1.55;
            f = clamp(pow(abs(f), 23.0) * 13.0, 0.0, q.y*.14) * 2.7;
            col += clamp(f,0.0,1.0)*color;
            gl_FragColor = vec4(col,1.0);
        }`

};
export { rainShader };
