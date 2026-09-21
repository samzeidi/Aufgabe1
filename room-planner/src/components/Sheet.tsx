import { useEffect, useState } from "react";
import { useRoomStore } from "../store/useRoomStore";
import { useDesignStore, encodeDesign } from "../store/useDesignStore";
import { COLOR_LABELS, TEMPLATES } from "../room/palettes";
import type { DesignColors } from "../room/design";

type Tab = "looks" | "colours" | "stuff" | "list";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "looks", label: "Looks", icon: "◍" },
  { id: "colours", label: "Colours", icon: "◐" },
  { id: "stuff", label: "Furniture", icon: "▤" },
  { id: "list", label: "Codes", icon: "＃" },
];

const COLOR_ORDER: (keyof DesignColors)[] = [
  "wall",
  "accentWall",
  "ceiling",
  "sofa",
  "cushions",
  "bedding",
  "throwBlanket",
  "rug",
  "curtains",
  "art",
  "tile",
  "tilePattern",
];

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      setCopied(null);
    }
  };
  return { copied, copy };
}

function Picker<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="picker">
      <span className="picker-label">{label}</span>
      <div className="picker-options">
        {options.map(([v, text]) => (
          <button key={v} className={value === v ? "active" : ""} onClick={() => onChange(v)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Sheet() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("looks");
  const { copied, copy } = useCopy();

  const settings = useRoomStore((s) => s.settings);
  const setWallOpacity = useRoomStore((s) => s.setWallOpacity);
  const toggleRoom = useRoomStore((s) => s.toggle);

  const templateId = useDesignStore((s) => s.templateId);
  const colors = useDesignStore((s) => s.colors);
  const styles = useDesignStore((s) => s.styles);
  const applyTemplate = useDesignStore((s) => s.applyTemplate);
  const setColor = useDesignStore((s) => s.setColor);
  const setStyle = useDesignStore((s) => s.setStyle);
  const resetLayout = useDesignStore((s) => s.resetLayout);
  const resetAll = useDesignStore((s) => s.resetAll);
  const snapshot = useDesignStore((s) => s.snapshot);

  // the sheet closes while dragging, and disappears entirely in move mode so
  // the whole screen is free to drag on
  const dragging = useDesignStore((s) => s.dragging);
  const moveMode = useDesignStore((s) => s.moveMode);
  useEffect(() => {
    if (dragging || moveMode) setOpen(false);
  }, [dragging, moveMode]);

  const shareLink = () => `${window.location.origin}${window.location.pathname}#d=${encodeDesign(snapshot())}`;
  const visibleColors = COLOR_ORDER.filter(
    (key) =>
      (key !== "accentWall" || styles.accentWall) &&
      (key !== "tile" || styles.backsplash !== "original") &&
      (key !== "tilePattern" || styles.backsplash !== "original" || styles.borderRow === "band"),
  );
  const colourList = () => visibleColors.map((key) => `${COLOR_LABELS[key]}: ${colors[key].toUpperCase()}`).join("\n");

  if (moveMode) return null;

  return (
    <div className={`sheet ${open ? "open" : "peek"}`}>
      <button className="grabber" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close" : "Open the design panel"}>
        <span />
      </button>

      {!open && (
        <div className="peek-row">
          <div className="look-strip">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`look-pill ${t.id === templateId ? "active" : ""}`}
                onClick={() => applyTemplate(t.id)}
              >
                <span className="pill-chips">
                  {t.chips.map((c) => (
                    <span key={c} style={{ background: c }} />
                  ))}
                </span>
                <span className="pill-name">{t.name}</span>
              </button>
            ))}
          </div>
          <button className="open-button" onClick={() => setOpen(true)}>
            Change things
          </button>
        </div>
      )}

      {open && (
        <>
          <div className="tab-row">
            {TABS.map((t) => (
              <button key={t.id} className={`tab ${t.id === tab ? "active" : ""}`} onClick={() => setTab(t.id)}>
                <span className="tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="sheet-body">
            {tab === "looks" && (
              <section>
                <p className="hint">Tap a look — the room changes straight away. Then tweak anything you like.</p>
                <div className="template-grid">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      className={`template-card ${t.id === templateId ? "active" : ""}`}
                      onClick={() => applyTemplate(t.id)}
                    >
                      <div className="chips">
                        {t.chips.map((c) => (
                          <span key={c} style={{ background: c }} />
                        ))}
                      </div>
                      <strong>{t.name}</strong>
                      <span className="template-vibe">{t.vibe}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {tab === "colours" && (
              <section>
                <p className="hint">Tap a circle to pick any colour. The code underneath is what you search for.</p>
                {COLOR_ORDER.map((key) => {
                  const disabled =
                    (key === "accentWall" && !styles.accentWall) ||
                    (key === "tile" && styles.backsplash === "original") ||
                    (key === "tilePattern" && styles.backsplash === "original" && styles.borderRow !== "band");
                  return (
                    <div className={`colour-row ${disabled ? "disabled" : ""}`} key={key}>
                      <label className="swatch" style={{ background: colors[key] }}>
                        <input
                          type="color"
                          value={colors[key]}
                          onChange={(e) => setColor(key, e.target.value)}
                          disabled={disabled}
                          aria-label={COLOR_LABELS[key]}
                        />
                      </label>
                      <div className="colour-meta">
                        <span className="colour-name">{COLOR_LABELS[key]}</span>
                        <button className="hex" onClick={() => copy(colors[key].toUpperCase(), key)}>
                          {copied === key ? "copied ✓" : colors[key].toUpperCase()}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <label className="toggle-line">
                  <input
                    type="checkbox"
                    checked={styles.accentWall}
                    onChange={() => setStyle("accentWall", !styles.accentWall)}
                  />
                  Different colour on the wall behind the bed
                </label>
              </section>
            )}

            {tab === "stuff" && (
              <section>
                <p className="hint">
                  Tap something in the room, then tap <b>Move</b> to drag it — that way nothing shifts by accident.
                  The kitchen units, windows and walls are the real flat, so they stay put.
                </p>
                <Picker
                  label="Sofa"
                  value={styles.sofa}
                  onChange={(v) => setStyle("sofa", v)}
                  options={[
                    ["existing", "Ours"],
                    ["loveseat", "Loveseat"],
                    ["sectional", "Corner"],
                    ["chesterfield", "Chesterfield"],
                  ] as const}
                />
                <Picker
                  label="Bed"
                  value={styles.bed}
                  onChange={(v) => setStyle("bed", v)}
                  options={[
                    ["existing", "Ours"],
                    ["wood", "Light wood"],
                    ["upholstered", "Upholstered"],
                  ] as const}
                />
                <Picker
                  label="Rug"
                  value={styles.rug}
                  onChange={(v) => setStyle("rug", v)}
                  options={[
                    ["none", "None"],
                    ["jute", "Jute"],
                    ["persian", "Persian"],
                    ["shag", "Fluffy"],
                  ] as const}
                />
                <Picker
                  label="Curtains"
                  value={styles.curtains}
                  onChange={(v) => setStyle("curtains", v)}
                  options={[
                    ["none", "None"],
                    ["linen", "Linen"],
                    ["velvet", "Velvet"],
                  ] as const}
                />
                <Picker
                  label="Kitchen splashback — stick-on tiles"
                  value={styles.backsplash}
                  onChange={(v) => setStyle("backsplash", v)}
                  options={[
                    ["original", "As it is"],
                    ["plain", "Plain squares"],
                    ["metro", "Metro"],
                    ["zellige", "Zellige"],
                    ["checker", "Checkerboard"],
                    ["pattern", "Patterned"],
                  ] as const}
                />
                <Picker
                  label="The decorative row on the tiles"
                  value={styles.borderRow}
                  onChange={(v) => setStyle("borderRow", v)}
                  options={[
                    ["keep", "Keep it"],
                    ["hide", "Cover it"],
                    ["band", "Plain band"],
                  ] as const}
                />
                <p className="hint">
                  Tile stickers go straight over the existing tiles and peel off again — the colours are under
                  <b> Colours → Splashback</b>.
                </p>
                <div className="switch-list">
                  <label>
                    <span>Plants</span>
                    <input type="checkbox" checked={styles.plants} onChange={() => setStyle("plants", !styles.plants)} />
                  </label>
                  <label>
                    <span>Pictures on the wall</span>
                    <input type="checkbox" checked={styles.art} onChange={() => setStyle("art", !styles.art)} />
                  </label>
                  <label>
                    <span>Ceiling</span>
                    <input type="checkbox" checked={settings.showCeiling} onChange={() => toggleRoom("showCeiling")} />
                  </label>
                  <label>
                    <span>View out of the window</span>
                    <input type="checkbox" checked={settings.showExterior} onChange={() => toggleRoom("showExterior")} />
                  </label>
                </div>
                <div className="control-row">
                  <div className="control-row-label">
                    <span>See through the walls</span>
                    <span className="control-row-value">{Math.round((1 - settings.wallOpacity) * 100)}%</span>
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
                <div className="button-row">
                  <button className="ghost-button" onClick={resetLayout}>
                    Put furniture back
                  </button>
                  <button className="ghost-button" onClick={resetAll}>
                    Start over
                  </button>
                </div>
              </section>
            )}

            {tab === "list" && (
              <section>
                <p className="hint">Your colours, ready to search for. Tap a code to copy it.</p>
                <ul className="shopping-list">
                  {visibleColors.map((key) => (
                    <li key={key}>
                      <span className="dot" style={{ background: colors[key] }} />
                      <span className="colour-name">{COLOR_LABELS[key]}</span>
                      <button className="hex" onClick={() => copy(colors[key].toUpperCase(), `l-${key}`)}>
                        {copied === `l-${key}` ? "copied ✓" : colors[key].toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="button-row">
                  <button className="primary-button" onClick={() => copy(colourList(), "all")}>
                    {copied === "all" ? "Copied ✓" : "Copy all codes"}
                  </button>
                  <button className="ghost-button" onClick={() => copy(shareLink(), "link")}>
                    {copied === "link" ? "Link copied ✓" : "Copy link to this design"}
                  </button>
                </div>
                <p className="hint">The link saves everything — colours, furniture and where you put it all.</p>

                <details className="fixed-details">
                  <summary>What can't change</summary>
                  <ul className="shopping-list">
                    {[
                      ["Kitchen units (beech)", "#C09A6C"],
                      ["Worktop", "#5E5954"],
                      ["Oak floor", "#C6A88B"],
                      ["Window frames", "#1D2020"],
                    ].map(([name, hex]) => (
                      <li key={hex}>
                        <span className="dot" style={{ background: hex }} />
                        <span className="colour-name">{name}</span>
                        <span className="hex static">{hex}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="hint">Room is 400 × 624 cm and 243 cm high — measured, so everything is true to size.</p>
                </details>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
