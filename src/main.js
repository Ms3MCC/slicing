import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { NURBSCurve } from 'three/addons/curves/NURBSCurve.js';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { NURBSVolume } from 'three/addons/curves/NURBSVolume.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';




// create a scene


const scene = new  THREE.Scene()
scene.background = new THREE.Color( 'black' );



//setup a camera

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,20000)
camera.position.set(0,0,20)

// setup the renderer and attach to canvas

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// add lights

const ambientLight = new THREE.AmbientLight(0x404040,100); // Ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff,100)
pointLight.position.set(0,0,20)
scene.add(pointLight)

//create your geometry etc

const group =new THREE.Group();
scene.add(group)


//box
const boxG = new THREE.BoxGeometry(4, 4, 4,8,8,8); 
const boxM = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxG, boxM);
box.rotation.y=-60

let wireframe = new THREE.WireframeGeometry(boxG);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black for edges
let wireframeLines = new THREE.LineSegments(wireframe, lineMaterial);
box.add(wireframeLines)
group.add(box);


// sphere

const sphereG = new THREE.SphereGeometry(2, 16, 16);
const sphereM = new THREE.MeshStandardMaterial({ color: 0xff0000,flatShading: true, });
const sphere = new THREE.Mesh(sphereG, sphereM);
sphere.position.x=-7
sphere.position.y=0

 wireframe = new THREE.WireframeGeometry(sphereG);
 wireframeLines = new THREE.LineSegments(wireframe, lineMaterial);
sphere.add(wireframeLines)
group.add(sphere);

// plane 
const planeG = new THREE.PlaneGeometry(5, 3);
const planeM = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeG, planeM);
plane.position.y = 4;
group.add(plane);

// circle

const circleG = new THREE.CircleGeometry(2, 32);
const circleM = new THREE.MeshBasicMaterial({ color: 0xffff00,side: THREE.DoubleSide });
const circle = new THREE.Mesh(circleG, circleM);
circle.position.x = -7;
circle.position.y = 4;
group.add(circle);

// cone

const coneG = new THREE.ConeGeometry(2, 4, 32);
const coneM = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const cone = new THREE.Mesh(coneG, coneM);
cone.position.x = -7;
cone.position.y=-5
cone.rotation.z=THREE.MathUtils.degToRad(180)
group.add(cone);

// cylinder

const cylinderG = new THREE.CylinderGeometry(2, 2, 4, 32);
const cylinderM = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const cylinder = new THREE.Mesh(cylinderG, cylinderM);
cylinder.position.y = -5;
cylinder.rotation.z=50
group.add(cylinder);

// torus
const torusG = new THREE.TorusGeometry(2, 0.5, 16, 100);
const torusM = new THREE.MeshBasicMaterial({ color: 0xff8800 });
const torus = new THREE.Mesh(torusG, torusM);
torus.position.x = 7;
group.add(torus);

// torus knot

const torusKnotG = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
const torusKnotM = new THREE.MeshBasicMaterial({ color: 0x8800ff });
const torusKnot = new THREE.Mesh(torusKnotG, torusKnotM);
torusKnot.position.x = 7;
torusKnot.position.y = 6;
group.add(torusKnot);

//dodecahedron

const dodecahedronG = new THREE.DodecahedronGeometry(2);
const dodecahedronM = new THREE.MeshBasicMaterial({ color: 0x444444 });
const dodecahedron = new THREE.Mesh(dodecahedronG, dodecahedronM);
dodecahedron.position.x = 13;
dodecahedron.position.y = -5;
group.add(dodecahedron);

// Icosahedron

const icosahedronG = new THREE.IcosahedronGeometry(2);
const icosahedronM = new THREE.MeshBasicMaterial({ color: 0x888888 });
const icosahedron = new THREE.Mesh(icosahedronG, icosahedronM);
icosahedron.position.x = 13;
group.add(icosahedron);

// Tetrahedron

const tetrahedronG = new THREE.TetrahedronGeometry(2);
const tetrahedronM = new THREE.MeshBasicMaterial({ color: 0xbbbbbb });
const tetrahedron = new THREE.Mesh(tetrahedronG, tetrahedronM);
tetrahedron.position.x = 13;
tetrahedron.position.y = 5;
group.add(tetrahedron);

//lathe

const points = [];
for (let i = 0; i < 10; i++) points.push(new THREE.Vector2(Math.sin(i * 0.2) * 1.5 + 0.5, i - 5));
const latheG = new THREE.LatheGeometry(points, 20);
const latheM = new THREE.MeshBasicMaterial({ color: 0x996600, side: THREE.DoubleSide });
const lathe = new THREE.Mesh(latheG, latheM);
lathe.position.x = -13;
group.add(lathe);

// Extrude Shape

const starShape = new THREE.Shape();
starShape.moveTo(0, 2);
for (let i = 0; i < 5; i++) {
  const angle = (i * 2 * Math.PI) / 5;
  const x = Math.cos(angle) * 2;
  const y = Math.sin(angle) * 2;
  starShape.lineTo(x, y);
  const innerAngle = angle + Math.PI / 5;
  const innerX = Math.cos(innerAngle) * 1;
  const innerY = Math.sin(innerAngle) * 1;
  starShape.lineTo(innerX, innerY);
}
starShape.closePath();

const extrudeSettings = {
  depth: 1,
  bevelEnabled: true,
  bevelThickness: 0.5,
  bevelSize: 0.2,
  bevelSegments: 5
};

const extrudeG = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
const extrudeM = new THREE.MeshBasicMaterial({ color: 0xff9900 });
const extrude = new THREE.Mesh(extrudeG, extrudeM);
extrude.position.y = 9;
group.add(extrude);

// parametric
const parametricFunction = (u, v, target) => {
  const x = Math.sin(u * Math.PI) * Math.cos(v * 2 * Math.PI);
  const y = Math.sin(u * Math.PI) * Math.sin(v * 2 * Math.PI);
  const z = Math.cos(u * Math.PI);
  target.set(x, y, z);
};


const parametricG = new ParametricGeometry(parametricFunction, 50, 50);
const parametricM = new THREE.MeshBasicMaterial({ color: 0xff5500, wireframe: true });
const parametric = new THREE.Mesh(parametricG, parametricM);


parametric.position.x=-7
parametric.position.y = 8;
scene.add(parametric);

// text

const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  // Create the text geometry
  const textG = new TextGeometry('Manan Sharma M$3', {
    font: font,
    size: 1,           // Height of the text
    height: 0.5,       // Depth of the text
    curveSegments: 12, // Number of segments for curves
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.02,
    bevelSegments: 5
  });

  // Create a material
  const textM = new THREE.MeshBasicMaterial({ color: 0x00ffcc });

  // Mesh for the text
  const textMesh = new THREE.Mesh(textG, textM);
  textMesh.position.y = -10;
  textMesh.position.x = -5;


  scene.add(textMesh);
});








//add orbit controls

const controls = new OrbitControls(camera,canvas)
controls.enableDamping=true
// controls.autoRotate=true

// add stats optional

//render a scene

renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);

  // Rotate the scene for better view

  // group.children.forEach((child) =>{
  //   if(child instanceof THREE.Mesh){
  //     child.rotation.y+=0.02
  //   }

  // })


  renderer.render(scene, camera);
  controls.update()
}

animate();


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});