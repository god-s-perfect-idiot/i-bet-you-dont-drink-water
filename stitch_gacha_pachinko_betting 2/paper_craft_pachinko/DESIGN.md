---
name: Paper Craft Pachinko
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5d3f3b'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#926f6a'
  outline-variant: '#e7bdb7'
  surface-tint: '#c0000a'
  primary: '#bc000a'
  on-primary: '#ffffff'
  primary-container: '#e2241f'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4aa'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fecb00'
  on-secondary-container: '#6e5700'
  tertiary: '#00609a'
  on-tertiary: '#ffffff'
  tertiary-container: '#0079c1'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930005'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#f1c100'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#cfe5ff'
  tertiary-fixed-dim: '#99cbff'
  on-tertiary-fixed: '#001d34'
  on-tertiary-fixed-variant: '#004a78'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 32px
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Rubik
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Rubik
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Rubik
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 20px
  gutter: 12px
  card-padding: 16px
  stack-offset: 4px
---

## Brand & Style

This design system draws inspiration from the whimsical, tactile world of paper-craft and pop-up books. It transforms the high-energy world of Pachinko betting into a friendly, approachable, and physically grounded experience. The brand personality is playful, energetic, and "hand-made," contrasting the digital nature of mobile betting with the warmth of physical textures.

The aesthetic follows a **Paper-craft Brutalism** style: combining the thick, unapologetic outlines of 2D illustration with the layered depth of cut-out cardstock. Every element should feel as though it was cut from heavy paper and placed onto the screen. The UI prioritizes high-contrast clarity and a "toy-like" tactile quality to make the gambling mechanics feel like a fun, low-stress game.

## Colors

The palette is built on high-saturation primary colors to evoke excitement and nostalgia.

- **Primary (Red):** Used for critical actions, winning states, and branding. It is aggressive but friendly.
- **Secondary (Yellow):** Used for currency, highlights, and "jackpot" moments. It represents the gold of the Pachinko balls.
- **Tertiary (Blue):** Used for informational elements, secondary buttons, and navigation.
- **Neutral (Black/Ink):** Used exclusively for the thick 2px to 4px outlines and primary text. It acts as the "glue" that holds the paper elements together.
- **Background (Cream):** Instead of pure white, use a warm, off-white "paper" tone to reduce eye strain and reinforce the tactile theme.

## Typography

Typography in this design system is playful and loud. 

**Bricolage Grotesque** is used for all headlines and display text. Its quirky, slightly irregular shapes complement the "hand-cut" aesthetic. Headlines should always be bold or extra-bold.

**Rubik** is used for body copy and labels. Its rounded terminals maintain the friendly vibe while ensuring high legibility for betting odds, histories, and numerical data. 

All display typography should be paired with a subtle 1px or 2px black text stroke or a "hard" drop shadow to ensure it pops against vibrant background colors.

## Layout & Spacing

The layout philosophy is based on a **Layered Card** model. Content is organized into distinct paper "scraps" or cards that appear to be stacked on top of one another.

- **Grid:** Use a 4-column fluid grid for mobile with a 20px outer margin.
- **Padding:** Use a consistent 8px-based scale. High-priority cards use 24px padding to create a sense of importance.
- **The "Stack" Effect:** Elements do not sit flush. Instead, they use a 4px offset (defined as `stack-offset`) to create a hard-edged shadow effect, simulating the thickness of heavy cardstock.
- **Reflow:** On larger devices, cards should not stretch infinitely; they should maintain a maximum width of 480px and center themselves, mimicking a physical game board.

## Elevation & Depth

Depth is conveyed through **Hard Offsets** rather than soft ambient shadows. This design system rejects blurs and gradients in favor of "sticker-style" layering.

1.  **Level 0 (Tabletop):** The main off-white paper background.
2.  **Level 1 (Cards/UI):** Elements have a 3px solid black border. They feature a "Hard Drop Shadow"—a solid black or dark-tinted fill offset by 4px down and 4px right, with 0% blur.
3.  **Level 2 (Active/Floating):** For modals or high-priority buttons, the offset increases to 8px, and the element may feature a white "sticker border" outside of its black outline to separate it from complex backgrounds.

Transitions between states should be instant or "springy," avoiding slow linear fades to keep the toy-like feel.

## Shapes

Shapes are chunky and deliberate. While the primary roundedness is set to `2` (0.5rem), this should be applied in conjunction with a thick 3px black stroke. 

- **Cards:** Use `rounded-lg` (1rem) to feel like die-cut cardboard.
- **Buttons:** Use `rounded-xl` or full pill-shapes to invite tapping.
- **Interactive Elements:** Checkboxes and radio buttons should be slightly "wonky"—not perfect circles or squares, but subtly irregular as if hand-drawn.
- **The Cut-out:** Occasionally use "zig-zag" or "torn paper" edges for separators to reinforce the material narrative.

## Components

### Buttons
Buttons are the most tactile part of the UI. They must have a 3px black outline and a 4px hard shadow. Upon `active` (press) state, the button should translate 4px down and right, hiding the shadow to simulate being physically pushed into the paper.

### Cards
Cards use the `background_paper_hex` or primary colors. They always feature a bold outline. Headers within cards are separated by a 2px horizontal line that looks like a hand-drawn stroke.

### Input Fields
Inputs are recessed. Instead of a hard shadow, use an "inner shadow" effect (a solid dark stroke on the top and left inside edges) to make the field look like a hole cut into the paper.

### Chips & Badges
Chips look like small stickers. They should have a white 2px outer "die-cut" border and be slightly rotated (1-2 degrees) at random to look like they were placed by hand.

### Pachinko Balls
In the "Neo-Pachinko" context, balls are not metallic but rendered as bright, high-contrast circular "stickers" with a single white dot for a highlight, ensuring they stand out against the paper game board.