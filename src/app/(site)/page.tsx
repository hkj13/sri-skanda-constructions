"use client";

import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Home,
  Compass,
  Ruler,
  HardHat,
  ShieldCheck,
  MessageCircle,
  ChevronUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, type ReactNode } from "react";

/* ── Modal component ── */
const modalVariants = {
  surface: {
    card: "bg-surface",
    close: "text-primary/40 hover:text-primary",
    title: "text-primary",
    body: "text-primary/70",
  },
  dark: {
    card: "bg-primary",
    close: "text-accent-light/40 hover:text-accent-light",
    title: "text-accent-light",
    body: "text-accent-light/70",
  },
  overlay: {
    card: "bg-gradient-to-br from-[#1a2340] to-[#2a3660]",
    close: "text-accent-light/40 hover:text-accent-light",
    title: "text-accent-light",
    body: "text-accent-light/70",
  },
};

type ModalVariant = keyof typeof modalVariants;

function Modal({
  open,
  onClose,
  title,
  children,
  variant = "surface",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: ModalVariant;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const v = modalVariants[variant];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative ${v.card} rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${v.close} transition`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className={`text-2xl font-bold ${v.title} pr-8`}>{title}</h3>
        <div className={`mt-4 ${v.body} text-sm leading-relaxed space-y-3`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Parallax hook: returns a Y offset driven by scroll ── */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * speed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return { ref, offset };
}

/* ── Reusable reveal wrapper (DOM-class based, no React state) ── */
function Reveal({
  children,
  className = "",
  effect = "fade-up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  effect?: "fade-up" | "fade-left" | "fade-right" | "zoom" | "flip";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.classList.add("revealed");
    };

    // Safety fallback: guarantee visibility after 1.5s
    const fallback = setTimeout(reveal, 1500);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay for stagger effect, then reveal
          setTimeout(reveal, delay);
          obs.unobserve(el);
          clearTimeout(fallback);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${effect} ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [popup, setPopup] = useState<{ title: string; content: ReactNode; variant: ModalVariant } | null>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ───── NAVBAR ───── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-primary/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#" className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            Sri Skanda Constructions
          </a>
          <div className="hidden md:flex gap-8 text-sm font-medium text-primary">
            <a href="#services" className="hover:text-primary/70 transition">Services</a>
            <a href="#specialization" className="hover:text-primary/70 transition">Specialization</a>
            <a href="#why-us" className="hover:text-primary/70 transition">Why Us</a>
            <a href="#testimonials" className="hover:text-primary/70 transition">Testimonials</a>
            <a href="#contact" className="hover:text-primary/70 transition">Contact</a>
            <a href="https://wa.me/919488084277" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-600 hover:text-green-700 transition"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a>
          </div>
          <button
            className="md:hidden text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-primary/10 px-6 pb-4 flex flex-col gap-3 text-sm font-medium text-primary">
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#specialization" onClick={() => setMenuOpen(false)}>Specialization</a>
            <a href="#why-us" onClick={() => setMenuOpen(false)}>Why Us</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <a href="https://wa.me/919488084277" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-green-600"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a>
          </div>
        )}
      </nav>

      {/* ───── HERO — Full-width Video BG ───── */}
      <section className="relative overflow-hidden h-[85vh] min-h-[500px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        >
          <source src="/videos/construction-site.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/20" />
        <div className="relative z-10 h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <Reveal effect="fade-up">
              <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1]">
                Building Your<br />Dreams
              </h1>
              <p className="mt-6 text-white/70 text-lg max-w-lg">
                Expert builders and developers delivering quality residential &amp;
                commercial construction with Vastu-compliant designs across India.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-block bg-accent text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-accent/90 transition"
              >
                Contact Us
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───── OUR EXPERTISE / SERVICES ───── */}
      <section id="services" className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-sans)] font-light tracking-tight text-primary">
              Our Expertise
            </h2>
            <p className="mt-2 text-primary/60">Trusted Builders &amp; Developers</p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Home className="w-8 h-8" />,
                title: "Residential Construction",
                desc: "Custom homes, villas, and apartments built with precision and care for your family.",
                detail: (
                  <>
                    <p>We specialize in building individual houses, villas, duplex homes, and multi-storey apartments tailored to your lifestyle and budget. Every project begins with understanding your family&apos;s needs.</p>
                    <p>Our residential projects include foundation-to-finish execution, interior coordination, landscaping, and compliance with local building codes. We use high-quality materials sourced from trusted suppliers to ensure longevity.</p>
                    <p>Whether it&apos;s a compact 2BHK or a sprawling independent villa, we deliver on time with transparent billing and regular progress updates.</p>
                  </>
                ),
              },
              {
                icon: <Building2 className="w-8 h-8" />,
                title: "Commercial Construction",
                desc: "Offices, retail spaces, and commercial complexes designed for business success.",
                detail: (
                  <>
                    <p>From modern office buildings and retail showrooms to warehouses and industrial facilities, we deliver commercial spaces engineered for productivity and growth.</p>
                    <p>We handle structural design, MEP (Mechanical, Electrical, Plumbing) coordination, fire safety compliance, and interior fit-outs. Our team ensures minimal disruption to your business timelines.</p>
                    <p>Every commercial project is built to meet industry standards with energy-efficient designs that reduce long-term operational costs.</p>
                  </>
                ),
              },
              {
                icon: <Compass className="w-8 h-8" />,
                title: "Vastu Consultation",
                desc: "Vastu-compliant designs ensuring harmony, prosperity, and positive energy in every space.",
                detail: (
                  <>
                    <p>Our certified Vastu consultants work alongside architects from the initial planning stage to ensure every room, entrance, and element aligns with Vastu Shastra principles.</p>
                    <p>We address directional placements for kitchens, bedrooms, puja rooms, and entrances. For existing properties, we provide remedial Vastu solutions without major structural changes.</p>
                    <p>Vastu consultation is included at no extra cost for all our construction projects — because we believe harmony starts at home.</p>
                  </>
                ),
              },
              {
                icon: <Ruler className="w-8 h-8" />,
                title: "Architectural Planning",
                desc: "Modern architectural planning with 2D/3D designs tailored to your vision and budget.",
                detail: (
                  <>
                    <p>Our in-house architects create detailed 2D floor plans and photorealistic 3D renderings so you can visualize your project before construction begins.</p>
                    <p>We consider plot orientation, natural light, ventilation, space optimization, and aesthetic preferences. Plans are revised until you are 100% satisfied.</p>
                    <p>All architectural plans include structural calculations, municipal approval drawings, and detailed material specifications.</p>
                  </>
                ),
              },
              {
                icon: <HardHat className="w-8 h-8" />,
                title: "Renovation & Remodeling",
                desc: "Transform your existing space with expert renovation and remodeling services.",
                detail: (
                  <>
                    <p>Breathe new life into your property with our renovation services — from kitchen and bathroom remodeling to complete home makeovers and structural strengthening.</p>
                    <p>We assess the existing structure, provide a detailed scope of work, and execute renovations with minimal disruption to your daily routine.</p>
                    <p>Our renovation projects include waterproofing, re-wiring, re-plumbing, flooring upgrades, and modern finishing touches.</p>
                  </>
                ),
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Turnkey Projects",
                desc: "End-to-end project delivery from foundation to finishing — completely hassle-free.",
                detail: (
                  <>
                    <p>With our turnkey service, you hand us the keys to your plot and we deliver a fully finished, move-in ready property. We manage everything — permits, materials, labour, and finishing.</p>
                    <p>This includes civil construction, electrical, plumbing, painting, flooring, modular kitchen, wardrobes, and landscaping. One point of contact, zero hassle.</p>
                    <p>Ideal for NRI clients and busy professionals who want quality construction without day-to-day involvement.</p>
                  </>
                ),
              },
            ].map((s, i) => (
              <Reveal key={i} effect="zoom" delay={i * 100}>
                <div
                  className="bg-surface rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full cursor-pointer"
                  onClick={() => setPopup({ title: s.title, content: s.detail, variant: "surface" })}
                >
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <h3 className="text-lg font-bold text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm text-primary/60">{s.desc}</p>
                  <span className="mt-4 inline-block text-xs font-semibold text-primary/40 group-hover:text-primary transition">Learn more →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── SERVING ALL OVER INDIA — Video BG ───── */}
      <section className="relative overflow-hidden py-20 md:py-32 px-6">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        >
          <source src="/videos/building-landscape.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal effect="fade-up">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider">
              Your Trusted Builder Nationwide
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Serving All Over<br />India
            </h2>
            <p className="mt-4 text-white/70 max-w-md">
              From Pondicherry to every corner of the country — we bring quality construction and Vastu expertise to your doorstep.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-block bg-accent text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-accent/90 transition"
            >
              Contact
            </a>
          </Reveal>
        </div>
      </section>

      {/* ───── SPECIALIZATION ───── */}
      <section id="specialization" className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal effect="fade-up">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-primary mb-14">
              Our Specialization
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Residential Projects",
                desc: "Building dream homes with meticulous attention to quality, comfort, and Vastu principles for your family.",
                detail: (
                  <>
                    <p>Our residential portfolio spans individual homes, row houses, gated community villas, and apartment complexes across India. We bring together structural engineers, architects, and interior designers under one roof.</p>
                    <p>Each home is designed with cross-ventilation, natural lighting, and optimal space utilization in mind. We integrate Vastu principles from the blueprint stage, ensuring your home promotes well-being and prosperity.</p>
                    <p>We offer flexible packages — from basic structure-only builds to fully finished interiors with modular kitchens, wardrobes, and landscaping.</p>
                  </>
                ),
              },
              {
                title: "Commercial Projects",
                desc: "Constructing modern offices, showrooms, and commercial spaces that drive business growth.",
                detail: (
                  <>
                    <p>We build functional and aesthetically impressive commercial spaces — from corporate office towers and co-working hubs to shopping complexes and hospitality buildings.</p>
                    <p>Our commercial construction process emphasizes structural integrity, accessibility compliance, fire safety, and energy efficiency. We coordinate with MEP consultants, interior firms, and regulatory bodies seamlessly.</p>
                    <p>Fast-track construction options are available for time-sensitive commercial projects without compromising quality.</p>
                  </>
                ),
              },
              {
                title: "Vastu-Compliant Designs",
                desc: "Integrating ancient Vastu Shastra wisdom into modern construction for harmony and prosperity.",
                detail: (
                  <>
                    <p>Vastu Shastra is not just tradition — it&apos;s the science of spatial harmony. Our designs balance ancient directional principles with contemporary architecture, ensuring your space feels both modern and spiritually aligned.</p>
                    <p>We consult on room placement, entrance orientation, kitchen positioning, staircase direction, and even colour palettes based on Vastu guidelines. For existing buildings, we offer non-invasive corrective measures.</p>
                    <p>Every new construction project includes a complimentary Vastu assessment as part of our commitment to holistic building design.</p>
                  </>
                ),
              },
            ].map((s, i) => (
              <Reveal key={i} effect="flip" delay={i * 150}>
                <div
                  className="bg-primary text-accent-light rounded-2xl p-8 md:p-10 flex flex-col justify-between min-h-[240px] hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
                  onClick={() => setPopup({ title: s.title, content: s.detail, variant: "dark" })}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                    <Home className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{s.title}</h3>
                    <p className="mt-3 text-sm text-accent-light/70">{s.desc}</p>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-accent/50 hover:text-accent transition">Learn more →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── GLASS BUILDING — Crafting Spaces ───── */}
      <section className="relative overflow-hidden h-[300px] md:h-[420px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        >
          <source src="/videos/glass-building.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal effect="fade-up">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest">Builders &amp; Developers</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Crafting Spaces That Inspire
            </h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              From concept to completion — we bring your architectural vision to life with precision and passion.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───── WHY US ───── */}
      <section id="why-us" className="bg-surface py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal effect="fade-up">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-primary mb-14">
              Our Distinction
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Transparent Pricing",
                desc: "We believe in transparent and competitive rates for our valued clients.",
                img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80",
                detail: (
                  <>
                    <p>We provide detailed, itemized cost breakdowns before construction begins — no hidden charges, no surprise escalations. You know exactly where every rupee goes.</p>
                    <p>Our pricing model includes material costs, labour charges, overheads, and a clear profit margin. We also offer stage-wise payment plans aligned with construction milestones.</p>
                    <p>Regular billing statements and site visit reports keep you informed throughout the project lifecycle.</p>
                  </>
                ),
              },
              {
                title: "Qualified Engineers",
                desc: "Our team consists of qualified and experienced engineers for trustworthy service.",
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80",
                detail: (
                  <>
                    <p>Every project is supervised by degree-qualified civil engineers with hands-on experience in residential, commercial, and industrial construction.</p>
                    <p>Our engineers conduct daily site inspections, quality checks on materials, and ensure structural safety at every stage — from soil testing to final finishing.</p>
                    <p>We also have dedicated project managers who serve as your single point of contact for updates, queries, and coordination.</p>
                  </>
                ),
              },
              {
                title: "Dedicated Support",
                desc: "Experience excellent customer support and assistance throughout your construction journey.",
                img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&q=80",
                detail: (
                  <>
                    <p>From your first enquiry to post-construction maintenance, our support team is available via phone, WhatsApp, and email. We respond within hours, not days.</p>
                    <p>You receive weekly photo/video progress reports, and are welcome to visit the site anytime. We also schedule formal review meetings at key milestones.</p>
                    <p>Post-handover, we provide a warranty period with free rectification of any structural or finishing defects.</p>
                  </>
                ),
              },
              {
                title: "Decades of Experience",
                desc: "Benefit from our extensive experience in providing top-notch construction solutions.",
                img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80",
                detail: (
                  <>
                    <p>With years of construction experience across Pondicherry and beyond, we have delivered hundreds of successful residential and commercial projects.</p>
                    <p>Our experience means we anticipate challenges before they arise — from monsoon-proofing timelines to navigating municipal approvals efficiently.</p>
                    <p>We have built lasting relationships with material suppliers, skilled labour teams, and regulatory bodies that benefit every client.</p>
                  </>
                ),
              },
            ].map((item, i) => (
              <Reveal key={i} effect="fade-up" delay={i * 120}>
                <div
                  className="relative rounded-2xl overflow-hidden group h-[320px] hover:[transform:perspective(800px)_rotateY(-5deg)] transition-all duration-500 cursor-pointer"
                  onClick={() => setPopup({ title: item.title, content: item.detail, variant: "overlay" })}
                >
                  <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-accent-light">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-accent-light/70">{item.desc}</p>
                    <span className="mt-2 inline-block text-xs font-semibold text-accent/60 group-hover:text-accent transition">Learn more →</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section id="testimonials" className="bg-surface py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-sans)] font-light tracking-tight text-primary mb-12">
              Client Feedback
            </h2>
          </Reveal>

          {[
            {
              name: "Rajesh Kumar",
              quote:
                "I'm incredibly impressed with the professionalism and quality of their construction. They built our dream home exactly as we envisioned. Highly recommend!",
            },
            {
              name: "Priya Shanmugam",
              quote:
                "Their Vastu consultation and construction quality were exceptional. Our commercial space is thriving thanks to Sri Skanda Constructions.",
            },
            {
              name: "Anand & Meera",
              quote:
                "We feel so blessed with our Vastu-compliant home. The team delivered on time and within budget. Exceptional work!",
            },
          ].map((t, i) => (
            <Reveal key={i} effect="fade-up" delay={i * 100}>
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 py-8 border-b border-primary/10 last:border-none">
                <span className="font-semibold text-primary min-w-[180px]">{t.name}</span>
                <p className="text-primary/60 italic">&ldquo;{t.quote}&rdquo;</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── ECO CITY CINEMATIC BANNER ───── */}
      <section className="relative overflow-hidden h-[280px] md:h-[400px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        >
          <source src="/videos/eco-city.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
        <div className="relative z-10 h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal effect="fade-left">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest">Sustainable Building</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
                Modern. Ecological.<br />Future-Ready.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───── CONTACT / FOOTER ───── */}
      <footer id="contact" className="bg-primary text-accent-light">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-[family-name:var(--font-sans)] font-light tracking-tight">
              Sri Skanda Constructions
            </h2>
            <p className="mt-1 text-accent-light/60 text-sm">Builders &amp; Developers</p>
          </div>
          <div className="space-y-4 text-sm">
            <a
              href="https://wa.me/919488084277"
              className="flex items-center gap-3 hover:text-accent transition"
            >
              <Phone className="w-4 h-4" /> +91 94880 84277
            </a>
            <a
              href="mailto:sriskandaconstructions@gmail.com"
              className="flex items-center gap-3 hover:text-accent transition"
            >
              <Mail className="w-4 h-4" /> sriskandaconstructions@gmail.com
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" /> Saram, Pondicherry
            </div>

            <div className="flex gap-4 pt-4">
              <a href="#" aria-label="Facebook" className="hover:text-accent transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-accent transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-accent transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-accent-light/10 text-center text-xs text-accent-light/40 py-6">
          &copy; {new Date().getFullYear()} Sri Skanda Constructions. All rights reserved.
        </div>
      </footer>

      {/* ───── WHATSAPP FAB ───── */}
      <a
        href="https://wa.me/919488084277"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* ───── BACK TO TOP ───── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-50 bg-primary text-accent p-3 rounded-full shadow-lg hover:bg-primary/90 transition"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* ───── POPUP MODAL ───── */}
      <Modal
        open={!!popup}
        onClose={() => setPopup(null)}
        title={popup?.title ?? ""}
        variant={popup?.variant ?? "surface"}
      >
        {popup?.content}
      </Modal>
    </>
  );
}
