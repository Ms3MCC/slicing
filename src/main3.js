
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// Setup a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(0, 0, 15);

// Setup the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(0, 0, 20);
scene.add(pointLight);

// Define geometries and materials
const geometries = {
  Sphere: new THREE.SphereGeometry(1, 32, 32),
  Box: new THREE.BoxGeometry(2, 2, 2),
  Cone: new THREE.ConeGeometry(1, 2, 32),
  Cylinder: new THREE.CylinderGeometry(1, 1, 2, 32),
  Torus: new THREE.TorusGeometry(1, 0.4, 32, 64),
  TorusKnot: new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
};

const material = new THREE.MeshPhysicalMaterial({
  color: 0x0088ff,
  roughness: 0.5,
  metalness: 0.8,
  clearcoat: 0.7,
  clearcoatRoughness: 0.1,
});

// List of mesh types
const meshTypes = ["Mesh", "InstancedMesh", "Wireframe", "Points"];
let currentShape = "Sphere";
let meshes = [];

// Function to create meshes
const createMeshesForShape = (shapeName) => {
  // Remove existing meshes
  meshes.forEach((mesh) => scene.remove(mesh));
  meshes = [];

  const geometry = geometries[shapeName];
  let xOffset = -12;

  meshTypes.forEach((type) => {
    let mesh;

    if (type === "Mesh") {
      mesh = new THREE.Mesh(geometry, material);
    } else if (type === "InstancedMesh") {
      const count = 10;
      mesh = new THREE.InstancedMesh(geometry, material, count);

      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    } else if (type === "Wireframe") {
      const wireframeGeometry = new THREE.WireframeGeometry(geometry);
      mesh = new THREE.LineSegments(wireframeGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
    } else if (type === "Points") {
      mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 }));
    }

    if (mesh) {
      mesh.position.x = xOffset; // Offset each mesh horizontally
      xOffset += 5;
      scene.add(mesh);
      meshes.push(mesh);
    }
  });
};

// Add Tweakpane controls
const pane = new Pane();
pane.element.style.width = "300px";

const params = { Shape: "Sphere", RotationSpeed: 0.01 };

// Dropdown to select shape
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

// Slider for rotation speed
pane.addBinding(params, "RotationSpeed", { min: 0, max: 0.1 });

// Material property controls
const materialFolder = pane.addFolder({ title: "Material Properties" });
materialFolder.addBinding(material, "roughness", { min: 0, max: 1 });
materialFolder.addBinding(material, "metalness", { min: 0, max: 1 });
materialFolder.addBinding(material, "clearcoat", { min: 0, max: 1 });
materialFolder.addBinding(material, "clearcoatRoughness", { min: 0, max: 1 });

// Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate meshes
  meshes.forEach((mesh) => {
    if (mesh.rotation) {
      mesh.rotation.x += params.RotationSpeed;
      mesh.rotation.y += params.RotationSpeed;
    }
  });

  renderer.render(scene, camera);
  controls.update();
}

// Initialize the scene
createMeshesForShape(currentShape);
animate();

// Adjust on window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
