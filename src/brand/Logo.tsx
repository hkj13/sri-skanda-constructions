import type { CSSProperties } from "react";
import {
  buildWordmark,
  inkColor,
  layoutLogo,
  markShapes,
  symbolId,
  type LogoKind,
  type LogoVariant,
} from "./build";
import { MARK_SIZE, NAVY, type Shape } from "./logo-art";

const VARIANTS: LogoVariant[] = ["light", "dark", "mono"];

function ShapePaths({ shapes }: { shapes: Shape[] }) {
  return (
    <>
      {shapes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill={inkColor(s.ink)}
          fillRule={s.evenodd ? "evenodd" : undefined}
          transform={s.transform}
        />
      ))}
    </>
  );
}

/**
 * Hidden sprite holding the logo artwork once. Render it a single time per
 * page (the root layout does this); every <Logo> then points at it with
 * <use>, so the logo can appear many times without repeating its outlines.
 */
export function LogoSprite() {
  const word = buildWordmark();
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      {VARIANTS.map((variant) => (
        <symbol
          key={variant}
          id={symbolId(`mark-${variant}`)}
          viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
        >
          <ShapePaths shapes={markShapes(variant)} />
        </symbol>
      ))}
      <symbol id={symbolId("icon")} viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}>
        <ShapePaths shapes={markShapes("icon")} />
      </symbol>
      {/* Lettering colours come from the .logo-* class on the <svg>.
          Round letters overshoot the cap height slightly, so the symbol
          must not clip at its own edges. */}
      <symbol
        id={symbolId("word")}
        viewBox={`0 0 ${word.width} ${word.height}`}
        overflow="visible"
      >
        {word.glyphs.map((g, i) => (
          <path
            key={i}
            d={g.d}
            transform={g.transform}
            style={{
              fill:
                g.line === "primary"
                  ? `var(--logo-text, ${NAVY})`
                  : `var(--logo-sub, ${NAVY})`,
            }}
          />
        ))}
      </symbol>
    </svg>
  );
}

/**
 * The <use> elements for one logo, for placing inside another SVG (mock-ups,
 * illustrations). The parent must carry the matching .logo-* class.
 */
export function LogoUse({
  kind,
  variant = "light",
  x = 0,
  y = 0,
  height,
}: {
  kind: LogoKind;
  variant?: LogoVariant;
  x?: number;
  y?: number;
  /** Rendered height in the parent's units. Defaults to the natural size. */
  height?: number;
}) {
  const layout = layoutLogo(kind);
  const scale = height ? height / layout.height : 1;
  const markId = symbolId(kind === "icon" ? "icon" : `mark-${variant}`);
  return (
    <g
      transform={
        x || y || scale !== 1 ? `translate(${x} ${y}) scale(${scale})` : undefined
      }
    >
      <use
        href={`#${markId}`}
        x={layout.mark.x}
        y={layout.mark.y}
        width={layout.mark.width}
        height={layout.mark.height}
      />
      {layout.word ? (
        <use
          href={`#${symbolId("word")}`}
          x={layout.word.x}
          y={layout.word.y}
          width={layout.word.width}
          height={layout.word.height}
        />
      ) : null}
    </g>
  );
}

/** Width divided by height, for sizing a logo by one dimension in CSS. */
export function logoAspect(kind: LogoKind): number {
  const { width, height } = layoutLogo(kind);
  return width / height;
}

type LogoProps = {
  /**
   * horizontal: mark beside the name (default).
   * stacked:    mark above the name.
   * mark:       the mark alone, in its square.
   * icon:       the favicon: mark on a rounded navy tile.
   */
  kind?: LogoKind;
  /**
   * light: for white and lime grounds (default).
   * dark:  reversed, for navy grounds.
   * mono:  one colour, taken from the CSS `color` of the element.
   */
  variant?: LogoVariant;
  /** Accessible name. Leave out when the logo is decorative. */
  title?: string;
  className?: string;
  style?: CSSProperties;
};

export function Logo({
  kind = "horizontal",
  variant = "light",
  title,
  className,
  style,
}: LogoProps) {
  const { width, height } = layoutLogo(kind);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={[`logo-${variant}`, className].filter(Boolean).join(" ")}
      style={{ overflow: "visible", ...style }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <LogoUse kind={kind} variant={variant} />
    </svg>
  );
}
