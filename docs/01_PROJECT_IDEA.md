# Project Idea

## Name

AI Imposter

## Concept

AI Imposter is a real-time multiplayer party game where players try to identify the AI-style answer.

Each round:

1. Players receive a funny question.
2. Every player writes one answer.
3. One prepared AI-style answer is added.
4. All valid answers are displayed anonymously.
5. Players vote for the answer they believe was written by AI.

## Player Goals

Players have two main goals:

- Detect the AI answer.
- Write an answer that tricks other players.

The game is designed to be:

- Funny and social.
- Quick to understand.
- Easy to create or join.
- Suitable for desktop and mobile.
- Designed for short group sessions.

## MVP Features

- Multiple independent rooms.
- Room codes.
- Room capacity between 2 and 5 players.
- Anonymous player sessions.
- Ready states and automatic game start.
- Five-round games.
- Answering, Voting, and Reveal phases.
- Round points and cumulative Leaderboard.
- Final podium.
- Play Again and Quit.

## AI Strategy

There is no live AI API call.

Each question stores three prepared AI-style answers. The server randomly selects one for the round.

## Scoring

- Guess the AI answer: 2 points.
- Receive a vote on a human answer: 1 point.
- Incorrect vote: 0 points.

## Future Extensions

- Refresh restoration.
- Better disconnect handling.
- Host-controlled settings.
- Custom round count and timers.
- Question categories.
- Admin question management.
- Player profiles.
- Game history and statistics.
