import { useMemo, useState } from "react";
import { useRoomStore } from "../store/useRoomStore";
import { runChecks } from "../room/validate";
import { VIEW_LABELS } from "./CameraRig";
import type { Lens, ViewId } from "../types";

const VIEW_ORDER: ViewId[] = ["kitchen", "bed", "table", "kitchenAlong", "overview", "top"];

export function ControlPanel() {
  const [expanded, setExpanded] = useState(true);
  const settings = useRoomStore((s) => s.settings);
  const view = useRoomStore((s) => s.view);
  const setView = useRoomStore((s) => s.setView);
  const setLens = useRoomStore((s) => s.setLens);
  const setWallOpacity = useRoomStore((s) => s.setWallOpacity);
  const toggle = useRoomStore((s) => s.toggle);
  const checks = useMemo(() => runChecks(), []);
  const allOk = checks.every((c) => c.ok);

  return (
    <div className={`control-panel ${expanded ? "expanded" : "collapsed"}`}>
      <button
        className="control-panel-handle"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse controls" : "Expand controls"}
      >
        <span className="handle-bar" />
        <span>{expanded ? "Hide controls" : "Views & settings"}</span>
      </button>

      {expanded && (
        <div className="control-panel-body">
          <div className="control-section">
            <div className="section-title-row">
              <h2>Views</h2>
              <div className="unit-toggle">
                {([14, 24, 35] as Lens[]).map((l) => (
                  <button key={l} className={l === settings.lens ? "active" : ""} onClick={() => setLens(l)}>
                    {l} mm
                  </button>
                ))}
              </div>
            </div>
            <div className="view-grid">
              {VIEW_ORDER.map((id) => (
                <button key={id} className={`view-button ${id === view ? "active" : ""}`} onClick={() => setView(id)}>
                  {VIEW_LABELS[id]}
                </button>
              ))}
            </div>
            <p className="hint">Drag to look around, pinch to zoom, two fingers to pan. Pick a view to jump back.</p>
          </div>

          <div className="control-section">
            <h2>Display</h2>
            <div className="control-row">
              <div className="control-row-label">
                <span>Wall opacity</span>
                <span className="control-row-value">{Math.round(settings.wallOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={settings.wallOpacity}
                onChange={(e) => setWallOpacity(Number(e.target.value))}
              />
            </div>
            <div className="toggle-row">
              <label>
                <input type="checkbox" checked={settings.showCeiling} onChange={() => toggle("showCeiling")} />
                Ceiling (auto-hidden in top/overview)
              </label>
              <label>
                <input type="checkbox" checked={settings.showDimensions} onChange={() => toggle("showDimensions")} />
                Dimension labels (always on in top-down)
              </label>
              <label>
                <input type="checkbox" checked={settings.showExterior} onChange={() => toggle("showExterior")} />
                Balcony & street outside (auto-hidden in top/overview)
              </label>
            </div>
          </div>

          <div className="control-section">
            <div className="section-title-row">
              <h2>Measurement check</h2>
              <span className={`badge ${allOk ? "ok" : "bad"}`}>{allOk ? "all pass" : "mismatch"}</span>
            </div>
            <ul className="check-list">
              {checks.map((c) => (
                <li key={c.label} className={c.ok ? "ok" : "bad"}>
                  <span className="check-label">{c.label}</span>
                  <span className="check-value">
                    {c.actual}
                    {c.actual !== c.expected && <span className="check-expected"> (expected {c.expected})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="control-section products-section">
            <h2>Products</h2>
            <p className="coming-soon">
              Next step: upload product photos/models and place them inside this room at true scale.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
