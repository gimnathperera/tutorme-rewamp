"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";

const NavBar: React.FC = () => {
  /** True only when hero page is loaded and scroll position is at the very top */
  const [isHeroTop, setIsHeroTop] = useState(false);
  const pathname = usePathname();

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
      const heroVisible = !!heroEl && atTop;
      setIsHeroTop(heroVisible);

      // data-hero lets CSS know whether a hero is present (for solid navbar on non-hero pages)
      document.documentElement.dataset.hero = heroEl ? "1" : "0";
      // Keep the data-scroll attribute for the navbar background-color CSS transition
      document.documentElement.dataset.scroll = window.scrollY.toString();
    };

    const debouncedUpdate = debounce(update);

    document.addEventListener("scroll", debouncedUpdate, { passive: true });
    // Re-run on every route change (hero may appear/disappear after navigation)
    update();

    return () => document.removeEventListener("scroll", debouncedUpdate);
  }, [pathname]); // re-run whenever the route changes

  return <Header isHeroTop={isHeroTop} />;
};

export default NavBar;
