# Game Flow and Rules

## Room and Player Limits

- Minimum players per room: 2
- Maximum players per room: 5
- The room creator selects the required number of players when creating the room.
- A game cannot start until the room reaches its selected player capacity.
- The MVP supports multiple independent rooms.

Each room has:

- A unique internal room ID.
- A randomly generated room code.
- A selected player capacity between 2 and 5.
- A list of players.
- Player ready states.
- A room status.
- An active game ID when a game is running.

Room codes must be unique among active rooms.

## Room Statuses

Recommended room statuses:

- `waiting`
- `countdown`
- `playing`
- `finished`

### Waiting

The room is open and players may join if it is not full.

### Countdown

The room is full and every player is ready. A short countdown is displayed before the game starts.

New players cannot join during the countdown.

### Playing

The game has started.

New players cannot join while the room is playing.

### Finished

The game has completed and the final results are displayed.

Players may choose Play Again or leave the room.

## Start Page Flow

From the Start Page, a player can:

1. Create a new room.
2. Join an existing room.

## Create Room

When creating a room, the player enters:

- A nickname.
- The required number of players, between 2 and 5.

The system then:

1. Validates the nickname.
2. Creates a new room.
3. Generates a random and unique room code.
4. Sets the selected player capacity.
5. Adds the room creator as the first player.
6. Sets the creator's ready state to `false`.
7. Moves the creator to the room lobby.

The room creator does not receive special host permissions in the MVP.

The game does not require the creator to manually start it.

## Join Room

When joining an existing room, the player enters:

- A nickname.
- A room code.

A player can join only if:

- The room code belongs to an active room.
- The room status is `waiting`.
- The room is not full.
- The nickname is valid.
- The nickname is not already used in that room.

If any condition fails, the player remains on the Start Page and sees an appropriate error message.

## Nickname Rules

- Minimum length: 2 characters.
- Maximum length: 16 characters.
- Cannot be empty.
- Leading and trailing spaces should be removed.
- Must be unique within the current room.
- Nickname comparison should be case-insensitive.

For example, `PlayerOne` and `playerone` are considered the same nickname inside the same room.

The same nickname may exist in different rooms.

## Lobby Flow

After creating or joining a room, the player enters the room lobby.

Inside the lobby, players can:

- See the room code.
- See the current number of players.
- See the selected player capacity.
- See the other players in the room.
- See which players are ready.
- Mark themselves as ready or not ready.
- Leave the room.

Each player begins with:

```js
isReady: false;
```
