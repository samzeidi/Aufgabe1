import { useRoomStore } from "../store/useRoomStore";
import { VIEW_LABELS } from "./CameraRig";
import type { ViewId } from "../types";

const VIEW_ORDER: ViewId[] = ["bed", "table", "kitchen", "kitchenAlong", "overview", "top"];

export function TopBar() {
  const view = useRoomStore((s) => s.view);
  const setView = useRoomStore((s) => s.setView);

  return (
    <div className="top-bar">
      <div className="view-strip">
        {VIEW_ORDER.map((id) => (
          <button key={id} className={`view-chip ${id === view ? "active" : ""}`} onClick={() => setView(id)}>
            {VIEW_LABELS[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
