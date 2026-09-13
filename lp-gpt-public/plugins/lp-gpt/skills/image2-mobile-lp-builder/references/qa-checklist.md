# QA Checklist

Use before delivery or Netlify deployment.

## Visual

- The LP is smartphone-first.
- The first viewport communicates the offer and action.
- The image slices feel like one system.
- Generated text is readable enough for visual use.
- Important CTA/video/form regions are easy to tap.
- The result feels like an LP, not just a poster.

## Functional

- CTAs open the correct URL or placeholder modal.
- Video areas open the correct video or placeholder modal.
- Forms/LINE/profile links are wired when provided.
- Modals close via button, background click, and Esc.
- Fixed bottom CTA does not block essential content.
- `sr-only` content exists for important visible text.

## Responsive

- 390px width has no horizontal overflow.
- 430px width has no horizontal overflow.
- Desktop centers the phone canvas.
- Tap targets are large enough.

## Delivery

- Assets are project-local.
- Screenshots were generated and inspected.
- Public deployment returns HTTP 200 when deployed.
