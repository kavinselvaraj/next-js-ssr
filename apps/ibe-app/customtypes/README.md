# Prismic Custom Type Governance

This document defines **long-term modeling rules** for `customtypes/` in this booking engine.

## Why this exists

- Keep schemas stable as pages/features grow.
- Protect editor experience (non-developers) from disruptive model changes.
- Ensure multilingual scaling (`en-us`, `ja-jp`, and future locales) without rework.

## Core principles

1. **Custom Types model content/data**, not UI implementation details.
2. Prefer **Slice Zones** for page composition to support reorderable content.
3. Keep field names **semantic and durable** (avoid visual naming like `left_column_title`).
4. Every new field/slice must be safe for localization through Prismic locales.

## Naming conventions

- Custom Type IDs: `snake_case` (e.g., `reusable_page`, `flights_landing`).
- Field API IDs: `snake_case` and content-semantic (e.g., `route_name`, `short_description`).
- Labels: editor-friendly Title Case.

## Stability rules (do not break published content)

- ❌ Do not rename existing field API IDs after content exists.
- ❌ Do not remove fields used by production rendering without migration.
- ✅ Additive changes are preferred (new fields, new optional slices, new variations).
- ✅ Deprecate gradually: hide from UI process-wise before removal.

## Required structure by page model

- `homepage`: Slice Zone only.
- `flights_landing`: Slice Zone + SEO group.
- `flight_page`: core flight identity fields + Slice Zone.
- `reusable_page`: generic title/uid + Slice Zone for future pages.

## SEO group standard

Use this field group name consistently:

- `SEO & Metadata`

Recommended reusable fields:

- `meta_title` (Text)
- `meta_description` (Text)
- `meta_image` (Image)
- `canonical_url` (Link, web)

## Multilingual policy

- Use Prismic locale documents for translated content.
- Never hardcode translated copy in schema defaults/placeholders as a runtime dependency.
- Keep copy fields locale-specific; keep structural fields stable across locales.

## Change checklist (before merging schema changes)

1. Is this change additive and backward compatible?
2. Are field names semantic and future-proof?
3. Will editors understand labels/help text?
4. Does this work for all locales?
5. Did JSON validate cleanly in repo + Slice Machine?

## Version-control friendliness

- Keep JSON formatting stable and minimal diffs.
- Avoid unnecessary reordering of fields.
- Group related fields together to improve PR readability.
