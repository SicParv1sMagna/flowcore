import { useGraph } from "@graphlet/react";

import type { Plan, ScreenComponent } from "../types";

import { Screen } from "../components/Screen";
import { FlowNode } from "../nodes";

export const PlanScreen: ScreenComponent = ({ graph }) => {
  const { snapshot } = useGraph(graph);

  function selectPlan(plan: Plan) {
    graph.setContext((ctx) => ({
      ...ctx,
      selectedPlan: plan
    }));
  }

  const selectedPlan = snapshot.context.selectedPlan;

  return (
    <Screen title="Choose plan" eyebrow="Step 2">
      <div className="plans">
        <button
          className={selectedPlan === "personal" ? "plan active" : "plan"}
          onClick={() => selectPlan("personal")}
        >
          <strong>Personal</strong>
          <span>For individual usage.</span>
        </button>

        <button
          className={selectedPlan === "business" ? "plan active" : "plan"}
          onClick={() => selectPlan("business")}
        >
          <strong>Business</strong>
          <span>For teams and companies.</span>
        </button>
      </div>

      <div className="actions">
        <button onClick={() => graph.back()} disabled={!graph.canGoBack()}>
          Back
        </button>

        <button
          disabled={selectedPlan !== "personal"}
          onClick={() =>
            graph.goTo(FlowNode.PersonalDetails, {
              source: "button"
            })
          }
        >
          Continue as personal
        </button>

        <button
          disabled={selectedPlan !== "business"}
          onClick={() =>
            graph.goTo(FlowNode.CompanyDetails, {
              source: "button"
            })
          }
        >
          Continue as business
        </button>
      </div>
    </Screen>
  );
};
