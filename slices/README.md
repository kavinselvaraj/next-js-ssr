# Prismic Slice Governance

This document defines standards for reusable Shared Slices in `slices/`.

## Why this exists

- Slices are the long-term extension point for marketing/editor-driven pages.
- Good slice contracts reduce future component rewrites.

## Design rules

1. Name slices by **content meaning**, not layout.
   - ✅ `HeroBanner`, `SectionHeader`, `CTASection`, `RichTextSection`, `FeaturedFlights`
   - ❌ `ThreeColumnBlue`, `TopBannerLarge`
2. Start with **primary fields only** when possible.
3. Add variations only when a real content need appears.
4. Keep each slice narrowly focused on one editorial job.

## Field conventions

- API IDs: `snake_case`
- Labels: human-friendly for editors
- Rich text should allow only needed blocks (avoid overly permissive configs)

## Backward compatibility

- Do not rename `slice_type` IDs after deployment.
- Do not remove fields used by existing components without migration.
- Prefer adding optional fields/variations over replacing contracts.

## Multilingual behavior

- Slice content is localized through the parent document locale.
- No client translation library is required for slice copy.

## Adding a new slice safely

1. Create `slices/<SliceName>/model.json`.
2. Add realistic `mocks.json` for editor/dev previews.
3. Include the slice in relevant Custom Type `choices`.
4. Add rendering component when needed by product scope.
5. Release as additive change only.
