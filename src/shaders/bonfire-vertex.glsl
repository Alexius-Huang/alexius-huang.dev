uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

void main() {
    float bonfireSparkHeight = .5;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += uTime * .1;
    modelPosition.y = mod(modelPosition.y, bonfireSparkHeight);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float sizeMultiplier = (1.0 - modelPosition.y / bonfireSparkHeight) * 10.0;
    gl_PointSize = uSize * uPixelRatio * sizeMultiplier;
    gl_PointSize /= -viewPosition.z;
}
