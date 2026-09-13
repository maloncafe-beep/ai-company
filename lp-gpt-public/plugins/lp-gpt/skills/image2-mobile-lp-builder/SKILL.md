---
name: image2-mobile-lp-builder
description: Build shareable Image2-style smartphone landing pages from a fixed LP outline and reference eyecatch/design. Use when Codex should turn an already-decided LP structure, seminar/event offer, lead magnet, product LP, or campaign page plus a reference visual into vertical generated image slices, then assemble them into functional HTML/CSS/JS with clickable CTAs, video/form/link behavior, mobile QA, and optional Netlify deployment. Also use when asked to create or explain a reusable two-prompt workflow for this exact LP-building flow.
---

# Image2 Mobile LP Builder

## Purpose

Turn a fixed LP outline and a reference eyecatch/design into a smartphone-first LP by splitting the work into two clear phases:

1. Generate vertical Image2-style LP image slices from the outline and reference visual.
2. Connect those slices in HTML/CSS/JS and add functional CTA, video, form, and link behavior.

This skill is intentionally designed for repeatable, giftable use. Prefer simple input slots, two prompts, and predictable outputs over bespoke art-direction complexity.

## Fit Check

Use this skill only when the user has, or can provide:

- A fixed LP structure or enough copy to infer one safely.
- A reference eyecatch, key visual, past LP, or design direction.
- A smartphone-first output goal.
- A need for generated visual quality plus real HTML behavior.

If the LP structure is not fixed, ask the user to finalize the section order before production. This skill is not for offer strategy, funnel design, or copywriting from scratch.

## Workflow

### 1. Normalize Inputs

Collect or infer:

- LP objective: reservation, LINE opt-in, purchase, document request, webinar signup, video view, or other conversion.
- Audience and offer.
- Ordered LP sections and their role.
- Exact copy: headlines, body, bullets, CTA labels, dates, notes, speaker/product/service info.
- Reference visual: eyecatch, design screenshot, brand image, or existing LP.
- Destination URLs: CTA, video, form, social/profile links. If missing, use placeholder modals.
- Delivery target: local static site, preview screenshots, shareable prompt, Netlify deploy.

### 2. Choose Output Mode

Default to hybrid image-slice mode:

- Generate full vertical image slices for visual quality.
- Overlay transparent HTML hotspots for CTA/video/form/link behavior.
- Add `sr-only` HTML text for accessibility and search.

Use HTML-text mode only when Japanese text accuracy, editing, SEO, or responsiveness matters more than preserving the generated visual. In HTML-text mode, generate backgrounds/section art and place final text in HTML.

### 3. Generate Visual Slices

Ask for 4 to 8 vertical smartphone slices. Keep the same design system across all slices.

Default slice map:

1. First view with first CTA.
2. Proof/video/details.
3. Benefits or “what you get.”
4. Recommended audience.
5. Workflow/process or differentiator.
6. Speaker/product/service credibility.
7. Final CTA and notes.

Rules:

- Use the reference visual as tone, not as a rigid layout.
- Keep LP readability above poster impact.
- Keep one primary action per screenful.
- Avoid page numbers.
- Avoid over-flashy thumbnail styling, dark neon overuse, clutter, and tiny text.
- For text-heavy Japanese sections, prefer simpler generated text regions or HTML-text mode.

### 4. Build Functional HTML

Assemble a static site:

- `index.html`
- project-local `assets/` containing generated slices and referenced images
- optional screenshots such as `preview-mobile.png` and `preview-desktop.png`

Implementation requirements:

- Use `width: min(100%, 430px)` or equivalent for the phone canvas.
- Center the phone canvas on desktop.
- Stack image slices with no visible seams.
- Add transparent buttons over generated CTA/video/form regions.
- If URLs are missing, open polished placeholder modals instead of external links.
- If URLs exist, wire real destinations and preserve expected target behavior.
- Add a fixed bottom CTA when conversion is the goal.
- Add `sr-only` copy matching the visible image content.
- Keep styling quiet enough that it does not fight the generated art.

### 5. Verify

Before delivery or deploy:

- Check 390px and 430px mobile widths for no horizontal overflow.
- Check desktop centers the 430px LP.
- Check every CTA, video, form, and modal action.
- Generate screenshots and inspect them.
- If deployed, verify the public URL returns HTTP 200.

## Shareable Prompt Mode

When the user wants to “present,” “gift,” “distribute,” “make reusable prompts,” or “show how others can use this,” load `references/shareable-prompts.md`.

Return two prompts:

1. Prompt 1 / Image slices: the user pastes their fixed LP structure and reference tone.
2. Prompt 2 / HTML LP: the user converts generated slices into a functional static LP.

Keep shareable prompts generic enough for other people to replace the LP outline, while preserving the Image2-style workflow. For Japanese users, return the shareable prompts in Japanese by default.

## Reference Files

- `references/shareable-prompts.md`: ready-to-copy generic two-prompt workflow.
- `references/qa-checklist.md`: final QA checklist for generated LPs.
