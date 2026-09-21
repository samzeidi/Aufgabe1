import { Scene } from "./components/Scene";
import { Sheet } from "./components/Sheet";
import { TopBar } from "./components/TopBar";
import { SelectionBar } from "./components/SelectionBar";
import { Hint } from "./components/Hint";

// ?ui=0 renders only the 3D view (used for the check renders)
const hideUi = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("ui") === "0";

export function App() {
  return (
    <div className="app">
      <Scene />
      {!hideUi && (
        <>
          <TopBar />
          <SelectionBar />
          <Sheet />
          <Hint />
        </>
      )}
    </div>
  );
}
