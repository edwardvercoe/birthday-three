import "./style.css";
import "./scss/main.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import vertexShader from "./shaders/vertex.glsl";
// import fragmentShader from "./shaders/fragment.glsl";
import { gsap } from "gsap";

// Debug
const gui = new dat.GUI();

const modelPath = "/models/cupcake.glb";

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

//
const pinkColor = new THREE.Color(0xffe2ee);

// Scene
const scene = new THREE.Scene();
scene.background = pinkColor;
scene.fog = new THREE.Fog(pinkColor, 0.0025, 10);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
// camera.lookAt(0, 0, 0);

scene.add(camera);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// Material

const material = new THREE.MeshLambertMaterial({ color: pinkColor });

// Model

const gltfLoader = new GLTFLoader();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomIntMinMax(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let cupcakeModels = [];

for (let i = 0; i < 20; i++) {
  // scale random
  let scaleRandom = randomIntMinMax(5, 7);
  // position random
  let posRandomX;
  let posRandomZ = randomIntMinMax(-3, 1);

  // if cupcake closer towards camera keep it horizontally closer inwards
  posRandomZ < 0 ? (posRandomX = randomIntMinMax(-3, 3)) : (posRandomX = randomIntMinMax(-1, 1));

  // rotation
  let rotateRandom = {
    x: getRandomInt(360),
    y: getRandomInt(360),
    z: getRandomInt(360),
  };
  gltfLoader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      // scale
      model.scale.set(scaleRandom, scaleRandom, scaleRandom);
      //position
      model.position.y = -(i + 1);
      model.position.z = posRandomZ;
      model.position.x = posRandomX;
      // rotate
      model.rotation.x = rotateRandom.x;
      model.rotation.y = rotateRandom.y;
      model.rotation.z = rotateRandom.z;

      model.traverse((o) => {
        if (o.isMesh) o.material = material;
      });

      cupcakeModels.push(model);

      scene.add(model);
    },
    (progress) => {
      console.log("Loading...");
    }
  );
}

// Lights

const ambientLight = new THREE.AmbientLight(pinkColor, 1);
scene.add(ambientLight);

const followLight = new THREE.PointLight(pinkColor, 0.3, 10, 1); // color, intensity, distance, decay
camera.add(followLight);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // material.uniforms.time.value = elapsedTime;

  // Update Orbital Controls
  // controls.update();

  for (const cupcake of cupcakeModels) {
    cupcake.rotation.y = 0.1 * elapsedTime;
    cupcake.rotation.x = 0.1 * elapsedTime;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.needsUpdate = true;
    }
  });
};

// CAMERA MOVEMENT

function updateCamera(ev) {
  let wrapper = document.getElementById("wrapper");
  camera.position.y = 0 - window.scrollY / 500.0;
  // camera.position.z = 10 - window.scrollY / 500.0;
}

window.addEventListener("scroll", updateCamera);

window.addEventListener("mousemove", onMouseMove);

var mouseTolerance = 0.1;

function onMouseMove(e) {
  e.preventDefault();
  var centerX = window.innerWidth * 0.5;
  var centerY = window.innerHeight * 0.5;

  gsap.timeline().to(camera.rotation, { y: (-(e.clientX - centerX) / centerX) * 2 * mouseTolerance });
  gsap.timeline().to(camera.rotation, { x: (-(e.clientY - centerY) / centerX) * 2 * mouseTolerance });
  // gsap.timeline().to(camera.rotation, { z: ((e.clientX - centerX) / centerY) * mouseTolerance });
}
