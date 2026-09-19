import { Scene } from "./components/Scene";
import { ControlPanel } from "./components/ControlPanel";

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Room Planner</h1>
        <p>Set your room's size, then look around in 3D.</p>
      </header>
      <div className="scene-container">
        <Scene />
      </div>
      <ControlPanel />
    </div>
  );
}
