/** Small line drawings for each stage of the build journey. */
const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
  focusable: false,
  viewBox: "0 0 64 64",
};

export function StageIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "consultation":
      return (
        <svg {...common} className={className}>
          <path d="M8 12h34v22H22l-8 7v-7H8z" />
          <path d="M28 40v6h16l8 7v-7h4V24h-8" />
          <path d="M15 20h20M15 26h12" />
        </svg>
      );
    case "site-visit":
      return (
        <svg {...common} className={className}>
          <path d="M6 46l26-14 26 14-26 14z" />
          <path d="M6 46V40M32 32v-6M58 46v-6" />
          <path d="M44 20v18M40 38h8" />
          <circle cx={44} cy={14} r={5} />
        </svg>
      );
    case "design":
      return (
        <svg {...common} className={className}>
          <rect x={8} y={8} width={48} height={48} />
          <path d="M8 30h22V8M30 30v26M30 40h26" />
          <path d="M44 8v10" />
        </svg>
      );
    case "approval":
      return (
        <svg {...common} className={className}>
          <path d="M14 6h28l10 10v42H14z" />
          <path d="M42 6v10h10" />
          <circle cx={33} cy={38} r={10} />
          <path d="M28 38l4 4 7-8" />
        </svg>
      );
    case "agreement":
      return (
        <svg {...common} className={className}>
          <path d="M12 6h40v52H12z" />
          <path d="M20 16h24M20 24h24M20 32h24M20 40h12" />
          <path d="M36 50c4-6 6-6 8-2s4 2 6-2" />
        </svg>
      );
    case "construction":
      return (
        <svg {...common} className={className}>
          <path d="M10 58V10h4v48M14 10h44M14 16h30" />
          <path d="M40 16v12" />
          <rect x={34} y={28} width={12} height={8} />
          <path d="M24 58V40h28v18M24 48h28" />
        </svg>
      );
    case "quality":
      return (
        <svg {...common} className={className}>
          <rect x={6} y={26} width={52} height={14} />
          <rect x={26} y={29} width={12} height={8} />
          <path d="M32 26V18M32 40v6" />
          <path d="M14 52l6 6 12-12" />
        </svg>
      );
    case "handover":
      return (
        <svg {...common} className={className}>
          <circle cx={20} cy={32} r={9} />
          <path d="M29 32h28M48 32v8M54 32v6" />
          <path d="M14 40l-4 12h12" />
        </svg>
      );
    default:
      return null;
  }
}
