import * as THREE from "three";

export default {
    bloom: { //自发光
        uniforms: {},
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,

        fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            varying vec2 vUv;
            void main() {
                gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
            }
        `,
    },

    mask: { //暗角
        uniforms: {
            "tDiffuse": {
                type: "t",
                value: new THREE.Color(0xffffff)
            },
            "maskColor": {
                type: "t",
                value: new THREE.Color(0x000000)
            },
            "maskAlpha": {
                type: "f",
                value: 1.0
            },
            "markRadius": {
                type: "f",
                value: 0.15
            },
            "smoothSize": {
                type: "f",
                value: 0.5
            }
        },
        vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,

        fragmentShader: `
                uniform float maskAlpha;
                uniform vec3 maskColor;
                uniform float markRadius;
                uniform float smoothSize;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;

                float sdfCircle(vec2 coord, vec2 center, float radius){
                    vec2 offset = coord - center;
                    return sqrt((offset.x * offset.x) + (offset.y * offset.y))- radius;
                }

                void main() {
                    vec4 texel = texture2D( tDiffuse, vUv );
                    float sdfValue = sdfCircle(vUv, vec2(0.5, 0.5), markRadius);
                    if (sdfValue < 0.0){
                        gl_FragColor = texel;
                    }else{
                        float a = smoothstep(0.0, smoothSize, sdfValue);
                        gl_FragColor = mix(texel, vec4(maskColor, maskAlpha), a);
                    }
                }
            `
    }
}