# AI Imposter — Source of Truth

## Project Summary

AI Imposter is a real-time multiplayer party game where players join one shared lobby, answer funny questions, and try to identify which answer was written by AI.

The game is inspired by social party games like Kahoot and Jackbox. Players do not need a full account. They join the shared lobby by entering a nickname.

In the MVP, the system supports one shared lobby and one active game session at a time. Multiple rooms, room codes, host-controlled rooms, and custom game settings are future extensions.

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- MobX
- Mantine UI
- Supabase Database
- Supabase Realtime
- Supabase Anonymous Auth
- Google AI API
- GitHub Pages

## Main Decisions

- The MVP uses one shared lobby.
- The MVP supports one active game session at a time.
- Players join using a nickname only.
- Players do not need email/password registration.
- Supabase Anonymous Auth is used behind the scenes.
- There are no registered users in the MVP.
- There is no admin role in the MVP.
- There is no host role in the MVP.
- The game starts automatically when all required players are ready.
- The game supports 2–9 players.
- The game has 5 rounds.
- Each round has:
  - 20 seconds for answering
  - 10 seconds for voting
  - 6 seconds for round results / reveal
- Google AI API is used to generate the AI answer for each round.
- If the AI API fails, takes too long, or returns an invalid response, the game uses a fallback AI-style answer from the database.
- The AI is not displayed as a player.
- The AI does not appear in the leaderboard.
- Supabase is the source of truth.
- MobX is used for client-side state management.
- React components should focus on UI.
- Supabase calls should be handled through service files.
- Multiple rooms and room codes are future extensions.

## MVP Goal

The MVP should allow players to:

1. Enter a nickname.
2. Join the shared lobby.
3. See other players in the lobby.
4. Mark themselves as ready.
5. Wait for the game to start automatically.
6. View the countdown before the game starts.
7. Play a 5-round game.
8. View the current question.
9. Submit an answer during the answering phase.
10. View all submitted answers anonymously.
11. Vote for the answer they think was written by AI.
12. See the reveal screen after each round.
13. See who guessed correctly and incorrectly.
14. See the updated leaderboard.
15. View the final podium.
16. Click Play Again.
17. Return to the lobby after Play Again.
18. Mark themselves as ready again for a new game.
19. Quit the game.

## Future Scope

Future versions may include:

- Multiple rooms
- Room codes
- Host-controlled game start
- Admin panel for question management
- Question categories
- Age-based question sets
- Custom number of players
- Custom number of rounds

## Documentation Files

- `01_PROJECT_IDEA.md` — product idea and gameplay concept
- `02_GAME_FLOW_AND_RULES.md` — game flow, timers, and scoring
- `03_ARCHITECTURE.md` — frontend and backend architecture
- `04_DATABASE_AND_SUPABASE.md` — database structure and Supabase usage