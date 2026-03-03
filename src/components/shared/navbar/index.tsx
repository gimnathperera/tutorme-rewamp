"use client";
import React, { useEffect, useState } from "react";
import Header from "./header";

const NavBar: React.FC = () => {
  /** True only when hero page is loaded and scroll position is at the very top */
  const [isHeroTop, setIsHeroTop] = useState(false);

  useEffect(() => {
    const debounce = (fn: Function) => {
      let frame: number;
      return (...params: any[]) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => fn(...params));
      };
    };

    const update = () => {
      const heroEl = document.getElementById("hero-section");
      const atTop = window.scrollY === 0;
      setIsHeroTop(!!heroEl && atTop);

      // Keep the data-scroll attribute for the navbar background-color CSS transition
      document.documentElement.dataset.scroll = window.scrollY.toString();
    };

    const debouncedUpdate = debounce(update);

    document.addEventListener("scroll", debouncedUpdate, { passive: true });
    // Also re-run on any route change (hero may appear/disappear)
    update();

    return () => document.removeEventListener("scroll", debouncedUpdate);
  }, []);

  return <Header isHeroTop={isHeroTop} />;
};

export default NavBar;
