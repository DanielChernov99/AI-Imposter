# Game Flow and Rules

## Player Limits

- Minimum players: 2
- Maximum players: 9

A game cannot start with fewer than 2 players.

## Room Flow

### Create Room

A player enters a nickname and creates a new room.

The player who creates the room becomes the technical host.

The host is still a normal player in the game, but behind the scenes the host controls phase transitions.

### Join Room

A player enters:

- Room code
- Nickname

The nickname must be unique inside the room.

## Nickname Rules

- Minimum length: 2 characters
- Maximum length: 16 characters
- Must be unique in the room

## Game Structure

Each game has 5 rounds.

Each round has these phases:

1. Answering
2. Voting
3. Reveal

After 5 rounds, the game moves to the final results screen.

## Answering Phase

Duration: 20 seconds

During this phase:

- A question is shown.
- Each player writes an answer.
- The game also adds one AI-style answer from the database.

If all players submit valid answers before the 20 seconds end, the game can move to the voting phase early.

## Invalid or Missing Answers

If a player does not submit an answer in time, or submits an empty answer, the game shows a disabled answer card.

Example text:

> No valid answer submitted

This answer cannot be voted for.

The player can still vote in the voting phase.

## Voting Phase

Duration: 10 seconds

During this phase:

- All valid human answers are shown anonymously.
- The AI-style answer is also shown anonymously.
- Disabled invalid answers may be shown, but cannot be selected.
- Players vote for the answer they think was written by AI.

Voting time is always 10 seconds, even if all players vote early.

## Reveal Phase

Duration: 6 seconds

During this phase:

- The AI answer is revealed.
- Correct and incorrect guesses are shown.
- The leaderboard is updated.
- The game then moves to the next round or the final screen.

## Scoring Rules

If a player correctly votes for the AI answer:

- The voter gets 2 points.

If a player votes for a real human answer:

- The owner of that answer gets 1 point.
- The voter gets 0 points.

Players cannot vote for their own answer.

Invalid answers cannot receive votes or points.

## Final Results

After 5 rounds, the game shows a podium:

- 1st place
- 2nd place
- 3rd place

The final screen includes:

- Play Again
- Quit Game

For the MVP, Play Again creates a new room instead of resetting the existing room.