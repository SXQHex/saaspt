---
name: saaspt-design-system
description: Project-specific design direction for SaaSPT frontend work, including dark-first responsive interfaces, LTR/RTL, shared UI, and Supabase Auth states.
---

# SaaSPT design system

## Confirmed direction

- The user accepted task-led management: explain what needs attention today and the consequences before an impactful action. Use compact tables when comparison benefits; cards are not mandatory. Keep debt, credit, and usage rights separate. Expired previews must not offer stale effects; unknown transport outcomes must not claim failure or success. These are interaction principles, not approval of another frontend's branding or backend-status assertions.
- The user accepted organization-selected curated color and heading/body font packages, with logo branding, separate from each user's light/dark/system and accessibility preferences. System semantic status/focus colors remain protected. Arbitrary CSS/colors/custom font uploads are not initial scope. Exact packages, role/permission mapping, storage and API remain pending. Backend needs are recorded in FtkSaaS draft PR https://github.com/SXQHex/FtkSaaS/pull/43; it is not merged or callable implementation.
- The user explicitly wants shell menu items present before destinations are finalized. Show proposed sections as clearly marked, disabled placeholders until links/content are connected. Mobile uses a bottom menu with More; desktop uses sidebar navigation. This design shell does not assert live permission or plan access.

- Build a modern, distinctive, dark-first SaaS interface. Let the product's primary task determine the layout; do not default to a CRM table shell or repeated metric cards.
- Use a Turborepo monorepo, pnpm, Next.js, TypeScript, and Tailwind CSS. Use Playwright for browser checks and Vitest for meaningful unit tests.
- Supabase is the backend-as-a-service and authentication provider. Expo is a future possibility, not a current implementation target.
- Support responsive layouts and type-safe localization with LTR and RTL from the start. i18next is the proposed option, not yet a confirmed dependency.
- Requested package versions are targets, not verified installations. Check registry availability, runtime requirements, and peer compatibility before pinning; report unavailable targets instead of silently substituting versions.

## Open decisions

The user authorized extending design as far as current contracts support, with later customization. The shell now links to eleven manager design sections plus the daily page; see `docs/design-coverage.md`. Connected design routes replace the earlier disabled menu placeholders. Keep unsupported business writes and missing settings APIs explicitly unconnected. A root AppShell preserves temporary appearance across client navigation, not reload.

23 October 2026: the user selected the center manager's daily program as the first persona and task. The local preview offers Akış, Sahne, and Atölye as unapproved visual directions. See `docs/frontend-start.md` for implementation and verification scope. No brand, locale set, or Auth method has been selected.

The local preview now separates three palette proposals from three system-font proposals and personal light/dark/system mode. Semantic colors and focus are system-owned. Choices are memory-only and reset on reload; this is not an implemented organization settings API or a final distributed font catalog.

The backend product scope covers organizations/centers, students/instructors, scheduling, reservations, attendance, entitlements, finance, and related operations; consult the upstream product contract rather than inventing scope. Brand, palette, typography, supported locales, and authentication methods remain to be selected. Do not invent these as settled requirements. Present a small number of visual directions using representative content, then record the selected direction here.

## Design workflow

1. Read this skill and frontend-design before visual implementation.
2. Define semantic color tokens, type roles, spacing, surface hierarchy, focus, and interaction states. Exact values follow the selected visual direction.
3. Design the primary workflow before navigation chrome. Give the composition a deliberate focal point and use motion to explain actions.
4. Implement reusable primitives in the shared UI package; keep product logic and backend calls outside visual primitives. Read vercel-composition-patterns for component APIs and vercel-react-best-practices for Next.js implementation.
5. Review with web-design-guidelines and inspect actual browser screenshots when browser tooling is available. Report unexecuted checks honestly.

## Quality requirements

- Dark is the default. Distinguish backgrounds, elevated surfaces, borders, text, and interactive states with semantic tokens. Maintain WCAG AA text contrast and visible keyboard focus.
- Adapt layout to content and viewport; check narrow mobile and wide desktop, long translations, zoom, overflow, and keyboard navigation.
- Use CSS logical properties such as margin-inline and padding-inline. Set document lang and dir from the active locale. Mirror directional controls intentionally; do not mirror every icon.
- Keep translation keys typed; avoid sentence fragments and string concatenation. Use locale-aware date, number, currency, and plural formatting. Keep secrets out of translation files.
- Respect prefers-reduced-motion. Make loading, empty, error, success, and disabled states intentional and actionable.

## Supabase and authentication

- Follow the backend handover references and integration constraints in root AGENTS.md. Domain access goes through the backend-v1 Edge API using backend-generated shared types, not direct Supabase table or service-only RPC calls.
- Use supported Supabase browser/server clients for Auth and the current documented Next.js session integration. Validate authenticated access server-side; a hidden UI is not authorization.
- Design signed-out, pending, signed-in, expired-session, and recoverable-error states. Select specific sign-in methods after product requirements are known.
- Keep service-role and other privileged keys out of client bundles, public variables, logs, and repository files. Use RLS for client-accessible data; do not assume tenant boundaries or authorization are already configured.
- If no Supabase project is connected, clearly label mocked flows. Do not claim real authentication or backend validation succeeded.
