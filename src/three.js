import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import vertexShader from "./shaders/vertex.glsl";
// import fragmentShader from "./shaders/fragment.glsl";
import { gsap } from "gsap";
import inView from "in-view";

// Debug
// const gui = new dat.GUI();

const loadDiv = document.querySelector(".loading-svg");

const modelPath = "/models/cupcake2.glb";
const colorCake = "/models/color-cupcake.glb";
const champagnePath = "/models/champ.glb";

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
const champColor = new THREE.Color(0xff95d6);

// Scene
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.Fog(pinkColor, 0.0025, 8);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
// camera.lookAt(0, 0, 0);

scene.add(camera);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// Material

const material = new THREE.MeshLambertMaterial({ color: pinkColor });

const materialChamp = new THREE.MeshLambertMaterial({ color: champColor });

// Model
const loadingManager = new THREE.LoadingManager(
  // loaded
  () => {
    loadDiv.classList.add("remove");

    window.setTimeout(() => {
      loadDiv.remove();
    }, 500);
  },
  // progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
  }
);
const gltfLoader = new GLTFLoader(loadingManager);

// color top cake

let topCake;

gltfLoader.load(
  colorCake,
  (gltf) => {
    const model = gltf.scene;

    model.scale.set(7, 7, 7);
    //position
    model.position.x = 0;
    model.position.y = -1.5;
    model.position.z = 1;
    model.rotation.x = 0.5;

    // model.traverse((o) => {
    //   if (o.isMesh) o.material = material;
    // });

    topCake = model;
    scene.add(model);
  },
  (progress) => {
    // console.log("Loading...");
  }
);

// champagne load

let champagneModel;
let champagneLight;

gltfLoader.load(
  champagnePath,
  (gltf) => {
    const model = gltf.scene;

    // model.scale.set();
    //position
    model.position.x = 0;
    model.position.y = -5;
    model.position.z = -2.3;
    // rotation
    model.rotation.z = 0.5;

    // model.traverse((o) => {
    //   if (o.isMesh) o.material = materialChamp;
    // });

    camera.add(model);
    champagneModel = model;
  },
  (progress) => {
    // console.log("Loading...");
  }
);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomIntMinMax(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let cupcakeModels = [];

// cupcake loop

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
      model.position.y = -(i + 3);
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
      // console.log("Loading...");
    }
  );
}

// Lights

const ambientLight = new THREE.AmbientLight(pinkColor, 1);
scene.add(ambientLight);

champagneLight = new THREE.PointLight("white", 3, 3, 1); // color, intensity, distance, decay
champagneLight.position.x = 0;
champagneLight.position.y = -5;
champagneLight.position.z = 0;

champagneLight.visible = false;

camera.add(champagneLight);

const cakelight = new THREE.PointLight("white", 3, 3, 1); // color, intensity, distance, decay
cakelight.position.x = 1;
cakelight.position.y = -0.5;
cakelight.position.z = 2;
scene.add(cakelight);

const directionalLight = new THREE.DirectionalLight(pinkColor, 0.3);
camera.add(directionalLight);

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
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let cupcakeSlow = {
  slow: false,
  speed: 0.03,
};

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

  topCake ? (topCake.rotation.y = topCake.rotation.y + cupcakeSlow.speed) : null;

  if (cupcakeSlow.slow == true) {
    cupcakeSlow.speed > 0.005 ? (cupcakeSlow.speed = cupcakeSlow.speed - 0.0005) : null;
  } else if (cupcakeSlow.slow == false) {
    cupcakeSlow.speed < 0.03 ? (cupcakeSlow.speed = cupcakeSlow.speed + 0.0005) : null;
  }

  // champagneLight ? (champagneLight.position.x = Math.sin(elapsedTime)) : null;
  // champagneLight ? (champagneLight.position.y = Math.sin(elapsedTime)) : null;

  champagneModel ? (champagneModel.rotation.y = 0.5 * elapsedTime) : null;

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

var mouseTolerance = 0.01;

function onMouseMove(e) {
  e.preventDefault();
  var centerX = window.innerWidth * 0.5;
  var centerY = window.innerHeight * 0.5;

  gsap.timeline().to(camera.rotation, { y: (-(e.clientX - centerX) / centerX) * 2 * mouseTolerance });
  gsap.timeline().to(camera.rotation, { x: (-(e.clientY - centerY) / centerX) * 2 * mouseTolerance });
  // gsap.timeline().to(camera.rotation, { z: ((e.clientX - centerX) / centerY) * mouseTolerance });
}

inView("footer")
  .on("enter", (el) => {
    gsap.to(champagneModel.position, { duration: 1.5, y: -0.2 });
    champagneLight.visible = true;
    gsap.to(champagneLight.position, { duration: 1.5, y: 0 });
  })
  .on("exit", (el) => {
    gsap.to(champagneModel.position, { duration: 1.5, y: -3 });
    champagneLight.visible = false;
    gsap.to(champagneLight.position, { duration: 1.5, y: -5 });
  });

inView(".cupcake")
  .on("enter", (el) => {
    cupcakeSlow.slow = true;
  })
  .on("exit", (el) => {
    cupcakeSlow.slow = false;
  });
