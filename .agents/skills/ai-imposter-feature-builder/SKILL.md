---
name: ai-imposter-feature-builder
description: Plan and implement features for the AI Imposter React, MobX, and Supabase project while preserving project documentation, service contracts, provider parity, Realtime lifecycles, and server-authoritative game rules. Use when Codex is asked to design, scope, build, refactor, or extend an AI Imposter feature across UI components, routing, MobX stores, service contracts, Mock or Supabase services, Realtime behavior, or database rules.
---

# AI Imposter Feature Builder

## Workflow

1. Locate the repository root containing `docs/00_SOURCE_OF_TRUTH.md` and `ai-imposter/package.json`.
2. Read `docs/00_SOURCE_OF_TRUTH.md` and `docs/03_ARCHITECTURE.md`. Read only the relevant supporting file: `docs/01_PROJECT_IDEA.md`, `docs/02_GAME_FLOW_AND_RULES.md`, `docs/04_DATABASE_AND_SUPABASE.md`, or `ai-imposter/src/index.css` for visual work.
3. Inspect the current code and worktree before asking questions. Treat the documentation as intent, the code as current behavior, and surface important mismatches.
4. Identify the affected layers: UI/routing, MobX stores, service contracts and providers, Supabase/database/Realtime, and documentation. Do not change layers the feature does not need.
5. Perform read-only discovery and return a decision-complete plan covering success criteria, layer changes, interfaces or data, relevant failure cases, verification, and assumptions.
6. Stop and wait for explicit approval of that plan before editing application files.
7. After approval, re-check the repository, implement the approved scope, run checks, and report the result and remaining limitations.

## Preserve Project Guardrails

- Keep the data flow as React Component -> MobX Store -> Service Contract -> Supabase Service -> Supabase; never call Supabase from a component.
- Reuse the visual tokens and global conventions in `ai-imposter/src/index.css` before introducing component-local colors, fonts, spacing, or shared layout rules.
- Keep feature stores focused on their service. Use `RootStore` only for cross-store coordination and subscription ownership.
- Keep Mock and Supabase providers aligned with their shared contract, and map database `snake_case` to frontend `camelCase` at the service boundary.
- Keep room state, game phases, deadlines, question selection, scoring, final standings, and Play Again reset server-authoritative.
- Define ownership and cleanup for Realtime subscriptions, and translate infrastructure failures into contract-level errors.
- Update source-of-truth documentation only when behavior, architecture, or database rules change.
- Run targeted checks, then `npm run lint` and `npm run build` from `ai-imposter` after implementation.

## Example: Restore State After Refresh

Example request:

> Use $ai-imposter-feature-builder to plan restoring the current player, room, and game after a browser refresh.

Confirm the documented limitation and the Anonymous Auth link through `players.auth_user_id`. Inspect bootstrap, route guards, stores, and both room-service providers; then trace authenticated user -> player -> room -> active game -> subscriptions. Plan hydration, loading, cleanup, and failure behavior without reconstructing or advancing server state in the client. Wait for approval, then implement and verify refresh from Lobby, Game, and Result routes.
