# AI Imposter — Source of Truth

## Project Summary

AI Imposter is a real-time party game where players join a room, answer funny questions, and try to identify which answer was written by the AI.

The game is inspired by room-based games like Kahoot. Players do not need a full account. They join with a nickname and a room code.

## Tech Stack

- React
- Vite
- javascript
- React Router
- MobX
- Mantine UI
- Supabase Database
- Supabase Realtime
- Supabase Anonymous Auth
- GitHub Pages

## Main Decisions

- The game uses nickname-based entry.
- Supabase Anonymous Auth is used behind the scenes.
- Each room has 2–9 players.
- The game has 5 rounds.
- Each round has 20 seconds for answers, 10 seconds for voting, and 6 seconds for reveal.
- The AI is not displayed as a player.
- The AI does not appear in the leaderboard.
- In the MVP, AI-style answers are stored in the database as fallback answers.
- A future version may replace fallback answers with live AI API responses.
- Supabase is the source of truth.
- MobX is used for client-side state management.
- React components should focus on UI.
- Supabase calls should be handled through service files.

## MVP Goal

The MVP should allow players to:

1. Create a room.
2. Join a room using a numeric room code.
3. Enter a nickname.
4. Wait in a lobby.
5. Start a 5-round game.
6. Submit answers.
7. Vote for the answer they think was written by AI.
8. See scores update.
9. See a final podium.
10. Start a new game or quit.

## Documentation Files

- `01_PROJECT_IDEA.md` — product idea and gameplay concept
- `02_GAME_FLOW_AND_RULES.md` — game flow, timers, and scoring
- `03_ARCHITECTURE.md` — frontend and backend architecture
- `04_DATABASE_AND_SUPABASE.md` — database structure and Supabase usage