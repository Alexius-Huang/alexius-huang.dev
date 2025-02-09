import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Dimension from './dimension';

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
const textureLoader = new THREE.TextureLoader();

const bgWithBonFireLightTexture = textureLoader.load('./baked-bg-with-bon-fire.webp');
bgWithBonFireLightTexture.flipY = false;
bgWithBonFireLightTexture.colorSpace = THREE.SRGBColorSpace;

const bgTexture = textureLoader.load('./baked-bg.webp');
bgTexture.flipY = false;
bgTexture.colorSpace = THREE.SRGBColorSpace;

const bgMaterial = new THREE.MeshBasicMaterial({ map: bgWithBonFireLightTexture });

// Draco loader
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
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial(),
// );

// scene.add(cube);

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

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
});
