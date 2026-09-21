import { ITEM_LABELS } from "../room/design";
import { useDesignStore } from "../store/useDesignStore";

/** Controls for whatever is currently selected. Moving is off until she asks for it. */
export function SelectionBar() {
  const selected = useDesignStore((s) => s.selected);
  const moveMode = useDesignStore((s) => s.moveMode);
  const layout = useDesignStore((s) => s.layout);
  const select = useDesignStore((s) => s.select);
  const setMoveMode = useDesignStore((s) => s.setMoveMode);
  const rotateItem = useDesignStore((s) => s.rotateItem);
  const nudgeItem = useDesignStore((s) => s.nudgeItem);

  if (!selected) return null;
  const t = layout[selected];

  // while moving, everything gets out of the way so the whole screen can be dragged
  if (moveMode) {
    return (
      <div className="move-banner">
        <span>
          Moving <b>{ITEM_LABELS[selected]}</b> — drag it anywhere
        </span>
        <button onClick={() => setMoveMode(false)}>Finish</button>
      </div>
    );
  }

  return (
    <div className="selection-bar">
      <div className="selection-head">
        <strong>{ITEM_LABELS[selected]}</strong>
        <span className="selection-pos">
          {Math.round(t.x)} · {Math.round(t.y)} cm · {Math.round(t.rot)}°
        </span>
        <button className="selection-close" onClick={() => select(null)} aria-label="Done">
          ✕
        </button>
      </div>

      <button className="move-button" onClick={() => setMoveMode(true)}>
        ✥  Move
      </button>

      <div className="selection-actions">
        <button onClick={() => rotateItem(selected, -15)}>⟲ 15°</button>
        <button onClick={() => rotateItem(selected, 15)}>15° ⟳</button>
        <button onClick={() => rotateItem(selected, 90)}>90° ⟳</button>
        <div className="nudge-pad">
          <button onClick={() => nudgeItem(selected, 0, 5)} aria-label="Away from the bed wall">
            ↑
          </button>
          <button onClick={() => nudgeItem(selected, -5, 0)} aria-label="Left">
            ←
          </button>
          <button onClick={() => nudgeItem(selected, 5, 0)} aria-label="Right">
            →
          </button>
          <button onClick={() => nudgeItem(selected, 0, -5)} aria-label="Toward the bed wall">
            ↓
          </button>
        </div>
      </div>

      <p className="selection-hint">Turn it with the arrows, or tap Move to drag it.</p>
    </div>
  );
}
