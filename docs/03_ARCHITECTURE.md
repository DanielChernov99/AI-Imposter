נכון. במסמך `Architecture` צריך להסביר **איך המערכת בנויה**, לא לחזור שוב על כל חוקי המשחק, ה־Flow וה־UI שכבר נמצאים במסמכים האחרים. הגרסה הקודמת כללה יותר מדי פירוט וחזרות.

הנה גרסה קצרה וממוקדת יותר:

````md
# Architecture

## Main Principle

Supabase is the source of truth for shared room and game data.

React and MobX manage the client-side state and UI, but the permanent and shared state is stored in Supabase.

The MVP supports multiple rooms. Each room has a randomly generated room code, supports 2–5 players, and can have one active game at a time.

## Frontend

The frontend is built with:

- React
- Vite
- JavaScript
- React Router
- MobX
- Mantine UI

React components should focus mainly on presentation and user interaction.

Components should not contain direct Supabase calls or shared game logic.

## Application Flow

The application follows the game flow:

```txt
Start Page
    ↓
Create Room or Join Room
    ↓
Lobby
    ↓
Countdown
    ↓
Game Page
    ├── Answering
    ├── Voting
    └── Reveal
    ↓
Final Results
```

The application does not use a traditional navigation bar.

## Routing

React Router is used for navigation between the main pages.

Because the application will be deployed to GitHub Pages, `HashRouter` should be used.

Recommended routes:

- `/`
- `/room/:roomCode/lobby`
- `/room/:roomCode/game`
- `/room/:roomCode/results`

The Answering, Voting, and Reveal phases are not separate routes.

They are displayed as changing content inside the same Game Page, while shared components such as the Header, Timer, round status, and Leaderboard remain visible.

## Room and Game Separation

A room and a game are separate entities.

### Room

A room represents the shared lobby that players create or join.

A room stores:

- Room ID
- Room code
- Maximum players
- Room status
- Active game ID

### Game

A game represents one complete 5-round match inside a room.

A game stores:

- Game ID
- Room ID
- Current phase
- Current round
- Current question
- Phase start time
- Phase end time

When players choose Play Again, they return to the same room, but a new game session is created.

## State Management

MobX is used for client-side state management.

The initial architecture uses three stores:

### PlayerStore

Manages the current player's identity:

- Player ID
- Authenticated user ID
- Nickname
- Current room ID
- Current game ID

### RoomStore

Manages room and lobby state:

- Current room
- Room players
- Ready states
- Room creation
- Room joining
- Leaving the room
- Room subscriptions

### GameStore

Manages the active game:

- Current phase
- Current round
- Current question
- Answers
- Votes
- Scores
- Leaderboard
- Phase timer
- Play Again

Temporary UI state, such as textarea content or an unsubmitted vote selection, should remain inside the relevant component.

## Services

Components should call MobX store actions, and stores should use service files.

```txt
React Component
      ↓
MobX Store
      ↓
Service
      ↓
Mock Service or Supabase
```

Main services:

- `authService`
- `roomService`
- `gameService`
- `questionService`
- `aiService`

During the first development stage, mock services are used.

After the complete local flow works, the mock services are replaced with Supabase services.

## Authentication

Players use only a nickname in the UI.

Supabase Anonymous Auth is used behind the scenes to identify each browser session.

Each player row is connected to an authenticated user through `auth_user_id`.

## Realtime

Supabase Realtime synchronizes players inside the same room and game.

Realtime updates are required for:

- Players joining or leaving
- Ready-state changes
- Countdown
- Game phases
- Answers
- Votes
- Scores
- Final results

Subscriptions should be filtered by `room_id` and `game_id`.

## Phase Management

The game starts automatically when the room is full and every player is ready.

Game phases are:

- `countdown`
- `answering`
- `voting`
- `reveal`
- `finished`

The game stores `phase_started_at` and `phase_ends_at`.

The Timer component only displays the remaining time. It should not independently control phase transitions.

During the mock stage, phase transitions are managed through the GameStore and mock game service.

During the Supabase stage, transitions must be guarded so multiple clients cannot advance the game more than once.

## Authorization

Supabase Row Level Security should prevent players from:

- Editing other players
- Submitting answers for other players
- Submitting votes for other players
- Changing scores
- Changing game phases directly

Sensitive operations such as scoring and phase transitions should eventually use protected database or server-side functions.

## Deployment

The frontend will be deployed to GitHub Pages using `HashRouter`.

Public Supabase values may be stored in frontend environment variables.

Secret values, including the Google AI API key and Supabase service-role key, must not be exposed in frontend code.
````
