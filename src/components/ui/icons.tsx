type IconProps = { className?: string };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
};

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className}>
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.800 12 21 12 21z" />
      <path d="M12 7v5M9.500 9.500h5" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function SocialIcon({ name, className }: IconProps & { name: "facebook" | "instagram" | "linkedin" | "youtube" }) {
  const paths = {
    facebook: "M14 8.500V7c0-.800.300-1.300 1.400-1.300H17V3h-2.300C12 3 11 4.700 11 6.800v1.700H9V11h2v10h3V11h2.600l.400-2.500H14z",
    instagram: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5.200A3.800 3.800 0 1012 15.800 3.800 3.800 0 0012 8.200zm0 2a1.800 1.800 0 110 3.600 1.800 1.800 0 010-3.600zM17.300 5.700a1 1 0 100 2 1 1 0 000-2z",
    linkedin: "M4 9h3v11H4V9zm1.500-5a1.800 1.800 0 110 3.600 1.800 1.800 0 010-3.600zM10 9h2.900v1.500c.500-.900 1.600-1.800 3.300-1.800 3 0 3.800 2 3.800 4.600V20h-3v-5.900c0-1.300-.400-2.300-1.700-2.300-1.400 0-2.300 1-2.300 2.500V20h-3V9z",
    youtube: "M21.600 7.200a2.500 2.500 0 00-1.800-1.800C18.300 5 12 5 12 5s-6.300 0-7.800.400A2.500 2.500 0 002.400 7.200 26 26 0 002 12a26 26 0 00.400 4.800 2.500 2.500 0 001.800 1.800C5.700 19 12 19 12 19s6.300 0 7.800-.400a2.500 2.500 0 001.800-1.800A26 26 0 0022 12a26 26 0 00-.400-4.800zM10 15V9l5.200 3L10 15z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true" focusable="false" className={className}>
      <path d={paths[name]} />
    </svg>
  );
}
