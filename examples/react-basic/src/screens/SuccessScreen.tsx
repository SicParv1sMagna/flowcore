import { useGraph } from "@graphlet/react";

import type { ScreenComponent } from "../types";

import { initialContext } from "../graph";
import { Screen } from "../components/Screen";

export const SuccessScreen: ScreenComponent = ({ graph }) => {
  const { snapshot } = useGraph(graph);

  return (
    <Screen title="Success" eyebrow="Completed">
      <p>
        Thank you, <strong>{snapshot.context.profile.name}</strong>.
      </p>

      <p className="muted">
        Completed at: <code>{snapshot.context.completedAt}</code>
      </p>

      <div className="actions">
        <button
          onClick={() => {
            graph.setContext(initialContext);
            graph.reset();
          }}
        >
          Restart
        </button>
      </div>
    </Screen>
  );
};
