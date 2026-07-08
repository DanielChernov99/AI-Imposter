# Game Flow and Rules

## Player Limits

- Minimum players: 2
- Maximum players: 9

A game cannot start with fewer than 2 players.

In the MVP, the game uses one shared lobby and one active game session at a time.

## Lobby Flow

### Join Game

A player enters a nickname and joins the shared lobby.

The player does not create a room and does not need a room code in the MVP.

### Lobby / Ready

After joining the shared lobby, the player can see the other players.

Each player can mark themselves as ready.

When all required players are ready, the game starts automatically.

### Countdown

Before the first round starts, a short countdown is shown.

Recommended duration:

- 3 seconds

After the countdown ends, the game moves to the answering phase.

## Nickname Rules

- Minimum length: 2 characters
- Maximum length: 16 characters
- Must be unique in the current shared lobby
- Cannot be empty

## Game Structure

Each game has 5 rounds.

Each round has these phases:

1. Answering
2. Voting
3. Round Results / Reveal

After 5 rounds, the game moves to the final results screen.

## Answering Phase

Duration: 20 seconds

During this phase:

- A question is shown.
- Each player writes an answer.
- The game generates one AI answer using Google AI API.
- If the AI API fails, takes too long, or returns an invalid response, the game uses the fallback AI-style answer from the database.

If all players submit valid answers before the 20 seconds end, the game can move to the voting phase early.

## Answer Rules

- A player can submit only one answer per round.
- Empty answers are invalid.
- Answers should have a maximum length of 120 characters.
- A player cannot edit an answer after submitting it.

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
- The AI answer is also shown anonymously.
- Disabled invalid answers may be shown, but cannot be selected.
- Players vote for the answer they think was written by AI.

Voting time is always 10 seconds, even if all players vote early.

## Voting Rules

- A player can vote only once per round.
- A player cannot vote for their own answer.
- A player cannot vote for an invalid answer.
- A vote is final and cannot be changed.

## Round Results / Reveal Phase

Duration: 6 seconds

During this phase:

- The AI answer is revealed.
- Correct and incorrect guesses are shown.
- Round points are shown.
- The leaderboard is updated.
- The game then moves to the next round or to the final results screen.

## Scoring Rules

If a player correctly votes for the AI answer:

- The voter gets 2 points.

If a player votes for a real human answer:

- The owner of that answer gets 1 point.
- The voter gets 0 points.

Players cannot vote for their own answer.

Invalid answers cannot receive votes or points.

The AI does not receive points.

The AI does not appear in the leaderboard.

## Final Results

After 5 rounds, the game shows a podium:

- 1st place
- 2nd place
- 3rd place

The final screen also shows the rest of the players below the podium.

The final screen includes:

- Play Again
- Quit Game

## Play Again

For the MVP, Play Again returns all players to the shared lobby.

After returning to the lobby:

- Player scores are reset.
- Answers are cleared.
- Votes are cleared.
- Round progress is reset.
- Players need to mark themselves as ready again.
- When all required players are ready, a new game starts automatically.

## Quit Game

When a player quits the game:

- The player is removed from the current lobby.
- The player returns to the join screen.