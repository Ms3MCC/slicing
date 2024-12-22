import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// Setup a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(0, 0, 12);

// Setup the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(0, 0, 12);
scene.add(pointLight);

// Define all geometries
const geometries = {
  Sphere: new THREE.SphereGeometry(1, 32, 32),
  Box: new THREE.BoxGeometry(2, 2, 2),
  Cone: new THREE.ConeGeometry(1, 2, 32),
  Cylinder: new THREE.CylinderGeometry(1, 1, 2, 32),
  Torus: new THREE.TorusGeometry(1, 0.4, 32, 64),
  TorusKnot: new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
};

// Common color for materials
const commonColor = 0x0088ff;

// Define all materials
const materials = {
  lambert: new THREE.MeshLambertMaterial({ color: commonColor }),
  standard: new THREE.MeshStandardMaterial({ color: commonColor, roughness: 0.8, metalness: 0.4 }),
  physical: new THREE.MeshPhysicalMaterial({
    color: commonColor,
    roughness: 0.5,
    metalness: 0.8,
    clearcoat: 0.7,
    clearcoatRoughness: 0.1,
  }),
  phong: new THREE.MeshPhongMaterial({ color: commonColor, shininess: 150 }),
};

// Create an object to manage meshes and current shape
let currentShape = "Sphere";
const meshes = [];

// Function to create meshes for the current shape
const createMeshesForShape = (shapeName) => {
  // Remove old meshes
  meshes.forEach(({ mesh }) => scene.remove(mesh));
  meshes.length = 0;

  let xOffset = -6;
  for (const key in materials) {
    const mesh = new THREE.Mesh(geometries[shapeName], materials[key]);
    mesh.position.x = xOffset; // Position each mesh horizontally
    xOffset += 6;
    scene.add(mesh);
    meshes.push({ mesh, material: materials[key] });
  }
};

// Add Tweakpane controls
const pane = new Pane();
pane.element.style.width = "250px";

// Dropdown to select shape
const params = { Shape: "Sphere", rotationSpeed: 0.01, rotate: true };
pane.addBinding(params, "Shape", {
  options: {
    Sphere: "Sphere",
    Box: "Box",
    Cone: "Cone",
    Cylinder: "Cylinder",
    Torus: "Torus",
    TorusKnot: "TorusKnot",
  },
}).on("change", (ev) => {
  currentShape = ev.value;
  createMeshesForShape(currentShape);
});

// Rotation speed slider
pane.addBinding(params, "rotationSpeed", { min: 0, max: 0.1, step: 0.001 }).on("change", (ev) => {
  rotationSpeed = ev.value;
});

// Toggle rotation checkbox
pane.addBinding(params, "rotate").on("change", (ev) => {
  rotationEnabled = ev.value;
});

// Helper to create folders for material properties
const createMaterialFolder = (name, material) => {
  const folder = pane.addFolder({ title: name });

  // Roughness
  if ("roughness" in material) {
    folder.addBinding(material, "roughness", { min: 0, max: 1 });
  }

  // Metalness
  if ("metalness" in material) {
    folder.addBinding(material, "metalness", { min: 0, max: 1 });
  }

  // Clearcoat
  if ("clearcoat" in material) {
    folder.addBinding(material, "clearcoat", { min: 0, max: 1 });
    folder.addBinding(material, "clearcoatRoughness", { min: 0, max: 1 });
  }

  // Shininess
  if ("shininess" in material) {
    folder.addBinding(material, "shininess", { min: 0, max: 200 });
  }
};

// Add folders for all materials
for (const key in materials) {
  createMaterialFolder(key, materials[key]);
}

// Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation loop
let rotationSpeed = 0.01;
let rotationEnabled = true;

function animate() {
  requestAnimationFrame(animate);

  // Rotate the meshes if rotation is enabled
  if (rotationEnabled) {
    meshes.forEach(({ mesh }) => {
      mesh.rotation.x += rotationSpeed;
      mesh.rotation.y += rotationSpeed;
    });
  }

  renderer.render(scene, camera);
  controls.update();
}

// Initialize with the first shape
createMeshesForShape(currentShape);
animate();

// Adjust scene on window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});






// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { Pane } from "tweakpane";

// // Create a scene
// const scene = new THREE.Scene();
// scene.background = new THREE.Color("black");

// // Setup a camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
// camera.position.set(0, 0, 12);

// // Setup the renderer
// const canvas = document.querySelector("canvas.threejs");
// const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // Add lights
// const ambientLight = new THREE.AmbientLight(0x404040, 5);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 500);
// pointLight.position.set(0, 0, 12);
// scene.add(pointLight);

// // Define all geometries
// const geometries = {
//   Sphere: new THREE.SphereGeometry(1, 32, 32),
//   Box: new THREE.BoxGeometry(2, 2, 2),
//   Cone: new THREE.ConeGeometry(1, 2, 32),
//   Cylinder: new THREE.CylinderGeometry(1, 1, 2, 32),
//   Torus: new THREE.TorusGeometry(1, 0.4, 32, 64),
//   TorusKnot: new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
// };

// // Common color for materials
// const commonColor = 0x0088ff;

// // Define all materials
// const materials = {
//   lambert: new THREE.MeshLambertMaterial({ color: commonColor }),
//   standard: new THREE.MeshStandardMaterial({ color: commonColor, roughness: 0.8, metalness: 0.4 }),
//   physical: new THREE.MeshPhysicalMaterial({
//     color: commonColor,
//     roughness: 0.5,
//     metalness: 0.8,
//     clearcoat: 0.7,
//     clearcoatRoughness: 0.1,
//   }),
//   phong: new THREE.MeshPhongMaterial({ color: commonColor, shininess: 150 }),
// };

// // Create an object to manage meshes and current shape
// let currentShape = "Sphere";
// const meshes = [];

// // Function to create meshes for the current shape
// const createMeshesForShape = (shapeName) => {
//   // Remove old meshes
//   meshes.forEach(({ mesh }) => scene.remove(mesh));
//   meshes.length = 0;

//   let xOffset = -6;
//   for (const key in materials) {
//     const mesh = new THREE.Mesh(geometries[shapeName], materials[key]);
//     mesh.position.x = xOffset; // Position each mesh horizontally
//     xOffset += 6;
//     scene.add(mesh);
//     meshes.push({ mesh, material: materials[key] });
//   }
// };

// // Add Tweakpane controls
// const pane = new Pane();
// pane.element.style.width = "250px";

// // Dropdown to select shape
// const params = { Shape: "Sphere" };
// pane.addBinding(params, "Shape", {
//   options: {
//     Sphere: "Sphere",
//     Box: "Box",
//     Cone: "Cone",
//     Cylinder: "Cylinder",
//     Torus: "Torus",
//     TorusKnot: "TorusKnot",
//   },
// }).on("change", (ev) => {
//   currentShape = ev.value;
//   createMeshesForShape(currentShape);
// });

// // Helper to create folders for material properties
// const createMaterialFolder = (name, material) => {
//   const folder = pane.addFolder({ title: name });

//   // Roughness
//   if ("roughness" in material) {
//     folder.addBinding(material, "roughness", { min: 0, max: 1 });
//   }

//   // Metalness
//   if ("metalness" in material) {
//     folder.addBinding(material, "metalness", { min: 0, max: 1 });
//   }

//   // Clearcoat
//   if ("clearcoat" in material) {
//     folder.addBinding(material, "clearcoat", { min: 0, max: 1 });
//     folder.addBinding(material, "clearcoatRoughness", { min: 0, max: 1 });
//   }

//   // Shininess
//   if ("shininess" in material) {
//     folder.addBinding(material, "shininess", { min: 0, max: 200 });
//   }
// };

// // Add folders for all materials
// for (const key in materials) {
//   createMaterialFolder(key, materials[key]);
// }

// // Orbit controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // Animation loop
// let rotationSpeed = 0.01;

// function animate() {
//   requestAnimationFrame(animate);

//   // Rotate the meshes
//   meshes.forEach(({ mesh }) => {
//     mesh.rotation.x += rotationSpeed;
//     mesh.rotation.y += rotationSpeed;
//   });

//   renderer.render(scene, camera);
//   controls.update();
// }

// // Initialize with the first shape
// createMeshesForShape(currentShape);
// animate();

// // Adjust scene on window resize
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });




// // import * as THREE from 'three';

// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// // import { Pane } from "tweakpane";

// // // Create a scene
// // const scene = new THREE.Scene();
// // scene.background = new THREE.Color('black');

// // // Setup a camera
// // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
// // camera.position.set(0, 0, 12);

// // // Setup the renderer and attach to canvas
// // const canvas = document.querySelector("canvas.threejs");
// // const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// // renderer.setSize(window.innerWidth, window.innerHeight);
// // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // // Add lights
// // const ambientLight = new THREE.AmbientLight(0x404040, 5); // Ambient light
// // scene.add(ambientLight);

// // const pointLight = new THREE.PointLight(0xffffff, 500);
// // pointLight.position.set(0, 0, 12);
// // scene.add(pointLight);

// // // Create your geometry
// // const geometry = new THREE.TorusKnotGeometry(1, 0.4, 128, 32);

// // // Common color for all materials
// // const commonColor = 0x0088ff;

// // // Materials with noticeable properties
// // const materials = {
// //   lambert: new THREE.MeshLambertMaterial({ color: commonColor }),
// //   standard: new THREE.MeshStandardMaterial({ color: commonColor, roughness: 0.8, metalness: 0.4 }),
// //   physical: new THREE.MeshPhysicalMaterial({
// //     color: commonColor,
// //     roughness: 0.5,
// //     metalness: 0.8,
// //     clearcoat: 0.7,
// //     clearcoatRoughness: 0.1,
// //   }),
// //   phong: new THREE.MeshPhongMaterial({ color: commonColor, shininess: 150 }),
// // };

// // const meshes = [];
// // let xOffset = -6;

// // for (const key in materials) {
// //   const mesh = new THREE.Mesh(geometry, materials[key]);
// //   mesh.position.x = xOffset; // Offset each mesh horizontally
// //   xOffset += 6;
// //   scene.add(mesh);
// //   meshes.push({ mesh, material: materials[key] });
// // }

// // // Add Tweakpane with increased size
// // const pane = new Pane();
// // // pane.element.style.width = "400px";
// // // pane.element.style.fontSize = "14px";
// // // pane.element.style.padding = "10px";
// // // pane.element.style.background = "#222";
// // // pane.element.style.color = "#fff";

// // // Helper to create folders for material properties
// // const createMaterialFolder = (name, material) => {
// //   const folder = pane.addFolder({ title: name });

// //   // Roughness
// //   if ("roughness" in material) {
// //     folder.addBinding(material, "roughness", { min: 0, max: 1 });
// //   }

// //   // Metalness
// //   if ("metalness" in material) {
// //     folder.addBinding(material, "metalness", { min: 0, max: 1 });
// //   }

// //   // Clearcoat
// //   if ("clearcoat" in material) {
// //     folder.addBinding(material, "clearcoat", { min: 0, max: 1 });
// //     folder.addBinding(material, "clearcoatRoughness", { min: 0, max: 1 });
// //   }

// //   // Shininess
// //   if ("shininess" in material) {
// //     folder.addBinding(material, "shininess", { min: 0, max: 200 });
// //   }
// // };

// // // Add material folders to Tweakpane
// // for (const key in materials) {
// //   createMaterialFolder(key, materials[key]);
// // }

// // // Animation
// // let rotationSpeed = 0.00;

// // // Add orbit controls
// // const controls = new OrbitControls(camera, canvas);
// // controls.enableDamping = true;

// // // Render a scene
// // function animate() {
// //   requestAnimationFrame(animate);

// //   // Rotate the meshes
// //   meshes.forEach(({ mesh }) => {
// //     mesh.rotation.x += rotationSpeed;
// //     mesh.rotation.y += rotationSpeed;
// //   });

// //   renderer.render(scene, camera);
// //   controls.update();
// // }

// // animate();

// // // Adjust scene on window resize
// // window.addEventListener('resize', () => {
// //   camera.aspect = window.innerWidth / window.innerHeight;
// //   camera.updateProjectionMatrix();
// //   renderer.setSize(window.innerWidth, window.innerHeight);
// // });










// // // import * as THREE from 'three';

// // // import Stats from 'three/addons/libs/stats.module.js';

// // // import { NURBSCurve } from 'three/addons/curves/NURBSCurve.js';
// // // import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
// // // import { NURBSVolume } from 'three/addons/curves/NURBSVolume.js';
// // // import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
// // // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// // // import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// // // import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// // // import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// // // import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// // // import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// // // import { color } from 'three/tsl';
// // // import { Pane } from "tweakpane";


// // // // create a scene


// // // const scene = new  THREE.Scene()
// // // scene.background = new THREE.Color( 'black' );



// // // //setup a camera

// // // const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,20000)
// // // camera.position.set(0,0,8)

// // // // setup the renderer and attach to canvas

// // // const canvas = document.querySelector("canvas.threejs");
// // // const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// // // renderer.setSize(window.innerWidth, window.innerHeight);
// // // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// // // // add lights

// // // const ambientLight = new THREE.AmbientLight(0x404040,100); // Ambient light
// // // scene.add(ambientLight);

// // // const pointLight = new THREE.PointLight(0xffffff,1000)
// // // pointLight.position.set(0,0,15)
// // // scene.add(pointLight)

// // // //create your geometry 

// // // const geometry = new THREE.TorusKnotGeometry(1, 0.4, 128, 32);

// // // // Materials
// // // const materials = {
// // //   basic: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
// // //   lambert: new THREE.MeshLambertMaterial({ color: 0xff0000 }),
// // //   standard: new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.5, metalness: 0.5 }),
// // //   physical: new THREE.MeshPhysicalMaterial({
// // //     color: 0xffff00,
// // //     roughness: 0.5,
// // //     metalness: 0.5,
// // //     clearcoat: 0.5,
// // //     clearcoatRoughness: 0.2,
// // //   }),
// // //   phong: new THREE.MeshPhongMaterial({ color: 0xff00ff, shininess: 100 }),
// // // };

// // // const meshes = [];
// // // let xOffset = -6;

// // // for (const key in materials) {
// // //   const mesh = new THREE.Mesh(geometry, materials[key]);
// // //   mesh.position.x = xOffset; // Offset each mesh horizontally
// // //   xOffset += 3;
// // //   scene.add(mesh);
// // //   meshes.push({ mesh, material: materials[key] });
// // // }


// // // const pane = new Pane();
// // // pane.addBinding({ rotationSpeed: 0.01 }, "rotationSpeed", { min: 0, max: 0.1 }).on("change", (e) => {
// // //   rotationSpeed = e.value;
// // // });

// // // const createMaterialFolder = (name, material) => {
// // //   const folder = pane.addFolder({ title: name });
// // //   folder.addBinding(material, "color", { view: "color" }).on("change", (e) => {
// // //     material.color.set(e.value);
// // //   });

// // //   if ("roughness" in material) {
// // //     folder.addBinding(material, "roughness", { min: 0, max: 1 });
// // //   }

// // //   if ("metalness" in material) {
// // //     folder.addBinding(material, "metalness", { min: 0, max: 1 });
// // //   }

// // //   if ("clearcoat" in material) {
// // //     folder.addBinding(material, "clearcoat", { min: 0, max: 1 });
// // //     folder.addBinding(material, "clearcoatRoughness", { min: 0, max: 1 });
// // //   }

// // //   if ("shininess" in material) {
// // //     folder.addBinding(material, "shininess", { min: 0, max: 200 });
// // //   }
// // // };

// // // // Add material folders to Tweakpane
// // // for (const key in materials) {
// // //   createMaterialFolder(key, materials[key]);
// // // }

// // // // Animation
// // // let rotationSpeed = 0.01;






// // // //add orbit controls

// // // const controls = new OrbitControls(camera,canvas)
// // // controls.enableDamping=true
// // // // controls.autoRotate=true

// // // // add stats optional

// // // //render a scene

// // // renderer.render(scene, camera);

// // // function animate() {
// // //   requestAnimationFrame(animate);

// // //   // Rotate the scene for better view

// // //   // group.children.forEach((child) =>{
// // //   //   if(child instanceof THREE.Mesh){
// // //   //     child.rotation.y+=0.02
// // //   //   }

// // //   // })
// // //   meshes.forEach(({ mesh }) => {
// // //     mesh.rotation.x += rotationSpeed;
// // //     mesh.rotation.y += rotationSpeed;
// // //   });


// // //   renderer.render(scene, camera);
// // //   controls.update()
// // // }

// // // animate();


// // // window.addEventListener('resize', () => {
// // //   camera.aspect = window.innerWidth / window.innerHeight;
// // //   camera.updateProjectionMatrix();
// // //   renderer.setSize(window.innerWidth, window.innerHeight);
// // // });