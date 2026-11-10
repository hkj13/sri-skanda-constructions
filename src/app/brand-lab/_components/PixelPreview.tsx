"use client";

import { useEffect, useRef } from "react";

/**
 * Rasterises an SVG at an exact pixel size and shows it enlarged with hard
 * pixel edges: an honest look at what a 16 px favicon really is.
 */
export function PixelPreview({
  svg,
  pixels,
  zoom,
  label,
}: {
  svg: string;
  pixels: number;
  zoom: number;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, pixels, pixels);
      ctx.drawImage(img, 0, 0, pixels, pixels);
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return () => {
      cancelled = true;
    };
  }, [svg, pixels]);

  return (
    <canvas
      ref={ref}
      width={pixels}
      height={pixels}
      role="img"
      aria-label={label}
      style={{
        width: pixels * zoom,
        height: pixels * zoom,
        imageRendering: "pixelated",
      }}
    />
  );
}
