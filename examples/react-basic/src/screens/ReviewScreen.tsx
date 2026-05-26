import { useGraph } from "@graphlet/react";

import type { ScreenComponent } from "../types";

import { SummaryRow, Screen } from "../components/Screen";
import { PlanScreen } from "./PlanScreen";
import { SuccessScreen } from "./SuccessScreen";

export const ReviewScreen: ScreenComponent = ({ graph }) => {
  const { snapshot } = useGraph(graph);
  const context = snapshot.context;

  return (
    <Screen title="Review" eyebrow="Final check">
      <div className="summary">
        <SummaryRow label="Name" value={context.profile.name} />
        <SummaryRow label="Email" value={context.profile.email} />
        <SummaryRow label="Plan" value={context.selectedPlan ?? "—"} />

        {context.selectedPlan === "personal" ? (
          <SummaryRow
            label="Interests"
            value={context.personal.interests.join(", ")}
          />
        ) : (
          <>
            <SummaryRow label="Company" value={context.company.companyName} />
            <SummaryRow
              label="Team size"
              value={String(context.company.teamSize)}
            />
          </>
        )}
      </div>

      <div className="actions">
        <button onClick={() => graph.back()} disabled={!graph.canGoBack()}>
          Back
        </button>

        <button onClick={() => graph.goTo(PlanScreen, { source: "button" })}>
          Change plan
        </button>

        <button
          onClick={() => {
            graph.setContext((ctx) => ({
              ...ctx,
              completedAt: new Date().toISOString()
            }));

            graph.goTo(SuccessScreen, {
              source: "system"
            });
          }}
        >
          Submit
        </button>
      </div>
    </Screen>
  );
};
