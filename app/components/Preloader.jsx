"use client";

import { useEffect, useState } from "react";

const PRELOADER_KEY = "umv-preloader-seen";
const FALLBACK_DURATION = 60000; // emergency only — video onEnded is the real trigger
const EXIT_DURATION = 850;

function dispatchDone() {
  window.dispatchEvent(new CustomEvent("umv:preloader-done"));
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const hasSeenPreloader =
      window.sessionStorage.getItem(PRELOADER_KEY) === "true" ||
      window.__umvPreloaderHasPlayed === true ||
      window.__umvPreloaderIsPlaying === true;

    if (hasSeenPreloader) {
      setIsHidden(true);
      return;
    }

    window.sessionStorage.setItem(PRELOADER_KEY, "true");
    window.__umvPreloaderIsPlaying = true;
    setIsVisible(true);

    const fallbackTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, FALLBACK_DURATION);

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!isLeaving) return;
    window.__umvPreloaderHasPlayed = true;
    window.__umvPreloaderIsPlaying = false;
    dispatchDone();

    const exitTimer = window.setTimeout(() => {
      setIsHidden(true);
    }, EXIT_DURATION);

    return () => window.clearTimeout(exitTimer);
  }, [isLeaving]);

  if (!isVisible || isHidden) return null;

  return (
    <div className={`preloader${isLeaving ? " preloader-leaving" : ""}`} aria-label="Loading UMV Digital Solutions">
      <video
        className="loader-video"
        src="/umv3.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIsLeaving(true)}
        onError={() => setIsLeaving(true)}
      />
    </div>
  );
}
