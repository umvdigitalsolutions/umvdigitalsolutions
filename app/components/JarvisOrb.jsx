"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hand } from "lucide-react";
import { createOrbScene } from "@/lib/orbScene";
import { HandTracker } from "@/lib/handTracker";
import { services as serviceEntries } from "./siteData";

const SERVICES = serviceEntries.map(([title]) => title);

export default function JarvisOrb({ scrollDriven = false }) {
  const orbRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const sceneRef = useRef(null);
  const trackerRef = useRef(null);

  const [camera, setCamera] = useState("off");

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
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (scrollDriven) {
        window.removeEventListener("scroll", requestScrollUpdate);
        window.removeEventListener("resize", requestScrollUpdate);
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

  const startGestures = useCallback(async () => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay || trackerRef.current) return;

    setCamera("starting");

    const tracker = new HandTracker(video, overlay, {
      onRotate: (dt, dp) => sceneRef.current?.rotateBy(dt, dp),
      onZoom: (factor) => sceneRef.current?.zoomBy(factor),
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
  }, []);

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
    <div ref={orbRef} className={`jarvis-orb${scrollDriven ? " scroll-driven" : ""}`} aria-label="Interactive Ultron hero orb">
      <div ref={containerRef} className="orb-root" />

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
    </div>
  );
}
