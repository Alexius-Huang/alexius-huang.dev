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

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400,
});

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
    wireframe: true
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = Math.PI / 2;
water.position.z = 1;
water.position.y = -.2;
scene.add(water);

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

/**
 * Animate
 */
const clock = new THREE.Clock();

renderer.setAnimationLoop(function animation() {
    const elapsedTime = clock.getElapsedTime();
    bgMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
});
