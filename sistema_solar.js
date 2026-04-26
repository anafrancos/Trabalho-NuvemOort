import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// CONFIGURAÇÃO DA CENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010118);
scene.fog = new THREE.FogExp2(0x010118, 0.00005);

// CÂMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 60);
camera.lookAt(0, 0, 0);

// RENDERIZADORES
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// CONTROLES DE ÓRBITA
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 0, 0);

// DADOS DOS PLANETAS 
const planetsData = [
    { name: 'Mercúrio', color: 0xbc9a6c, size: 0.38, distance: 4.2, speed: 0.025, emissive: 0x332200 },
    { name: 'Vênus',   color: 0xe6b800, size: 0.45, distance: 5.8, speed: 0.018, emissive: 0x442200 },
    { name: 'Terra',   color: 0x2e86c1, size: 0.48, distance: 7.5, speed: 0.015, emissive: 0x001133 },
    { name: 'Marte',   color: 0xc4553c, size: 0.42, distance: 9.2, speed: 0.012, emissive: 0x331100 },
    { name: 'Júpiter', color: 0xd8a27a, size: 1.05, distance: 13.5, speed: 0.007, emissive: 0x442200 },
    { name: 'Saturno', color: 0xf0d9b0, size: 0.92, distance: 16.5, speed: 0.0055, emissive: 0x332200, hasRing: true },
    { name: 'Urano',   color: 0xb0e0e6, size: 0.78, distance: 19.8, speed: 0.004, emissive: 0x114455 },
    { name: 'Netuno',  color: 0x4169e1, size: 0.76, distance: 23.2, speed: 0.0032, emissive: 0x001144 }
];

const planets = [];
const orbits = [];

// CRIAÇÃO DO SOL
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(2.2, 128, 128);
    const sunMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffaa55, 
        emissive: 0xff4411, 
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.4
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.castShadow = false;
    sunMesh.receiveShadow = false;
    scene.add(sunMesh);
    
    // Brilho do Sol
    const sunGlowGeometry = new THREE.SphereGeometry(2.4, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xff8833, transparent: true, opacity: 0.15 });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);
    
    // Label do Sol
    const sunDiv = document.createElement('div');
    sunDiv.textContent = 'SOL';
    sunDiv.style.color = '#ffaa44';
    sunDiv.style.fontSize = '18px';
    sunDiv.style.fontWeight = 'bold';
    sunDiv.style.textShadow = '0 0 8px orange';
    const sunLabel = new CSS2DObject(sunDiv);
    sunLabel.position.set(0, 2.5, 0);
    scene.add(sunLabel);
    
    return { sunMesh, sunGlow };
}

// CRIAÇÃO DOS PLANETAS
function createPlanets() {
    planetsData.forEach((data) => {
        // Geometria do planeta
        const geometry = new THREE.SphereGeometry(data.size, 96, 96);
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.5,
            metalness: 0.3,
            emissive: data.emissive,
            emissiveIntensity: 0.1
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = false;
        
        // Ângulo inicial aleatório
        const angle = Math.random() * Math.PI * 2;
        planet.position.x = Math.cos(angle) * data.distance;
        planet.position.z = Math.sin(angle) * data.distance;
        
        scene.add(planet);
        
        // Adicionar anel para Saturno
        let ring = null;
        if (data.hasRing) {
            const ringGeometry = new THREE.TorusGeometry(data.size * 1.3, 0.25, 32, 200);
            const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xcbb88e, emissive: 0x442200, side: THREE.DoubleSide });
            ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2.2;
            planet.add(ring);
        }
        
        // Label do planeta
        const div = document.createElement('div');
        div.textContent = data.name;
        div.style.color = '#fff';
        div.style.fontSize = '12px';
        div.style.backgroundColor = 'rgba(0,0,0,0.6)';
        div.style.padding = '2px 6px';
        div.style.borderRadius = '12px';
        div.style.border = `1px solid ${new THREE.Color(data.color).getStyle()}`;
        div.style.fontFamily = 'sans-serif';
        div.style.pointerEvents = 'none';
        const label = new CSS2DObject(div);
        label.position.set(0, data.size + 0.4, 0);
        planet.add(label);
        
        // Guardar dados para animação
        planets.push({
            mesh: planet,
            distance: data.distance,
            speed: data.speed,
            angle: angle,
            ring: ring,
            name: data.name
        });
        
        // Criar linha da órbita
        const orbitPoints = [];
        const orbitRadius = data.distance;
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const x = Math.cos(theta) * orbitRadius;
            const z = Math.sin(theta) * orbitRadius;
            orbitPoints.push(new THREE.Vector3(x, 0, z));
        }
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x4488aa, transparent: true, opacity: 0.35 });
        const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbits.push(orbitLine);
    });
}

// CRIAÇÃO DA NUVEM DE OORT
function createOortCloud() {
    // Camada interna da Nuvem de Oort
    const oortCount = 8000;
    const oortGeometry = new THREE.BufferGeometry();
    const oortPositions = new Float32Array(oortCount * 3);
    const oortColors = new Float32Array(oortCount * 3);
    
    for (let i = 0; i < oortCount; i++) {
        const radius = 42 + Math.random() * 28;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
        const z = radius * Math.cos(phi);
        
        oortPositions[i*3] = x;
        oortPositions[i*3+1] = y * 0.8;
        oortPositions[i*3+2] = z;
        
        oortColors[i*3] = 0.5 + Math.random() * 0.4;
        oortColors[i*3+1] = 0.6 + Math.random() * 0.3;
        oortColors[i*3+2] = 0.8 + Math.random() * 0.2;
    }
    
    oortGeometry.setAttribute('position', new THREE.BufferAttribute(oortPositions, 3));
    oortGeometry.setAttribute('color', new THREE.BufferAttribute(oortColors, 3));
    
    const oortMaterialPoints = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const oortCloud = new THREE.Points(oortGeometry, oortMaterialPoints);
    scene.add(oortCloud);
    
    // Camada externa da Nuvem de Oort
    const oortOuterCount = 4000;
    const oortOuterGeometry = new THREE.BufferGeometry();
    const outerPositions = new Float32Array(oortOuterCount * 3);
    for (let i = 0; i < oortOuterCount; i++) {
        const radius = 65 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        const z = radius * Math.cos(phi);
        outerPositions[i*3] = x;
        outerPositions[i*3+1] = y;
        outerPositions[i*3+2] = z;
    }
    oortOuterGeometry.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
    const oortOuterPoints = new THREE.Points(oortOuterGeometry, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.06, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
    scene.add(oortOuterPoints);
    
    return { oortCloud, oortOuterPoints };
}

// CRIAÇÃO DE ELEMENTOS ADICIONAIS
function createAdditionalElements() {
    // Cinturão de asteroides
    const asteroidCount = 1800;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount; i++) {
        const r = 10.5 + Math.random() * 2.8;
        const angle = Math.random() * Math.PI * 2;
        const yOff = (Math.random() - 0.5) * 1.2;
        asteroidPositions[i*3] = Math.cos(angle) * r;
        asteroidPositions[i*3+1] = yOff;
        asteroidPositions[i*3+2] = Math.sin(angle) * r;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    const asteroidMat = new THREE.PointsMaterial({ color: 0xaa8866, size: 0.05 });
    const asteroidField = new THREE.Points(asteroidGeo, asteroidMat);
    scene.add(asteroidField);
    
    // Poeira estelar
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
        dustPositions[i*3] = (Math.random() - 0.5) * 100;
        dustPositions[i*3+1] = (Math.random() - 0.5) * 40;
        dustPositions[i*3+2] = (Math.random() - 0.5) * 80;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.03, transparent: true, opacity: 0.3 });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);
    
    return { asteroidField, dustField };
}

// CRIAÇÃO DAS ESTRELAS DE FUNDO
function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i*3] = (Math.random() - 0.5) * 800;
        starPositions[i*3+1] = (Math.random() - 0.5) * 400;
        starPositions[i*3+2] = (Math.random() - 0.5) * 200 - 80;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    return stars;
}

// CONFIGURAÇÃO DE ILUMINAÇÃO
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffaa66, 2, 0, 2);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    
    const fillLight = new THREE.DirectionalLight(0x4466cc, 0.3);
    fillLight.position.set(1, 1, 1);
    scene.add(fillLight);
    
    const backLight = new THREE.DirectionalLight(0xffaa88, 0.2);
    backLight.position.set(-1, -1, -0.5);
    scene.add(backLight);
}

// ANIMAÇÃO DOS PLANETAS 
function animatePlanets(time) {
    planets.forEach(planet => {
        planet.angle += planet.speed * 0.6;
        if (planet.angle > Math.PI * 2) planet.angle -= Math.PI * 2;
        
        const x = Math.cos(planet.angle) * planet.distance;
        const z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.position.set(x, 0, z);
        
        planet.mesh.rotation.y += 0.01;
        
        if (planet.ring) {
            planet.ring.rotation.z += 0.008;
            planet.ring.rotation.x = Math.PI / 2.2 + Math.sin(time * 0.5) * 0.05;
        }
    });
}

// ANIMAÇÃO PRINCIPAL
let stars, sunMeshes, oortClouds, extraElements;

function init() {
    setupLighting();
    stars = createStars();
    sunMeshes = createSun();
    createPlanets();
    oortClouds = createOortCloud();
    extraElements = createAdditionalElements();
    
    // Controles de visibilidade
    let oortVisible = true;
    let orbitsVisible = true;
    
    document.getElementById('toggleOort').addEventListener('click', () => {
        oortVisible = !oortVisible;
        oortClouds.oortCloud.visible = oortVisible;
        oortClouds.oortOuterPoints.visible = oortVisible;
    });
    
    document.getElementById('toggleOrbits').addEventListener('click', () => {
        orbitsVisible = !orbitsVisible;
        orbits.forEach(orbit => { orbit.visible = orbitsVisible; });
    });
    
    document.getElementById('resetView').addEventListener('click', () => {
        camera.position.set(0, 30, 60);
        controls.target.set(0, 0, 0);
        controls.update();
    });
    
    // Animação das estrelas
    function animateStars() {
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
        requestAnimationFrame(animateStars);
    }
    animateStars();
    
    // Loop principal de renderização
    function render() {
        const elapsedTime = performance.now() / 1000;
        
        animatePlanets(elapsedTime);
        
        // Rotação do Sol
        sunMeshes.sunMesh.rotation.y += 0.002;
        sunMeshes.sunGlow.rotation.y += 0.001;
        
        // Rotação da Nuvem de Oort e outros elementos
        if (oortClouds.oortCloud) oortClouds.oortCloud.rotation.y += 0.0003;
        if (oortClouds.oortOuterPoints) oortClouds.oortOuterPoints.rotation.y -= 0.0002;
        if (extraElements.asteroidField) extraElements.asteroidField.rotation.y += 0.001;
        if (extraElements.dustField) {
            extraElements.dustField.rotation.x += 0.0001;
            extraElements.dustField.rotation.y += 0.0002;
        }
        
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    
    render();
}

// REDIMENSIONAMENTO DA JANELA
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// INICIALIZAR 
init();

console.log('Sistema Solar 3D carregado | Nuvem de Oort visível ao redor');