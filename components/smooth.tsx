"use client";

import { useEffect } from "react";

export function Smooth() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion");
    // Reveal sections as they enter the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of document.querySelectorAll(".reveal")) io.observe(el);
    return () => {
      io.disconnect();
    };
  }, []);
  return null;
}
