# Database and Supabase

## Main Principle

Supabase stores and validates all shared Room and Game data.

The database uses:

- Tables.
- Constraints.
- Unique indexes.
- Triggers.
- Row Level Security.
- Server functions.
- Realtime.

## Main Tables

### rooms

Stores:

- Room code.
- Maximum players.
- Room status.
- Active Game ID.

Statuses:

```txt
waiting
countdown
playing
finished
```

### games

Stores:

- Room ID.
- Current phase and round.
- Current question.
- Phase deadlines.
- Phase durations.
- Final standings.

Phases:

```txt
countdown
answering
voting
reveal
finished
```

### players

Stores:

- Room ID.
- Anonymous Auth user ID.
- Nickname and avatar.
- Ready state.
- Total score.

### questions

Stores:

- Question text.
- Active state.
- Three prepared AI-style answers.

```txt
ai_answers text[]
```

### game_rounds

Stores the selected Question and AI answer for each round.

It prevents the same Question from appearing twice in one Game.

### answers

Stores human and AI answers.

Rules:

- One human answer per player per round.
- One AI answer per round.
- AI answers use `player_id = null`.

### votes

Stores one Vote per player per round.

A trigger prevents:

- Voting for an invalid answer.
- Voting for the player's own answer.

### round_scores

Records which rounds were already scored.

This prevents duplicate scoring.

## Main Server Functions

- `start_game` — creates a Game and starts Countdown.
- `cancel_game_countdown` — cancels Countdown and returns the Room to `waiting`.
- `advance_game_phase` — controls phases, questions, AI answers, scoring, and completion.
- `get_voting_answers` — returns anonymous valid answers.
- `score_round` — calculates and stores round scoring.
- `request_play_again` — waits for all players and resets the Room.
- `cleanup_old_game_data` — removes old completed Game data.

## Important Database Rules

- Room capacity must be between 2 and 5.
- Active Room codes are unique.
- Nicknames are unique per Room, case-insensitively.
- One unfinished Game is allowed per Room.
- A Question cannot repeat in the same Game.
- One Answer per player per round.
- One AI Answer per round.
- One Vote per player per round.
- One scoring operation per round.

## Realtime

Realtime is enabled for:

- `rooms`
- `players`
- `games`
- `answers`
- `votes`

The frontend mainly listens to Room, Player, and Game changes.

## Authentication and RLS

Supabase Anonymous Auth identifies each browser session.

The Player row is connected through:

```txt
players.auth_user_id
```

RLS and server functions restrict access according to the current player and Room.

## Final Standings

The server stores final results in:

```txt
games.final_standings
```

Ordering:

```txt
total_score DESC
joined_at ASC
```

## Current Limitations

- Frontend Refresh restoration is not implemented.
- Room capacity does not change automatically when players leave.
- Automatic scheduling of old-game cleanup is not managed by the frontend.
