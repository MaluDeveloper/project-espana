// Typography shared by the landing sections so they match the hero (orbit-delivery-hero).
// The fonts are registered by the hero's @font-face, which is always mounted on the landing page.

export const heroFontStyle = { fontFamily: "'Orbit DM Sans', sans-serif" };

/** Small uppercase label inside the pill above each section title. */
export const heroEyebrowClass = "text-xs font-medium uppercase tracking-[0.36em] text-accent-foreground";

export const heroTitleClass = "font-[550] tracking-[-0.064em] leading-[1.05]";

/** The orange part of a section title: the hero's serif italic with the gradient.
 *  box-decoration-clone keeps the clip padding on every wrapped line so no glyph is cut. */
export const heroHighlightClass =
  "text-gradient-spain italic font-normal text-[1.12em] tracking-[-0.035em] pr-[0.08em] box-decoration-clone";
export const heroHighlightStyle = { fontFamily: "'Orbit Libre Caslon', Georgia, serif" };

/** Card titles inside the sections. */
export const heroCardTitleClass = "font-[550] tracking-[-0.03em]";
