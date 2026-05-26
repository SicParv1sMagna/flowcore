import type { ScreenComponent } from "../types";

import { ProfileScreen } from "./ProfileScreen";
import { Screen } from "../components/Screen";

export const WelcomeScreen: ScreenComponent = ({ graph, snapshot }) => {
  return (
    <Screen title="Welcome" eyebrow="Start">
      <p className="muted">
        This demo uses React components as graph nodes. The current node is{" "}
        <code>{snapshot.current.name}</code>.
      </p>

      <div className="card">
        <p>
          You can move through the flow, update context, go back using history
          and inspect every snapshot.
        </p>
      </div>

      <div className="actions">
        <button onClick={() => graph.goTo(ProfileScreen, { source: "button" })}>
          Start onboarding
        </button>
      </div>
    </Screen>
  );
};
