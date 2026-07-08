# AI Imposter — Color Palette

Dark neon party-game UI system.

---

## Background Colors

| Name | Hex | Usage |
|---|---|---|
| Deep Space Navy | `#050816` | Main app background |
| Midnight Blue | `#08122B` | Secondary dark background |
| Dark Purple Surface | `#14102B` | Dark purple sections |
| Card Surface | `#101A33` | Cards, panels, containers |
| Elevated Surface | `#17213D` | Hovered cards / elevated UI |
| Modal Surface | `#1B1635` | Modals and popups |

---

## Primary Brand Colors

| Name | Hex | Usage |
|---|---|---|
| Electric Purple | `#7C3AED` | Main brand color, buttons, highlights |
| Neon Violet | `#A855F7` | Gradients, glows, active states |
| Cyber Blue | `#38BDF8` | Secondary accent, icons, info |
| Hot Pink | `#EC4899` | CTA gradients, energetic highlights |
| Purple Gradient Start | `#7C3AED` | Button gradient start |
| Pink Gradient End | `#EC4899` | Button gradient end |

---

## Active Colors

| Name | Hex | Usage |
|---|---|---|
| Active Purple | `#8B5CF6` | Active button / selected state |
| Active Violet | `#A855F7` | Active border / glow |
| Active Blue | `#0EA5E9` | Secondary active highlight |
| Selected Card Border | `#9333EA` | Selected answer card border |
| Selected Card Background | `#1E1B4B` | Selected answer card background |

---

## Hover Colors

| Name | Hex | Usage |
|---|---|---|
| Hover Purple | `#6D28D9` | Primary button hover |
| Hover Violet | `#9333EA` | Card / option hover |
| Hover Blue | `#0284C7` | Icon / link hover |
| Hover Surface | `#1E293B` | Row / card hover background |
| Hover Border | `#A855F7` | Border on hover |

---

## Error / Danger Colors

| Name | Hex | Usage |
|---|---|---|
| Error Red | `#EF4444` | Default error color |
| Error Strong | `#DC2626` | Strong / critical error |
| Error Dark Background | `#2A0F18` | Error message background |
| Error Border | `#F87171` | Error border |
| Error Text | `#FCA5A5` | Error text |
| Error Hover | `#B91C1C` | Danger button hover |

---

## Game State Colors

| Name | Hex | Usage |
|---|---|---|
| Success Green | `#22C55E` | Ready state, correct answer, success |
| Success Dark | `#14532D` | Dark success background |
| Success Text | `#86EFAC` | Success text |
| Warning Gold | `#FACC15` | Points, stars, warning |
| Warning Dark | `#422006` | Dark warning background |
| Orange Accent | `#F97316` | Third place, 1 point, warm highlight |
| Info Blue | `#38BDF8` | Info messages |
| Info Dark | `#082F49` | Dark info background |

---

## Text Colors

| Name | Hex | Usage |
|---|---|---|
| Main White | `#F8FAFC` | Main titles |
| Soft Text | `#CBD5E1` | Regular text |
| Muted Text | `#64748B` | Secondary text / placeholders |
| Disabled Text | `#475569` | Disabled text |
| Accent Text | `#C084FC` | Purple highlighted text |
| Score Text | `#FACC15` | Score / stars |

---

## Border Colors

| Name | Hex | Usage |
|---|---|---|
| Border Subtle | `#26324F` | Default subtle border |
| Border Purple | `#6D28D9` | Purple border |
| Border Active | `#A855F7` | Active border |
| Border Blue | `#0EA5E9` | Blue border |
| Border Disabled | `#334155` | Disabled card border |

---

## Disabled Colors

| Name | Hex | Usage |
|---|---|---|
| Disabled Gray | `#334155` | Disabled background |
| Disabled Surface | `#1E293B` | Disabled card surface |
| Disabled Border | `#475569` | Disabled border |
| Disabled Text | `#64748B` | Disabled text |

---

## UI Glow / Effects

| Name | Hex | Usage |
|---|---|---|
| Purple Glow | `#8B5CF6` | Glow around buttons and cards |
| Blue Glow | `#0EA5E9` | Soft blue glow |
| Pink Glow | `#EC4899` | Primary CTA glow |
| Green Glow | `#22C55E` | Ready / success glow |
| Gold Glow | `#FACC15` | Winners / points glow |
| Shadow Dark | `#020617` | Dark shadows |

---

# Recommended Gradients

## Main Background

```css
linear-gradient(135deg, #050816 0%, #08122B 45%, #14102B 100%);
```

## Primary Button

```css
linear-gradient(135deg, #7C3AED 0%, #A855F7 45%, #EC4899 100%);
```

## Primary Button Hover

```css
linear-gradient(135deg, #6D28D9 0%, #9333EA 45%, #DB2777 100%);
```

## Active Card

```css
linear-gradient(135deg, #1E1B4B 0%, #14102B 100%);
```

## Success / Ready Badge

```css
linear-gradient(135deg, #14532D 0%, #22C55E 100%);
```

## Error Badge

```css
linear-gradient(135deg, #2A0F18 0%, #DC2626 100%);
```

---

# CSS Variables

```css
:root {
  /* Background */
  --bg-main: #050816;
  --bg-secondary: #08122B;
  --surface-dark-purple: #14102B;
  --surface-card: #101A33;
  --surface-elevated: #17213D;
  --surface-modal: #1B1635;

  /* Brand */
  --primary: #7C3AED;
  --primary-hover: #6D28D9;
  --primary-active: #8B5CF6;

  --accent-violet: #A855F7;
  --accent-blue: #38BDF8;
  --accent-pink: #EC4899;

  /* Active */
  --active-purple: #8B5CF6;
  --active-violet: #A855F7;
  --active-blue: #0EA5E9;
  --selected-card-border: #9333EA;
  --selected-card-bg: #1E1B4B;

  /* Hover */
  --hover-purple: #6D28D9;
  --hover-violet: #9333EA;
  --hover-blue: #0284C7;
  --hover-surface: #1E293B;
  --hover-border: #A855F7;

  /* Error */
  --error: #EF4444;
  --error-strong: #DC2626;
  --error-bg: #2A0F18;
  --error-border: #F87171;
  --error-text: #FCA5A5;
  --error-hover: #B91C1C;

  /* Game States */
  --success: #22C55E;
  --success-dark: #14532D;
  --success-text: #86EFAC;

  --warning: #FACC15;
  --warning-dark: #422006;

  --orange-accent: #F97316;

  --info: #38BDF8;
  --info-dark: #082F49;

  /* Text */
  --text-main: #F8FAFC;
  --text-soft: #CBD5E1;
  --text-muted: #64748B;
  --text-disabled: #475569;
  --text-accent: #C084FC;
  --text-score: #FACC15;

  /* Borders */
  --border-subtle: #26324F;
  --border-purple: #6D28D9;
  --border-active: #A855F7;
  --border-blue: #0EA5E9;
  --border-disabled: #334155;

  /* Disabled */
  --disabled-gray: #334155;
  --disabled-surface: #1E293B;
  --disabled-border: #475569;
  --disabled-text: #64748B;

  /* Effects */
  --glow-purple: #8B5CF6;
  --glow-blue: #0EA5E9;
  --glow-pink: #EC4899;
  --glow-green: #22C55E;
  --glow-gold: #FACC15;
  --shadow-dark: #020617;
}
```

---

# Main UI Usage

## Primary Button

```css
background: linear-gradient(135deg, #7C3AED 0%, #A855F7 45%, #EC4899 100%);
color: #F8FAFC;
border: none;
```

## Primary Button Hover

```css
background: linear-gradient(135deg, #6D28D9 0%, #9333EA 45%, #DB2777 100%);
box-shadow: 0 0 24px rgba(168, 85, 247, 0.45);
```

## Selected Answer Card

```css
background: #1E1B4B;
border: 2px solid #9333EA;
box-shadow: 0 0 24px rgba(139, 92, 246, 0.45);
```

## Disabled Answer Card

```css
background: #1E293B;
border: 1px dashed #475569;
color: #64748B;
opacity: 0.65;
```

## Error Message

```css
background: #2A0F18;
border: 1px solid #F87171;
color: #FCA5A5;
```

## Ready Badge

```css
background: rgba(34, 197, 94, 0.15);
border: 1px solid #22C55E;
color: #86EFAC;
```