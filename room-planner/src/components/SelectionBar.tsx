import { KIND_LABELS, SHELF_WIDTHS, isShelf, shelfWidth } from "../room/design";
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
  const setItemWidth = useDesignStore((s) => s.setItemWidth);
  const setItemHeight = useDesignStore((s) => s.setItemHeight);
  const removeItem = useDesignStore((s) => s.removeItem);

  const item = selected ? layout[selected] : undefined;
  if (!selected || !item) return null;

  // while moving, everything gets out of the way so the whole screen can be dragged
  if (moveMode) {
    return (
      <div className="move-banner">
        <span>
          Moving <b>{KIND_LABELS[item.kind]}</b> — drag it anywhere
        </span>
        <button onClick={() => setMoveMode(false)}>Finish</button>
      </div>
    );
  }

  const shelf = isShelf(item.kind);
  const width = shelfWidth(item);

  return (
    <div className="selection-bar">
      <div className="selection-head">
        <strong>{KIND_LABELS[item.kind]}</strong>
        <span className="selection-pos">
          {Math.round(item.x)} · {Math.round(item.y)} cm · {Math.round(item.rot)}°
        </span>
        <button className="selection-close" onClick={() => select(null)} aria-label="Done">
          ✕
        </button>
      </div>

      {shelf && (
        <div className="inline-picker">
          <span>Width</span>
          {SHELF_WIDTHS.map((w) => (
            <button key={w} className={w === width ? "active" : ""} onClick={() => setItemWidth(selected, w)}>
              {w}
            </button>
          ))}
          {!SHELF_WIDTHS.includes(width as 40 | 60 | 80) && <span className="as-measured">{width} cm (measured)</span>}
        </div>
      )}

      {item.kind === "wallShelf" && (
        <div className="inline-picker">
          <span>Height</span>
          <button onClick={() => setItemHeight(selected, (item.z ?? 140) - 10)}>−10</button>
          <span className="value">{Math.round(item.z ?? 140)} cm</span>
          <button onClick={() => setItemHeight(selected, (item.z ?? 140) + 10)}>+10</button>
        </div>
      )}

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

      <div className="selection-footer">
        <span className="selection-hint">Turn it with the arrows, or tap Move to drag it.</span>
        <button className="remove-button" onClick={() => removeItem(selected)}>
          Remove
        </button>
      </div>
    </div>
  );
}
