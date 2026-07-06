# Database and Supabase

## Main Tables

The MVP uses these main tables:

- rooms
- players
- questions
- rounds
- answers
- votes

## rooms

Stores room state.

Important fields:

- id
- code
- status
- phase
- host_player_id
- current_round
- current_question_id
- phase_started_at
- phase_ends_at
- created_at

Room phases:

- lobby
- answering
- voting
- reveal
- finished

## players

Stores temporary players inside a room.

Important fields:

- id
- room_id
- auth_user_id
- nickname
- is_host
- score
- joined_at

The AI is not stored as a player.

## questions

Stores game questions and fallback AI-style answers.

Important fields:

- id
- text
- fallback_ai_answer
- category
- created_at

the game uses `fallback_ai_answer` instead of a live AI API response if the AI API fails or takes too long to respond.

## rounds

Stores the rounds for a room.

Important fields:

- id
- room_id
- round_number
- question_id
- created_at

Each game has 5 rounds.

## answers

Stores answers for each round.

Important fields:

- id
- round_id
- player_id
- text
- is_ai
- is_valid
- created_at

Human answer:

- player_id = actual player id
- is_ai = false
- is_valid = true

AI-style answer:

- player_id = null
- is_ai = true
- is_valid = true

Missing or invalid answer:

- player_id = actual player id
- is_ai = false
- is_valid = false
- text = "No valid answer submitted"

## votes

Stores player votes.

Important fields:

- id
- round_id
- voter_player_id
- answer_id
- created_at

Each player can vote only once per round.

A unique constraint should exist on:

- round_id
- voter_player_id

## Temporary Data

The game does not need long-term history in the MVP.

Room data, answers, rounds, and votes are temporary.

When a game is finished and no longer needed, the room can be deleted.

With cascade delete, related data should also be deleted:

- players
- rounds
- answers
- votes

## Supabase Realtime

Realtime subscriptions are needed for:

- rooms
- players
- answers
- votes

## Supabase Auth

The app uses Supabase Anonymous Auth.

Players still enter only a nickname, but behind the scenes they receive an authenticated Supabase user.

## RLS

Basic RLS should protect the data.

The goal is:

- Players can only access rooms they joined.
- Players can only submit their own answer.
- Players can only vote once per round.
- Players cannot directly edit other players.
- Players should not manually change scores from the UI.