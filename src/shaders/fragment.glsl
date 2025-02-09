precision mediump float;

uniform sampler2D uBonFireLightTexture;
uniform sampler2D uBackgroundTexture;
uniform sampler2D uNoiseTexture;
uniform float uMixStrength;
uniform float uTime;
varying vec2 vUv;

void main() {
	vec4 bonFireLightenedColor = texture2D(uBonFireLightTexture, vUv);
	vec4 backgroundColor = texture2D(uBackgroundTexture, vUv);	

	float speed = uTime * .5;
	float mixStrength = .3 + texture2D(uNoiseTexture, vec2(speed, .2)).x * .7;
	vec3 mixedColor = mix(backgroundColor.rgb, bonFireLightenedColor.rgb, mixStrength);

	gl_FragColor = vec4(mixedColor, 1.0);
}
