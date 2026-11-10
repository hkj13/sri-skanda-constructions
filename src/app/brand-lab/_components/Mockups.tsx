import { addressLines, site } from "@content/site";
import { Logo, LogoUse, logoAspect } from "@/brand/Logo";
import { LIME, NAVY, NAVY_2, getConcept, type ConceptId } from "@/brand/concepts";

const JOST = "var(--font-jost), sans-serif";

/** A navy site hoarding with the reversed lockup, as painted on sheet panels. */
export function Hoarding({ concept }: { concept: ConceptId }) {
  const c = getConcept(concept);
  const logoH = 104;
  const seams = [195, 330, 465, 600, 735, 870, 1005];
  return (
    <svg
      viewBox="0 0 1200 430"
      className="logo-dark block h-auto w-full"
      role="img"
      aria-label={`Concept ${c.letter} painted on a navy site hoarding`}
    >
      <rect width="1200" height="430" fill="#f1f2f4" />
      {/* scaffold behind the hoarding, drawn like a blueprint */}
      <g stroke="#c9ccd3" strokeWidth="2" fill="none">
        <path d="M760 96 V28 H1090 V96 M870 28 V96 M980 28 V96 M760 62 H1090" />
        <path d="M760 28 L870 62 L980 28 L1090 62" />
      </g>
      <rect y="372" width="1200" height="58" fill="#e2e4e8" />
      <path d="M0 372 H1200" stroke="#b3b7c0" strokeWidth="2" />
      {[60, ...seams, 1130].map((x) => (
        <rect key={x} x={x - 6} y="352" width="12" height="22" fill="#7d8291" />
      ))}
      <rect x="60" y="96" width="1080" height="262" fill={NAVY} />
      {seams.map((x) => (
        <path key={x} d={`M${x} 106 V358`} stroke={NAVY_2} strokeWidth="2" />
      ))}
      {/* hi-vis rail */}
      <rect x="60" y="96" width="1080" height="10" fill={LIME} />
      <LogoUse
        concept={concept}
        kind="horizontal"
        variant="dark"
        x={116}
        y={232 - logoH / 2}
        height={logoH}
      />
      <g fontFamily={JOST} textAnchor="end">
        <text x="1084" y="200" fontSize="18" letterSpacing="3" fill="#ffffff">
          RESIDENTIAL · COMMERCIAL · TURNKEY
        </text>
        <text x="1084" y="254" fontSize="46" fontWeight="600" fill={LIME}>
          {site.phone.display}
        </text>
        <text
          x="1084"
          y="290"
          fontSize="20"
          letterSpacing="1"
          fill="#ffffff"
          fillOpacity="0.8"
        >
          {site.address.locality}, {site.address.city}
        </text>
      </g>
    </svg>
  );
}

/** A site helmet seen from the front, with the mark on the shell. */
export function Helmet({
  concept,
  shell,
}: {
  concept: ConceptId;
  shell: "white" | "lime";
}) {
  const c = getConcept(concept);
  const fill = shell === "white" ? "#ffffff" : LIME;
  return (
    <svg
      viewBox="0 0 300 236"
      className="logo-light block h-auto w-full"
      role="img"
      aria-label={`Concept ${c.letter} on a ${shell} site helmet`}
    >
      <ellipse cx="150" cy="214" rx="118" ry="9" fill="#d9dce2" />
      <path
        d="M40 170 C40 92 92 38 150 38 C208 38 260 92 260 170 Z"
        fill={fill}
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* ribs */}
      <g fill="none" stroke={NAVY} strokeWidth="2" strokeOpacity="0.35">
        <path d="M100 54 C82 88 76 126 76 170" />
        <path d="M200 54 C218 88 224 126 224 170" />
      </g>
      <path
        d="M22 170 H278 A10 10 0 0 1 278 190 H22 A10 10 0 0 1 22 170 Z"
        fill={fill}
        stroke={NAVY}
        strokeWidth="3"
      />
      <LogoUse concept={concept} kind="mark" x={117} y={82} height={66} />
    </svg>
  );
}

/** Front and back of a 90 x 50 mm business card. */
export function BusinessCard({ concept }: { concept: ConceptId }) {
  const c = getConcept(concept);
  const [line1, line2] = addressLines();
  return (
    <div className="mx-auto grid max-w-[920px] gap-6 sm:grid-cols-2">
      <div className="@container flex aspect-[9/5] flex-col justify-between rounded-[6px] bg-white p-[7%] shadow-[0_1px_2px_rgba(26,35,64,0.12),0_14px_30px_-12px_rgba(26,35,64,0.3)]">
        <Logo
          concept={concept}
          kind="horizontal"
          title={`Concept ${c.letter} on the front of a business card`}
          className="h-auto w-[58%]"
        />
        <div className="text-[3.1cqw] leading-snug text-primary">
          <p className="font-semibold tracking-wide">{site.phone.display}</p>
          <p className="mt-[0.4em]">
            {line1}
            <br />
            {line2}
          </p>
        </div>
      </div>
      <div className="relative flex aspect-[9/5] items-center justify-center overflow-hidden rounded-[6px] bg-primary shadow-[0_1px_2px_rgba(26,35,64,0.12),0_14px_30px_-12px_rgba(26,35,64,0.45)]">
        <Logo
          concept={concept}
          kind="stacked"
          variant="dark"
          title={`Concept ${c.letter} on the back of a business card`}
          className="h-[62%] w-auto"
          style={{ aspectRatio: logoAspect(concept, "stacked") }}
        />
        <span className="absolute inset-x-0 bottom-0 h-[5px] bg-accent" />
      </div>
    </div>
  );
}

/** The mark inside WhatsApp's round profile picture crop. */
export function WhatsAppAvatar({ concept }: { concept: ConceptId }) {
  const c = getConcept(concept);
  const avatar = (size: string) => (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary ${size}`}
    >
      <Logo concept={concept} kind="mark" variant="dark" className="h-[56%] w-[56%]" />
    </span>
  );
  return (
    <div
      role="img"
      aria-label={`Concept ${c.letter} as a WhatsApp profile picture`}
      className="flex h-full flex-col items-center justify-center gap-6"
    >
      {avatar("h-40 w-40")}
      <div className="flex w-full max-w-[340px] items-center gap-3 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(26,35,64,0.1)]">
        {avatar("h-12 w-12")}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-primary">{site.name}</p>
          <p className="truncate text-[13px] text-neutral-600">
            Tell us about your plot
          </p>
        </div>
      </div>
    </div>
  );
}
