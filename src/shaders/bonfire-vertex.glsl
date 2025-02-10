uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

uniform float uSparkHeight;
uniform float uSparkSizeMultiplier;
uniform float uSparkSpeed;

attribute float aSpeedRandomness;
attribute vec3 aSparkXPositionRandomness;
attribute vec3 aSparkZPositionRandomness;

const float largestDistanceFromCenter = distance(vec2(.25, .25), vec2(.0));

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += uTime * ((uSparkSpeed / 100.0) + aSpeedRandomness);
    modelPosition.y = mod(modelPosition.y, uSparkHeight);

    float xPhase = aSparkXPositionRandomness.x;
    float xSpeed = aSparkXPositionRandomness.y;
    float xAmplitude = aSparkXPositionRandomness.z;
    modelPosition.x += xAmplitude * sin(uTime * xSpeed + xPhase);

    float zPhase = aSparkZPositionRandomness.x;
    float zSpeed = aSparkZPositionRandomness.y;
    float zAmplitude = aSparkZPositionRandomness.z;
    modelPosition.z += zAmplitude * cos(uTime * zSpeed + zPhase);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float scale = (1.0 - modelPosition.y / uSparkHeight) * uSparkSizeMultiplier;

    float distanceToCenter = distance(modelPosition.xz, vec2(.0));
    float attenuateFromDistance = 1.0 - (distanceToCenter / largestDistanceFromCenter);

    gl_PointSize = uSize * uPixelRatio * scale * attenuateFromDistance;
    gl_PointSize /= -viewPosition.z;
}
