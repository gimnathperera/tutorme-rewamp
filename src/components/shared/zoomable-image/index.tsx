"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ZoomableImage = ({
  src,
  alt,
  width,
  height,
  className,
}: ZoomableImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label={`Zoom in: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
          <div
            className="relative max-h-[90vh] max-w-[95vw] overflow-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-auto max-h-[90vh] max-w-[95vw] cursor-zoom-out rounded-lg"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
