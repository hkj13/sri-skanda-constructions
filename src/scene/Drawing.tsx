import { DRAWINGS, DRAWING_SIZE, type DrawingName } from "./drawings";

/**
 * A pre-rendered building drawing as an image. Plain <img>: the files are
 * small vector drawings that need no resizing, and next/image does not
 * optimise SVG.
 */
export function Drawing({
  name,
  className,
  eager,
  alt,
}: {
  name: DrawingName;
  className?: string;
  /** Load straight away (above the fold). */
  eager?: boolean;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/drawings/${name}.svg`}
      alt={alt ?? DRAWINGS[name].alt}
      width={DRAWING_SIZE.width}
      height={DRAWING_SIZE.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}
