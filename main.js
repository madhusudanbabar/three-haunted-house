import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import "./style.scss";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// variables
let canvas = document.querySelector("canvas.canvas");
let sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};
// scene
let scene = new Scene();

// objects
let cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({
    color: "cyan",
  })
);

scene.add(cube);

// renderer
let renderer = new WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

// cameras
let camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 7;

// helpers
let axisHelper = new AxesHelper(1);
scene.add(axisHelper);

let orbitControls = new OrbitControls(camera, canvas);

// scene.add(orbit Controls);

renderer.render(scene, camera);

// event handlers
let onMouseMove = (e) => {
  let rounds = 5;
  let posx = e.clientX;
  let posy = e.clientY;

  // console.log({ posx, posy });
  cube.rotation.y = Math.PI * 10 * (posx / sizes.width / rounds);
  renderer.render(scene, camera);
};

let onResizeHandler = (e) => {
  // update sizes object for future reference
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  // update camera aspect ratio and projectionMatrix
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer size and
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
};

// events
canvas.addEventListener("mousemove", onMouseMove);
window.addEventListener("resize", onResizeHandler);

function animate() {
  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();

  renderer.render(scene, camera);
}

animate();
