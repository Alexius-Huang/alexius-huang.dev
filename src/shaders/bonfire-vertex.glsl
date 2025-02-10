uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

uniform float uSparkHeight;
uniform float uSparkSizeMultiplier;
uniform float uSparkSpeed;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += uTime * (uSparkSpeed / 100.0);
    modelPosition.y = mod(modelPosition.y, uSparkHeight);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float scale = (1.0 - modelPosition.y / uSparkHeight) * uSparkSizeMultiplier;
    gl_PointSize = uSize * uPixelRatio * scale;
    gl_PointSize /= -viewPosition.z;
}
