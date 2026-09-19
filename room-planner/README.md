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

## Open it on your phone

1. Make sure your phone is on the **same Wi-Fi network** as the machine
   running `npm run dev`.
2. Open the `Network` URL Vite printed (the `http://<ip>:5173` one) in your
   phone's browser.
3. If this is running inside a cloud/remote sandbox (not your own machine),
   the phone can't reach it directly over Wi-Fi — you'll need to either run
   it locally on a machine on your network, or deploy it somewhere public
   (say the word and this can be set up next).

## Install it on your iPhone (no App Store)

Once you have the app open in **Safari** on your iPhone (using the `Network`
URL above, both devices on the same Wi-Fi):

1. Tap the **Share** button (square with an arrow, in the bottom toolbar).
2. Scroll down and tap **Add to Home Screen**.
3. Tap **Add** (top right).

A "Room Planner" icon appears on your home screen. Opening it launches the
app full-screen, no browser chrome — just like a native app.

**Note on offline support:** because this runs over a plain local `http://`
address rather than `https://`, the offline caching part (service worker)
won't activate in Safari — that only works over HTTPS or `localhost`. The
home screen icon and full-screen app experience work regardless. If you want
real offline support too, this needs to be served over HTTPS (e.g. via a
public deployment) — ask if you'd like that set up.

## Next steps

- Upload real room measurements and photos to replace the placeholder box
  room with an accurate model (and optionally trace walls/doors/windows from
  a photo or floor plan).
- Upload product photos/models and place them inside the room, with
  collision-aware dragging and snapping to walls/floor.
