import type { CSSProperties } from "react";
import {
  MARK_SIZE,
  buildWordmark,
  inkColor,
  layoutLogo,
  markShapes,
  symbolId,
  type LogoKind,
  type LogoVariant,
} from "./build";
import {
  CONCEPTS,
  NAVY,
  getConcept,
  type Concept,
  type ConceptId,
  type Shape,
} from "./concepts";

const VARIANTS: LogoVariant[] = ["light", "dark", "mono"];

function ShapePaths({ shapes }: { shapes: Shape[] }) {
  return (
    <>
      {shapes.map((s, i) =>
        s.stroke ? (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={inkColor(s.ink)}
            strokeWidth={s.stroke}
            strokeMiterlimit={8}
            transform={s.transform}
          />
        ) : (
          <path
            key={i}
            d={s.d}
            fill={inkColor(s.ink)}
            fillRule={s.evenodd ? "evenodd" : undefined}
            transform={s.transform}
          />
        ),
      )}
    </>
  );
}

/**
 * Hidden sprite holding every piece of logo artwork once. Render it a single
 * time per page; <Logo> instances then point at it with <use>, so a page can
 * show the logo many times without repeating the outlines.
 */
export function LogoSprite({ concepts = CONCEPTS }: { concepts?: Concept[] }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      {concepts.map((concept) => {
        const word = buildWordmark(concept);
        return (
          <g key={concept.id}>
            {VARIANTS.map((variant) => (
              <symbol
                key={variant}
                id={symbolId(concept, `mark-${variant}`)}
                viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
              >
                <ShapePaths shapes={markShapes(concept, variant)} />
              </symbol>
            ))}
            <symbol
              id={symbolId(concept, "icon")}
              viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
            >
              <ShapePaths shapes={markShapes(concept, "icon")} />
            </symbol>
            {/* Lettering colours come from the .logo-* class on the <svg>. */}
            <symbol
              id={symbolId(concept, "word")}
              viewBox={`0 0 ${word.width} ${word.height}`}
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
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The <use> elements for one logo, for placing inside another SVG (mock-ups,
 * illustrations). The parent must carry the matching .logo-* class.
 */
export function LogoUse({
  concept,
  kind,
  variant = "light",
  x = 0,
  y = 0,
  height,
}: {
  concept: ConceptId;
  kind: LogoKind;
  variant?: LogoVariant;
  x?: number;
  y?: number;
  /** Rendered height in the parent's units. Defaults to the natural size. */
  height?: number;
}) {
  const c = getConcept(concept);
  const layout = layoutLogo(c, kind);
  const scale = height ? height / layout.height : 1;
  const markId = symbolId(c, kind === "icon" ? "icon" : `mark-${variant}`);
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
          href={`#${symbolId(c, "word")}`}
          x={layout.word.x}
          y={layout.word.y}
          width={layout.word.width}
          height={layout.word.height}
        />
      ) : null}
    </g>
  );
}

export function logoAspect(concept: ConceptId, kind: LogoKind): number {
  const { width, height } = layoutLogo(getConcept(concept), kind);
  return width / height;
}

type LogoProps = {
  concept: ConceptId;
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
  concept,
  kind = "horizontal",
  variant = "light",
  title,
  className,
  style,
}: LogoProps) {
  const { width, height } = layoutLogo(getConcept(concept), kind);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={[`logo-${variant}`, className].filter(Boolean).join(" ")}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <LogoUse concept={concept} kind={kind} variant={variant} />
    </svg>
  );
}
