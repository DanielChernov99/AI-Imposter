# Architecture

## Main Principle

Supabase is the source of truth.

The frontend should not be the permanent source of game data. React and MobX are used to display and manage client-side state, but the actual game state is stored in Supabase.

In the MVP, the system supports one shared lobby and one active game session at a time.

Multiple rooms, room codes, and host-controlled rooms are future extensions.

## Frontend

The frontend is built with:

- React
- Vite
- JavaScript
- React Router
- MobX
- Mantine UI

## Routing

React Router is used for navigation.

Because the app will be deployed to GitHub Pages, hash-based routing should be used.

Example routes:

- `/`
- `/#/lobby`
- `/#/game`
- `/#/final`

There is no `roomCode` route parameter in the MVP because the game uses one shared lobby.

## State Management

MobX is used for client-side state management.

Suggested stores:

- PlayerStore
- GameStateStore
- GameStore
- AnswerStore
- VoteStore
- UIStore

MobX should manage:

- Current player state
- Current shared lobby state
- Current game phase
- Current round
- Current question
- Loaded answers
- Loaded votes
- Leaderboard data
- Loading states
- UI errors

Supabase still remains the source of truth.

## Services

Supabase calls should not be written directly inside React components.

Use service files for data access.

Suggested services:

- authService
- playerService
- gameStateService
- questionService
- answerService
- voteService
- aiService

### Service Responsibilities

`authService`

- Starts Supabase Anonymous Auth.
- Gets the current authenticated user.
- Keeps the browser session connected to a player row.

`playerService`

- Creates a player in the shared lobby.
- Checks nickname uniqueness.
- Updates player ready state.
- Removes a player when they quit.
- Loads players for the lobby and leaderboard.

`gameStateService`

- Loads the current game state.
- Updates the current phase.
- Updates the current round.
- Updates phase start and end times.
- Resets the game after Play Again.

`questionService`

- Loads questions.
- Selects the question for the current round.
- Provides fallback AI-style answers.

`answerService`

- Submits human answers.
- Inserts AI answers.
- Inserts invalid/missing answers when needed.
- Loads answers for the current round.

`voteService`

- Submits player votes.
- Prevents duplicate votes.
- Loads votes for the current round.
- Calculates round points.

`aiService`

- Calls Google AI API to generate an AI answer.
- Validates the AI answer.
- Falls back to the stored fallback AI-style answer if needed.

## Components

Components should focus on UI.

Components should receive data from stores, hooks, or props, and should avoid containing direct Supabase logic.

The exact component structure will follow the design mockups.

Suggested component groups:

- layout
- lobby
- game
- answers
- voting
- results
- leaderboard
- shared

## Authentication

The user experience is nickname-based.

Behind the scenes, Supabase Anonymous Auth is used so each player has an authenticated session.

This allows the project to include authentication without requiring email and password registration.

Each browser session is connected to one player row using `auth_user_id`.

## Authorization

Supabase Row Level Security should be used to protect important operations.

Players should only be able to:

- Read the shared game state.
- Read players in the shared lobby.
- Update their own player row.
- Submit their own answer.
- Submit one vote per round.
- Read answers and votes for the active game.

Players should not be able to:

- Edit other players.
- Manually change scores from the UI.
- Submit answers for other players.
- Submit votes for other players.

## Realtime

Supabase Realtime is used to sync the game between players.

Realtime updates are needed for:

- Players joining the lobby
- Players leaving the lobby
- Players becoming ready
- Countdown start
- Phase changes
- Current round changes
- Answers being submitted
- Votes being submitted
- Reveal results
- Leaderboard updates
- Final results

Realtime subscriptions are needed for:

- game_state
- players
- answers
- votes

## Phase Management

There is no host role in the MVP.

The game starts automatically when all required players are ready.

Phase transitions are based on the shared game state and timers.

The shared game state stores:

- Current phase
- Current round
- Current question
- Phase start time
- Phase end time
- Required players

Because the app has no backend server in the MVP, phase transition logic can run from the client, but it should be written carefully so duplicate updates do not break the game.

Phase update operations should be guarded by the current game state.

Example:

- Move from lobby to countdown only if all required players are ready.
- Move from countdown to answering only if the current phase is countdown.
- Move from answering to voting only if the current phase is answering.
- Move from voting to reveal only if the current phase is voting.
- Move from reveal to the next round only if the current phase is reveal.
- Move from reveal to final only if the current round is 5.

## UI Requirements

The app must include:

- Controlled forms
- Loading indicators
- Error messages in the UI
- Disabled buttons when actions are not allowed
- Responsive design for mobile and desktop
- Mantine components where useful

## Deployment

The frontend will be deployed to GitHub Pages.

Because GitHub Pages does not support normal client-side routes well, the project should use hash-based routing.