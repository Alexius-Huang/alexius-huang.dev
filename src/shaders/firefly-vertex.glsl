uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

varying float vScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float speed = uTime * aScale * .5;
    modelPosition.y += sin(speed + aScale * 2.0) * aScale * .5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * uPixelRatio * (aScale + 1.0);
    gl_PointSize *= (1.0 / -(viewPosition.z));

    vScale = aScale;
}
