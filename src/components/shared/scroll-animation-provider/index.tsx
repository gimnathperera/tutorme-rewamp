"use client";
import { useEffect } from "react";

/**
 * ScrollAnimationProvider
 *
 * Wires up IntersectionObserver on every element that has one of the
 * animation trigger classes.  When an element enters the viewport it
 * gets the `is-visible` class, which CSS transitions handle entirely
 * (see globals.css: .animate-on-scroll.is-visible, etc.)
 */
const ScrollAnimationProvider = () => {
    useEffect(() => {
        const selectors = [
            ".animate-on-scroll",
            ".animate-fade-in",
            ".animate-slide-left",
            ".animate-slide-right",
        ];

        const elements = document.querySelectorAll<HTMLElement>(
            selectors.join(", ")
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        // Once visible, stop observing to preserve the state
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null;
};

export default ScrollAnimationProvider;
