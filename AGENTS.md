# SaaSPT agent instructions

The user wants to continue development in a local Codex session on their computer. Read `docs/conversation-handover.md` first for conversation decisions, requested versions, and unfinished work. Use the existing checkout. In cloud tasks, the environment is already isolated; do not create a Git worktree unless explicitly requested.

## Project skills

Read applicable skills under `.agents/skills/` before working:

- `saaspt-design-system/SKILL.md`: project direction and design requirements.
- `frontend-design/SKILL.md`: visual concepts and implementation.
- `web-design-guidelines/SKILL.md`: UI and accessibility review.
- `vercel-composition-patterns/SKILL.md`: reusable component APIs.
- `vercel-react-best-practices/SKILL.md`: React and Next.js performance.

Upstream skill snapshots and source commits are recorded in `.agents/skills/sources.json`. Follow referenced rule files when relevant; skill guidance must be checked against the installed framework versions and current official APIs.

Backend: Supabase, including Supabase Auth. No application scaffold, dependencies, database, or authentication connection has been configured yet. See the project design skill for confirmed and open decisions. Never commit credentials.

## Backend handover and frontend ownership

The user assigned the frontend responsibilities labeled “Claude” in SXQHex/FtkSaaS to this agent. Model names in the upstream responsibility document are role labels. Work on frontend design, client implementation, and frontend tests here; propose backend contract changes rather than editing backend behavior unilaterally. Backend CI, deployment, and historical merge authorizations do not authorize actions in this frontend task.

Reference repository: https://github.com/SXQHex/FtkSaaS
Read-only reference inspected at main SHA `bfb8ccb29a1e0ca9efde7813dc3af4bbbad8768d`. This identifies inspected documentation, not verified CI or hosted readiness. Recheck current sources before real integration; do not copy a parallel backend documentation tree into this repository.

Read upstream sources in their documented priority order:
- `docs/source-index.md`
- `contracts/00-FtkSaaS-yeni-sohbet-devir.md`
- `docs/remaining-work.md`
- `docs/claude-handover.md`
- Applicable product, technical, responsibility, machine contracts, and accepted decisions.

Frontend integration constraints extracted from the handover:
- Call `POST {API_URL}/functions/v1/backend-v1/{operation}` using the typed request body, Supabase access token as Bearer authorization, publishable key as apikey, and JSON content type.
- Consume success `ok/data/trace_id` and failure `ok:false/error` envelopes. Use backend-generated shared types from `packages/contracts`; do not maintain manual duplicate API types.
- Do not access core/private domain tables or service-only RPCs directly. Never expose privileged keys to the frontend.
- The server derives identity and permissions from live Auth, account, organization, role, and center scope. Client role claims do not confer authority. Owner status alone does not grant center operations.
- Where client-generated IDs are required, use verified UUIDv7 for request_id and mutation operation_key. Domain IDs come from the backend; provider IDs remain unchanged.
- Preserve operation_key for retries of the same user action, including ambiguous transport failures; request_id may change. Do not blindly retry version, permission, capacity, or policy failures. At most three automatic retries for retryable transient failures.
- Respect expected_version, preview freshness, and idempotency payload mismatch semantics from the current contract; do not invent financial or entitlement rules.
- Mocks must match published contracts and remain explicitly pending integration. Never silently fall back to fake success in production.
- Runtime implementation, hosted deployment, and tested acceptance are separate statuses. Historical reports and contract-only endpoints are not current working-backend evidence.
- External email is deferred; do not start Resend integration. No production deployment is authorized. Use synthetic data for validation.
