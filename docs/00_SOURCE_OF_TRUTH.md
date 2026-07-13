# AI Imposter — Source of Truth

## Project Summary

AI Imposter is a real-time multiplayer party game.

Players create or join a room, answer funny questions, and vote for the answer they believe was written by AI.

The MVP supports multiple independent rooms with 2–5 players.

## Main Decisions

- Players enter using a nickname only.
- Supabase Anonymous Auth identifies each browser session.
- A player can create a room or join using a room code.
- Nicknames are unique inside each room.
- There is no Host or Admin role.
- The game starts automatically when the room is full and all players are ready.
- Each game contains 5 rounds.
- Supabase is the source of truth for shared game data.
- MobX manages local frontend state.
- The server controls phases, deadlines, scoring, and question selection.

## AI Answers

The game does not call an AI API during gameplay.

Each question stores exactly three prepared AI-style answers in:

```txt
questions.ai_answers
```

For each round, the server selects one unused question and randomly chooses one prepared AI answer.

The AI answer is stored with:

```txt
player_id = null
is_ai = true
```

The AI is not a player and does not appear in the Leaderboard.

## Game Flow

```txt
Start
→ Create or Join Room
→ Lobby
→ Countdown
→ Answering
→ Voting
→ Reveal
→ Repeat for 5 rounds
→ Final Results
```

## Phase Durations

| Phase     |   Duration |
| --------- | ---------: |
| Countdown |  5 seconds |
| Answering | 20 seconds |
| Voting    | 20 seconds |
| Reveal    | 10 seconds |

The frontend displays the server deadline. It does not independently control phase transitions.

## Scoring

- Correct AI vote: voter receives 2 points.
- Vote for a human answer: answer owner receives 1 point.
- Incorrect voter receives 0 points.
- Invalid answers receive no points.
- A round cannot be scored twice.

## Play Again

Each player may request Play Again.

The room returns to the Lobby only after every current player requests it.

The reset:

- Keeps the same room code.
- Resets scores.
- Resets Ready states.
- Clears the active game.
- Returns the room to `waiting`.

## Current Limitations

- Refresh does not restore the current Player, Room, and Game into MobX.
- Full disconnect recovery is not implemented.
- Room capacity does not automatically change when a player leaves.
- The development Mock provider does not support the full game flow.
