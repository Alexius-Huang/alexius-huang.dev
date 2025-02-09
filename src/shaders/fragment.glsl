precision mediump float;

uniform sampler2D uBonFireLightTexture;
uniform sampler2D uBackgroundTexture;
uniform float uMixStrength;
varying vec2 vUv;

void main() {
	vec4 bonFireLightenedColor = texture2D(uBonFireLightTexture, vUv);
	vec4 backgroundColor = texture2D(uBackgroundTexture, vUv);	
	vec3 mixedColor = mix(backgroundColor.rgb, bonFireLightenedColor.rgb, uMixStrength);

	gl_FragColor = vec4(mixedColor, 1.0);
}
