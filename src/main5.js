import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import {
  SUBTRACTION,
  ADDITION,
  INTERSECTION,
  REVERSE_SUBTRACTION,
  DIFFERENCE,
  HOLLOW_SUBTRACTION,
  HOLLOW_INTERSECTION,
  Brush,
  Evaluator,
} from "three-bvh-csg";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// Setup a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(0, 0, 5);

// Setup the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 50);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

// Create initial geometry brushes
let brush1 = new Brush(new THREE.SphereGeometry());
brush1.updateMatrixWorld();
let brush2 = new Brush(new THREE.BoxGeometry());
brush2.position.x = 0.4;
brush2.updateMatrixWorld();
// Function to create brush geometries
function createBrush(geometryType) {
  let geometry;
  switch (geometryType) {
    case "Sphere":
      geometry = new THREE.SphereGeometry();
      break;
    case "Box":
      geometry = new THREE.BoxGeometry();
      break;
    case "Cylinder":
      geometry = new THREE.CylinderGeometry(1, 1, 2);
      break;
    case "Cone":
      geometry = new THREE.ConeGeometry(1, 2);
      break;
    case "Torus":
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
      break;
    case "TorusKnot":
      geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
      break;
    default:
      geometry = new THREE.SphereGeometry(); // Default geometry
  }
  return new Brush(geometry);
}

// Perform initial CSG operation
const evaluator = new Evaluator();
let operation = SUBTRACTION;
let result = evaluator.evaluate(brush1, brush2, operation);

// Create a mesh for the result
const material = new THREE.MeshStandardMaterial({ color: 0x0088ff, roughness: 0.8, metalness: 0.6 });
const resultMesh = new THREE.Mesh(result.geometry, material);
scene.add(resultMesh);

// Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Create a Tweakpane instance
const pane = new Pane();
pane.element.style.width = "250px";

// Parameters object
const params = {
  operation: "SUBTRACTION", // Default operation as a string
  brush1Geometry: "Sphere", // Default brush1 geometry
  brush2Geometry: "Box",   // Default brush2 geometry
};

// Mapping of operation names to constants
const operationMap = {
  SUBTRACTION: SUBTRACTION,
  ADDITION: ADDITION,
  INTERSECTION: INTERSECTION,
  REVERSE_SUBTRACTION: REVERSE_SUBTRACTION,
  DIFFERENCE: DIFFERENCE,
  HOLLOW_SUBTRACTION: HOLLOW_SUBTRACTION,
  HOLLOW_INTERSECTION: HOLLOW_INTERSECTION,
};

// // Add a dropdown to select CSG operation
// pane
//   .addBinding(params, "operation", {
//     options: {
//       Subtraction: "SUBTRACTION",
//       Addition: "ADDITION",
//       Intersection: "INTERSECTION",
//       "Reverse Subtraction": "REVERSE_SUBTRACTION",
//       Difference: "DIFFERENCE",
//       "Hollow Subtraction": "HOLLOW_SUBTRACTION",
//       "Hollow Intersection": "HOLLOW_INTERSECTION",
//     },
//   })
//   .on("change", (ev) => {
//     console.log("Selected operation:", ev.value);
//     const selectedOperation = ev.value;

//      operation = operationMap[selectedOperation];

//     // Update the CSG operation and re-render geometry
//     updateCSG(operation);
//   });

// Add dropdowns to select geometries for both brushes
pane
  .addBinding(params, "brush1Geometry", {
    options: {
      Sphere: "Sphere",
      Box: "Box",
      Cylinder: "Cylinder",
      Cone: "Cone",
      Torus: "Torus",
      TorusKnot: "TorusKnot",
    },
  })
  .on("change", (ev) => {
    console.log("Selected Brush1 Geometry:", ev.value);
    brush1 = createBrush(ev.value); // Update brush1 geometry
    brush1.updateMatrixWorld();
    updateCSG(operation); // Recompute the result with updated brush1
  });

pane
  .addBinding(params, "brush2Geometry", {
    options: {
      Sphere: "Sphere",
      Box: "Box",
      Cylinder: "Cylinder",
      Cone: "Cone",
      Torus: "Torus",
      TorusKnot: "TorusKnot",
    },
  })
  .on("change", (ev) => {
    console.log("Selected Brush2 Geometry:", ev.value);
    brush2 = createBrush(ev.value); // Update brush2 geometry
    brush2.position.x = 0.4; // Reset position for brush2
    brush2.updateMatrixWorld();
    updateCSG(operation); // Recompute the result with updated brush2
  });


  // Add a dropdown to select CSG operation
pane
.addBinding(params, "operation", {
  options: {
    Subtraction: "SUBTRACTION",
    Addition: "ADDITION",
    Intersection: "INTERSECTION",
    "Reverse Subtraction": "REVERSE_SUBTRACTION",
    Difference: "DIFFERENCE",
    "Hollow Subtraction": "HOLLOW_SUBTRACTION",
    "Hollow Intersection": "HOLLOW_INTERSECTION",
  },
})
.on("change", (ev) => {
  console.log("Selected operation:", ev.value);
  const selectedOperation = ev.value;

   operation = operationMap[selectedOperation];

  // Update the CSG operation and re-render geometry
  updateCSG(operation);
});

// Function to update the CSG operation
function updateCSG(operation) {
  const newResult = evaluator.evaluate(brush1, brush2, operation);

  // Dispose of old geometry and update the result mesh
  resultMesh.geometry.dispose();
  resultMesh.geometry = newResult.geometry;

//   brush1.updateMatrixWorld();
//   brush2.updateMatrixWorld();
}

pane.addBinding(material, 'roughness', {
    min: 0,
    max: 1,
    step: 0.01,
  });

  pane.addBinding(material, 'metalness', {
    min: 0,
    max: 1,
    step: 0.01,
  });

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();

// Adjust scene on window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
