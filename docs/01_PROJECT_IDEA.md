# Project Idea

## Name

AI Imposter

## Concept

AI Imposter is a real-time multiplayer party game.

Players join a room, answer funny questions, and try to identify which answer was written by the AI.

The game should feel light, fun, and easy to understand. It is designed for short sessions and quick gameplay.

## Core Gameplay

Each round starts with a funny question.

Example:

> Why were you late to class?

Every human player writes an answer. In addition, the game adds one AI-style answer.

After the answering phase, all answers are shown anonymously. Players vote for the answer they believe was written by AI.

## Why It Is Fun

The fun comes from two things:

1. Trying to detect the AI answer.
2. Trying to write an answer that makes other players think it was written by AI.

This creates a simple and funny social deduction experience.

## MVP Version

In the MVP, each question has a prepared AI-style fallback answer stored in the database.

This allows the game to work without relying on a live AI API during the first version.

## Future Version

In a future version, the prepared fallback answer can be replaced by a live AI-generated answer.

If the AI API fails or takes too long, the game can still use the fallback answer from the database.

## Target Experience

The game should be:

- Simple to join
- Easy to understand
- Fast to play
- Funny and social
- Good-looking on desktop and mobile