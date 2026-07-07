# UI Design Prompts

This file contains reusable prompts for generating UI mockups for AI Imposter.

Use the Base Prompt first, then add the specific screen prompt below it.

---

# 1. Base UI Prompt

Design a high-fidelity UI mockup for a web game called "AI Imposter".

AI Imposter is a real-time multiplayer party game inspired by Kahoot-style room games.

Players join a room using a numeric room code and a nickname. There is no full registration flow. The game is played in short sessions.

Game concept:
Players answer funny questions, and one answer is an AI-style answer. All answers are shown anonymously, and players vote for the answer they think was written by AI.

Core rules:
- 2 to 9 players per room.
- 5 rounds per game.
- 20 seconds to write an answer.
- 10 seconds to vote.
- 6 seconds to reveal results.
- The AI is not shown as a player.
- The AI does not appear in the leaderboard.
- Correctly identifying the AI answer gives the voter 2 points.
- If a player votes for a human answer, the owner of that answer gets 1 point.
- Invalid or missing answers appear as disabled answer cards.

Visual direction:
Create a modern, playful, polished web app UI.
The design should feel like a fun party game, but still clean and professional.
Use a dark or semi-dark background, colorful accent elements, rounded cards, soft shadows, clear typography, and a strong focus on readability.
The UI should work well on desktop and mobile.
Avoid clutter.
Avoid childish cartoon style.
Avoid too much text.
Use realistic spacing and consistent layout.

Design style:
- Modern SaaS/game dashboard style
- Rounded cards
- Clear hierarchy
- Big readable titles
- Fun but clean colors
- Smooth visual rhythm
- Leaderboard should feel visible but not distracting
- Buttons should look clickable and polished

Important:
Generate only the requested screen.
Do not create extra screens unless asked.
Do not add features that were not described.
Do not generate code.
This is only a visual UI mockup.

---

# 2. Screen-Specific Prompt Template

Now design the following screen:

Screen name:
[WRITE SCREEN NAME HERE]

Screen purpose:
[EXPLAIN WHAT THIS SCREEN DOES]

Main elements that must appear:
- [ELEMENT 1]
- [ELEMENT 2]
- [ELEMENT 3]

State:
[Example: empty state / waiting state / active round / voting / reveal / final results]

Desktop layout:
[Explain desktop layout]

Mobile layout:
[Explain mobile layout]

Keep the same visual style as described in the base prompt.