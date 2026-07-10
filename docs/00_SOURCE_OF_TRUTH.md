# AI Imposter — Source of Truth

## Project Summary

AI Imposter is a real-time multiplayer party game where players create or join a room, answer funny questions, and try to identify which answer was written by AI.

The game is inspired by social party games such as Kahoot and Jackbox. Players do not need a traditional account. They enter a nickname and either create a new room or join an existing room using a room code.

The MVP supports multiple independent rooms. Each room has a randomly generated room code and a selected player capacity between 2 and 5 players.

The game starts automatically when the room is full and every player in the room is marked as ready.

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

- The MVP supports multiple rooms.
- Each room has a randomly generated and unique room code.
- A player can create a new room or join an existing room.
- When creating a room, the player enters:
  - A nickname
  - The required number of players, between 2 and 5
- When joining a room, the player enters:
  - A nickname
  - A room code
- Players can join a room only while it is waiting for players and is not full.
- Nicknames must be unique within the current room.
- Players do not need email or password registration.
- Supabase Anonymous Auth is used behind the scenes.
- There are no registered users in the MVP.
- There is no admin role in the MVP.
- There is no host-controlled game flow in the MVP.
- The player who creates the room is the first player, but does not receive special host permissions.
- A room starts in a waiting state.
- The game starts automatically only when:
  - The room has reached its selected player capacity.
  - Every player in the room is marked as ready.
- A short countdown is shown before the game begins.
- Each game has 5 rounds.
- Each round has:
  - 20 seconds for answering
  - 10 seconds for voting
  - 6 seconds for round results / reveal
- Each game belongs to one room.
- Players, answers, votes, scores, and round results belong to a specific game.
- Google AI API is used to generate the AI answer for each round.
- If the AI API fails, takes too long, or returns an invalid response, the game uses a fallback AI-style answer from the database.
- The AI is not displayed as a player.
- The AI does not appear in the leaderboard.
- Supabase is the final source of truth for shared game data.
- MobX is used for client-side state management.
- React components should focus mainly on UI.
- Data access should be handled through service files.
- Mock services may be used during development before connecting Supabase.
- Game phases inside the main game screen are controlled by game state, not by separate routes.
- The Answering, Voting, and Reveal phases are displayed as changing content inside the same Game Page.
- Shared components such as the Header and Leaderboard remain visible and update according to the current game state.

## Room and Game Relationship

A room represents the shared space that players join before the game begins.

A room stores information such as:

- Room ID
- Room code
- Required player capacity
- Current players
- Player ready states
- Room status
- Active game ID

A game represents one complete 5-round match inside a room.

A game stores information such as:

- Game ID
- Room ID
- Current phase
- Current round
- Current question
- Answers
- Votes
- Scores
- Phase start and end times

When a room becomes full and all players are ready, a game begins for that room.

After the game ends, the room may be reused for Play Again while a new game session is created.

## Main Application Flow

```txt
Start Page
    ↓
Create Room or Join Room
    ↓
Lobby
    ↓
Wait until the room is full
    ↓
All players mark themselves as ready
    ↓
Countdown
    ↓
Answering
    ↓
Voting
    ↓
Round Results / Reveal
    ↓
Repeat for 5 rounds
    ↓
Final Results
```
