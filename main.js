import { MeshBasicMaterial, PlaneBufferGeometry, Mesh } from "three";
import "./style.scss";

let floor = new Mesh(
  new PlaneBufferGeometry(20, 20),
  new MeshBasicMaterial({ color: "#a9c388" })
);

console.log(floor);
