# Architecture

## Main Principle

Supabase is the source of truth.

The frontend should not be the permanent source of game data. React and MobX are used to display and manage client-side state, but the actual game state is stored in Supabase.

## Frontend

The frontend is built with:

- React
- Vite
- javascript
- React Router
- MobX
- Mantine UI

## Routing

React Router is used for navigation.

Because the app will be deployed to GitHub Pages, hash-based routing should be used.

Example routes:

- `/`
- `/#/lobby/:roomCode`
- `/#/game/:roomCode`
- `/#/final/:roomCode`

## State Management

MobX is used for client-side state management.

Suggested stores:

- PlayerStore
- RoomStore
- GameStore
- UIStore

MobX should manage:

- Current player state
- Current room state
- Current game phase
- Loaded answers and votes
- Loading states
- UI errors

Supabase still remains the source of truth.

## Services

Supabase calls should not be written directly inside React components.

Use service files for data access.

Suggested services:

- roomService
- playerService
- gameService
- questionService

## Components

Components should focus on UI.

Components should receive data from stores, hooks, or props, and should avoid containing direct Supabase logic.

The exact component structure will follow the Figma design.

## Authentication

The user experience is nickname-based, similar to Kahoot.

Behind the scenes, Supabase Anonymous Auth is used so each player has an authenticated session.

This allows the project to include authentication without requiring email and password registration.

## Authorization

Supabase Row Level Security should be used to protect important operations.

Players should only interact with their own room, player row, answers, and votes.

## Realtime

Supabase Realtime is used to sync the game between players.

Realtime updates are needed for:

- Players joining the lobby
- Room phase changes
- Answers being submitted
- Votes being submitted
- Leaderboard updates

## Technical Host

The player who creates the room is the technical host.

The host is a normal player visually, but behind the scenes the host is responsible for moving the game between phases.

Examples:

- Answering to Voting
- Voting to Reveal
- Reveal to Next Round

## UI Requirements

The app must include:

- Controlled forms
- Loading indicators
- Error messages in the UI
- Responsive design for mobile and desktop
- Mantine components where useful