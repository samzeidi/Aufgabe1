import { useState } from "react";
import { useRoomStore } from "../store/useRoomStore";
import { displayToMeters, metersToDisplay } from "../units";
import type { Unit } from "../types";

const LIMITS = {
  width: { min: 1, max: 15, step: 0.1 },
  depth: { min: 1, max: 15, step: 0.1 },
  height: { min: 2, max: 5, step: 0.05 },
};

export function ControlPanel() {
  const [expanded, setExpanded] = useState(true);
  const settings = useRoomStore((state) => state.settings);
  const setDimension = useRoomStore((state) => state.setDimension);
  const setUnit = useRoomStore((state) => state.setUnit);
  const setWallOpacity = useRoomStore((state) => state.setWallOpacity);
  const toggleCeiling = useRoomStore((state) => state.toggleCeiling);
  const toggleGrid = useRoomStore((state) => state.toggleGrid);
  const reset = useRoomStore((state) => state.reset);

  const { unit } = settings;

  const dimensionRow = (key: keyof typeof LIMITS, label: string) => {
    const meters = settings.dimensions[key];
    const displayValue = metersToDisplay(meters, unit);
    const limits = LIMITS[key];
    return (
      <div className="control-row" key={key}>
        <div className="control-row-label">
          <span>{label}</span>
          <span className="control-row-value">
            {displayValue.toFixed(2)} {unit}
          </span>
        </div>
        <input
          type="range"
          min={metersToDisplay(limits.min, unit)}
          max={metersToDisplay(limits.max, unit)}
          step={limits.step}
          value={displayValue}
          onChange={(e) =>
            setDimension(key, displayToMeters(Number(e.target.value), unit))
          }
        />
      </div>
    );
  };

  return (
    <div className={`control-panel ${expanded ? "expanded" : "collapsed"}`}>
      <button
        className="control-panel-handle"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse controls" : "Expand controls"}
      >
        <span className="handle-bar" />
        <span>{expanded ? "Hide room settings" : "Room settings"}</span>
      </button>

      {expanded && (
        <div className="control-panel-body">
          <div className="control-section">
            <div className="section-title-row">
              <h2>Room dimensions</h2>
              <div className="unit-toggle">
                {(["m", "ft"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    className={u === unit ? "active" : ""}
                    onClick={() => setUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            {dimensionRow("width", "Width")}
            {dimensionRow("depth", "Depth")}
            {dimensionRow("height", "Height")}
          </div>

          <div className="control-section">
            <h2>View</h2>
            <div className="control-row">
              <div className="control-row-label">
                <span>Wall opacity</span>
                <span className="control-row-value">
                  {Math.round(settings.wallOpacity * 100)}%
                </span>
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
                <input
                  type="checkbox"
                  checked={settings.showCeiling}
                  onChange={toggleCeiling}
                />
                Show ceiling
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.showGrid}
                  onChange={toggleGrid}
                />
                Show floor grid
              </label>
            </div>
            <button className="reset-button" onClick={reset}>
              Reset to defaults
            </button>
          </div>

          <div className="control-section products-section">
            <h2>Products</h2>
            <p className="coming-soon">
              Next step: upload your room photos, exact measurements, and
              product models here to place them inside this room.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
