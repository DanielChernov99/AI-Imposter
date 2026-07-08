# Project Idea

## Name

AI Imposter

## Concept

AI Imposter is a real-time multiplayer party game.

Players join one shared lobby, answer funny questions, and try to identify which answer was written by AI.

The game should feel light, fun, and easy to understand. It is designed for short sessions and quick gameplay.

In the MVP, all users are guests. There are no registered users, no admin users, and no host role.

## Core Gameplay

Each round starts with a funny question.

Example:

> Why were you late to class?

Every human player writes an answer. In addition, the game generates one AI answer using Google AI API.

After the answering phase, all answers are shown anonymously. Players vote for the answer they believe was written by AI.

The AI answer is mixed together with the human answers, but the AI is not shown as a player and does not appear in the leaderboard.

## Why It Is Fun

The fun comes from two things:

1. Trying to detect the AI answer.
2. Trying to write an answer that makes other players think it was written by AI.

This creates a simple and funny social deduction experience.

Players are not only trying to find the AI. They are also trying to trick other players with answers that sound strange, robotic, too perfect, or AI-like.

## MVP Version

In the MVP, the game supports one shared lobby and one active game session at a time.

A player joins by entering a nickname. After joining the shared lobby, the player can mark themselves as ready.

When all required players are ready, the game starts automatically after a short countdown.

Each game has 5 rounds.

Each round includes:

1. Answering phase
2. Voting phase
3. Round results / reveal phase

Google AI API is used to generate the AI answer for each round.

If the AI API fails, takes too long, or returns an invalid response, the game uses the fallback AI-style answer stored in the questions table.

## Target Users

### Guest / Player

In the MVP, all users are guests.

A guest becomes an active player after entering a valid nickname and joining the shared lobby.

The guest/player can:

- Enter a nickname
- Join the shared lobby
- See other players in the lobby
- Mark themselves as ready
- Wait for the game to start automatically
- View the countdown before the game starts
- View the current question
- Submit an answer during the answering phase
- View all submitted answers anonymously
- Vote for the answer they think was written by AI
- See the reveal screen after each round
- See who guessed correctly and incorrectly
- See the updated leaderboard
- Continue through 5 rounds
- View the final podium
- Click Play Again
- Return to the lobby after Play Again
- Mark themselves as ready again for a new game
- Quit the game

## Future Version

Future versions may include:

- Multiple rooms
- Room codes
- Host-controlled game start
- Admin panel for question management
- Question categories
- Age-based question sets
- Custom number of players
- Custom number of rounds

## Target Experience

The game should be:

- Simple to join
- Easy to understand
- Fast to play
- Funny and social
- Good-looking on desktop and mobile