# Database and Supabase

## Main Principle

Supabase is the source of truth for shared room and game data.

The MVP supports multiple independent rooms.

Each room has:

- A unique room ID
- A randomly generated room code
- A selected capacity between 2 and 5 players
- Its own players
- One active game session at a time

A game represents one complete 5-round match inside a room.

## Main Tables

The MVP uses these main tables:

- `rooms`
- `games`
- `players`
- `questions`
- `answers`
- `votes`

## rooms

Stores the room that players create or join.

Important fields:

- `id`
- `code`
- `max_players`
- `status`
- `active_game_id`
- `created_at`
- `updated_at`

Recommended statuses:

- `waiting`
- `countdown`
- `playing`
- `finished`

The room code must be unique among active rooms.

Players can join only when:

- The room exists
- The room status is `waiting`
- The room is not full

## games

Stores one complete game session inside a room.

Important fields:

- `id`
- `room_id`
- `phase`
- `current_round`
- `total_rounds`
- `current_question_id`
- `phase_started_at`
- `phase_ends_at`
- `created_at`
- `finished_at`

Recommended phases:

- `countdown`
- `answering`
- `voting`
- `reveal`
- `finished`

Example phase flow:

```txt
countdown
    ->
answering
    ->
voting
    ->
reveal
    ->
answering
    ->
...
    ->
finished
```

Each room can have only one active game at a time.

A new game record is created when the room is full and every player is ready.

## players

Stores the players inside rooms.

Important fields:

- `id`
- `room_id`
- `auth_user_id`
- `nickname`
- `avatar_url`
- `is_ready`
- `is_connected`
- `total_score`
- `joined_at`

Rules:

- Nicknames must be unique inside the same room
- Nickname comparison should be case-insensitive
- A player may update only their own ready state
- A player starts with `is_ready = false`
- Scores are reset when a new game begins

## questions

Stores the questions used during the game.

Important fields:

- `id`
- `text`
- `fallback_ai_answer`
- `is_active`
- `created_at`

The fallback AI answer is used when the Google AI API fails, times out, or returns an invalid answer.

Questions should not repeat during the same game when enough questions are available.

## answers

Stores human and AI answers.

Important fields:

- `id`
- `game_id`
- `round_number`
- `question_id`
- `player_id`
- `text`
- `is_valid`
- `is_ai`
- `submitted_at`

Rules:

- A human player can submit only one answer per round
- A submitted answer cannot be edited
- The AI answer uses `player_id = null`
- Only one AI answer may exist per game and round
- Missing or invalid answers cannot receive votes
- Every answer belongs to a specific game and round

## votes

Stores player votes.

Important fields:

- `id`
- `game_id`
- `round_number`
- `voter_player_id`
- `answer_id`
- `created_at`

Rules:

- A player can vote only once per round
- A player cannot vote for their own answer
- A player cannot vote for an invalid answer
- A submitted vote cannot be changed
- Every vote belongs to a specific game and round

## Main Relationships

```txt
rooms
  ├── players
  └── games
        ├── answers
        └── votes

questions
  └── answers
```

Relationships:

- A room has many players
- A room has many game sessions
- A room has one active game at a time
- A game has many answers
- A game has many votes
- An answer may belong to a human player or to the AI
- A vote belongs to one player and one answer

## Recommended Constraints

The database should enforce:

- Unique room code
- Room capacity between 2 and 5
- Unique nickname per room
- One human answer per player per round
- One AI answer per round
- One vote per player per round
- Valid foreign-key relationships
- No duplicate game scoring
- No joining a full or active room

Some rules, such as preventing self-votes, may require a database function because they depend on data from multiple rows.

## Scoring

Scoring should not be trusted from the frontend.

The scoring logic should:

- Give 2 points to a player who votes for the AI answer
- Give 1 point to the owner of a human answer that receives a vote
- Give the incorrect voter 0 points
- Ignore invalid answers
- Prevent the AI from receiving points
- Update player total scores
- Prevent the same round from being scored twice

During local development, scoring may be handled by the mock game service.

In Supabase, scoring should be handled through a protected database function or Edge Function.

## Supabase Anonymous Auth

Players enter only a nickname.

Behind the scenes, Supabase Anonymous Auth creates an authenticated user ID for each browser session.

The authenticated user is connected to a player row through:

```txt
auth_user_id
```

This is used to:

- Identify the current player
- Prevent players from editing other players
- Restore a session after refresh
- Support Row Level Security

## Row Level Security

RLS should ensure that players can:

- Create a room
- Join an open room
- Read the room they joined
- Read players in their room
- Update their own ready state
- Submit their own answer
- Submit one vote per round
- Read the active game data

Players should not be able to:

- Edit another player
- Change scores manually
- Submit answers for another player
- Submit votes for another player
- Change the current game phase directly
- Join a full room
- Join a room after the game has started

## Realtime

Supabase Realtime is used to synchronize players in the same room and game.

Realtime updates are needed for:

- Players joining and leaving
- Ready-state changes
- Countdown start or cancellation
- Game creation
- Phase changes
- Round changes
- Answer submissions
- Vote submissions
- Reveal results
- Leaderboard updates
- Final results
- Play Again

Subscriptions should be filtered by:

- `room_id`
- `game_id`

The main Realtime tables are:

- `rooms`
- `players`
- `games`
- `answers`
- `votes`

## Play Again

When players choose Play Again:

- The same room remains active
- The room code remains unchanged
- The completed game remains stored
- Player scores are reset
- Player ready states return to `false`
- The room status returns to `waiting`
- A new game session is created when the room is full and everyone is ready again
