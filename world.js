// ========================================
// GALAXION INFINITY
// Mundo 3D de Verdália
// ========================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

let scene;
let camera;
let renderer;
let player;
let clock;

let keys = {};
let crystals = [];
let trees = [];

let velocityY = 0;
let isGrounded = true;
let mouseSensitivity = 0.002;

let yaw = 0;
let pitch = 0;

const WORLD_SIZE = 120;
const PLAYER_HEIGHT = 1.8;

const WORLD_COLORS = {
    sky: 0x07101f,
    ground: 0x183b2b,
    grass: 0x3c8c54,
    treeTrunk: 0x62452f,
    crystal: 0x55fff2
};

// ========================================
// CRIAR O MUNDO
// ========================================

export function createWorld(canvas) {
    scene = new THREE.Scene();

    scene.background = new THREE.Color(WORLD_COLORS.sky);
    scene.fog = new THREE.Fog(WORLD_COLORS.sky, 35, 140);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );

    camera.position.set(0, PLAYER_HEIGHT, 5);

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    clock = new THREE.Clock();

    createLights();
    createGround();
    createTrees();
    createCrystals();
    createPlayer();

    window.addEventListener("resize", resizeWorld);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);

    animate();

    return {
        scene,
        camera,
        renderer
    };
}

// ========================================
// ILUMINAÇÃO
// ========================================

function createLights() {
    const ambientLight = new THREE.HemisphereLight(
        0xc4e5ff,
        0x24402c,
        2
    );

    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(
        0x9aabff,
        2
    );

    moonLight.position.set(30, 50, 20);
    moonLight.castShadow = true;

    scene.add(moonLight);

    const blueLight = new THREE.PointLight(
        0x347bff,
        12,
        45
    );

    blueLight.position.set(-10, 8, -15);

    scene.add(blueLight);
}

// ========================================
// TERRENO
// ========================================

function createGround() {
    const geometry = new THREE.PlaneGeometry(
        WORLD_SIZE,
        WORLD_SIZE,
        50,
        50
    );

    geometry.rotateX(-Math.PI / 2);

    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);

        const distance = Math.sqrt(x * x + z * z);

        const height =
            Math.sin(x * 0.12) * 0.5 +
            Math.cos(z * 0.1) * 0.5 +
            Math.sin(distance * 0.08) * 0.25;

        positions.setY(i, height);
    }

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        color: WORLD_COLORS.ground,
        roughness: 0.95,
        metalness: 0
    });

    const ground = new THREE.Mesh(geometry, material);

    ground.receiveShadow = true;
    ground.position.y = -0.2;

    scene.add(ground);
}

// ========================================
// ÁRVORES
// ========================================

function createTrees() {
    const trunkGeometry = new THREE.CylinderGeometry(
        0.25,
        0.4,
        2.5,
        8
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: WORLD_COLORS.treeTrunk
    });

    const leavesGeometry = new THREE.SphereGeometry(
        1.5,
        8,
        8
    );

    const leavesMaterial = new THREE.MeshStandardMaterial({
        color: WORLD_COLORS.grass,
        roughness: 0.9
    });

    for (let i = 0; i < 90; i++) {
        const x = (Math.random() - 0.5) * WORLD_SIZE;
        const z = (Math.random() - 0.5) * WORLD_SIZE;

        // Deixa a região inicial livre para o jogador
        if (Math.abs(x) < 5 && Math.abs(z) < 5) {
            continue;
        }

        const tree = new THREE.Group();

        const trunk = new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

        trunk.position.y = 1.25;
        trunk.castShadow = true;

        const leaves = new THREE.Mesh(
            leavesGeometry,
            leavesMaterial
        );

        leaves.position.y = 3;
        leaves.scale.set(
            0.8 + Math.random() * 0.5,
            0.8 + Math.random() * 0.7,
            0.8 + Math.random() * 0.5
        );

        leaves.castShadow = true;

        tree.add(trunk);
        tree.add(leaves);

        tree.position.set(x, 0, z);

        scene.add(tree);
        trees.push(tree);
    }
}

// ========================================
// CRISTAIS COLETÁVEIS
// ========================================

function createCrystals() {
    const crystalGeometry = new THREE.OctahedronGeometry(0.65, 0);

    const crystalColors = [
        0x55fff2,
        0x55aaff,
        0xb86cff,
        0x42ff9b
    ];

    for (let i = 0; i < 25; i++) {
        const color = crystalColors[
            Math.floor(Math.random() * crystalColors.length)
        ];

        const material = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 1.5,
            metalness: 0.3,
            roughness: 0.25
        });

        const crystal = new THREE.Mesh(
            crystalGeometry,
            material
        );

        crystal.position.set(
            (Math.random() - 0.5) * 70,
            1,
            (Math.random() - 0.5) * 70
        );

        crystal.rotation.set(
            Math.random(),
            Math.random(),
            Math.random()
        );

        crystal.castShadow = true;

        crystal.userData = {
            collected: false,
            resourceId: chooseResource()
        };

        scene.add(crystal);
        crystals.push(crystal);
    }
}

function chooseResource() {
    const possibleResources = [
        "pedrinhas",
        "esmeraldas",
        "safiras",
        "ametistas",
        "opalas"
    ];

    return possibleResources[
        Math.floor(Math.random() * possibleResources.length)
    ];
}

// ========================================
// PERSONAGEM
// ========================================

function createPlayer() {
    const geometry = new THREE.CapsuleGeometry(
        0.45,
        0.9,
        4,
        8
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x61cfff,
        emissive: 0x102b55,
        roughness: 0.5
    });

    player = new THREE.Mesh(geometry, material);

    player.position.set(0, 1.1, 0);
    player.castShadow = true;

    scene.add(player);
}

// ========================================
// CONTROLES DO TECLADO
// ========================================

function onKeyDown(event) {
    keys[event.code] = true;
}

function onKeyUp(event) {
    keys[event.code] = false;
}

// ========================================
// CÂMERA COM O MOUSE
// ========================================

function onMouseMove(event) {
    if (document.pointerLockElement !== renderer?.domElement) {
        return;
    }

    yaw -= event.movementX * mouseSensitivity;
    pitch -= event.movementY * mouseSensitivity;

    pitch = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, pitch)
    );
}

// ========================================
// REDIMENSIONAR A TELA
// ========================================

function resizeWorld() {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}

// ========================================
// MOVIMENTAR O PERSONAGEM
// ========================================

function updatePlayer(delta) {
    if (!player || !camera) return;

    const direction = new THREE.Vector3();

    const forward = new THREE.Vector3(
        -Math.sin(yaw),
        0,
        -Math.cos(yaw)
    );

    const right = new THREE.Vector3(
        Math.cos(yaw),
        0,
        -Math.sin(yaw)
    );

    if (keys["KeyW"] || keys["ArrowUp"]) {
        direction.add(forward);
    }

    if (keys["KeyS"] || keys["ArrowDown"]) {
        direction.sub(forward);
    }

    if (keys["KeyD"] || keys["ArrowRight"]) {
        direction.add(right);
    }

    if (keys["KeyA"] || keys["ArrowLeft"]) {
        direction.sub(right);
    }

    if (direction.length() > 0) {
        direction.normalize();

        player.position.addScaledVector(
            direction,
            6 * delta
        );
    }

    // Pulo
    if (keys["Space"] && isGrounded) {
        velocityY = 7;
        isGrounded = false;
    }

    velocityY -= 18 * delta;
    player.position.y += velocityY * delta;

    if (player.position.y < 1.1) {
        player.position.y = 1.1;
        velocityY = 0;
        isGrounded = true;
    }

    // Limites do planeta
    player.position.x = THREE.MathUtils.clamp(
        player.position.x,
        -WORLD_SIZE / 2,
        WORLD_SIZE / 2
    );

    player.position.z = THREE.MathUtils.clamp(
        player.position.z,
        -WORLD_SIZE / 2,
        WORLD_SIZE / 2
    );

    // A câmera acompanha o jogador
    camera.position.set(
        player.position.x,
        player.position.y + 0.6,
        player.position.z
    );

    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
}

// ========================================
// ANIMAÇÃO DOS CRISTAIS
// ========================================

function updateCrystals(delta) {
    for (const crystal of crystals) {
        if (crystal.userData.collected) continue;

        crystal.rotation.y += delta;
        crystal.position.y =
            1 + Math.sin(performance.now() * 0.002 + crystal.position.x) * 0.2;
    }
}

// ========================================
// ANIMAÇÃO DO MUNDO
// ========================================

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    updatePlayer(delta);
    updateCrystals(delta);

    renderer.render(scene, camera);
}

// ========================================
// FUNÇÕES PARA O ARQUIVO main.js
// ========================================

export function getNearbyCrystal() {
    if (!player) return null;

    for (const crystal of crystals) {
        if (crystal.userData.collected) continue;

        const distance = player.position.distanceTo(
            crystal.position
        );

        if (distance < 3) {
            return crystal;
        }
    }

    return null;
}

export function collectCrystal(crystal) {
    if (!crystal || crystal.userData.collected) {
        return null;
    }

    crystal.userData.collected = true;

    scene.remove(crystal);

    const index = crystals.indexOf(crystal);

    if (index !== -1) {
        crystals.splice(index, 1);
    }

    return crystal.userData.resourceId;
}

export function enableMouseLook() {
    if (renderer?.domElement) {
        renderer.domElement.requestPointerLock();
    }
}

export function getPlayerPosition() {
    if (!player) return null;

    return player.position.clone();
}
