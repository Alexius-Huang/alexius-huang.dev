precision mediump float;

varying float vScale;

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(.5));
    float strength = .1 / distanceToCenter - .2;
	gl_FragColor = vec4(1.0, 1.0, .2 + vScale * .5, strength);
}
