"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeQuestionMark, Expand, Hand, HandGrab, MoveHorizontal, Pause, Rotate3D, ThumbsUp, ZoomIn } from "lucide-react";
import { createOrbScene } from "@/lib/orbScene";
import { HandTracker } from "@/lib/handTracker";
import { services as serviceEntries } from "./siteData";

const SERVICES = serviceEntries.map(([title]) => title);
const GESTURE_GUIDE = [
  ["Pinch", "Zoom / spin", ZoomIn],
  ["Open palm", "Wake services", Hand],
  ["Holo hold", "Grip orb", HandGrab],
  ["Fist", "Pause orb", Pause],
  ["Swipe", "Rotate services", MoveHorizontal],
  ["Two hands", "Show all", Expand],
  ["Thumbs up", "Next section", ThumbsUp],
  ["Hold + drag", "Rotate orb", Rotate3D],
];

export default function JarvisOrb({ scrollDriven = false }) {
  const orbRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const sceneRef = useRef(null);
  const trackerRef = useRef(null);
  const dragRef = useRef({
    pointerId: null,
    active: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    scrolling: false,
    holdTimer: 0,
  });

  const [camera, setCamera] = useState("off");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const scene = createOrbScene(container, {
      services: SERVICES,
      scrollDriven,
    });
    sceneRef.current = scene;

    let frameId = 0;
    const updateScrollProgress = () => {
      frameId = 0;
      if (!scrollDriven) return;
      const orb = orbRef.current;
      const section = orb?.closest(".services-orb-section");
      const shell = orb?.closest(".services-page-orb");
      if (!section || !shell) return;

      const sectionRect = section.getBoundingClientRect();
      const stickyTop = parseFloat(window.getComputedStyle(shell).top) || 0;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight + stickyTop);
      const progress = Math.min(1, Math.max(0, (-sectionRect.top + stickyTop) / travel));
      scene.setScrollProgress(progress);
    };
    const requestScrollUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    if (scrollDriven) {
      requestScrollUpdate();
      window.addEventListener("scroll", requestScrollUpdate, { passive: true });
      window.addEventListener("resize", requestScrollUpdate);
      window.visualViewport?.addEventListener("resize", requestScrollUpdate);
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (scrollDriven) {
        window.removeEventListener("scroll", requestScrollUpdate);
        window.removeEventListener("resize", requestScrollUpdate);
        window.visualViewport?.removeEventListener("resize", requestScrollUpdate);
      }
      trackerRef.current?.stop();
      trackerRef.current = null;
      scene.dispose();
      sceneRef.current = null;
    };
  }, [scrollDriven]);

  const stopGestures = useCallback(() => {
    trackerRef.current?.stop();
    trackerRef.current = null;
    setCamera("off");
  }, []);

  const scrollAfterOrb = useCallback(() => {
    const section = orbRef.current?.closest(".services-orb-section");
    const nextSection = section?.nextElementSibling;
    if (nextSection instanceof HTMLElement) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  const startGestures = useCallback(async () => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay || trackerRef.current) return;

    setCamera("starting");

    const tracker = new HandTracker(video, overlay, {
      onRotate: (dt, dp) => sceneRef.current?.rotateBy(dt, dp),
      onZoom: (factor) => sceneRef.current?.zoomBy(factor),
      onWake: () => sceneRef.current?.wake(),
      onPause: (paused) => sceneRef.current?.setPaused(paused),
      onSwipe: (direction) => sceneRef.current?.rotateBy(direction === "right" ? -0.85 : 0.85, 0),
      onExpand: () => sceneRef.current?.showAllServices(),
      onThumbsUp: scrollAfterOrb,
      onStatus: () => {},
    });
    trackerRef.current = tracker;

    try {
      await tracker.start();
      setCamera("on");
    } catch (err) {
      trackerRef.current = null;
      tracker.stop();
      setCamera("off");
      console.warn("Hand tracking failed to start", err);
    }
  }, [scrollAfterOrb]);

  const clearHoldTimer = useCallback(() => {
    if (dragRef.current.holdTimer) {
      window.clearTimeout(dragRef.current.holdTimer);
      dragRef.current.holdTimer = 0;
    }
  }, []);

  const startOrbDrag = useCallback((pointerId) => {
    const root = containerRef.current;
    dragRef.current.active = true;
    setDragging(true);
    try {
      root?.setPointerCapture(pointerId);
    } catch {
      // Pointer capture is best-effort; drag still works if the browser refuses it.
    }
  }, []);

  const endOrbDrag = useCallback(
    (event) => {
      const state = dragRef.current;
      if (state.pointerId !== event.pointerId) return;

      clearHoldTimer();
      try {
        containerRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        // Capture may already be released after a native touch scroll.
      }

      dragRef.current = {
        pointerId: null,
        active: false,
        lastX: 0,
        lastY: 0,
        startX: 0,
        startY: 0,
        scrolling: false,
        holdTimer: 0,
      };
      setDragging(false);
    },
    [clearHoldTimer],
  );

  const handleOrbPointerDown = useCallback(
    (event) => {
      if (!scrollDriven) return;
      if (event.button !== undefined && event.button !== 0) return;

      clearHoldTimer();
      const state = dragRef.current;
      state.pointerId = event.pointerId;
      state.active = event.pointerType === "mouse";
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.scrolling = false;

      if (state.active) {
        startOrbDrag(event.pointerId);
        return;
      }

      state.holdTimer = window.setTimeout(() => {
        if (dragRef.current.pointerId === event.pointerId) {
          startOrbDrag(event.pointerId);
        }
      }, 180);
    },
    [clearHoldTimer, scrollDriven, startOrbDrag],
  );

  const handleOrbPointerMove = useCallback(
    (event) => {
      const state = dragRef.current;
      if (state.pointerId !== event.pointerId) return;

      const totalX = event.clientX - state.startX;
      const totalY = event.clientY - state.startY;

      if (!state.active) {
        const absX = Math.abs(totalX);
        const absY = Math.abs(totalY);

        if (event.pointerType === "touch" && scrollDriven && (state.scrolling || (absY > 9 && absY > absX * 1.15))) {
          clearHoldTimer();
          state.scrolling = true;
          event.preventDefault();
          window.scrollBy(0, state.lastY - event.clientY);
          state.lastX = event.clientX;
          state.lastY = event.clientY;
          return;
        }

        if (absX > 9 && absX > absY * 1.05) {
          clearHoldTimer();
          startOrbDrag(event.pointerId);
        } else {
          return;
        }
      }

      event.preventDefault();
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        sceneRef.current?.rotateBy(dx * 0.007, dy * 0.007);
      }
    },
    [clearHoldTimer, scrollDriven, startOrbDrag],
  );

  const toggleGestures = useCallback(() => {
    if (trackerRef.current) stopGestures();
    else void startGestures();
  }, [startGestures, stopGestures]);

  useEffect(() => {
    const onKey = (event) => {
      switch (event.key) {
        case "+":
        case "=":
          sceneRef.current?.zoomIn();
          break;
        case "-":
        case "_":
          sceneRef.current?.zoomOut();
          break;
        case "r":
        case "R":
          sceneRef.current?.resetView();
          break;
        case "g":
        case "G":
          toggleGestures();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleGestures]);

  const cameraOn = camera === "on";

  return (
    <div
      ref={orbRef}
      className={`jarvis-orb${scrollDriven ? " scroll-driven" : ""}${dragging ? " is-orb-dragging" : ""}${cameraOn ? " gestures-active" : ""}`}
      aria-label="Interactive Ultron hero orb"
    >
      <div
        ref={containerRef}
        className="orb-root"
        onPointerDown={handleOrbPointerDown}
        onPointerMove={handleOrbPointerMove}
        onPointerUp={endOrbDrag}
        onPointerCancel={endOrbDrag}
        onLostPointerCapture={endOrbDrag}
      />

      <div className="overlay-vignette" />
      <div className="overlay-grain" />
      <div className="overlay-scanlines" />

      <button
        type="button"
        className={`gesture-toggle${cameraOn ? " active" : ""}`}
        aria-label={cameraOn ? "Stop hand gestures" : "Start hand gestures"}
        aria-pressed={cameraOn}
        onClick={toggleGestures}
        disabled={camera === "starting"}
      >
        <Hand size={18} aria-hidden="true" />
        <span className="gesture-toggle-dot" />
      </button>

      <div className={`gesture-camera-panel${cameraOn ? " visible" : ""}`} aria-hidden={!cameraOn}>
        <video ref={videoRef} muted playsInline className="camera-video" />
        <canvas ref={overlayRef} width={208} height={156} className="camera-overlay" />
      </div>

      <div className="gesture-guide">
        <div className="gesture-guide-title">
          <BadgeQuestionMark size={15} aria-hidden="true" />
          <span>Gesture Guide</span>
        </div>
        <div className="gesture-guide-grid">
          {GESTURE_GUIDE.map(([gesture, action, Icon]) => (
            <div className="gesture-guide-item" key={gesture}>
              <Icon size={14} aria-hidden="true" />
              <span>
                <strong>{gesture}</strong>
                <small>{action}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
