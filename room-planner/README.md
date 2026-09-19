# Room Planner

A 1:1 digital twin of the main living/sleeping/kitchen room, reconstructed
from the hand-drawn floor plan and the room photos (see `renders/` for the
check renders). The next phase adds uploaded products placed inside it.

## The reconstruction

Everything is parametric: every dimension lives in `src/room/params.ts` in
centimeters, in the coordinate system from the brief (origin at the
bottom-left corner, X across the 400 cm wall, Y toward the kitchen, Z up).
`src/room/validate.ts` re-checks the measured numbers and the panel shows the
result ("Measurement check").

Measured (authoritative): room 400 × 624 × 243; window wall sequence from the
bed wall 107 / 127 / 131 / 127 / 132; windows 127 × 225; kitchen 285 long
starting 110 from the window wall (so it ends at 395); right solid wall 305;
bed 140 × 200; table Ø110; sofa 150; shelves 36 × 30.

Inferred from the photos: kitchen module sequence (sink 60 · open niche 60 ·
oven+cooktop 60 · drawer unit 45 · tall unit 60), upper cabinets 145–212 cm
with the hood + frosted cabinet over the cooktop, counter at 90, tall unit to
228; bed toward the right side of the bed wall (X 230–370); sofa with its back
to the kitchen; the diagonal wall return beside the kitchen carrying the
light switches; the entrance nook with the white bathroom door, simplified.
Floor planks run along X (the 400 cm direction) because that is what every
photo shows.

Views in the panel jump to the reference-photo positions (pages 6/7, 10/11,
12, 14/15) plus an overview and a dimensioned top-down plan. Lens buttons
switch between the phone ultrawide (14 mm), the phone main camera (24 mm)
and a normal 35 mm.

- Touch-friendly orbit/zoom/pan camera (one/two-finger gestures).
- Wall opacity slider to look inside from the overview.
- Settings persist in the browser (`localStorage`).
- Installable as an app: it's a PWA (manifest + service worker + app icon),
  so it can be added to your iPhone home screen and launched full-screen like
  a real app — no App Store needed.

### Check renders

`renders/` holds the validation set: plain and dimensioned top-down plans and
the four photo-matching perspectives, all at 14 mm to match the phone photos.
Regenerate them after a change with:

```bash
npm run build
npx playwright install chromium   # once
npm run render:checks
```

## Run it

```bash
cd room-planner
npm install
npm run dev
```

Vite will print two URLs, e.g.:

```
Local:   http://localhost:5173/
Network: http://192.168.1.23:5173/
```

## Open it on your phone (no computer needed)

The app is also published to **GitHub Pages** so it's reachable from Safari
on your iPhone directly, no dev server required:

**https://samzeidi.github.io/Aufgabe1/**

One-time setup (only needed once, from Safari on your iPhone or any browser,
by whoever owns the `samzeidi/Aufgabe1` repo):

1. Go to `github.com/samzeidi/Aufgabe1` → **Settings** → **Pages** (left
   sidebar).
2. Under "Build and deployment" → **Source**, choose **Deploy from a
   branch**.
3. Branch: **gh-pages**, folder **/ (root)** → **Save**.
4. Wait ~1 minute, then open the URL above.

Because this is served over `https://`, the service worker also works here,
so the app caches itself for real offline use after the first visit.

Every time the app is updated, the `gh-pages` branch gets rebuilt and
re-pushed with the new build (already the case for the current version) —
no re-setup needed on your end.

### Local dev (optional, needs a computer)

```bash
cd room-planner
npm install
npm run dev
```

Vite prints a `Network` URL you can also open from a phone on the same
Wi-Fi, if you ever want to iterate locally instead.

## Install it on your iPhone (no App Store)

Once you have the app open in **Safari** on your iPhone (either the GitHub
Pages URL above, or a local `Network` URL):

1. Tap the **Share** button (square with an arrow, in the bottom toolbar).
2. Scroll down and tap **Add to Home Screen**.
3. Tap **Add** (top right).

A "Room Planner" icon appears on your home screen. Opening it launches the
app full-screen, no browser chrome — just like a native app.

## Next steps

- Upload real room measurements and photos to replace the placeholder box
  room with an accurate model (and optionally trace walls/doors/windows from
  a photo or floor plan).
- Upload product photos/models and place them inside the room, with
  collision-aware dragging and snapping to walls/floor.
