import { ITEM_LABELS } from "../room/design";
import { useDesignStore } from "../store/useDesignStore";

/** Floating controls for whatever is currently selected. */
export function SelectionBar() {
  const selected = useDesignStore((s) => s.selected);
  const layout = useDesignStore((s) => s.layout);
  const select = useDesignStore((s) => s.select);
  const rotateItem = useDesignStore((s) => s.rotateItem);
  const nudgeItem = useDesignStore((s) => s.nudgeItem);

  if (!selected) return null;
  const t = layout[selected];

  return (
    <div className="selection-bar">
      <div className="selection-head">
        <strong>{ITEM_LABELS[selected]}</strong>
        <span className="selection-pos">
          at {Math.round(t.x)} · {Math.round(t.y)} cm, turned {Math.round(t.rot)}°
        </span>
        <button className="selection-close" onClick={() => select(null)} aria-label="Deselect">
          ✕
        </button>
      </div>
      <div className="selection-actions">
        <button onClick={() => rotateItem(selected, -15)}>⟲ 15°</button>
        <button onClick={() => rotateItem(selected, 15)}>15° ⟳</button>
        <button onClick={() => rotateItem(selected, 90)}>90° ⟳</button>
        <div className="nudge-pad">
          <button onClick={() => nudgeItem(selected, 0, 5)} aria-label="Move away from the bed wall">
            ↑
          </button>
          <button onClick={() => nudgeItem(selected, -5, 0)} aria-label="Move left">
            ←
          </button>
          <button onClick={() => nudgeItem(selected, 5, 0)} aria-label="Move right">
            →
          </button>
          <button onClick={() => nudgeItem(selected, 0, -5)} aria-label="Move toward the bed wall">
            ↓
          </button>
        </div>
      </div>
      <p className="selection-hint">Drag it in the picture to move it. Arrows nudge by 5 cm.</p>
    </div>
  );
}
