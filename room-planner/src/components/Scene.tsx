import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useRoomStore } from "../store/useRoomStore";
import { useDesignStore } from "../store/useDesignStore";
import { MaterialsProvider } from "../room/materials";
import { CameraRig } from "./CameraRig";
import { Shell } from "./room/Shell";
import { Windows } from "./room/Windows";
import { Kitchen } from "./room/Kitchen";
import { Furnishings } from "./room/Furniture";
import { Curtains, Art } from "./room/Decor";
import { Lighting } from "./room/Lighting";
import { Exterior } from "./room/Exterior";
import { Dimensions } from "./room/Dimensions";

// ?dims=0 suppresses the dimension overlay even in the top view (plain plan render)
const dimsSuppressed = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("dims") === "0";

export function Scene() {
  const settings = useRoomStore((s) => s.settings);
  const view = useRoomStore((s) => s.view);
  const accentWall = useDesignStore((s) => s.styles.accentWall);
  const select = useDesignStore((s) => s.select);
  const planView = view === "top" || view === "overview";
  const showCeiling = settings.showCeiling && !planView;
  const showExterior = settings.showExterior && !planView;
  const showDimensions = !dimsSuppressed && (settings.showDimensions || view === "top");

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}
      style={{ touchAction: "none" }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={["#c9d4de"]} />
      <MaterialsProvider>
        <CameraRig view={view} lens={settings.lens} />
        <Lighting />
        <Shell
          wallOpacity={settings.wallOpacity}
          showCeiling={showCeiling}
          accentWall={accentWall}
          dollhouse={view === "overview"}
        />
        <Windows />
        <Curtains />
        <Art dollhouse={view === "overview"} />
        <Kitchen />
        <Furnishings />
        {showExterior && <Exterior />}
        {showDimensions && <Dimensions />}
      </MaterialsProvider>
    </Canvas>
  );
}
