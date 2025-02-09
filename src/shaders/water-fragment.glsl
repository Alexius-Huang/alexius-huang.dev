precision mediump float;

varying vec4 vNoise;

void main() {
	gl_FragColor = vec4(
        .15 + vNoise.x * .3 - .15,
        .2 + vNoise.x * .5 - .15,
        .5 + vNoise.x * .5 - .1,
        vNoise.x * .2 + .8
    );
}
