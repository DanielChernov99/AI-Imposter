# Game Flow and Rules

## Room Rules

- Room capacity is between 2 and 5 players.
- The creator selects the room capacity.
- The creator has no Host permissions.
- Players join using a nickname and room code.
- Nicknames must be unique inside the room.
- Players may join only while the room is `waiting`.
- The game starts only when the room is full and all players are ready.

## Room Statuses

```txt
waiting
countdown
playing
finished
```

## Game Phases

```txt
countdown
answering
voting
reveal
finished
```

## Timers

| Phase     |   Duration |
| --------- | ---------: |
| Countdown |  5 seconds |
| Answering | 20 seconds |
| Voting    | 20 seconds |
| Reveal    | 10 seconds |

## Lobby

Players can:

- View the room code.
- View all room players.
- View Ready states.
- Change their own Ready state.
- Leave the room.

If a player becomes Not Ready during Countdown:

- The Countdown is cancelled.
- The temporary Game is deleted.
- The Room returns to `waiting`.

## Answering

- Every player may submit one answer per round.
- A submitted answer cannot be edited.
- Missing or invalid answers cannot receive votes.
- The AI answer remains hidden during this phase.

## Voting

- Valid answers are displayed anonymously.
- Players may change their selection before submitting.
- A submitted vote is final.
- A player may vote only once.
- A player cannot vote for their own answer.
- A player cannot vote for an invalid answer.

## Reveal

The Reveal displays:

- The AI answer.
- The owner of each human answer.
- Player votes.
- Round points.
- Updated Leaderboard.

## Scoring

- Correct AI vote: +2 to the voter.
- Vote for a human answer: +1 to its owner.
- Incorrect voter: 0 points.
- Invalid answers and the AI receive no points.

## Game Completion

The Answering, Voting, and Reveal flow repeats for 5 rounds.

After Round 5:

- The Game becomes `finished`.
- Final standings are stored.
- The podium and final scores are displayed.

Ties are ordered by earlier room join time.

## Play Again

The Room resets only after every current player requests Play Again.

The reset:

- Keeps the room code.
- Resets scores.
- Resets Ready states.
- Returns the Room to `waiting`.

## Known Limitations

- Refresh may return the player to the Start Page.
- Room capacity does not shrink when a player leaves.
- Full mid-game disconnect recovery is outside the MVP.
