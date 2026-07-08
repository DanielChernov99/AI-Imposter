# Database and Supabase

## Main Principle

Supabase is the source of truth.

In the MVP, the game supports one shared lobby and one active game session at a time.

The MVP does not use multiple rooms or room codes.

Multiple rooms, room codes, and host-controlled rooms are future extensions.

## Main Tables

The MVP uses these main tables:

- game_state
- players
- questions
- answers
- votes

## game_state

Stores the current shared game session state.

The MVP can use one active `game_state` row.

Important fields:

- id
- phase
- current_round
- current_question_id
- required_players
- phase_started_at
- phase_ends_at
- created_at
- updated_at

Recommended phases:

- lobby
- countdown
- answering
- voting
- reveal
- finished

Example phase flow:

```txt
lobby -> countdown -> answering -> voting -> reveal -> answering -> ... -> finished