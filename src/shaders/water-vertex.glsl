uniform sampler2D uNoiseTexture;
uniform float uTime;

varying vec2 vUv;
varying vec4 vNoise;

void main() {
    float speed = uTime * .1;
    vec4 noise = texture2D(uNoiseTexture, vec2(uv.x - speed, uv.y));

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += (noise.x - .5) * .2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
    vNoise = noise;
}
