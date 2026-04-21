"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const RouteScrollManager = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const frame = requestAnimationFrame(() => {
      scrollToPageTop();
      setTimeout(scrollToPageTop, 0);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
};

export default RouteScrollManager;
