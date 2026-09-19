import { Scene } from "./components/Scene";
import { ControlPanel } from "./components/ControlPanel";

// ?ui=0 renders only the 3D view (used for clean check renders)
const hideUi = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("ui") === "0";

export function App() {
  return (
    <div className="app">
      {!hideUi && (
        <header className="app-header">
          <h1>Room Planner</h1>
          <p>1:1 digital twin · 400 × 624 × 243 cm</p>
        </header>
      )}
      <div className="scene-container">
        <Scene />
      </div>
      {!hideUi && <ControlPanel />}
    </div>
  );
}
