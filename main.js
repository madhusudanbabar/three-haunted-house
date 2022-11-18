import {
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  WebGLRenderer,
  Group,
  BoxGeometry,
  ConeGeometry,
  DirectionalLight,
  SphereGeometry,
  PointLight,
  Fog,
} from "three";
import "./style.scss";

import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// variables
const canvas = document.querySelector("canvas.canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const wallDimensions = {
  width: 4,
  height: 2.5,
  depth: 4,
};

const gui = new dat.GUI();

const fog = new Fog("#262837", 1, 15);

// SCENE
let scene = new Scene();
scene.fog = fog;

// CAMERA
let camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;

// LIGHTS
// Ambient light
const ambientLight = new AmbientLight("#b9d5ff", 0.12);

let ambientLightControls = gui.addFolder("ambientLight");
ambientLightControls.add(ambientLight, "intensity").min(0).max(1).step(0.001);
ambientLightControls.add(ambientLight, "visible");

// moon light
let moonLight = new DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);

let moonLightControls = gui.addFolder("moonLight");
moonLightControls.add(moonLight.position, "x", -5, 5, 0.001);
moonLightControls.add(moonLight.position, "y", -5, 5, 0.001);
moonLightControls.add(moonLight.position, "z", -5, 5, 0.001);
moonLightControls.add(moonLight, "intensity").min(0).max(1).step(0.001);
moonLightControls.add(moonLight, "visible");

const doorLight = new PointLight("#ff7d46", 1, 7);
doorLight.position.z = wallDimensions.depth / 2 + 1;
doorLight.position.y = wallDimensions.height;

// RENDERER
let renderer = new WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor("#262837");

// OBJECTS
// floor
let floor = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshStandardMaterial({ color: "#a9c388" })
);
// floor.rotation.z = -87;
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;

// walls
let walls = new Mesh(
  new BoxGeometry(
    wallDimensions.width,
    wallDimensions.height,
    wallDimensions.depth
  ),
  new MeshStandardMaterial({ color: "#ac8e82" })
);
walls.position.y = wallDimensions.height / 2;

// roof
let roof = new Mesh(
  new ConeGeometry(3.5, 2, 4),
  new MeshStandardMaterial({
    color: "#b35f45",
  })
);
roof.position.y = wallDimensions.height + 1;
roof.rotation.y = -Math.PI * 0.25;

// door
let door = new Mesh(
  new PlaneGeometry(2, 2),
  new MeshStandardMaterial({
    color: "#aa7b7b",
  })
);
door.position.z = wallDimensions.depth / 2 + 0.001;
door.position.y = 1;

// bushes
let bushGeometry = new SphereGeometry(1, 16, 16);
let bushMaterial = new MeshStandardMaterial({ color: "#89c854" });

let bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

let bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

let bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.2, 2.2);

let bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

// graves
const graves = new Group();
const graveGeometry = new BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const grave = new Mesh(graveGeometry, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.set(x, 0.3, z);
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// house
let house = new Group();
house.add(walls, roof, door, bush1, bush2, bush3, bush4, graves, doorLight);

// HELPERS
// let floorControls = gui.addFolder("floorControls");
// floorControls.add(floor.rotation, "x", -180, 180, 1);
// floorControls.add(floor.rotation, "y", -180, 180, 1);
// floorControls.add(floor.rotation, "z", -180, 180, 1);
// @ts-ignore
let controls = new OrbitControls(camera, canvas);

// init scene
scene.add(ambientLight, moonLight, camera, floor, house);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// animation stuff
const tick = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(tick);
};

tick();
