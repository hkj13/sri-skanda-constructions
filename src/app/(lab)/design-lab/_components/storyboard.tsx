import type { ReactNode } from "react";
import {
  F0Groundbreaking,
  F10Start,
  F1Vastu,
  F2Planning,
  F3Foundation,
  F4Structure,
  F5Walls,
  F6ResCom,
  F7Renovation,
  F8Handover,
  F9Sustainable,
} from "./Frames";

export type Render = "3D" | "SVG" | "DOM";

export type Chapter = {
  sheet: string;
  title: string;
  frame: () => ReactNode;
  /** What a visitor takes away. */
  learns: string;
  scroll: string;
  interaction?: string;
  reduced: string;
  mobile: string;
  render: Render[];
  media?: string;
};

export const CHAPTERS: Chapter[] = [
  {
    sheet: "00",
    title: "Groundbreaking",
    frame: F0Groundbreaking,
    learns: "A builder in Pondicherry, for homes and commercial buildings, and one tap to reach them on WhatsApp.",
    scroll:
      "First paint is already the finished frame: plot, stakes, logo and headline, as inline SVG and real text. Once the page is idle the motion layers on top: dawn line brightens, stakes drop one by one, string lines snap taut, and the logo outline on the plot draws itself and fills. Scrolling lifts the camera from eye level to plan view, which hands over to the Vastu chapter.",
    interaction: "Plan your build on WhatsApp, Get a free estimate, Skip the story, and the chapter rail on the right.",
    reduced: "The composed frame, no drops or drawing. Content is identical.",
    mobile: "Headline and buttons first, plot illustration below. Stakes drop with CSS only; no 3D, no video.",
    render: ["SVG"],
  },
  {
    sheet: "01",
    title: "Vastu and planning",
    frame: F1Vastu,
    learns: "Vastu is part of how they plan, explained in plain words, with their consultation as the real step.",
    scroll:
      "The 9 by 9 Vastu grid unfolds from the centre of the plot. The compass spins and settles on north. Rooms slide into their zones: entrance, kitchen, pooja room, master bedroom.",
    interaction: "Choose the plot's facing (N, E, S, W). The indicative layout rearranges. Always labelled indicative.",
    reduced: "Grid and rooms in place. The facing buttons still work, with a short crossfade.",
    mobile: "Plan fills the width; facing buttons as a four-way switch directly under it.",
    render: ["SVG"],
  },
  {
    sheet: "02",
    title: "Architectural planning",
    frame: F2Planning,
    learns: "They draw 2D plans and 3D views before anything is built, to your vision and budget.",
    scroll: "Plan lines lift and extrude into a white massing model. The camera makes one slow orbit, tied to scroll.",
    interaction: "2D plan / 3D view switch.",
    reduced: "A still 3D view; the switch swaps views instantly.",
    mobile: "Isometric SVG drawing with the same switch. No WebGL.",
    render: ["3D", "SVG"],
  },
  {
    sheet: "03",
    title: "Foundation",
    frame: F3Foundation,
    learns: "What goes below ground, named the way a site engineer would name it.",
    scroll:
      "The ground cuts away in section. The trench digs, the PCC bed is laid, the rebar cage drops in, concrete pours and levels. Small technical tags appear: PCC bed, footing, column, plinth beam.",
    reduced: "The finished section with every tag.",
    mobile: "The same section, cropped to one footing.",
    render: ["SVG"],
    media: "construction-site video, masked inside the section cut (desktop only).",
  },
  {
    sheet: "04",
    title: "Structure",
    frame: F4Structure,
    learns: "The frame goes up floor by floor, and each stage is checked before the next.",
    scroll:
      "Columns rise and slabs stack. The floor counter steps FLOOR 01 / 03 to 03 / 03 in the technical font. A tower crane swings behind, and its hook lowers the section heading into place.",
    reduced: "The finished frame, heading already in place, counter at 03 / 03.",
    mobile: "Flat elevation; floors stack with CSS transforms; crane is a still silhouette that lowers the heading once.",
    render: ["3D", "SVG"],
    media: "iron-worker video behind the crane (desktop only).",
  },
  {
    sheet: "05",
    title: "Walls and finishing",
    frame: F5Walls,
    learns: "Brickwork, plaster, paint and windows: the finishing is theirs too.",
    scroll: "Brick courses lay row by row, plaster smooths over, paint washes across with a lime leading edge that turns white, windows slide in and catch the light.",
    reduced: "The finished facade bay.",
    mobile: "Same close-up of one bay, shorter.",
    render: ["SVG"],
    media: "glass-building video, masked into the window glass (desktop only).",
  },
  {
    sheet: "06",
    title: "Homes or commercial",
    frame: F6ResCom,
    learns: "The same team builds both, and what each includes.",
    scroll: "The model settles on the plot as a villa.",
    interaction: "Home / Commercial switch. The building morphs to a commercial block with shopfronts and office floors, and the service list beside it changes.",
    reduced: "The switch swaps the building with a fade.",
    mobile: "Two SVG states with the switch above them.",
    render: ["3D", "SVG"],
  },
  {
    sheet: "07",
    title: "Renovation",
    frame: F7Renovation,
    learns: "They also renovate and remodel existing buildings.",
    scroll: "The before and after image slides in; the handle nudges once to show it can move.",
    interaction: "Drag the handle, or focus it and use the arrow keys.",
    reduced: "No nudge. The slider works the same.",
    mobile: "Full-width slider, large handle.",
    render: ["DOM"],
    media: "Two of the stock photos until the client has a real before and after.",
  },
  {
    sheet: "08",
    title: "Turnkey handover",
    frame: F8Handover,
    learns: "Turnkey: foundation to finishing, one team, one contact.",
    scroll: "Dusk falls. The front door opens, lights come on room by room, and a key with a lime tag drops into an open hand.",
    reduced: "Lit house, key already in the hand.",
    mobile: "Same scene, smaller, lights as a CSS sequence.",
    render: ["3D", "SVG"],
  },
  {
    sheet: "09",
    title: "Sustainable building",
    frame: F9Sustainable,
    learns: "Options like solar, rainwater harvesting and terrace gardens can be part of the build.",
    scroll: "Solar panels slide onto the roof, rainwater arrows trace down into the sump, greenery grows on the terrace.",
    reduced: "All three in place.",
    mobile: "Same drawing; video replaced by its poster frame.",
    render: ["SVG"],
    media: "eco-city video as the sky layer behind the building.",
  },
  {
    sheet: "10",
    title: "Start your project",
    frame: F10Start,
    learns: "How to start: WhatsApp, a free estimate, or a call.",
    scroll: "The finished building, lit. Buttons settle in.",
    interaction: "Plan your build on WhatsApp, Get a free estimate, Call.",
    reduced: "Same, without the light-up.",
    mobile: "Buttons stacked full width above the building.",
    render: ["3D", "SVG"],
  },
];

export const HEADLINES = [
  {
    text: "From the first stake to the house key.",
    note: "Recommended. It is the story of the page in one line: chapter 0 starts with stakes, chapter 8 ends with the key.",
    recommended: true,
  },
  {
    text: "Building Your Dreams",
    note: "The current headline. Warm and familiar, but any builder could say it.",
  },
  {
    text: "Your plot, built right. Foundation to finishing.",
    note: "Most practical. Speaks to someone who already owns land.",
  },
  {
    text: "Homes and businesses, built in Pondicherry.",
    note: "Plainest and best for local search, but the least memorable.",
  },
];

export const SUBLINE =
  "Residential and commercial construction in Pondicherry. Planned with Vastu, built by one team from foundation to finishing.";
