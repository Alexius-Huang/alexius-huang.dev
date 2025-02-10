import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Dimension from './dimension';
import TextureLoader from './texture-loader';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import waterVertexShader from './shaders/water-vertex.glsl';
import waterFragmentShader from './shaders/water-fragment.glsl';
import fireflyVertexShader from './shaders/firefly-vertex.glsl';
import fireflyFragmentShader from './shaders/firefly-fragment.glsl';
import bonfireVertexShader from './shaders/bonfire-vertex.glsl';
import bonfireFragmentShader from './shaders/bonfire-fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400,
});
// gui.hide();

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl');
if (!canvas) {
    throw new Error('Canvas not found!');
}

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new TextureLoader();

const bgWithBonFireLightTexture = textureLoader.load('./baked-bg-with-bon-fire.webp');
const bgTexture = textureLoader.load('./baked-bg.webp');
const noiseTexture = textureLoader.load('./perlin-noise.webp');
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

const bgMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uBonFireLightTexture: new THREE.Uniform(bgWithBonFireLightTexture),
        uBackgroundTexture: new THREE.Uniform(bgTexture),
        uNoiseTexture: new THREE.Uniform(noiseTexture),
        uMixStrength: new THREE.Uniform(.95),
        uTime: new THREE.Uniform(0)
    }
});

gui.add(bgMaterial.uniforms.uMixStrength, 'value')
    .min(0).max(1).step(.01);

// Draco loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('/scene.glb', gltf => {
    scene.add(gltf.scene);
    gltf.scene.traverse(child => {
        (child as THREE.Mesh).material = bgMaterial;
    })
});


/**
 * Object
 */
const waterGeometry = new THREE.PlaneGeometry(4 - .01, 2, 32, 16);
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uNoiseTexture: new THREE.Uniform(noiseTexture),
        uTime: new THREE.Uniform(0)
    },
    transparent: true
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = - Math.PI / 2;
water.position.z = 1;
water.position.y = -.2;
scene.add(water);

/**
 *  Bon Fire
 */
const bonfireGeometry = new THREE.BufferGeometry();
const bonfireParticleCount = 50;
const bonfirePositionArray = new Float32Array(bonfireParticleCount * 3);
for (let i = 0; i < bonfireParticleCount; i++) {
    const offset = i * 3;
    bonfirePositionArray[offset] = (Math.random() - .5) * .25;
    bonfirePositionArray[offset + 1] = Math.random() * .5 + .05;
    bonfirePositionArray[offset + 2] = (Math.random() - .5) * .25;
}
bonfireGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(bonfirePositionArray, 3)
);

const bonfireMaterial = new THREE.ShaderMaterial({
    vertexShader: bonfireVertexShader,
    fragmentShader: bonfireFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uSize: new THREE.Uniform(10),
        uPixelRatio: new THREE.Uniform(
            Math.min(window.devicePixelRatio, 2)
        )
    }
});
const bonFire = new THREE.Points(
    bonfireGeometry,
    bonfireMaterial
);
scene.add(bonFire);

/**
 *  Fireflies 
 */
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const firefliesPositionArray = new Float32Array(firefliesCount * 3);
const firefliesSizeScaleArray = new Float32Array(firefliesCount);
for (let i = 0; i < firefliesCount; i++) {
    const offset = i * 3;
    firefliesPositionArray[offset] = (Math.random() - .5) * 4;
    firefliesPositionArray[offset + 1] = Math.random() * 2 + .2;
    firefliesPositionArray[offset + 2] = (Math.random() - .5) * 4;

    firefliesSizeScaleArray[i] = Math.random();
}
firefliesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(firefliesPositionArray, 3)
);
firefliesGeometry.setAttribute(
    'aScale',
    new THREE.BufferAttribute(firefliesSizeScaleArray, 1)
);

const firefliesMaterial = new THREE.ShaderMaterial({
    vertexShader: fireflyVertexShader,
    fragmentShader: fireflyFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uPixelRatio: new THREE.Uniform(
            Math.min(window.devicePixelRatio, 2)
        ),
        uSize: new THREE.Uniform(50),
        uNoise: new THREE.Uniform(noiseTexture)
    },
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending
});

gui.add(firefliesMaterial.uniforms.uSize, 'value')
    .min(0).max(100).step(1).name('Firefly Size');

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

/**
 * Sizes
 */
const sizes = new Dimension();
sizes.onResize(([width, height]) => {
    // Update camera
    camera.aspect = sizes.aspectRatio;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update pixel ratio on firefly material
    firefliesMaterial.uniforms.uPixelRatio.value =
        Math.min(window.devicePixelRatio, 2)
    bonfireMaterial.uniforms.uPixelRatio.value =
        Math.min(window.devicePixelRatio, 2)
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.aspectRatio,
    0.1,
    100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#112');

/**
 * Animate
 */
const clock = new THREE.Clock();

renderer.setAnimationLoop(function animation() {
    const elapsedTime = clock.getElapsedTime();
    bgMaterial.uniforms.uTime.value = elapsedTime;
    waterMaterial.uniforms.uTime.value = elapsedTime;
    firefliesMaterial.uniforms.uTime.value = elapsedTime;
    bonfireMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
});
