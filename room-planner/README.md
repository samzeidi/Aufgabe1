# Room Planner

A 1:1 digital twin of the main living/sleeping/kitchen room, reconstructed from
the hand-drawn floor plan and the room photos — and a phone-first tool for
redecorating it: ten ready-made looks, editable colours with codes you can
search for, swappable furniture, and drag-to-move layout.

Live: **https://samzeidi.github.io/Aufgabe1/**

## Using it (on a phone)

- **Swipe** the room to look around, pinch to zoom. The chips along the top jump
  between fixed viewpoints and the floor plan.
- **The strip at the bottom** is the ten looks — tap one and the whole room
  repaints instantly. "As it is now" is the real, untouched flat.
- **Change things** opens the sheet:
  - *Looks* — the same ten, with a description each.
  - *Colours* — a circle per surface; tap it for the phone's colour picker. Each
    one shows its hex code; tap the code to copy it.
  - *Furniture* — swap the sofa, bed, rug and curtains, re-tile the kitchen
    splashback with stick-on tiles (plain, metro, zellige, checkerboard or
    patterned) and keep/cover/replace its decorative border row, toggle plants
    and pictures, see through the walls, put everything back.
  - *Codes* — the whole palette as a list, "copy all codes", and a link that
    carries the entire design (colours, furniture, positions) so it can be sent
    to someone else.
- **Tap** the bed, sofa, table, rug, a shelf or a plant to select it, then tap
  **Move** to drag it — nothing shifts by accident, and tapping *Finish* locks
  it again. Rotate and 5 cm nudge buttons are there too. Everything saves
  automatically.

The kitchen units, windows, walls and floor are the real flat and can't be
moved — the point is to see what actually fits. The splashback is the one
exception: tile stickers go over the existing tiles and come off again, so it
is editable.

## The reconstruction

Everything is parametric: every dimension lives in `src/room/params.ts` in
centimetres, in the coordinate system from the brief (origin at the bottom-left
corner, X across the 400 cm wall, Y toward the kitchen, Z up).
`src/room/validate.ts` re-checks the measured numbers.

Measured (authoritative): room 400 × 624 × 243; window wall sequence from the
bed wall 107 / 127 / 131 / 127 / 132; windows 127 × 225; kitchen 285 long
starting 110 from the window wall (so it ends at 395); right solid wall 305;
bed 140 × 200; table Ø110; sofa 150; shelves 36 × 30.

Inferred from the photos: kitchen module sequence (sink 60 · open niche 60 ·
oven+cooktop 60 · drawer unit 45 · tall unit 60), upper cabinets 145–212 cm with
the hood + frosted cabinet over the cooktop, counter at 90, tall unit to 228;
bed toward the right side of the bed wall; sofa with its back to the kitchen;
the diagonal wall return beside the kitchen carrying the light switches; the
entrance nook with the white bathroom door, simplified. Floor planks run along X
(the 400 cm direction) because that is what every photo shows.

Materials were calibrated by sampling the reference photos and normalising each
one by its own wall tone, which cancels the differing white balance between the
daylight and tungsten shots.

## Code map

| Path | What's in it |
| --- | --- |
| `src/room/params.ts` | every real dimension, in cm |
| `src/room/design.ts` | what's editable: colours, styles, layout, clamping |
| `src/room/palettes.ts` | the ten looks |
| `src/room/materials.tsx` | materials; design colours are applied here |
| `src/components/room/` | shell, windows, kitchen, furniture, decor, lighting |
| `src/components/Sheet.tsx` | the bottom sheet UI |
| `src/components/room/Movable.tsx` | tap-to-select and drag-on-floor |

## Running it

```bash
cd room-planner
npm install
npm run dev
```

### Check renders

`renders/` holds the validation set — plain and dimensioned floor plans plus the
four photo-matching perspectives, all at 14 mm to match the phone photos and
with the untouched flat (`?look=as-is`) so they stay comparable to the
originals. Regenerate after a change with:

```bash
npm run build
npx playwright install chromium   # once
npm run render:checks
```

Handy URL parameters: `?view=bed|table|kitchen|kitchenAlong|overview|top`,
`?look=<template id>`, `?ui=0` (hide the interface), `?dims=0` (hide dimension
labels), `#d=<code>` (a shared design).

## Deploying

The live site is the `gh-pages` branch, served by GitHub Pages:

```bash
GH_PAGES=true npm run build     # sets the /Aufgabe1/ base path
# then publish the contents of dist/ to the gh-pages branch
```
