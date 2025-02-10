precision mediump float;

varying vec4 vPointPosition;

const float largestDistanceFromCenter = distance(vec2(.25, .25), vec2(.0));

void main() {
    float alpha = 1.0 - distance(vPointPosition.xz, vec2(.0)) / largestDistanceFromCenter;
	gl_FragColor = vec4(.8, .3, .2, alpha);
}
