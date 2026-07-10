# AI Imposter — Typography & UI Style Guide

AI Imposter uses a modern dark neon party-game design.

The active design tokens are implemented in:

```txt
src/index.css
```

`index.css` is the source of truth for fonts, spacing, border radius, shadows, and visual effects.

## Fonts

| Usage                           | Font             |
| ------------------------------- | ---------------- |
| Main UI text                    | `Inter`          |
| Large titles and branding       | `Space Grotesk`  |
| Room codes, timers, and numbers | `JetBrains Mono` |
| Hebrew fallback                 | `Assistant`      |

CSS variables:

```css
--font-main
--font-display
--font-mono
```

## Typography Rules

- Use `--font-display` for page titles, major headings, and branding.
- Use `--font-main` for buttons, inputs, cards, labels, and regular text.
- Use `--font-mono` only for room codes, timers, scores, and important numbers.
- Use large bold text only for important headings.
- Keep helper text readable and avoid making mobile text too small.
- Mantine components should use the same global font system.

## UI Style

The interface should feel:

- Modern
- Spacious
- Rounded
- Clear
- Game-like
- Responsive

Use the radius, spacing, shadow, and glow variables already defined in `index.css`.

## Component Rules

- Buttons and inputs should have clear hover, focus, active, and disabled states.
- Cards should use consistent padding and rounded corners.
- Glow effects should be reserved for selected or important elements.
- Use colors to communicate state:
  - Green for ready and success
  - Red for errors
  - Purple for active and selected elements
  - Gold for scores and winners
- Avoid adding fixed styles when an existing global variable can be reused.

## Responsive UI

- Interactive elements should remain comfortable to press on mobile.
- Text should not become too small on narrow screens.
- Avoid fixed widths that cause horizontal overflow.
- Large desktop layouts should stack or simplify on mobile.
- Persistent elements such as the Header and Leaderboard may use compact mobile variants.

## Accessibility

- Interactive elements must show visible keyboard focus.
- Do not remove focus outlines globally without providing a replacement.
- Disabled elements should look disabled and prevent interaction.
- Text must maintain strong contrast against dark backgrounds.

## Updating the Style System

When changing a design value:

1. Update the variable in `index.css`.
2. Reuse the variable inside component CSS.
3. Update this document only when the general UI rules change.
