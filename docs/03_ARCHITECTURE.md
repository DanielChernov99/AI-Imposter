# Architecture

## Main Principle

The application follows this data flow:

```txt
React Component
→ MobX Store
→ Service Contract
→ Supabase Service
→ Supabase
```

Supabase is the source of truth for shared Room and Game data.

## Frontend

The frontend uses:

- React
- Vite
- JavaScript
- React Router
- MobX
- Mantine UI
- CSS Modules

Components focus on UI and user interaction.

Components do not call Supabase directly.

## Routing

The application uses `HashRouter` for GitHub Pages.

Main routes:

```txt
/
/lobby
/game
/result
```

Answering, Voting, and Reveal are displayed inside the same Game Page.

## Stores

### RootStore

Creates all feature stores and coordinates cross-store flow:

- Room and Game synchronization.
- Phase-entry loading.
- Store resets.
- Realtime subscription lifecycle.
- Final standings transfer.

It does not control authoritative game rules.

### Feature Stores

- `RoomStore` — Room, Players, Ready state, Lobby, Play Again.
- `GameStore` — Active Game, Realtime, deadlines, phase requests.
- `QuestionStore` — Current question.
- `AnswerStore` — Current player's answer.
- `VoteStore` — Voting options, selection, and submission.
- `RevealStore` — Reveal data, points, Leaderboard, and final standings.

Each feature store depends on one service.

## Services

Service files handle:

- Supabase queries.
- RPC calls.
- Realtime channels.
- Error translation.
- Database-to-client mapping.

Database `snake_case` fields are mapped to frontend `camelCase`.

## Server Authority

Supabase functions control:

- Game start.
- Countdown cancellation.
- Phase advancement.
- Question selection.
- Prepared AI-answer selection.
- Scoring.
- Final standings.
- Play Again reset.

The frontend reacts to server state.

## Realtime

- `RoomStore` owns Room and Player synchronization.
- `GameStore` owns Game synchronization.
- Supabase services create and manage channels.
- `RootStore` decides when subscriptions start and stop.

## Timer

The Timer component only displays the remaining time.

`GameStore` requests phase advancement when the deadline is reached.

The server validates the deadline and performs the actual transition.

## Current Limitation

Supabase Auth survives Refresh, but the frontend does not yet restore the related Player, Room, and Game into MobX.
