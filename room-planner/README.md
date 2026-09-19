# Room Planner

Phase 1: a basic 3D room you can size and walk around, viewable on your phone.
Later phases will add uploaded measurements/photos and let you place real
products (as 3D assets) inside the room.

## What's here now

- A 3D room (floor, back/left/right walls, optional ceiling) built from
  width/depth/height you control with sliders.
- Touch-friendly orbit/zoom/pan camera (works with one/two-finger gestures).
- Unit toggle (meters/feet), wall opacity (to see inside easier), floor grid
  and ceiling toggles.
- Settings are saved in the browser (`localStorage`), so they persist between
  visits on the same device.
- A "Products" section in the panel as a placeholder for the next phase.
- Installable as an app: it's a PWA (manifest + service worker + app icon),
  so it can be added to your iPhone home screen and launched full-screen like
  a real app — no App Store needed.

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
