import { useState } from "react";

const KEY = "room-planner-hint-seen";

function seen() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** One-time "how this works" card. */
export function Hint() {
  const [dismissed, setDismissed] = useState(seen);
  if (dismissed) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* private browsing — just close it */
    }
    setDismissed(true);
  };

  return (
    <div className="hint-card">
      <h2>This is your actual flat</h2>
      <ul>
        <li>
          <b>Swipe</b> on the room to look around, pinch to zoom.
        </li>
        <li>
          <b>Tap a look</b> at the bottom to repaint everything at once.
        </li>
        <li>
          <b>Drag</b> the bed, sofa, table, rug or plants to move them.
        </li>
        <li>Every colour comes with a code you can search for.</li>
      </ul>
      <button onClick={close}>Got it</button>
    </div>
  );
}
