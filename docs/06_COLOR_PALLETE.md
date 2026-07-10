# AI Imposter — Color Palette

AI Imposter uses a dark neon party-game visual style.

The active color system is implemented in:

```txt
src/index.css
```

`index.css` is the source of truth for all CSS variables.

Components should reuse the existing variables instead of adding random or duplicated color values.

## Main Colors

| Purpose          | Variable          | Color     |
| ---------------- | ----------------- | --------- |
| Main background  | `--bg-main`       | `#050816` |
| Card surface     | `--surface-card`  | `#101A33` |
| Primary purple   | `--primary`       | `#7C3AED` |
| Accent violet    | `--accent-violet` | `#A855F7` |
| Accent blue      | `--accent-blue`   | `#38BDF8` |
| Accent pink      | `--accent-pink`   | `#EC4899` |
| Success / Ready  | `--success`       | `#22C55E` |
| Error            | `--error`         | `#EF4444` |
| Points / Warning | `--warning`       | `#FACC15` |
| Main text        | `--text-main`     | `#F8FAFC` |
| Secondary text   | `--text-soft`     | `#CBD5E1` |

## Usage Rules

- Use CSS variables from `index.css`.
- Do not add random hex colors when an existing variable matches the purpose.
- Purple and pink are the main brand colors.
- Green represents ready, correct, and success states.
- Red represents errors and invalid states.
- Gold represents points, rankings, and winners.
- Glow effects should be used only for important or active elements.
- Text must remain readable against the dark background.

## Updating the Palette

When a color or design token changes:

1. Update it in `index.css`.
2. Update this document only if the main visual system changes.
