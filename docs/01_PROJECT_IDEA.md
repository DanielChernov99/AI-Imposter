# Project Idea

## Name

AI Imposter

## Concept

AI Imposter is a real-time multiplayer party game.

Players create or join a room, answer funny questions, and try to identify which answer was written by AI.

The game should feel light, social, and easy to understand. It is designed for short sessions and quick gameplay on both desktop and mobile.

In the MVP, all users are guests. There are no registered users, admin users, or host-controlled game actions.

## Core Gameplay

Each round starts with a funny question.

Example:

> Why were you late to class?

Every human player writes one answer. In addition, the game generates one AI answer using the Google AI API.

After the answering phase, all valid answers are displayed anonymously. Players vote for the answer they believe was written by AI.

The AI answer is mixed together with the human answers, but the AI is not displayed as a player and does not appear in the leaderboard.

## Core Experience

The main experience is based on two goals:

1. Identifying which answer was written by AI.
2. Writing an answer that makes other players think it was written by AI.

Players are not only trying to detect the AI. They are also trying to trick other players by writing answers that sound robotic, overly detailed, strange, or AI-like.

## MVP Version

The MVP supports multiple independent rooms.

A player can either:

- Create a new room.
- Join an existing room using a room code.

### Creating a Room

When creating a room, the player enters:

- A nickname.
- The required number of players, between 2 and 5.

The system then:

- Creates a new room.
- Generates a random and unique room code.
- Adds the creator as the first player in the room.
- Moves the creator to the room lobby.

The room creator does not receive special host permissions in the MVP.

### Joining a Room

When joining an existing room, the player enters:

- A nickname.
- A room code.

A player can join only if:

- The room exists.
- The room is still waiting for players.
- The room is not full.
- The nickname is not already used in that room.

### Lobby and Game Start

Inside the lobby, players can see the other players and mark themselves as ready.

The game starts automatically only when:

- The room has reached its selected player capacity.
- Every player in the room is marked as ready.

Before the game begins, a short countdown is displayed.

### Game Structure

Each game has 5 rounds.

Each round includes:

1. Answering phase.
2. Voting phase.
3. Round results / reveal phase.

The Answering, Voting, and Reveal phases are displayed inside the same Game Page.

The main content changes according to the current phase, while shared components such as the Header, round status, timer, and leaderboard remain visible and update during the game.

Google AI API is used to generate the AI answer for each round.

If the AI API fails, takes too long, or returns an invalid response, the game uses the fallback AI-style answer stored for the current question.

## Room and Game Sessions

A room represents the shared space that players create or join.

Each room includes:

- A unique room ID.
- A randomly generated room code.
- A selected player capacity between 2 and 5.
- A list of players.
- Player ready states.
- A room status.
- An active game ID when a game is running.

A game represents one complete 5-round match inside a room.

Each game has its own:

- Game ID.
- Room ID.
- Current phase.
- Current round.
- Questions.
- Answers.
- Votes.
- Scores.
- Round results.
- Phase start and end times.

This separation allows the same room to be reused after a completed game.

When players choose Play Again, they return to the same room lobby and a new game session can be created for that room.

## Target Users

### Guest / Player

In the MVP, all users are guests.

A guest becomes an active player after entering a valid nickname and either creating or joining a room.

The guest/player can:

- Enter a nickname.
- Create a room.
- Select a room capacity between 2 and 5 players.
- Receive a randomly generated room code.
- Join an existing room using a room code.
- See the other players in the room.
- See how many players have joined.
- Mark themselves as ready.
- Wait until the room is full.
- Wait until every player is ready.
- View the countdown before the game starts.
- View the current question.
- Submit one answer during the answering phase.
- View all submitted answers anonymously.
- Vote for the answer they think was written by AI.
- See the reveal screen after each round.
- See which answer was written by AI.
- See who guessed correctly and incorrectly.
- See the points awarded during the round.
- See the updated leaderboard.
- Continue through 5 rounds.
- View the final podium.
- View the remaining players below the podium.
- Click Play Again.
- Return to the same room lobby after Play Again.
- Mark themselves as ready again for a new game.
- Quit the room and return to the Start Page.

## Future Version

Future versions may include:

- Host-controlled game start.
- Host permissions.
- Admin panel for question management.
- Question categories.
- Age-based question sets.
- Custom number of rounds.
- Additional room settings.
- Public room discovery.
- Spectator mode.
- Game history.
- Player statistics.

## Target Experience

The game should be:

- Simple to create or join.
- Easy to understand.
- Fast to play.
- Funny and social.
- Clear during every game phase.
- Responsive and comfortable on desktop and mobile.
