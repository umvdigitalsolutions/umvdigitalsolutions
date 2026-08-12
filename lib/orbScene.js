import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
const HOME_POSITION = new THREE.Vector3(0, 0.5, 5.5);
const HOME_DIRECTION = HOME_POSITION.clone().normalize();
const MIN_DISTANCE = 2.15;
const MAX_DISTANCE = 40;
const SCROLL_ZOOM_OUT_DISTANCE = 9.2;
const SCROLL_ZOOM_IN_DISTANCE = 3.55;
const DEFAULT_SERVICES = [
    "Website Development",
    "Landing Page Development",
    "Software Development",
    "SEO Optimization",
    "Social Media Marketing",
    "Graphic Designing",
    "Content Shoots",
    "Brand Identity Design",
    "E-commerce Development",
    "Website Maintenance",
    "Google Business Profile Optimization",
    "Digital Growth Consultation",
];
export function createOrbScene(container, options = {}) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const services = Array.isArray(options.services) && options.services.length > 0
        ? options.services.map((service) => String(service)).filter(Boolean)
        : DEFAULT_SERVICES;
    const scrollDriven = options.scrollDriven === true;
    const initialDistance = scrollDriven ? SCROLL_ZOOM_OUT_DISTANCE : HOME_POSITION.length();
    const initialPosition = HOME_DIRECTION.clone().multiplyScalar(initialDistance);
    // ——— SCENE ———
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const labelScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
    camera.position.copy(initialPosition);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    renderer.autoClear = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    container.appendChild(renderer.domElement);
    // ——— POST PROCESSING ———
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.8, // strength
    0.4, // radius
    0.2);
    composer.addPass(bloom);
    // Chromatic aberration + color grade shader
    const chromaticShader = {
        uniforms: {
            tDiffuse: { value: null },
            uTime: { value: 0 },
            uIntensity: { value: 0.003 },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        vec2 dir = vUv - vec2(0.5);
        float d = length(dir);
        float offset = uIntensity * d;
        // Slight flicker
        float flicker = 1.0 + 0.02 * sin(uTime * 30.0) * sin(uTime * 7.3);
        vec4 cr = texture2D(tDiffuse, vUv + dir * offset);
        vec4 cg = texture2D(tDiffuse, vUv);
        vec4 cb = texture2D(tDiffuse, vUv - dir * offset * 0.5);
        gl_FragColor = vec4(cr.r * 0.62, cg.g * 1.12, cb.b * 1.24, 1.0) * flicker;
        // Push towards lightning-blue tone
        gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vec3(0.58, 1.18, 1.45), 0.38);
      }
    `,
    };
    const chromaticPass = new ShaderPass(chromaticShader);
    composer.addPass(chromaticPass);
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = MIN_DISTANCE;
    controls.maxDistance = MAX_DISTANCE;
    controls.zoomSpeed = 0.7;
    controls.enableZoom = !scrollDriven;
    controls.enablePan = false;
    // ——— COLORS ———
    const C_BRIGHT = 0x5af2ff;
    const C_MID = 0x149cff;
    const C_DIM = 0x0b5fb7;
    const C_FAINT = 0x05345d;
    const C_HOT = 0xb8fbff;
    // ——— ORB ROOT ———
    // Every part of the orb (shells, core, orbiting debris, text, dust, rings)
    // lives under this group.
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);
    // ——— MATERIAL HELPERS ———
    function lineMat(color, opacity = 1) {
        return new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }
    // ——— UTILITY: Create ring at latitude ———
    function latRing(radius, lat, segs = 120) {
        const r = radius * Math.cos(lat);
        const y = radius * Math.sin(lat);
        const pts = [];
        for (let i = 0; i <= segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
    }
    // ——— UTILITY: Create meridian ———
    function meridian(radius, lon, segs = 120) {
        const pts = [];
        for (let i = 0; i <= segs; i++) {
            const lat = (i / segs) * Math.PI - Math.PI / 2;
            pts.push(new THREE.Vector3(radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.sin(lon)));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
    }
    // ═══════════════════════════════════════════════
    // LAYER 1: OUTER SHELL — dense wireframe grid
    // ═══════════════════════════════════════════════
    const outerShell = new THREE.Group();
    const R1 = 2.0;
    // Dense latitude rings (30+)
    for (let i = -15; i <= 15; i++) {
        const lat = (i / 15) * (Math.PI / 2) * 0.95;
        const opacity = i % 3 === 0 ? 0.5 : 0.12;
        const color = i % 3 === 0 ? C_MID : C_FAINT;
        outerShell.add(new THREE.Line(latRing(R1, lat), lineMat(color, opacity)));
    }
    // Dense meridians (24)
    for (let i = 0; i < 24; i++) {
        const lon = (i / 24) * Math.PI * 2;
        const isMajor = i % 6 === 0;
        outerShell.add(new THREE.Line(meridian(R1, lon), lineMat(isMajor ? C_MID : C_FAINT, isMajor ? 0.6 : 0.1)));
    }
    // 4 bright cross meridians (the "plus" shape) — wide bands
    const CROSS_LINES = 18;
    const CROSS_SPREAD = 0.25; // radians total width
    for (let i = 0; i < 4; i++) {
        const lon = (i / 4) * Math.PI * 2;
        for (let j = 0; j < CROSS_LINES; j++) {
            const t = (j / (CROSS_LINES - 1)) * 2 - 1; // -1 to 1
            const offset = (t * CROSS_SPREAD) / 2;
            const falloff = 1 - Math.abs(t) * 0.7; // brighter at center, dimmer at edges
            const opacity = 0.85 * falloff;
            const color = Math.abs(t) < 0.3 ? C_BRIGHT : C_MID;
            outerShell.add(new THREE.Line(meridian(R1, lon + offset, 200), lineMat(color, opacity)));
        }
    }
    // Bright equator band — wide
    const EQ_LINES = 20;
    const EQ_SPREAD = 0.35;
    for (let j = 0; j < EQ_LINES; j++) {
        const t = (j / (EQ_LINES - 1)) * 2 - 1;
        const offset = (t * EQ_SPREAD) / 2;
        const falloff = 1 - Math.abs(t) * 0.65;
        const opacity = 0.8 * falloff;
        const color = Math.abs(t) < 0.3 ? C_BRIGHT : C_MID;
        outerShell.add(new THREE.Line(latRing(R1, offset, 200), lineMat(color, opacity)));
    }
    orbGroup.add(outerShell);
    // ═══════════════════════════════════════════════
    // LAYER 2: GRID PANELS on the sphere surface
    // ═══════════════════════════════════════════════
    const panelGroup = new THREE.Group();
    function createSpherePanel(latCenter, lonCenter, latSpan, lonSpan, radius, divisions = 4) {
        const group = new THREE.Group();
        const mat = lineMat(C_DIM, 0.25);
        // horizontal lines
        for (let i = 0; i <= divisions; i++) {
            const lat = latCenter - latSpan / 2 + (i / divisions) * latSpan;
            const pts = [];
            for (let j = 0; j <= divisions * 4; j++) {
                const lon = lonCenter - lonSpan / 2 + (j / (divisions * 4)) * lonSpan;
                pts.push(new THREE.Vector3(radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.sin(lon)));
            }
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
        }
        // vertical lines
        for (let j = 0; j <= divisions; j++) {
            const lon = lonCenter - lonSpan / 2 + (j / divisions) * lonSpan;
            const pts = [];
            for (let i = 0; i <= divisions * 4; i++) {
                const lat = latCenter - latSpan / 2 + (i / (divisions * 4)) * latSpan;
                pts.push(new THREE.Vector3(radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.sin(lon)));
            }
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
        }
        return group;
    }
    // Scatter panels across the sphere
    for (let i = 0; i < 30; i++) {
        const lat = (Math.random() - 0.5) * Math.PI * 0.8;
        const lon = Math.random() * Math.PI * 2;
        const size = 0.15 + Math.random() * 0.25;
        const panel = createSpherePanel(lat, lon, size, size, R1 + 0.01, 3 + Math.floor(Math.random() * 3));
        panelGroup.add(panel);
    }
    orbGroup.add(panelGroup);
    // ═══════════════════════════════════════════════
    // LAYER 3: SECONDARY SHELL — offset, partial arcs
    // ═══════════════════════════════════════════════
    const shell2 = new THREE.Group();
    const R2 = 2.12;
    // Partial arcs at random latitudes
    for (let i = 0; i < 16; i++) {
        const lat = (Math.random() - 0.5) * Math.PI * 0.85;
        const startLon = Math.random() * Math.PI * 2;
        const arcLen = 0.3 + Math.random() * 1.2;
        const pts = [];
        const segs = 60;
        const r = R2 * Math.cos(lat);
        const y = R2 * Math.sin(lat);
        for (let j = 0; j <= segs; j++) {
            const a = startLon + (j / segs) * arcLen;
            pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
        }
        shell2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(C_MID, 0.2 + Math.random() * 0.3)));
    }
    // Partial meridian arcs
    for (let i = 0; i < 12; i++) {
        const lon = Math.random() * Math.PI * 2;
        const startLat = (Math.random() - 0.5) * Math.PI * 0.8;
        const arcLen = 0.3 + Math.random() * 0.8;
        const pts = [];
        const segs = 40;
        for (let j = 0; j <= segs; j++) {
            const lat = startLat + (j / segs) * arcLen;
            pts.push(new THREE.Vector3(R2 * Math.cos(lat) * Math.cos(lon), R2 * Math.sin(lat), R2 * Math.cos(lat) * Math.sin(lon)));
        }
        shell2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(C_DIM, 0.15 + Math.random() * 0.2)));
    }
    orbGroup.add(shell2);
    // ═══════════════════════════════════════════════
    // LAYER 4: INNER CORE — spiral geodesic
    // ═══════════════════════════════════════════════
    const innerCore = new THREE.Group();
    const R3 = 0.9;
    // Dense spirals
    for (let s = 0; s < 8; s++) {
        const pts = [];
        const turns = 3 + Math.random() * 2;
        const segs = 300;
        const phase = (s / 8) * Math.PI * 2;
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const lat = t * Math.PI - Math.PI / 2;
            const lon = t * turns * Math.PI * 2 + phase;
            pts.push(new THREE.Vector3(R3 * Math.cos(lat) * Math.cos(lon), R3 * Math.sin(lat), R3 * Math.cos(lat) * Math.sin(lon)));
        }
        innerCore.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(C_BRIGHT, 0.3 + Math.random() * 0.2)));
    }
    // Inner latitude rings
    for (let i = -6; i <= 6; i++) {
        const lat = (i / 6) * (Math.PI / 2) * 0.9;
        innerCore.add(new THREE.Line(latRing(R3, lat, 80), lineMat(C_DIM, 0.2)));
    }
    // Inner meridians
    for (let i = 0; i < 12; i++) {
        const lon = (i / 12) * Math.PI * 2;
        innerCore.add(new THREE.Line(meridian(R3, lon, 80), lineMat(C_DIM, 0.15)));
    }
    orbGroup.add(innerCore);
    // ═══════════════════════════════════════════════
    // LAYER 5: INNERMOST CORE — bright hot center
    // ═══════════════════════════════════════════════
    const coreR = 0.25;
    // Icosahedron wireframe core
    const icoGeo = new THREE.IcosahedronGeometry(coreR, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoWireMat = lineMat(C_HOT, 0.9);
    const icoWire = new THREE.LineSegments(icoEdges, icoWireMat);
    orbGroup.add(icoWire);
    // Glowing center sphere — subtle, see-through
    const coreSphereMat = new THREE.MeshBasicMaterial({
        color: C_HOT,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
    });
    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), coreSphereMat);
    orbGroup.add(coreSphere);
    // Larger faint glow — very subtle
    const glowSphereMat = new THREE.MeshBasicMaterial({
        color: C_MID,
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending,
    });
    const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), glowSphereMat);
    orbGroup.add(glowSphere);
    // ═══════════════════════════════════════════════
    // SERVICE TEXT — floating labels revealed on zoom
    // ═══════════════════════════════════════════════
    const ORB_FONT = "Courier New";
    const serviceTextureCache = new Map();
    function getServiceIconKind(text) {
        const normalized = text.toLowerCase();
        if (normalized.includes("landing"))
            return "cursor";
        if (normalized.includes("software"))
            return "blocks";
        if (normalized.includes("seo"))
            return "search";
        if (normalized.includes("social"))
            return "megaphone";
        if (normalized.includes("graphic"))
            return "brush";
        if (normalized.includes("content"))
            return "camera";
        if (normalized.includes("brand"))
            return "palette";
        if (normalized.includes("commerce"))
            return "cart";
        if (normalized.includes("maintenance"))
            return "wrench";
        if (normalized.includes("google"))
            return "pin";
        if (normalized.includes("growth"))
            return "bulb";
        return "code";
    }
    function splitServiceText(text) {
        const words = text.split(" ");
        if (text.length <= 18 || words.length === 1)
            return [text];
        const midpoint = text.length / 2;
        let bestIndex = 1;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let i = 1; i < words.length; i++) {
            const length = words.slice(0, i).join(" ").length;
            const distance = Math.abs(length - midpoint);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = i;
            }
        }
        return [words.slice(0, bestIndex).join(" "), words.slice(bestIndex).join(" ")];
    }
    function roundedRect(ctx, x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    function drawServiceIcon(ctx, kind, cx, cy, size) {
        const s = size;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = "rgba(112, 246, 255, 1)";
        ctx.fillStyle = "rgba(36, 190, 255, 0.34)";
        ctx.lineWidth = Math.max(4, s * 0.08);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(42, 206, 255, 1)";
        ctx.shadowBlur = 18;
        switch (kind) {
            case "cursor":
                ctx.beginPath();
                ctx.moveTo(-s * 0.28, -s * 0.34);
                ctx.lineTo(s * 0.3, -s * 0.08);
                ctx.lineTo(s * 0.05, s * 0.03);
                ctx.lineTo(s * 0.18, s * 0.32);
                ctx.lineTo(-s * 0.04, s * 0.39);
                ctx.lineTo(-s * 0.17, s * 0.09);
                ctx.lineTo(-s * 0.35, s * 0.26);
                ctx.closePath();
                ctx.stroke();
                break;
            case "blocks":
                for (const [x, y] of [[-0.28, -0.28], [0.15, -0.28], [-0.06, 0.16]]) {
                    roundedRect(ctx, x * s, y * s, s * 0.28, s * 0.28, s * 0.04);
                    ctx.stroke();
                }
                break;
            case "search":
                ctx.beginPath();
                ctx.arc(-s * 0.08, -s * 0.08, s * 0.26, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(s * 0.12, s * 0.12);
                ctx.lineTo(s * 0.34, s * 0.34);
                ctx.stroke();
                break;
            case "megaphone":
                ctx.beginPath();
                ctx.moveTo(-s * 0.35, -s * 0.08);
                ctx.lineTo(s * 0.04, -s * 0.24);
                ctx.lineTo(s * 0.32, -s * 0.34);
                ctx.lineTo(s * 0.32, s * 0.24);
                ctx.lineTo(s * 0.04, s * 0.13);
                ctx.lineTo(-s * 0.35, s * 0.06);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-s * 0.12, s * 0.11);
                ctx.lineTo(s * 0.02, s * 0.36);
                ctx.stroke();
                break;
            case "brush":
                ctx.beginPath();
                ctx.moveTo(-s * 0.3, s * 0.28);
                ctx.quadraticCurveTo(-s * 0.12, s * 0.38, s * 0.02, s * 0.14);
                ctx.lineTo(s * 0.34, -s * 0.2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(s * 0.14, -s * 0.34);
                ctx.lineTo(s * 0.36, -s * 0.12);
                ctx.stroke();
                break;
            case "camera":
                roundedRect(ctx, -s * 0.36, -s * 0.18, s * 0.72, s * 0.5, s * 0.08);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, s * 0.06, s * 0.16, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-s * 0.16, -s * 0.18);
                ctx.lineTo(-s * 0.08, -s * 0.32);
                ctx.lineTo(s * 0.13, -s * 0.32);
                ctx.lineTo(s * 0.2, -s * 0.18);
                ctx.stroke();
                break;
            case "palette":
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.34, s * 0.28, -0.2, 0, Math.PI * 2);
                ctx.stroke();
                for (const [x, y] of [[-0.14, -0.08], [0.04, -0.15], [0.18, 0.02]]) {
                    ctx.beginPath();
                    ctx.arc(x * s, y * s, s * 0.035, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case "cart":
                ctx.beginPath();
                ctx.moveTo(-s * 0.34, -s * 0.28);
                ctx.lineTo(-s * 0.22, -s * 0.28);
                ctx.lineTo(-s * 0.12, s * 0.12);
                ctx.lineTo(s * 0.26, s * 0.12);
                ctx.lineTo(s * 0.34, -s * 0.12);
                ctx.lineTo(-s * 0.16, -s * 0.12);
                ctx.stroke();
                for (const x of [-0.08, 0.22]) {
                    ctx.beginPath();
                    ctx.arc(x * s, s * 0.3, s * 0.04, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case "wrench":
                ctx.beginPath();
                ctx.arc(-s * 0.18, -s * 0.18, s * 0.16, 0.7, 5.5);
                ctx.lineTo(s * 0.34, s * 0.34);
                ctx.stroke();
                break;
            case "pin":
                ctx.beginPath();
                ctx.moveTo(0, s * 0.38);
                ctx.bezierCurveTo(-s * 0.34, s * 0.02, -s * 0.26, -s * 0.34, 0, -s * 0.34);
                ctx.bezierCurveTo(s * 0.26, -s * 0.34, s * 0.34, s * 0.02, 0, s * 0.38);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, -s * 0.1, s * 0.09, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case "bulb":
                ctx.beginPath();
                ctx.arc(0, -s * 0.08, s * 0.24, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-s * 0.14, s * 0.18);
                ctx.lineTo(s * 0.14, s * 0.18);
                ctx.moveTo(-s * 0.1, s * 0.3);
                ctx.lineTo(s * 0.1, s * 0.3);
                ctx.stroke();
                break;
            default:
                ctx.beginPath();
                ctx.moveTo(-s * 0.34, 0);
                ctx.lineTo(-s * 0.12, -s * 0.22);
                ctx.moveTo(-s * 0.34, 0);
                ctx.lineTo(-s * 0.12, s * 0.22);
                ctx.moveTo(s * 0.34, 0);
                ctx.lineTo(s * 0.12, -s * 0.22);
                ctx.moveTo(s * 0.34, 0);
                ctx.lineTo(s * 0.12, s * 0.22);
                ctx.moveTo(s * 0.05, -s * 0.32);
                ctx.lineTo(-s * 0.08, s * 0.32);
                ctx.stroke();
                break;
        }
        ctx.restore();
    }
    function getTextTexture(text, { withIcon = false } = {}) {
        const cacheKey = `${withIcon ? "icon" : "text"}:${text}`;
        const cached = serviceTextureCache.get(cacheKey);
        if (cached)
            return cached;
        const c = document.createElement("canvas");
        const labelLines = splitServiceText(text);
        const height = withIcon ? (labelLines.length > 1 ? 188 : 164) : 132;
        const ctx = c.getContext("2d");
        const fontSize = withIcon ? 44 : 42;
        const lineHeight = withIcon ? 44 : 38;
        ctx.font = `bold ${fontSize}px ${ORB_FONT}`;
        const textWidth = Math.max(...labelLines.map((line) => ctx.measureText(line).width));
        const iconOffset = withIcon ? 112 : 0;
        c.width = Math.ceil(Math.max(withIcon ? 460 : 320, textWidth + iconOffset + 110));
        c.height = height;
        const chipX = 18;
        const chipY = withIcon ? 24 : 30;
        const chipW = c.width - chipX * 2;
        const chipH = c.height - chipY * 2;
        ctx.font = `bold ${fontSize}px ${ORB_FONT}`;
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(35, 204, 255, 1)";
        ctx.shadowBlur = 24;
        ctx.fillStyle = "rgba(0, 8, 24, 0.96)";
        roundedRect(ctx, chipX, chipY, chipW, chipH, 10);
        ctx.fill();
        const glow = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
        glow.addColorStop(0, "rgba(0, 172, 255, 0.32)");
        glow.addColorStop(0.5, "rgba(92, 246, 255, 0.18)");
        glow.addColorStop(1, "rgba(0, 96, 255, 0.3)");
        ctx.fillStyle = glow;
        roundedRect(ctx, chipX + 3, chipY + 3, chipW - 6, chipH - 6, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(124, 248, 255, 0.96)";
        ctx.lineWidth = 3;
        roundedRect(ctx, chipX, chipY, chipW, chipH, 10);
        ctx.stroke();
        if (withIcon) {
            const iconBox = 72;
            const iconX = chipX + 18;
            const iconY = c.height / 2 - iconBox / 2;
            ctx.shadowColor = "rgba(42, 206, 255, 1)";
            ctx.shadowBlur = 18;
            ctx.fillStyle = "rgba(0, 24, 58, 0.92)";
            roundedRect(ctx, iconX, iconY, iconBox, iconBox, 10);
            ctx.fill();
            ctx.strokeStyle = "rgba(90, 242, 255, 0.92)";
            ctx.lineWidth = 3;
            roundedRect(ctx, iconX, iconY, iconBox, iconBox, 10);
            ctx.stroke();
            drawServiceIcon(ctx, getServiceIconKind(text), iconX + iconBox / 2, c.height / 2, 48);
        }
        const textX = withIcon ? chipX + 112 : c.width / 2;
        const textBlockHeight = (labelLines.length - 1) * lineHeight;
        ctx.textAlign = withIcon ? "left" : "center";
        ctx.shadowColor = "rgba(34, 203, 255, 1)";
        ctx.shadowBlur = withIcon ? 22 : 14;
        ctx.strokeStyle = "rgba(1, 8, 20, 0.96)";
        ctx.lineWidth = withIcon ? 9 : 7;
        labelLines.forEach((line, lineIndex) => {
            const y = c.height / 2 - textBlockHeight / 2 + lineIndex * lineHeight;
            ctx.strokeText(line, textX, y);
            ctx.fillStyle = "rgba(190, 252, 255, 1)";
            ctx.fillText(line, textX, y);
            ctx.fillStyle = "rgba(52, 210, 255, 0.68)";
            ctx.fillText(line, textX + 1, y + 1);
        });
        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        const textureData = { texture: tex, aspect: c.width / c.height };
        serviceTextureCache.set(cacheKey, textureData);
        return textureData;
    }
    function makeTextSprite(text, size = 0.08, baseOpacity = 0.7, { withIcon = false, isPrimary = false } = {}) {
        const { texture, aspect } = getTextTexture(text, { withIcon });
        const s = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            blending: THREE.NormalBlending,
            depthWrite: false,
            depthTest: false,
            toneMapped: false,
        }));
        s.scale.set(size * aspect, size, 1);
        s.userData.baseScaleX = size * aspect;
        s.userData.baseScaleY = size;
        s.userData.baseOpacity = baseOpacity;
        s.userData.isPrimary = isPrimary;
        return s;
    }
    const serviceTextGroup = new THREE.Group();
    serviceTextGroup.visible = false;
    const serviceSprites = [];
    function getServiceRevealDelay(serviceIndex, jitter = 0) {
        const stageRange = 0.82;
        const stage = services.length <= 1 ? 0 : serviceIndex / (services.length - 1);
        return Math.min(0.86, stage * stageRange + jitter);
    }
    function placeServiceSprite(sprite, phi, theta, r, speed, revealDelay = 0, revealWindow = 0.16) {
        sprite.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
        Object.assign(sprite.userData, {
            phi,
            theta,
            r,
            speed,
            revealDelay,
            revealWindow,
            floatAmp: 0.035 + Math.random() * 0.045,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.6 + Math.random() * 0.65,
            pulseSpeed: 1.0 + Math.random() * 0.8,
        });
        serviceTextGroup.add(sprite);
        serviceSprites.push(sprite);
    }
    function scatterServiceLabels(count, sizeFn, rFn, speedScale, opacityFn, revealDelayFn) {
        for (let i = 0; i < count; i++) {
            const serviceIndex = i % services.length;
            const service = services[serviceIndex].toUpperCase();
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = rFn();
            const speed = (speedScale[0] + Math.random() * speedScale[1]) * (Math.random() > 0.5 ? 1 : -1);
            const sprite = makeTextSprite(service, sizeFn(service), opacityFn());
            placeServiceSprite(sprite, phi, theta, r, speed, revealDelayFn(serviceIndex, i), 0.18 + Math.random() * 0.08);
        }
    }
    const primaryLabelLayout = [
        { phi: 1.05, theta: 2.35, r: 1.18 },
        { phi: 0.76, theta: 1.56, r: 1.12 },
        { phi: 1.05, theta: 0.76, r: 1.18 },
        { phi: 1.23, theta: 2.35, r: 1.18 },
        { phi: 1.25, theta: 0.76, r: 1.18 },
        { phi: 1.55, theta: 2.45, r: 1.2 },
        { phi: 1.55, theta: 0.68, r: 1.2 },
        { phi: 1.85, theta: 2.28, r: 1.18 },
        { phi: 1.85, theta: 1.55, r: 1.1 },
        { phi: 1.85, theta: 0.82, r: 1.18 },
        { phi: 2.14, theta: 2.08, r: 1.16 },
        { phi: 2.14, theta: 1.03, r: 1.16 },
    ];
    services.forEach((service, index) => {
        const layout = primaryLabelLayout[index % primaryLabelLayout.length];
        const baseLabelSize = service.length > 34 ? 0.24 : service.length > 26 ? 0.26 : service.length > 20 ? 0.28 : service.length > 16 ? 0.3 : 0.32;
        const labelSize = index === 0 ? Math.max(baseLabelSize, 0.34) : baseLabelSize;
        const direction = index % 2 === 0 ? 1 : -1;
        const sprite = makeTextSprite(service.toUpperCase(), labelSize, 1, { withIcon: true, isPrimary: true });
        placeServiceSprite(sprite, layout.phi, layout.theta, layout.r, direction * (0.00012 + index * 0.000015), getServiceRevealDelay(index), 0.12);
    });
    scatterServiceLabels(
        54,
        (service) => (service.length > 20 ? 0.022 : 0.03) + Math.random() * 0.012,
        () => R1 + 0.02 + Math.random() * 0.12,
        [0.0002, 0.0008],
        () => 0.18 + Math.random() * 0.18,
        (serviceIndex) => getServiceRevealDelay(serviceIndex, 0.04 + Math.random() * 0.08),
    );
    scatterServiceLabels(
        30,
        (service) => (service.length > 20 ? 0.024 : 0.032) + Math.random() * 0.012,
        () => R3 + 0.02 + Math.random() * 0.16,
        [0.00045, 0.0009],
        () => 0.2 + Math.random() * 0.18,
        (serviceIndex) => getServiceRevealDelay(serviceIndex, 0.03 + Math.random() * 0.07),
    );
    scatterServiceLabels(
        36,
        (service) => (service.length > 20 ? 0.02 : 0.028) + Math.random() * 0.01,
        () => R3 + 0.24 + Math.random() * (R1 - R3 - 0.36),
        [0.00028, 0.00062],
        () => 0.16 + Math.random() * 0.16,
        (serviceIndex) => getServiceRevealDelay(serviceIndex, 0.06 + Math.random() * 0.1),
    );
    labelScene.add(serviceTextGroup);
    // ═══════════════════════════════════════════════
    // ORBITING DEBRIS / ROCKS
    // ═══════════════════════════════════════════════
    // Shared geometries for performance — reuse across 250 satellites
    const debrisGeos = [
        new THREE.IcosahedronGeometry(0.012, 0),
        new THREE.IcosahedronGeometry(0.02, 0),
        new THREE.IcosahedronGeometry(0.03, 1),
        new THREE.IcosahedronGeometry(0.008, 0),
        new THREE.TetrahedronGeometry(0.015, 0),
        new THREE.OctahedronGeometry(0.018, 0),
    ];
    const debris = [];
    for (let i = 0; i < 250; i++) {
        const geo = debrisGeos[Math.floor(Math.random() * debrisGeos.length)];
        const mat = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.7 ? C_BRIGHT : C_MID,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.6,
            blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const orbitR = 1.2 + Math.random() * 4.0;
        const speed = (0.08 + Math.random() * 0.6) * (Math.random() > 0.5 ? 1 : -1);
        const tiltX = (Math.random() - 0.5) * Math.PI * 0.9;
        const tiltZ = (Math.random() - 0.5) * Math.PI * 0.5;
        const phase = Math.random() * Math.PI * 2;
        mesh.userData = { orbitR, speed, tiltX, tiltZ, phase };
        debris.push(mesh);
        orbGroup.add(mesh);
        // ~15% get a faint trailing line
        if (Math.random() > 0.85) {
            const trailPts = [];
            for (let j = 0; j <= 15; j++) {
                const a = -(j / 15) * 0.3;
                trailPts.push(new THREE.Vector3(orbitR * Math.cos(a + phase), orbitR * 0.08 * Math.sin(a * 3), orbitR * Math.sin(a + phase)));
            }
            const trail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(trailPts), lineMat(C_FAINT, 0.08));
            mesh.add(trail);
        }
    }
    // ═══════════════════════════════════════════════
    // DUST PARTICLES — lots of them
    // ═══════════════════════════════════════════════
    const dustCount = 2000;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
        // Concentrate near the sphere, sparse further out
        const rr = 0.5 + Math.pow(Math.random(), 0.6) * 7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        dustPos[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
        dustPos[i * 3 + 1] = rr * Math.cos(phi);
        dustPos[i * 3 + 2] = rr * Math.sin(phi) * Math.sin(theta);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dustPos, 3));
    // Soft dot texture
    const dotC = document.createElement("canvas");
    dotC.width = dotC.height = 64;
    const dCtx = dotC.getContext("2d");
    const g = dCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(90,242,255,1)");
    g.addColorStop(0.2, "rgba(28,160,255,0.68)");
    g.addColorStop(0.5, "rgba(8,88,190,0.18)");
    g.addColorStop(1, "rgba(2,28,68,0)");
    dCtx.fillStyle = g;
    dCtx.fillRect(0, 0, 64, 64);
    const dustMat = new THREE.PointsMaterial({
        map: new THREE.CanvasTexture(dotC),
        size: 0.04,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        color: C_BRIGHT,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    orbGroup.add(dustPoints);
    // ═══════════════════════════════════════════════
    // SCANNING RINGS
    // ═══════════════════════════════════════════════
    function makeScanRing(radius, thickness = 0.015) {
        const geo = new THREE.RingGeometry(radius - thickness, radius + thickness, 120);
        const mat = new THREE.MeshBasicMaterial({
            color: C_BRIGHT,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }
    const scanRing1 = makeScanRing(R1, 0.01);
    const scanRing2 = makeScanRing(R1 * 0.7, 0.008);
    orbGroup.add(scanRing1, scanRing2);
    // ═══════════════════════════════════════════════
    // HEXAGONAL NODES — small tech details
    // ═══════════════════════════════════════════════
    for (let i = 0; i < 15; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = R1 + 0.02;
        const hexGeo = new THREE.CircleGeometry(0.03 + Math.random() * 0.02, 6);
        const hexEdges = new THREE.EdgesGeometry(hexGeo);
        const hex = new THREE.LineSegments(hexEdges, lineMat(C_MID, 0.5));
        hex.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
        hex.lookAt(0, 0, 0);
        outerShell.add(hex);
    }
    // ═══════════════════════════════════════════════
    // GESTURE / PROGRAMMATIC CAMERA CONTROL
    // ═══════════════════════════════════════════════
    const sphericalScratch = new THREE.Spherical();
    const offsetScratch = new THREE.Vector3();
    function rotateBy(deltaTheta, deltaPhi) {
        offsetScratch.copy(camera.position).sub(controls.target);
        sphericalScratch.setFromVector3(offsetScratch);
        sphericalScratch.theta -= deltaTheta;
        sphericalScratch.phi = THREE.MathUtils.clamp(sphericalScratch.phi - deltaPhi, 0.05, Math.PI - 0.05);
        sphericalScratch.makeSafe();
        offsetScratch.setFromSpherical(sphericalScratch);
        camera.position.copy(controls.target).add(offsetScratch);
        camera.lookAt(controls.target);
    }
    function zoomBy(factor) {
        offsetScratch.copy(camera.position).sub(controls.target);
        const dist = THREE.MathUtils.clamp(offsetScratch.length() * factor, MIN_DISTANCE, MAX_DISTANCE);
        offsetScratch.setLength(dist);
        camera.position.copy(controls.target).add(offsetScratch);
    }
    function setCameraDistance(distance) {
        offsetScratch.copy(camera.position).sub(controls.target);
        if (offsetScratch.lengthSq() === 0) {
            offsetScratch.copy(HOME_DIRECTION);
        }
        offsetScratch.setLength(THREE.MathUtils.clamp(distance, MIN_DISTANCE, MAX_DISTANCE));
        camera.position.copy(controls.target).add(offsetScratch);
        camera.lookAt(controls.target);
    }
    function setScrollProgress(progress) {
        const clampedProgress = THREE.MathUtils.clamp(progress, 0, 1);
        setCameraDistance(THREE.MathUtils.lerp(SCROLL_ZOOM_OUT_DISTANCE, SCROLL_ZOOM_IN_DISTANCE, clampedProgress));
        controls.update();
    }
    function resetView() {
        camera.position.copy(initialPosition);
        controls.target.set(0, 0, 0);
        camera.lookAt(controls.target);
        controls.update();
    }
    // ═══════════════════════════════════════════════
    // ANIMATION
    // ═══════════════════════════════════════════════
    const clock = new THREE.Clock();
    const SERVICE_REVEAL_START = scrollDriven ? SCROLL_ZOOM_OUT_DISTANCE : 5.1;
    const SERVICE_REVEAL_END = scrollDriven ? SCROLL_ZOOM_IN_DISTANCE : MIN_DISTANCE;
    let flickerTimer = 0;
    let rafId = 0;
    let disposed = false;
    let lastServicesVisible = false;
    function animate() {
        if (disposed)
            return;
        rafId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        // Outer shell rotation
        outerShell.rotation.y += 0.0015;
        outerShell.rotation.x = Math.sin(t * 0.08) * 0.05;
        // Panel group follows shell but with slight offset
        panelGroup.rotation.y += 0.0018;
        panelGroup.rotation.x = Math.sin(t * 0.08 + 0.5) * 0.04;
        // Secondary shell counter-rotates slowly
        shell2.rotation.y -= 0.001;
        shell2.rotation.z = Math.sin(t * 0.12) * 0.03;
        // Inner core — opposite, faster
        innerCore.rotation.y -= 0.005;
        innerCore.rotation.z += 0.002;
        innerCore.rotation.x = Math.cos(t * 0.1) * 0.08;
        // Innermost wireframe
        icoWire.rotation.x += 0.008;
        icoWire.rotation.y += 0.012;
        // Core pulse — dramatic surges but mostly transparent
        const wave1 = Math.sin(t * 1.2);
        const wave3 = Math.pow(Math.max(0, Math.sin(t * 0.4)), 5); // rare big surge
        const wave4 = Math.pow(Math.max(0, Math.sin(t * 0.7 + 2)), 8); // mega surge
        const fadeOut = Math.pow(Math.max(0, Math.sin(t * 0.25)), 3); // periodic full transparency
        const surge = wave3 * 1.5 + wave4 * 2.0;
        const coreScale = 1 + surge + Math.sin(t * 5) * 0.05;
        coreSphere.scale.setScalar(coreScale);
        // Opacity: mostly very low (0-0.15), sometimes fully transparent, brief bright on surge
        const coreOpacity = Math.max(0, (0.08 + wave1 * 0.05 + surge * 0.2) * (1 - fadeOut * 0.95));
        coreSphereMat.opacity = Math.min(0.6, coreOpacity);
        glowSphere.scale.setScalar(1 + surge * 0.8);
        glowSphereMat.opacity = Math.max(0, (0.03 + surge * 0.08) * (1 - fadeOut * 0.9));
        // Icosahedron wireframe stays visible even when glow fades
        icoWire.scale.setScalar(1 + surge * 0.6);
        icoWireMat.opacity = Math.min(1, 0.5 + surge * 0.4);
        // Debris orbits
        debris.forEach((d) => {
            const u = d.userData;
            const a = t * u.speed + u.phase;
            d.position.set(u.orbitR * Math.cos(a) * Math.cos(u.tiltX), u.orbitR * Math.sin(u.tiltX) * Math.sin(a * 0.8) + Math.sin(a * 0.3 + u.tiltZ) * 0.2, u.orbitR * Math.sin(a) * Math.cos(u.tiltZ));
            d.rotation.x += 0.015;
            d.rotation.z += 0.01;
        });
        const cameraDistance = camera.position.distanceTo(controls.target);
        const serviceReveal = THREE.MathUtils.clamp((SERVICE_REVEAL_START - cameraDistance) / (SERVICE_REVEAL_START - SERVICE_REVEAL_END), 0, 1);
        const servicesVisible = serviceReveal > 0.02;
        serviceTextGroup.visible = servicesVisible;
        if (servicesVisible !== lastServicesVisible) {
            lastServicesVisible = servicesVisible;
        }
        serviceTextGroup.rotation.y += 0.0009 + serviceReveal * 0.0006;
        serviceTextGroup.rotation.x = Math.sin(t * 0.14) * 0.045;
        serviceSprites.forEach((sprite) => {
            const u = sprite.userData;
            const labelReveal = THREE.MathUtils.clamp((serviceReveal - u.revealDelay) / u.revealWindow, 0, 1);
            u.theta += u.speed * (1 + serviceReveal);
            const floatOffset = Math.sin(t * u.floatSpeed + u.floatPhase) * u.floatAmp;
            const r = u.r + floatOffset;
            sprite.position.set(r * Math.sin(u.phi) * Math.cos(u.theta), r * Math.cos(u.phi), r * Math.sin(u.phi) * Math.sin(u.theta));
            const pulse = u.isPrimary ? 0.96 + Math.sin(t * u.pulseSpeed + u.floatPhase) * 0.04 : 0.82 + Math.sin(t * u.pulseSpeed + u.floatPhase) * 0.1;
            sprite.material.opacity = Math.min(1, u.baseOpacity * labelReveal * pulse);
            const distanceScale = THREE.MathUtils.clamp(cameraDistance / SERVICE_REVEAL_START, u.isPrimary ? 0.72 : 0.58, 1);
            const scaleBase = u.isPrimary ? 0.94 + labelReveal * 0.08 : 0.86 + labelReveal * 0.14;
            const scale = distanceScale * (scaleBase + Math.sin(t * u.pulseSpeed * 0.7 + u.floatPhase) * 0.02);
            sprite.scale.set(u.baseScaleX * scale, u.baseScaleY * scale, 1);
        });
        if (!servicesVisible) {
            serviceSprites.forEach((sprite) => {
                sprite.material.opacity = 0;
            });
        }
        // Scan rings sweeping
        const scanY1 = Math.sin(t * 0.4) * R1;
        scanRing1.position.y = scanY1;
        const scanS1 = Math.sqrt(Math.max(0, R1 * R1 - scanY1 * scanY1)) / R1;
        scanRing1.scale.set(scanS1, scanS1, 1);
        scanRing1.material.opacity = 0.2 * scanS1;
        const scanY2 = Math.sin(t * 0.6 + 2) * R3;
        scanRing2.position.y = scanY2;
        const scanS2 = Math.sqrt(Math.max(0, R3 * R3 - scanY2 * scanY2)) / R3;
        scanRing2.scale.set(scanS2, scanS2, 1);
        scanRing2.material.opacity = 0.15 * scanS2;
        // Dust rotation
        dustPoints.rotation.y += 0.0002;
        // Random flicker on some panels
        flickerTimer += 0.016;
        if (flickerTimer > 0.1) {
            flickerTimer = 0;
            panelGroup.children.forEach((p) => {
                if (Math.random() > 0.95) {
                    p.visible = !p.visible;
                }
            });
        }
        // Bloom pulse
        bloom.strength = 1.6 + Math.sin(t * 0.8) * 0.3;
        // Update chromatic aberration time
        chromaticPass.uniforms.uTime.value = t;
        controls.update();
        composer.render();
        if (serviceTextGroup.visible) {
            renderer.clearDepth();
            renderer.render(labelScene, camera);
        }
    }
    animate();
    // ——— RESIZE ———
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);
    // ——— CLEANUP ———
    function dispose() {
        disposed = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        const disposedMaps = new Set();
        const disposeObject = (obj) => {
            const mesh = obj;
            if (mesh.geometry)
                mesh.geometry.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const mat of mats) {
                if (!mat)
                    continue;
                const anyMat = mat;
                if (anyMat.map && !disposedMaps.has(anyMat.map)) {
                    disposedMaps.add(anyMat.map);
                    anyMat.map.dispose();
                }
                mat.dispose();
            }
        };
        scene.traverse(disposeObject);
        labelScene.traverse(disposeObject);
        composer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
    }
    return {
        rotateBy,
        zoomBy,
        zoomIn: () => zoomBy(0.65),
        zoomOut: () => zoomBy(1.55),
        setScrollProgress,
        resetView,
        dispose,
    };
}
