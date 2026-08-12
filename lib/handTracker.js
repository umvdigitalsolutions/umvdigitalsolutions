import { FilesetResolver, HandLandmarker, } from "@mediapipe/tasks-vision";
const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
// Landmark indices (MediaPipe hand model)
const WRIST = 0;
const THUMB_IP = 3;
const THUMB_TIP = 4;
const INDEX_MCP = 5;
const INDEX_PIP = 6;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_PIP = 10;
const MIDDLE_TIP = 12;
const RING_MCP = 13;
const RING_PIP = 14;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_PIP = 18;
const PINKY_TIP = 20;
// Pinch hysteresis: thumb–index distance relative to hand size
const PINCH_ON = 0.32;
const PINCH_OFF = 0.45;
// How strongly hand movement rotates the orb (radians per normalized unit)
const ROTATE_SPEED = 5.0;
// Smoothing factor for grab-point tracking (0..1, higher = snappier)
const SMOOTHING = 0.4;
const SWIPE_SPEED = 0.95;
const SWIPE_COOLDOWN_MS = 720;
const EXPAND_COOLDOWN_MS = 1100;
const THUMBS_UP_COOLDOWN_MS = 1600;
const WAKE_COOLDOWN_MS = 900;
export class HandTracker {
    video;
    overlay;
    callbacks;
    landmarker = null;
    stream = null;
    rafId = 0;
    running = false;
    lastVideoTime = -1;
    // keyed by handedness label so state survives re-ordering between frames
    handStates = new Map();
    prevMode = "idle";
    prevSpinGrab = null;
    prevZoomDist = null;
    lastSwipeAt = 0;
    lastExpandAt = 0;
    lastThumbsUpAt = 0;
    lastWakeAt = 0;
    lastStatus = { hands: 0, mode: "idle" };
    constructor(video, overlay, callbacks) {
        this.video = video;
        this.overlay = overlay;
        this.callbacks = callbacks;
    }
    async start() {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: false,
        });
        this.video.srcObject = this.stream;
        await this.video.play();
        const fileset = await FilesetResolver.forVisionTasks(WASM_CDN);
        const options = {
            baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.6,
            minHandPresenceConfidence: 0.6,
            minTrackingConfidence: 0.6,
        };
        try {
            this.landmarker = await HandLandmarker.createFromOptions(fileset, options);
        }
        catch {
            // Some browsers/GPUs reject the GPU delegate — fall back to CPU
            this.landmarker = await HandLandmarker.createFromOptions(fileset, {
                ...options,
                baseOptions: { ...options.baseOptions, delegate: "CPU" },
            });
        }
        this.running = true;
        this.loop();
    }
    stop() {
        this.running = false;
        cancelAnimationFrame(this.rafId);
        this.landmarker?.close();
        this.landmarker = null;
        this.stream?.getTracks().forEach((t) => t.stop());
        this.stream = null;
        this.video.srcObject = null;
        this.handStates.clear();
        this.prevMode = "idle";
        this.prevSpinGrab = null;
        this.prevZoomDist = null;
        this.lastSwipeAt = 0;
        this.lastExpandAt = 0;
        this.lastThumbsUpAt = 0;
        this.lastWakeAt = 0;
        const ctx = this.overlay.getContext("2d");
        ctx?.clearRect(0, 0, this.overlay.width, this.overlay.height);
        this.emitStatus({ hands: 0, mode: "idle" });
    }
    loop = () => {
        if (!this.running)
            return;
        this.rafId = requestAnimationFrame(this.loop);
        if (!this.landmarker || this.video.readyState < 2)
            return;
        if (this.video.currentTime === this.lastVideoTime)
            return;
        this.lastVideoTime = this.video.currentTime;
        const result = this.landmarker.detectForVideo(this.video, performance.now());
        this.processHands(result.landmarks, result.handedness.map((h) => h[0]?.categoryName ?? "?"));
        this.drawOverlay(result.landmarks);
    };
    processHands(landmarks, labels) {
        const pinchedGrabs = [];
        const handInfos = [];
        const seen = new Set();
        const now = performance.now();
        landmarks.forEach((lm, i) => {
            const label = labels[i];
            seen.add(label);
            const handScale = dist2d(lm[WRIST], lm[MIDDLE_MCP]);
            if (handScale < 1e-6)
                return;
            const pinchRatio = dist2d(lm[THUMB_TIP], lm[INDEX_TIP]) / handScale;
            const center = getHandCenter(lm);
            // Mirrored so hand-right = screen-right from the user's perspective
            const raw = {
                x: 1 - (lm[THUMB_TIP].x + lm[INDEX_TIP].x) / 2,
                y: (lm[THUMB_TIP].y + lm[INDEX_TIP].y) / 2,
            };
            let state = this.handStates.get(label);
            if (!state) {
                state = { pinching: false, grab: raw, center, prevCenter: center, centerAt: now };
                this.handStates.set(label, state);
            }
            const prevCenter = state.center ?? center;
            const prevAt = state.centerAt ?? now;
            // Hysteresis so the pinch doesn't flicker on/off at the threshold
            if (state.pinching && pinchRatio > PINCH_OFF)
                state.pinching = false;
            else if (!state.pinching && pinchRatio < PINCH_ON)
                state.pinching = true;
            state.prevCenter = prevCenter;
            state.center = {
                x: prevCenter.x + (center.x - prevCenter.x) * SMOOTHING,
                y: prevCenter.y + (center.y - prevCenter.y) * SMOOTHING,
            };
            state.centerAt = now;
            state.grab = {
                x: state.grab.x + (raw.x - state.grab.x) * SMOOTHING,
                y: state.grab.y + (raw.y - state.grab.y) * SMOOTHING,
            };
            const shape = classifyHandShape(lm, handScale);
            const dt = Math.max(16, now - prevAt) / 1000;
            const velocityX = (state.center.x - prevCenter.x) / dt;
            if (state.pinching) {
                pinchedGrabs.push(state.grab);
            }
            else {
                handInfos.push({
                    label,
                    center: state.center,
                    velocityX,
                    ...shape,
                });
            }
        });
        // Drop state for hands that left the frame
        for (const key of this.handStates.keys()) {
            if (!seen.has(key))
                this.handStates.delete(key);
        }
        const fistHeld = handInfos.some((hand) => hand.fist);
        this.callbacks.onPause?.(fistHeld);
        const openPalm = handInfos.find((hand) => hand.openPalm);
        if (openPalm && now - this.lastWakeAt > WAKE_COOLDOWN_MS) {
            this.callbacks.onWake?.();
            this.lastWakeAt = now;
        }
        const pointing = handInfos.find((hand) => hand.pointing);
        if (pointing) {
            this.callbacks.onPoint?.(pointing.pointer);
        }
        const thumbsUp = handInfos.find((hand) => hand.thumbsUp);
        if (thumbsUp && now - this.lastThumbsUpAt > THUMBS_UP_COOLDOWN_MS) {
            this.callbacks.onThumbsUp?.();
            this.lastThumbsUpAt = now;
        }
        const swipe = handInfos.find((hand) => Math.abs(hand.velocityX) > SWIPE_SPEED && hand.openPalm);
        if (swipe && now - this.lastSwipeAt > SWIPE_COOLDOWN_MS) {
            this.callbacks.onSwipe?.(swipe.velocityX > 0 ? "right" : "left");
            this.lastSwipeAt = now;
        }
        if (handInfos.length >= 2 && now - this.lastExpandAt > EXPAND_COOLDOWN_MS) {
            const [first, second] = handInfos;
            const spread = Math.hypot(first.center.x - second.center.x, first.center.y - second.center.y);
            if (spread > 0.56 && first.openPalm && second.openPalm) {
                this.callbacks.onExpand?.();
                this.lastExpandAt = now;
            }
        }
        const shapeMode = fistHeld ? "pause" : pointing ? "point" : thumbsUp ? "next" : openPalm ? "wake" : "idle";
        const mode = pinchedGrabs.length >= 2 ? "zoom" : pinchedGrabs.length === 1 ? "spin" : shapeMode;
        // Reset reference points on any mode change to avoid jumps
        if (mode !== this.prevMode) {
            this.prevSpinGrab = null;
            this.prevZoomDist = null;
            this.prevMode = mode;
        }
        if (mode === "spin") {
            const grab = pinchedGrabs[0];
            if (this.prevSpinGrab) {
                const dx = grab.x - this.prevSpinGrab.x;
                const dy = grab.y - this.prevSpinGrab.y;
                if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) {
                    this.callbacks.onRotate(dx * ROTATE_SPEED, dy * ROTATE_SPEED);
                }
            }
            this.prevSpinGrab = grab;
        }
        else if (mode === "zoom") {
            const d = Math.hypot(pinchedGrabs[0].x - pinchedGrabs[1].x, pinchedGrabs[0].y - pinchedGrabs[1].y);
            if (this.prevZoomDist && d > 1e-4) {
                // Spread hands apart -> factor < 1 -> camera moves closer
                const factor = Math.min(1.18, Math.max(0.85, this.prevZoomDist / d));
                this.callbacks.onZoom(factor);
            }
            this.prevZoomDist = d;
        }
        this.emitStatus({ hands: landmarks.length, mode });
    }
    emitStatus(status) {
        if (status.hands !== this.lastStatus.hands ||
            status.mode !== this.lastStatus.mode) {
            this.lastStatus = status;
            this.callbacks.onStatus(status);
        }
    }
    drawOverlay(landmarks) {
        const ctx = this.overlay.getContext("2d");
        if (!ctx)
            return;
        const { width, height } = this.overlay;
        ctx.clearRect(0, 0, width, height);
        for (const lm of landmarks) {
            const thumb = lm[THUMB_TIP];
            const index = lm[INDEX_TIP];
            // Overlay canvas sits on the mirrored video preview, so mirror x here too
            const tx = (1 - thumb.x) * width;
            const ty = thumb.y * height;
            const ix = (1 - index.x) * width;
            const iy = index.y * height;
            const handScale = dist2d(lm[WRIST], lm[MIDDLE_MCP]);
            const pinched = handScale > 1e-6 && dist2d(thumb, index) / handScale < PINCH_ON;
            ctx.strokeStyle = pinched ? "#ffcc66" : "rgba(255,170,48,0.5)";
            ctx.lineWidth = pinched ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(ix, iy);
            ctx.stroke();
            ctx.fillStyle = pinched ? "#ffcc66" : "rgba(255,170,48,0.7)";
            for (const [x, y] of [
                [tx, ty],
                [ix, iy],
            ]) {
                ctx.beginPath();
                ctx.arc(x, y, pinched ? 5 : 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
function dist2d(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
function getHandCenter(lm) {
    return {
        x: 1 - (lm[WRIST].x + lm[MIDDLE_MCP].x) / 2,
        y: (lm[WRIST].y + lm[MIDDLE_MCP].y) / 2,
    };
}
function fingerExtended(lm, tip, pip, mcp) {
    const palmToPip = dist2d(lm[WRIST], lm[pip]);
    const palmToTip = dist2d(lm[WRIST], lm[tip]);
    const curledTowardPalm = dist2d(lm[tip], lm[WRIST]) < dist2d(lm[pip], lm[WRIST]) * 1.08;
    const verticalExtension = lm[tip].y < lm[pip].y - 0.015;
    const radialExtension = palmToTip > palmToPip * 1.12;
    return !curledTowardPalm && (verticalExtension || radialExtension || palmToTip > dist2d(lm[WRIST], lm[mcp]) * 1.45);
}
function thumbExtended(lm, handScale) {
    return dist2d(lm[THUMB_TIP], lm[INDEX_MCP]) > handScale * 0.95 &&
        dist2d(lm[THUMB_TIP], lm[WRIST]) > dist2d(lm[THUMB_IP], lm[WRIST]) * 1.1;
}
function classifyHandShape(lm, handScale) {
    const index = fingerExtended(lm, INDEX_TIP, INDEX_PIP, INDEX_MCP);
    const middle = fingerExtended(lm, MIDDLE_TIP, MIDDLE_PIP, MIDDLE_MCP);
    const ring = fingerExtended(lm, RING_TIP, RING_PIP, RING_MCP);
    const pinky = fingerExtended(lm, PINKY_TIP, PINKY_PIP, PINKY_MCP);
    const thumb = thumbExtended(lm, handScale);
    const extendedCount = [index, middle, ring, pinky].filter(Boolean).length + (thumb ? 1 : 0);
    const openPalm = extendedCount >= 4;
    const fist = extendedCount <= 1 &&
        [INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP].every((tip) => dist2d(lm[tip], lm[WRIST]) < handScale * 1.55);
    const pointing = index && !middle && !ring && !pinky;
    const thumbAboveFingers = lm[THUMB_TIP].y < lm[INDEX_PIP].y &&
        lm[THUMB_TIP].y < lm[MIDDLE_PIP].y &&
        Math.abs(lm[THUMB_TIP].x - lm[WRIST].x) < handScale * 1.2;
    const thumbsUp = thumb && !index && !middle && !ring && !pinky && thumbAboveFingers;
    return {
        openPalm,
        fist,
        pointing,
        thumbsUp,
        pointer: {
            x: 1 - lm[INDEX_TIP].x,
            y: lm[INDEX_TIP].y,
        },
    };
}
