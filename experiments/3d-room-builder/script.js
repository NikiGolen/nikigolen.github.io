import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const sizePresets = {
  small: { width: 560, height: 440, readout: "14ft x 11ft", area: "154 sq ft", floorScale: { x: 7, z: 5.5 } },
  medium: { width: 720, height: 520, readout: "18ft x 13ft", area: "234 sq ft", floorScale: { x: 10, z: 8 } },
  large: { width: 880, height: 600, readout: "22ft x 15ft", area: "330 sq ft", floorScale: { x: 13, z: 9 } }
};

const catalogData = {
  title: "Inpatient Hospital Room Builder",
  desc: "Configure an inpatient clinical simulation space",
  headline: "Template Workspace: Inpatient Hospital Room",
  categories: [
    {
      categoryName: "Hospital Beds & Furnishing",
      items: [
        { sku: "PN-BED-101", label: "Patient Bed", sub: "Multi-position electric model", desc: "Full electric articulation with CPR release and nurse control panel.", icon: "bed", iconColor: "#0284c7", bg: "#e0f2fe", dims: [1.4, 0.7, 2.2], color: 0x0284c7 },
        { sku: "PN-REC-104", label: "3-Position Recliner", sub: "Clinical medical recliner with tray", desc: "Mobile medical recliner featuring multiple reclining positions, fold-down side tray, and rolling casters.", icon: "recliner", iconColor: "#3b82f6", bg: "#e0f2fe", dims: [0.8, 1.2, 1.0], color: 0x3b82f6 },
        { sku: "PN-CAB-202", label: "Bedside Cabinet", sub: "Rolling 3-drawer bedside unit", desc: "Laminate finish with solid core drawer boxes and integrated solid surface top.", icon: "cabinet", iconColor: "#b45309", bg: "#fef3c7", dims: [0.6, 0.8, 0.6], color: 0xd97706 },
     { sku: "PN-TBL-303", label: "Overbed Table", sub: "C-base rolling medical tray", desc: "Pneumatic height adjustment mechanism with vanity mirror attachment.", icon: "table", iconColor: "#b45309", bg: "#fef3c7", dims: [1.0, 0.9, 0.5], color: 0xd97706 }
      ]
    },
    {
      categoryName: "Wall Infrastructure & Safety",
      items: [
        { sku: "PN-WAL-401", label: "Medical Headwall", sub: "Integrated gas & electrical panel", desc: "Pre-piped and pre-wired modular clinical utility supply channel.", icon: "plug", iconColor: "#0284c7", bg: "#e0f2fe", dims: [1.4, 0.4, 0.04], color: 0xf8fafc, isWallItem: true },
  { sku: "PN-BIO-502", label: "Bio-Waste", sub: "Regulated wall sharp box", desc: "Locking wall bracket assembly with dual multi-quart puncture-resistant containers.", icon: "biohazard", iconColor: "#dc2626", bg: "#fee2e2", dims: [0.4, 0.5, 0.3], color: 0xdc2626, isWallItem: true },
      ]
    },
    {
      categoryName: "Simulators & Diagnostics",
      items: [
        { sku: "PN-SIM-601", label: "Adult Manikin", sub: "High-Fidelity Patient Simulator", desc: "Full-body wireless training manikin with palpable pulses and airway responses.", icon: "person", iconColor: "#475569", bg: "#f1f5f9", dims: [0.6, 0.4, 1.8], color: 0x64748b },
      { sku: "PN-IVP-702", label: "IV Pole", sub: "Mobile rolling infusion stand", desc: "Heavy weighted 4-leg base with 2-ram hook top configuration.", icon: "ivpole", iconColor: "#16a34a", bg: "#dcfce7", dims: [0.6, 1.8, 0.6], color: 0x64748b },
        { sku: "PN-POS-803", label: "Anatomical Poster", sub: "Skeletal system educational chart", desc: "Laminated full-color physiological breakdown reference diagram.", icon: "poster", iconColor: "#a16207", bg: "#fef08a", dims: [1.0, 1.2, 0.02], color: 0xfffbeb, isWallItem: true }
      ]
    }
  ]
};

const catalogList = document.getElementById('catalog-list');

const ICONS = {
  bed: '<path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"/><path d="M3 18h18"/><path d="M3 13V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4"/><path d="M3 21v-3"/><path d="M21 21v-3"/>',
  recliner: '<path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M5 11a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h1"/><path d="M19 11a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1"/><path d="M5 17v3"/><path d="M19 17v3"/><path d="M6 17h12"/>',
  cabinet: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="18" x2="16" y2="18"/>',
  table: '<rect x="4" y="4" width="16" height="3" rx="1"/><line x1="12" y1="7" x2="12" y2="20"/><line x1="7" y1="20" x2="17" y2="20"/>',
  plug: '<rect x="4" y="4" width="16" height="6" rx="1"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="16" y1="10" x2="16" y2="14"/>',
  biohazard: '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="6" r="2.2"/><circle cx="7" cy="15" r="2.2"/><circle cx="17" cy="15" r="2.2"/>',
  person: '<circle cx="12" cy="6" r="3"/><path d="M6 21v-4a6 6 0 0 1 12 0v4"/>',
  ivpole: '<line x1="12" y1="3" x2="12" y2="19"/><path d="M12 3c1.5 0 2.5 1 2.5 2"/><line x1="7" y1="21" x2="17" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/>',
  poster: '<rect x="5" y="3" width="14" height="18" rx="1"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>'
};

function renderIcon(key, color) {
  const inner = ICONS[key] || '';
  return `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

const sidebarTitle = document.getElementById('sidebar-title');
const sidebarDesc = document.getElementById('sidebar-desc');
const activeRoomTitle = document.getElementById('active-room-title');
const sizeSelect = document.getElementById('room-size-select');
const footprintDims = document.getElementById('footprint-dims');
const footprintArea = document.getElementById('footprint-area');

let scene, camera, renderer, floor, gridHelper, controls;
const spawnedObjects = [];
const cartItems = [];
let wallsData = {};

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();
let planeIntersectionPoint = new THREE.Vector3();
let selectedMesh = null;
const routingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

let actionOverlay = null;
let haloMesh = null;

function initializeWorkspace() {
  try {
    init3DSpace();
  } catch (err) {
    console.error("Error booting 3D space:", err);
  }

  try {
    load3DMenuCatalog();
  } catch (err) {
    console.error("Error loading menu catalog:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeWorkspace();

  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      updateRoomDimensions();
    });
  }

  const clearBtn = document.getElementById('clear-workspace');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      spawnedObjects.forEach(mesh => scene.remove(mesh));
      spawnedObjects.length = 0;
      cartItems.length = 0;
      selectedMesh = null;
      if (haloMesh) haloMesh.visible = false;
      if (actionOverlay) actionOverlay.style.display = 'none';
      updateCartUI();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!selectedMesh) return;
    if (e.key === 'r' || e.key === 'R') {
      performRotation(selectedMesh);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      removeSelectedItem();
    }
  });

  createActionOverlayUI();
  injectRightCartSidebar();
});

// --- CHANGED: cart is now appended inside .canvas-container (position: relative)
// instead of document.body, and uses position: absolute instead of fixed, so it
// no longer floats over the header/toolbar and stays scoped to the 3D view area.
function injectRightCartSidebar() {
  if (document.getElementById('right-cart-sidebar')) return;

  const container = document.querySelector('.canvas-container');
  if (!container) return;

  const cartSidebar = document.createElement('div');
  cartSidebar.id = 'right-cart-sidebar';
  cartSidebar.style.cssText = `
    position: absolute;
    right: 18px;
    top: 18px;
    width: 270px;
    max-height: calc(100% - 36px);
    background: #ffffff;
    border: 1px solid #eef1f6;
    border-radius: 14px;
    box-shadow: 0 16px 40px -12px rgba(15,23,42,0.18), 0 2px 8px rgba(15,23,42,0.06);
    z-index: 50;
    display: flex;
    flex-direction: column;
    font-family: inherit;
    backdrop-filter: blur(6px);
  `;

  cartSidebar.innerHTML = `
    <div style="padding: 16px 16px 14px 16px; border-bottom: 1px solid #eef1f6; background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%); border-top-left-radius: 14px; border-top-right-radius: 14px;">
      <h3 style="margin: 0; font-size: 0.9rem; color: #0f172a; font-weight: 700; letter-spacing: -0.01em;">Bill of Materials</h3>
      <p style="margin: 4px 0 0 0; font-size: 0.7rem; color: #94a3b8;">Active items in this layout</p>
    </div>
    <div id="cart-items-container" style="padding: 10px; overflow-y: auto; flex-grow: 1; max-height: 340px;">
      <p id="empty-cart-msg" style="color: #b0b8c4; font-size: 0.8rem; text-align: center; margin: 22px 0;">No items placed in room yet.</p>
    </div>
    <div style="padding: 14px 16px; border-top: 1px solid #eef1f6; background: #fbfcfe; border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;">
      <button id="submit-room-quote" style="width: 100%; background: #0284c7; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: background 0.15s ease;">Add Room Package to Cart</button>
    </div>
  `;
  container.appendChild(cartSidebar);
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `<p id="empty-cart-msg" style="color: #94a3b8; font-size: 0.85rem; text-align: center; margin: 24px 0;">No items placed in room yet.</p>`;
    return;
  }

  container.innerHTML = '';
  cartItems.forEach((cartEntry) => {
    const row = document.createElement('div');
    row.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 11px;
      margin-bottom: 7px;
      background: #f8fafc;
      border: 1px solid #eef1f6;
      border-radius: 8px;
      font-size: 0.82rem;
      transition: background 0.15s ease;
    `;
    row.innerHTML = `
      <div>
        <strong style="display: block; color: #1e293b;">${cartEntry.itemData.label}</strong>
        <span style="font-size: 0.7rem; color: #64748b;">SKU: ${cartEntry.itemData.sku}</span>
      </div>
      <button class="delete-cart-item" data-uuid="${cartEntry.uuid}" title="Remove Item" style="
        background: transparent;
        border: none;
        color: #ef4444;
        cursor: pointer;
        font-size: 1rem;
        padding: 4px;
      ">🗑️</button>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll('.delete-cart-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetUuid = e.currentTarget.getAttribute('data-uuid');
      removeMeshByUuid(targetUuid);
    });
  });
}

function removeMeshByUuid(uuid) {
  const foundEntry = cartItems.find(c => c.uuid === uuid);
  if (foundEntry && foundEntry.mesh) {
    scene.remove(foundEntry.mesh);
    const index = spawnedObjects.indexOf(foundEntry.mesh);
    if (index > -1) spawnedObjects.splice(index, 1);
  }
  const cartIdx = cartItems.findIndex(c => c.uuid === uuid);
  if (cartIdx > -1) cartItems.splice(cartIdx, 1);

  if (selectedMesh && selectedMesh.userData.uuid === uuid) {
    selectedMesh = null;
    if (haloMesh) haloMesh.visible = false;
    if (actionOverlay) actionOverlay.style.display = 'none';
  }
  updateCartUI();
}

function createActionOverlayUI() {
  actionOverlay = document.createElement('div');
  actionOverlay.id = 'item-action-overlay';
  actionOverlay.style.cssText = `
    position: absolute;
    display: none;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
    padding: 4px;
    border-radius: 9999px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.12);
    z-index: 100;
    gap: 4px;
    align-items: center;
    pointer-events: auto;
  `;

  actionOverlay.innerHTML = `
    <button id="overlay-rotate" title="Rotate 90°" style="background: transparent; color: #f8fafc; border: none; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;">🔄</button>
    <div style="width: 1px; height: 18px; background: rgba(255,255,255,0.2); margin: 0 2px;"></div>
    <button id="overlay-delete" title="Delete Item" style="background: transparent; color: #f87171; border: none; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;">🗑️</button>
  `;
  document.body.appendChild(actionOverlay);

  document.getElementById('overlay-rotate').addEventListener('click', (e) => {
    e.stopPropagation();
    if (selectedMesh) performRotation(selectedMesh);
  });

  document.getElementById('overlay-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    removeSelectedItem();
  });
}

function performRotation(mesh) {
  if (mesh.userData.isWallItem) {
    cycleWallAttachment(mesh);
  } else {
    mesh.rotation.y += Math.PI / 2;
  }
  updateHaloGeometry(mesh);
}

function removeSelectedItem() {
  if (!selectedMesh) return;
  const targetUuid = selectedMesh.userData.uuid;
  removeMeshByUuid(targetUuid);
}

function cycleWallAttachment(mesh) {
  const walls = ['back', 'right', 'front', 'left'];
  let currentWall = mesh.userData.wallName || 'back';
  let nextIdx = (walls.indexOf(currentWall) + 1) % walls.length;
  attachToWall(mesh, walls[nextIdx], mesh.userData.relativeX || 0);
}

function init3DSpace() {
  const container = document.getElementById('blueprint-canvas');
  if (!container) return;
  container.innerHTML = '';

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 12, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
  directionalLight.position.set(15, 25, 10);
  scene.add(directionalLight);

  const floorGeo = new THREE.BoxGeometry(1, 0.2, 1);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.05 });
  floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -0.1, 0);
  scene.add(floor);

  gridHelper = new THREE.GridHelper(1, 1, 0x1e3a8a, 0x93c5fd);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  const haloGeo = new THREE.RingGeometry(0.8, 0.9, 32);
  haloGeo.rotateX(-Math.PI / 2);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false });
  haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.renderOrder = 999;
  haloMesh.visible = false;
  scene.add(haloMesh);

  updateRoomDimensions();
  setupInteractionEvents(container);
  animate();

  // --- Keep the renderer/camera in sync with the container's actual size.
  // A ResizeObserver (rather than window 'resize') catches the container's
  // real size as soon as layout settles — including right after page load,
  // when flex/card layout can still be reflowing — preventing the aspect
  // ratio from locking in wrong and stretching the whole scene.
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w === 0 || h === 0 || !renderer || !camera) continue;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
  resizeObserver.observe(container);
}

function setupInteractionEvents(container) {
  container.addEventListener('pointerdown', (e) => {
    if (actionOverlay && actionOverlay.contains(e.target)) return;

    const bounds = container.getBoundingClientRect();
    mouseVector.x = ((e.clientX - bounds.left) / container.clientWidth) * 2 - 1;
    mouseVector.y = -((e.clientY - bounds.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouseVector, camera);
    const hits = raycaster.intersectObjects(spawnedObjects, true);

    if (hits.length > 0) {
      let obj = hits[0].object;
      while (obj.parent && obj.parent !== scene && !spawnedObjects.includes(obj)) {
        obj = obj.parent;
      }
      selectedMesh = spawnedObjects.includes(obj) ? obj : hits[0].object;
      controls.enabled = false;
      updateHaloGeometry(selectedMesh);
    } else {
      selectedMesh = null;
      if (haloMesh) haloMesh.visible = false;
      if (actionOverlay) actionOverlay.style.display = 'none';
    }
  });

  container.addEventListener('pointermove', (e) => {
    if (!selectedMesh) return;

    const bounds = container.getBoundingClientRect();
    mouseVector.x = ((e.clientX - bounds.left) / container.clientWidth) * 2 - 1;
    mouseVector.y = -((e.clientY - bounds.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouseVector, camera);

    if (selectedMesh.userData.isWallItem) {
      const wallName = selectedMesh.userData.wallName || 'back';
      const sizeConfig = sizePresets[sizeSelect ? sizeSelect.value : 'medium'];
      const halfX = sizeConfig.floorScale.x / 2 - 0.8;

      if (raycaster.ray.intersectPlane(routingPlane, planeIntersectionPoint)) {
        let relX = planeIntersectionPoint.x;
        if (wallName === 'left' || wallName === 'right') {
          relX = planeIntersectionPoint.z;
        }
        const clampedX = Math.max(-halfX, Math.min(halfX, relX));
        attachToWall(selectedMesh, wallName, Math.round(clampedX / 0.5) * 0.5);
      }
    } else {
      if (raycaster.ray.intersectPlane(routingPlane, planeIntersectionPoint)) {
        const sizeConfig = sizePresets[sizeSelect ? sizeSelect.value : 'medium'];
        const maxX = (sizeConfig.floorScale.x / 2) - 0.5;
        const maxZ = (sizeConfig.floorScale.z / 2) - 0.5;

        const clampedX = Math.max(-maxX, Math.min(maxX, planeIntersectionPoint.x));
        const clampedZ = Math.max(-maxZ, Math.min(maxZ, planeIntersectionPoint.z));

        selectedMesh.position.x = Math.round(clampedX / 0.5) * 0.5;
        selectedMesh.position.z = Math.round(clampedZ / 0.5) * 0.5;
      }
    }
    updateHaloGeometry(selectedMesh);
  });

  window.addEventListener('pointerup', () => {
    selectedMesh = null;
    if (controls) controls.enabled = true;
  });
}

function updateHaloGeometry(mesh) {
  if (!haloMesh || !mesh) return;
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.z, 0.8) * 0.75;

  haloMesh.scale.set(maxDim, 1, maxDim);
  haloMesh.position.set(mesh.position.x, 0.02, mesh.position.z);
  haloMesh.visible = true;
}

function attachToWall(mesh, wallName, relativeX) {
  const sizeConfig = sizePresets[sizeSelect ? sizeSelect.value : 'medium'];
  const halfX = sizeConfig.floorScale.x / 2;
  const halfZ = sizeConfig.floorScale.z / 2;
  const wallOffset = 0.02;

  mesh.userData.wallName = wallName;
  mesh.userData.relativeX = relativeX;
  mesh.rotation.set(0, 0, 0);

  if (wallName === 'back') {
    mesh.position.set(relativeX, 0, -halfZ + wallOffset);
    mesh.rotation.y = 0;
  } else if (wallName === 'front') {
    mesh.position.set(-relativeX, 0, halfZ - wallOffset);
    mesh.rotation.y = Math.PI;
  } else if (wallName === 'left') {
    mesh.position.set(-halfX + wallOffset, 0, relativeX);
    mesh.rotation.y = Math.PI / 2;
  } else if (wallName === 'right') {
    mesh.position.set(halfX - wallOffset, 0, -relativeX);
    mesh.rotation.y = -Math.PI / 2;
  }
}

function updateRoomWalls() {
  Object.values(wallsData).forEach(data => scene.remove(data.mesh));
  wallsData = {};

  const sizeConfig = sizePresets[sizeSelect ? sizeSelect.value : 'medium'];
  const halfX = sizeConfig.floorScale.x / 2;
  const halfZ = sizeConfig.floorScale.z / 2;
  const wallThickness = 0.2;
  const fullHeight = 3.2;

  const createWallMaterial = () => new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9, transparent: true, opacity: 1.0, side: THREE.DoubleSide });

  const backGeo = new THREE.BoxGeometry(sizeConfig.floorScale.x, fullHeight, wallThickness);
  const backWall = new THREE.Mesh(backGeo, createWallMaterial());
  backWall.position.set(0, fullHeight / 2, -halfZ - (wallThickness / 2));
  scene.add(backWall);
  wallsData.back = { mesh: backWall, normal: new THREE.Vector3(0, 0, -1) };

  const frontGeo = new THREE.BoxGeometry(sizeConfig.floorScale.x, fullHeight, wallThickness);
  const frontWall = new THREE.Mesh(frontGeo, createWallMaterial());
  frontWall.position.set(0, fullHeight / 2, halfZ + (wallThickness / 2));
  scene.add(frontWall);
  wallsData.front = { mesh: frontWall, normal: new THREE.Vector3(0, 0, 1) };

  const sideGeo = new THREE.BoxGeometry(wallThickness, fullHeight, sizeConfig.floorScale.z);
  const leftWall = new THREE.Mesh(sideGeo, createWallMaterial());
  leftWall.position.set(-halfX - (wallThickness / 2), fullHeight / 2, 0);
  scene.add(leftWall);
  wallsData.left = { mesh: leftWall, normal: new THREE.Vector3(-1, 0, 0) };

  const rightWall = new THREE.Mesh(sideGeo, createWallMaterial());
  rightWall.position.set(halfX + (wallThickness / 2), fullHeight / 2, 0);
  scene.add(rightWall);
  wallsData.right = { mesh: rightWall, normal: new THREE.Vector3(1, 0, 0) };
}

function updateRoomDimensions() {
  if (!floor || !gridHelper) return;
  const sizeConfig = sizePresets[sizeSelect ? sizeSelect.value : 'medium'];

  if (footprintDims) footprintDims.textContent = sizeConfig.readout;
  if (footprintArea) footprintArea.textContent = sizeConfig.area;

  floor.scale.set(sizeConfig.floorScale.x, 1, sizeConfig.floorScale.z);

  scene.remove(gridHelper);
  gridHelper = new THREE.GridHelper(Math.max(sizeConfig.floorScale.x, sizeConfig.floorScale.z), Math.max(sizeConfig.floorScale.x, sizeConfig.floorScale.z), 0x1e3a8a, 0x93c5fd);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);
  updateRoomWalls();
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();

  if (camera && Object.keys(wallsData).length > 0) {
    const cameraDir = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0, 0)).normalize();
    Object.values(wallsData).forEach(data => {
      const dot = cameraDir.dot(data.normal);
      const targetOpacity = dot > 0.05 ? 0.0 : 1.0;
      data.mesh.material.opacity += (targetOpacity - data.mesh.material.opacity) * 0.15;
      data.mesh.material.transparent = true;
      data.mesh.visible = data.mesh.material.opacity > 0.05;
    });
  }

  if (selectedMesh && haloMesh && haloMesh.visible && actionOverlay) {
    const tempV = new THREE.Vector3();
    selectedMesh.getWorldPosition(tempV);
    tempV.y += selectedMesh.userData.isWallItem ? 0.6 : 1.4;
    tempV.project(camera);

    const container = document.getElementById('blueprint-canvas');
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = (tempV.x *  .5 + .5) * rect.width;
      const y = (tempV.y * -.5 + .5) * rect.height;

      actionOverlay.style.display = 'flex';
      actionOverlay.style.left = `${rect.left + x - 40}px`;
      actionOverlay.style.top = `${rect.top + y - 46}px`;
    }
  } else if (actionOverlay) {
    actionOverlay.style.display = 'none';
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function load3DMenuCatalog() {
  const config = catalogData;

  if (sidebarTitle) sidebarTitle.textContent = config.title;
  if (sidebarDesc) sidebarDesc.textContent = config.desc;
  if (activeRoomTitle) activeRoomTitle.textContent = config.headline;

  if (!catalogList) return;
  catalogList.innerHTML = '';

  config.categories.forEach((cat) => {
    const catContainer = document.createElement('div');
    catContainer.style.cssText = `margin-bottom: 10px; border: 1px solid #eef1f6; border-radius: 10px; overflow: hidden; background: #ffffff;`;

    const catHeader = document.createElement('div');
    catHeader.style.cssText = `padding: 11px 14px; background: #fbfcfe; font-weight: 700; font-size: 0.82rem; color: #334155; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; letter-spacing: -0.01em;`;
    catHeader.innerHTML = `<span>${cat.categoryName}</span><span style="font-size: 0.7rem; color: #94a3b8; transition: transform 0.15s ease;">▼</span>`;

    const itemsBody = document.createElement('div');
    itemsBody.style.cssText = `padding: 8px; display: flex; flex-direction: column; gap: 7px; background: #ffffff;`;

    cat.items.forEach((item) => {
      const itemCard = document.createElement('div');
      itemCard.className = 'draggable-item';
      itemCard.style.cssText = `cursor: pointer; padding: 10px 11px; border-radius: 9px; border: 1px solid #eef1f6; background: ${item.bg}; transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease; display: flex; flex-direction: column; gap: 4px; box-sizing: border-box; width: 100%; overflow: hidden;`;
      itemCard.addEventListener('mouseenter', () => {
        itemCard.style.transform = 'translateY(-1px)';
        itemCard.style.boxShadow = '0 4px 12px rgba(15,23,42,0.08)';
      });
      itemCard.addEventListener('mouseleave', () => {
        itemCard.style.transform = 'translateY(0)';
        itemCard.style.boxShadow = 'none';
      });

      itemCard.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px; width: 100%;">
          <div style="width: 34px; height: 34px; border-radius: 9px; background: rgba(255,255,255,0.65); border: 1px solid rgba(15,23,42,0.06); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${renderIcon(item.icon, item.iconColor)}</div>
          <div style="display: flex; flex-direction: column; min-width: 0; flex-grow: 1; padding-top: 1px;">
            <strong style="font-size: 0.85rem; color: #0f172a; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.label}</strong>
            <span style="font-size: 0.7rem; color: #0284c7; font-weight: 600;">SKU: ${item.sku}</span>
          </div>
        </div>
        <p style="font-size: 0.7rem; color: #64748b; margin: 2px 0 0 0; line-height: 1.3; word-break: break-word;">${item.desc}</p>
      `;

      itemCard.addEventListener('click', () => {
        spawn3DObject(item);
      });
      itemsBody.appendChild(itemCard);
    });

    catHeader.addEventListener('click', () => {
      const isHidden = itemsBody.style.display === 'none';
      itemsBody.style.display = isHidden ? 'flex' : 'none';
      catHeader.querySelector('span:last-child').textContent = isHidden ? '▼' : '▶';
    });

    catContainer.appendChild(catHeader);
    catContainer.appendChild(itemsBody);
    catalogList.appendChild(catContainer);
  });
}

function spawn3DObject(itemData) {
  if (!scene) return;
  const group = new THREE.Group();
  const uniqueUuid = 'obj_' + Math.random().toString(36).substr(2, 9);
  group.userData.uuid = uniqueUuid;
  group.userData.isWallItem = itemData.isWallItem || false;

  if (itemData.label === "Patient Bed") {
    const baseGeo = new THREE.BoxGeometry(1.2, 0.15, 2.0);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const baseMesh = new THREE.Mesh(baseGeo, frameMat);
    baseMesh.position.y = 0.075;
    group.add(baseMesh);

    const mattressGeo = new THREE.BoxGeometry(1.3, 0.25, 2.1);
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 });
    const mattressMesh = new THREE.Mesh(mattressGeo, mattressMat);
    mattressMesh.position.y = 0.275;
    group.add(mattressMesh);

    const boardGeo = new THREE.BoxGeometry(1.35, 0.5, 0.1);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const headBoard = new THREE.Mesh(boardGeo, boardMat);
    headBoard.position.set(0, 0.375, -1.05);
    group.add(headBoard);
    const footBoard = new THREE.Mesh(boardGeo, boardMat);
    footBoard.position.set(0, 0.375, 1.05);
    group.add(footBoard);

  } else if (itemData.label === "3-Position Recliner") {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.5 });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 });
    const trayMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    [-0.4, 0.4].forEach(x => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 1.0), frameMat);
      arm.position.set(x, 0.5, 0);
      group.add(arm);
    });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.15, 0.8), cushionMat);
    seat.position.set(0, 0.45, 0);
    group.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.9, 0.15), cushionMat);
    backrest.position.set(0, 0.95, -0.38);
    backrest.rotation.x = -0.35;
    group.add(backrest);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16, Math.PI), blackMat);
    handle.position.set(0, 1.35, -0.45);
    group.add(handle);

    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.4), cushionMat);
    leg1.position.set(0, 0.32, 0.5);
    leg1.rotation.x = 0.5;
    group.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.35), cushionMat);
    leg2.position.set(0, 0.12, 0.75);
    leg2.rotation.x = 0.2;
    group.add(leg2);

    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.5), trayMat);
    tray.position.set(0, 0.72, 0.1);
    group.add(tray);

    [-0.38, 0.38].forEach(x => {
      [-0.45, 0.45].forEach(z => {
        const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), blackMat);
        caster.rotation.z = Math.PI / 2;
        caster.position.set(x, 0.04, z);
        group.add(caster);

        const legPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), frameMat);
        legPost.position.set(x, 0.22, z);
        group.add(legPost);
      });
    });

  } else if (itemData.label === "Bedside Cabinet") {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    const bodyGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const body = new THREE.Mesh(bodyGeo, woodMat);
    body.position.y = 0.42;
    group.add(body);

    for (let i = 0; i < 3; i++) {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.03), chromeMat);
      handle.position.set(0, 0.65 - (i * 0.22), 0.31);
      group.add(handle);
    }

    [-0.25, 0.25].forEach(x => {
      [-0.25, 0.25].forEach(z => {
        const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), blackMat);
        caster.rotation.z = Math.PI / 2;
        caster.position.set(x, 0.03, z);
        group.add(caster);
      });
    });

  } else if (itemData.label === "Overbed Table") {
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9, roughness: 0.1 });
    const topMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.5 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    const baseLeg = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.8), chromeMat);
    baseLeg.position.set(0, 0.025, 0.2);
    group.add(baseLeg);

    const column = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), chromeMat);
    column.position.set(0.3, 0.6, 0.2);
    group.add(column);

    const tabletop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.5), topMat);
    tabletop.position.set(-0.05, 1.15, 0);
    group.add(tabletop);

    [-0.3, 0.3].forEach(x => {
      [-0.2, 0.5].forEach(z => {
        const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 8), blackMat);
        caster.rotation.z = Math.PI / 2;
        caster.position.set(x, 0.02, z);
        group.add(caster);
      });
    });

  } else if (itemData.label === "Medical Headwall") {
    const panelGeo = new THREE.BoxGeometry(1.4, 0.4, 0.03);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 1.8, 0);
    group.add(panel);

    const portMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    [-0.4, -0.2, 0.2, 0.4].forEach(x => {
      const port = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16), portMat);
      port.rotation.x = Math.PI / 2;
      port.position.set(x, 1.8, 0.02);
      group.add(port);
    });

  } else if (itemData.label === "Bio-Waste") {
    const boxGeo = new THREE.BoxGeometry(0.4, 0.5, 0.3);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(0, 1.5, 0.15);
    group.add(box);

    const lidGeo = new THREE.BoxGeometry(0.42, 0.06, 0.32);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.set(0, 1.77, 0.15);
    group.add(lid);

  } else if (itemData.label === "Adult Manikin") {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b1, roughness: 0.8 });
    const scrubsMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.8 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), skinMat);
    head.position.set(0, 1.55, 0);
    group.add(head);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.18), scrubsMat);
    torso.position.set(0, 1.15, 0);
    group.add(torso);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), scrubsMat);
    leftArm.position.set(-0.22, 1.15, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), scrubsMat);
    rightArm.position.set(0.22, 1.15, 0);
    group.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.1), scrubsMat);
    leftLeg.position.set(-0.08, 0.65, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.1), scrubsMat);
    rightLeg.position.set(0.08, 0.65, 0);
    group.add(rightLeg);

    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), shoeMat);
    leftFoot.position.set(-0.08, 0.34, 0.04);
    group.add(leftFoot);

    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), shoeMat);
    rightFoot.position.set(0.08, 0.34, 0.04);
    group.add(rightFoot);

  } else if (itemData.label === "IV Pole") {
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.06), chromeMat);
      leg.position.set(Math.cos(angle) * 0.2, 0.02, Math.sin(angle) * 0.2);
      leg.rotation.y = angle;
      group.add(leg);

      const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 8), blackMat);
      caster.rotation.z = Math.PI / 2;
      caster.position.set(Math.cos(angle) * 0.38, 0.02, Math.sin(angle) * 0.38);
      group.add(caster);
    }

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 12), chromeMat);
    pole.position.y = 0.9;
    group.add(pole);

    for (let i = 0; i < 2; i++) {
      const hookAngle = i * Math.PI;
      const hookArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.02), chromeMat);
      hookArm.position.set(Math.cos(hookAngle) * 0.08, 1.78, Math.sin(hookAngle) * 0.08);
      group.add(hookArm);

      const hookTip = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8), chromeMat);
      hookTip.position.set(Math.cos(hookAngle) * 0.15, 1.74, Math.sin(hookAngle) * 0.15);
      group.add(hookTip);
    }

  } else if (itemData.label === "Anatomical Poster") {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const posterMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.9 });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.02), frameMat);
    frame.position.set(0, 1.8, 0);
    group.add(frame);

    const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.12, 0.025), posterMat);
    sheet.position.set(0, 1.8, 0.005);
    group.add(sheet);
  }

  if (itemData.isWallItem) {
    attachToWall(group, 'back', 0);
  } else {
    group.position.set(0, 0, 0);
  }

  scene.add(group);
  spawnedObjects.push(group);
  cartItems.push({ uuid: uniqueUuid, itemData: itemData, mesh: group });
  selectedMesh = group;
  updateHaloGeometry(group);
  updateCartUI();
}
