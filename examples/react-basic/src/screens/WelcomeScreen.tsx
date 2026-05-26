import type { ScreenComponent } from "../types";

import { Screen } from "../components/Screen";
import { FlowNode } from "../nodes";

export const WelcomeScreen: ScreenComponent = ({ graph, snapshot }) => {
  return (
    <Screen title="Welcome" eyebrow="Start">
      <p className="muted">
        This demo uses string/enum nodes and maps each node to a React
        component. The current node is <code>{snapshot.current}</code>.
      </p>

      <div className="card">
        <p>
          You can move through the flow, update context, go back using history
          and inspect every snapshot.
        </p>
      </div>

      <div className="actions">
        <button
          onClick={() =>
            graph.goTo(FlowNode.Profile, {
              source: "button"
            })
          }
        >
          Start onboarding
        </button>
      </div>
    </Screen>
  );
};
