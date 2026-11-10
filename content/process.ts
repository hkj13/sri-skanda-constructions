import { en, type L } from "./i18n";

/**
 * The build journey, shown as a timeline on /process.
 *
 * TODO(client): check each stage against how you really work and correct
 * anything that differs.
 */
export type ProcessStage = {
  id: string;
  title: L;
  body: L;
  /** What the client does or decides at this stage. */
  you: L;
  /** What comes out of the stage. */
  result: L;
};

export const processIntro = en(
  "Building a home or a commercial space is a long job with a clear order. This is the path every project follows, so you always know what comes next.",
);

export const processStages: ProcessStage[] = [
  {
    id: "consultation",
    title: en("Consultation"),
    body: en("We talk through what you want to build, where, and what you can spend. No drawings yet, just a clear picture of the job."),
    you: en("Tell us about your plot, your needs and your budget."),
    result: en("We both know what is being asked for."),
  },
  {
    id: "site-visit",
    title: en("Site visit and soil test"),
    body: en("We see the plot, measure it, and look at the road and the neighbours. The soil is tested, because the foundation depends on it."),
    you: en("Show us the plot and its boundaries."),
    result: en("Measurements and a soil report to design from."),
  },
  {
    id: "design",
    title: en("Design and Vastu"),
    body: en("2D plans and 3D views are drawn to your needs and your budget. If you follow Vastu, the entrance and rooms are placed with it from the start."),
    you: en("Review the drawings and ask for changes."),
    result: en("A plan you are happy with."),
  },
  {
    id: "approval",
    title: en("Building plan approval"),
    body: en("The plan is submitted to the local planning authority. Construction starts only after approval."),
    you: en("Provide land documents and sign the application."),
    result: en("An approved building plan."),
  },
  {
    id: "agreement",
    title: en("Agreement and BOQ"),
    body: en("A written agreement sets out the work, the cost and the stages. The bill of quantities (BOQ) lists what goes into the building, item by item."),
    you: en("Read it, ask questions, and sign when it is clear."),
    result: en("Scope and cost in writing before work starts."),
  },
  {
    id: "construction",
    title: en("Construction"),
    body: en("Foundation, then structure floor by floor, then brickwork, plastering, flooring, painting, doors and windows."),
    you: en("Visit when you like and decide on finishes when asked."),
    result: en("The building, rising in order."),
  },
  {
    id: "quality",
    title: en("Quality checks at each stage"),
    body: en("Each stage is checked before the next begins: steel before concrete is poured, levels before walls go up, plumbing and wiring before they are covered."),
    you: en("Ask to see any check you want to see."),
    result: en("Problems caught while they are still easy to fix."),
  },
  {
    id: "handover",
    title: en("Handover"),
    body: en("We walk through the finished building with you, room by room. When you are satisfied, you get the key."),
    you: en("Walk through, point out anything that needs attention."),
    result: en("A finished building and the key."),
  },
];
