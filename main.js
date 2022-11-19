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
  TextureLoader,
  Float32BufferAttribute,
  RepeatWrapping,
  Clock,
  PCFSoftShadowMap,
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

const textureLoader = new TextureLoader();

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

// TEXTURES
// door textures
const doorColorTexture = textureLoader.load("./static/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const doorAmbientTexture = textureLoader.load(
  "./static/textures/door/ambientOcclusion.jpg"
);
const doorMetalTexture = textureLoader.load(
  "./static/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./static/textures/door/roughness.jpg"
);
const doorNormalTexture = textureLoader.load(
  "./static/textures/door/normal.jpg"
);
const doorHeightTexture = textureLoader.load(
  "./static/textures/door/height.jpg"
);

// bricks texture
const bricksAoMap = textureLoader.load(
  "./static/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalMap = textureLoader.load(
  "./static/textures/bricks/normal.jpg"
);
const bricksColourMap = textureLoader.load(
  "./static/textures/bricks/color.jpg"
);
const bricksRoughnessMap = textureLoader.load(
  "./static/textures/bricks/roughness.jpg"
);

// floor texture
const grassColorMap = textureLoader.load("./static/textures/grass/color.jpg");
const grassNormalMap = textureLoader.load("./static/textures/grass/normal.jpg");
const grassAoMap = textureLoader.load(
  "./static/textures/grass/ambientOcclusion.jpg"
);
const grassRoughnessMap = textureLoader.load(
  "./static/textures/grass/roughness.jpg"
);

grassColorMap.repeat.set(8, 8);
grassColorMap.wrapS = RepeatWrapping;
grassColorMap.wrapT = RepeatWrapping;

grassNormalMap.repeat.set(8, 8);
grassNormalMap.wrapS = RepeatWrapping;
grassColorMap.wrapT = RepeatWrapping;

grassAoMap.repeat.set(8, 8);
grassAoMap.wrapS = RepeatWrapping;
grassAoMap.wrapT = RepeatWrapping;

grassRoughnessMap.repeat.set(8, 8);
grassRoughnessMap.wrapS = RepeatWrapping;
grassRoughnessMap.wrapT = RepeatWrapping;

// OBJECTS
// floor
let floor = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshStandardMaterial({
    map: grassColorMap,
    roughnessMap: grassRoughnessMap,
    aoMap: grassAoMap,
    normalMap: grassNormalMap,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
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
  new MeshStandardMaterial({
    map: bricksColourMap,
    roughnessMap: bricksRoughnessMap,
    normalMap: bricksNormalMap,
    aoMap: bricksAoMap,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
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
  new PlaneGeometry(2.2, 2.2, 100, 100),
  new MeshStandardMaterial({
    transparent: true,
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalTexture,
    roughnessMap: doorRoughnessTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
  })
);

door.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
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
  grave.castShadow = true;
  graves.add(grave);
}

// ghosts
const ghost1 = new PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new PointLight("#ffff00", 2, 3);
scene.add(ghost3);

// house
let house = new Group();
house.add(walls, roof, door, bush1, bush2, bush3, bush4, graves, doorLight);

// SHADOWS
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

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
const clock = new Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle) * 3;

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(ghost2Angle) * 4 + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime) * 0.32);
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime) * 0.5);
  ghost3.position.y = Math.sin(ghost3Angle) * 5 + Math.sin(elapsedTime * 2);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
