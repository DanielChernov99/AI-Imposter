# AI Imposter — Typography & UI Style Guide

Dark neon party-game UI system.

---

## Font Family

The UI should use a clean modern sans-serif font.

### Recommended Fonts

| Usage | Font |
|---|---|
| Main UI Font | `Inter` |
| Display / Logo / Big Titles | `Space Grotesk` |
| Hebrew fallback | `Assistant` |
| Code / Room Code / Numbers | `JetBrains Mono` |
| System fallback | `system-ui, sans-serif` |

---

## CSS Font Variables

```css
:root {
  --font-main: "Inter", "Assistant", system-ui, sans-serif;
  --font-display: "Space Grotesk", "Inter", "Assistant", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}
```

---

## Recommended Import

```css
@import url("https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap");
```

---

# Typography Scale

## Display Title

Used for big page titles like:

- `AI Imposter`
- `Final Results`
- `Waiting for players`

```css
font-family: var(--font-display);
font-size: 48px;
font-weight: 800;
line-height: 1.1;
letter-spacing: -0.04em;
```

---

## Page Title

Used for main screen titles.

```css
font-family: var(--font-display);
font-size: 36px;
font-weight: 700;
line-height: 1.15;
letter-spacing: -0.03em;
```

---

## Section Title

Used for cards, panels, lobby sections, leaderboard title.

```css
font-family: var(--font-main);
font-size: 24px;
font-weight: 700;
line-height: 1.25;
letter-spacing: -0.02em;
```

---

## Card Title

Used inside answer cards, player cards, and result cards.

```css
font-family: var(--font-main);
font-size: 18px;
font-weight: 600;
line-height: 1.35;
```

---

## Body Text

Used for regular text and descriptions.

```css
font-family: var(--font-main);
font-size: 16px;
font-weight: 400;
line-height: 1.6;
```

---

## Small Text

Used for helper text, subtitles, labels, and notes.

```css
font-family: var(--font-main);
font-size: 14px;
font-weight: 500;
line-height: 1.45;
```

---

## Micro Text

Used for badges, counters, small status text.

```css
font-family: var(--font-main);
font-size: 12px;
font-weight: 600;
line-height: 1.3;
letter-spacing: 0.04em;
text-transform: uppercase;
```

---

## Room Code / Timer Numbers

Used for room code, timer, points, and important numbers.

```css
font-family: var(--font-mono);
font-size: 32px;
font-weight: 700;
line-height: 1;
letter-spacing: -0.02em;
```

---

# Font Weights

| Weight | Usage |
|---|---|
| `400` | Regular body text |
| `500` | Labels, helper text |
| `600` | Buttons, badges, card titles |
| `700` | Section titles |
| `800` | Main titles |
| `900` | Logo / hero titles only |

---

# Text Usage

## Main Heading

```css
color: var(--text-main);
font-family: var(--font-display);
font-weight: 800;
```

## Secondary Text

```css
color: var(--text-soft);
font-family: var(--font-main);
font-weight: 400;
```

## Muted Text

```css
color: var(--text-muted);
font-family: var(--font-main);
font-weight: 500;
```

## Accent Text

```css
color: var(--text-accent);
font-family: var(--font-main);
font-weight: 600;
```

---

# Border Radius

The UI should feel soft, modern, and game-like.

```css
:root {
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-pill: 999px;
}
```

---

## Radius Usage

| Element | Radius |
|---|---|
| Small badges | `999px` |
| Buttons | `16px` or `999px` |
| Inputs | `16px` |
| Answer cards | `20px` |
| Main panels | `24px` |
| Large hero cards | `32px` |

---

# Spacing System

Use consistent spacing based on an 8px system.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

## Spacing Usage

| Usage | Value |
|---|---|
| Small gap between icon and text | `8px` |
| Gap inside buttons | `10px` |
| Padding inside input | `16px 20px` |
| Padding inside cards | `20px` |
| Padding inside main panels | `32px` |
| Section gap | `40px` |
| Page horizontal padding | `32px - 64px` |

---

# Shadows

Use soft shadows with subtle neon glows.

```css
:root {
  --shadow-sm: 0 4px 12px rgba(2, 6, 23, 0.35);
  --shadow-md: 0 10px 30px rgba(2, 6, 23, 0.45);
  --shadow-lg: 0 20px 60px rgba(2, 6, 23, 0.55);

  --glow-purple-soft: 0 0 18px rgba(139, 92, 246, 0.35);
  --glow-purple-strong: 0 0 32px rgba(139, 92, 246, 0.55);

  --glow-blue-soft: 0 0 18px rgba(14, 165, 233, 0.3);
  --glow-pink-soft: 0 0 22px rgba(236, 72, 153, 0.35);
  --glow-green-soft: 0 0 18px rgba(34, 197, 94, 0.35);
}
```

---

# Borders

```css
:root {
  --border-default: 1px solid var(--border-subtle);
  --border-active: 2px solid var(--border-active);
  --border-disabled: 1px dashed var(--border-disabled);
}
```

---

## Border Usage

| Element | Border |
|---|---|
| Normal card | `1px solid #26324F` |
| Hover card | `1px solid #A855F7` |
| Selected card | `2px solid #9333EA` |
| Disabled card | `1px dashed #475569` |
| Error input | `1px solid #F87171` |

---

# Buttons

## Primary Button

```css
.button-primary {
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;

  color: var(--text-main);
  background: linear-gradient(135deg, #7C3AED 0%, #A855F7 45%, #EC4899 100%);

  border: none;
  border-radius: var(--radius-lg);

  padding: 14px 24px;

  box-shadow: 0 0 24px rgba(168, 85, 247, 0.35);
  cursor: pointer;

  transition: all 0.2s ease;
}
```

---

## Primary Button Hover

```css
.button-primary:hover {
  background: linear-gradient(135deg, #6D28D9 0%, #9333EA 45%, #DB2777 100%);
  box-shadow: 0 0 32px rgba(168, 85, 247, 0.55);
  transform: translateY(-1px);
}
```

---

## Primary Button Active

```css
.button-primary:active {
  transform: translateY(0);
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.35);
}
```

---

## Secondary Button

```css
.button-secondary {
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 600;

  color: var(--text-soft);
  background: rgba(16, 26, 51, 0.75);

  border: 1px solid var(--border-purple);
  border-radius: var(--radius-lg);

  padding: 14px 24px;

  cursor: pointer;
  transition: all 0.2s ease;
}
```

---

## Secondary Button Hover

```css
.button-secondary:hover {
  color: var(--text-main);
  border-color: var(--hover-border);
  background: rgba(30, 41, 59, 0.85);
  box-shadow: var(--glow-purple-soft);
}
```

---

# Inputs

```css
.input {
  width: 100%;

  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 500;

  color: var(--text-main);
  background: rgba(16, 26, 51, 0.9);

  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);

  padding: 16px 20px;

  outline: none;
  transition: all 0.2s ease;
}
```

---

## Input Placeholder

```css
.input::placeholder {
  color: var(--text-muted);
}
```

---

## Input Focus

```css
.input:focus {
  border-color: var(--border-active);
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.16);
}
```

---

## Input Error

```css
.input-error {
  border-color: var(--error-border);
  background: rgba(42, 15, 24, 0.65);
}
```

---

# Cards

## Default Card

```css
.card {
  background: rgba(16, 26, 51, 0.82);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}
```

---

## Hover Card

```css
.card:hover {
  background: rgba(30, 41, 59, 0.88);
  border-color: var(--hover-border);
  box-shadow: var(--glow-purple-soft);
}
```

---

## Selected Card

```css
.card-selected {
  background: #1E1B4B;
  border: 2px solid #9333EA;
  box-shadow: 0 0 24px rgba(139, 92, 246, 0.45);
}
```

---

## Disabled Card

```css
.card-disabled {
  background: #1E293B;
  border: 1px dashed #475569;
  color: #64748B;
  opacity: 0.65;
  pointer-events: none;
}
```

---

# Badges

## Default Badge

```css
.badge {
  font-family: var(--font-main);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  border-radius: var(--radius-pill);
  padding: 6px 10px;
}
```

---

## Ready Badge

```css
.badge-ready {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid #22C55E;
  color: #86EFAC;
}
```

---

## Voting Badge

```css
.badge-voting {
  background: rgba(168, 85, 247, 0.16);
  border: 1px solid #A855F7;
  color: #C084FC;
}
```

---

## Error Badge

```css
.badge-error {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid #F87171;
  color: #FCA5A5;
}
```

---

# Transitions

```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

---

## Default Interactive Transition

```css
transition:
  background-color var(--transition-normal),
  border-color var(--transition-normal),
  box-shadow var(--transition-normal),
  transform var(--transition-normal),
  color var(--transition-normal);
```

---

# Z-Index

```css
:root {
  --z-background: 0;
  --z-content: 1;
  --z-header: 10;
  --z-modal: 50;
  --z-toast: 100;
}
```

---

# UI Rules

## General Rules

- Use one main font family across the app.
- Use `Space Grotesk` only for big titles and branding.
- Use `Inter` for most UI text.
- Use `JetBrains Mono` only for room codes, timers, and numbers.
- Keep cards rounded and spacious.
- Use glow effects only for important elements.
- Do not overuse neon colors.
- Keep text highly readable.
- Use dark surfaces with light text.
- Use color to show state: active, hover, success, error, disabled.

---

## Visual Hierarchy

1. Main title
2. Current game phase / timer
3. Main action area
4. Cards / answers / players
5. Helper text
6. Secondary actions

---

## Recommended Body Style

```css
body {
  font-family: var(--font-main);
  color: var(--text-main);
  background: linear-gradient(135deg, #050816 0%, #08122B 45%, #14102B 100%);
}
```