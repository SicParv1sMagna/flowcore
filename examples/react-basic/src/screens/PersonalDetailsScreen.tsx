import { useGraph } from "@graphlet/react";

import type { ScreenComponent } from "../types";

import { Screen } from "../components/Screen";
import { FlowNode } from "../nodes";

export const PersonalDetailsScreen: ScreenComponent = ({ graph }) => {
  const { snapshot } = useGraph(graph);

  const interests = snapshot.context.personal.interests;

  function toggleInterest(interest: string) {
    graph.setContext((ctx) => {
      const exists = ctx.personal.interests.includes(interest);

      return {
        ...ctx,
        personal: {
          interests: exists
            ? ctx.personal.interests.filter((item) => item !== interest)
            : [...ctx.personal.interests, interest]
        }
      };
    });
  }

  return (
    <Screen title="Personal details" eyebrow="Personal path">
      <p className="muted">Choose at least one interest.</p>

      <div className="chips">
        {["Design", "Engineering", "Product", "Marketing"].map((interest) => (
          <button
            key={interest}
            className={interests.includes(interest) ? "chip active" : "chip"}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>

      <div className="actions">
        <button onClick={() => graph.back()} disabled={!graph.canGoBack()}>
          Back
        </button>

        <button
          disabled={interests.length === 0}
          onClick={() =>
            graph.goTo(FlowNode.Review, {
              source: "form",
              field: "personal"
            })
          }
        >
          Review
        </button>
      </div>
    </Screen>
  );
};
