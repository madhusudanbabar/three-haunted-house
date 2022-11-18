import {
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  WebGLRenderer,
} from "three";
import "./style.scss";

// variables
const canvas = document.querySelector("canvas.canvas");
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// scene
let scene = new Scene();

// camera
let camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 25;

// lights
let ambientLight = new AmbientLight("white", 0.5);

// renderer
let renderer = new WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// objects
let floor = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshBasicMaterial({ color: "#a9c388" })
);

// init scene
scene.add(camera, floor);
renderer.render(scene, camera);
