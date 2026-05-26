import { useGraph } from "@graphlet/react";

import type { ScreenComponent } from "../types";

import { Field, Screen } from "../components/Screen";
import { FlowNode } from "../nodes";

export const CompanyDetailsScreen: ScreenComponent = ({ graph }) => {
  const { snapshot } = useGraph(graph);

  const company = snapshot.context.company;
  const canContinue = company.companyName.trim().length > 0;

  return (
    <Screen title="Company details" eyebrow="Business path">
      <Field label="Company name">
        <input
          value={company.companyName}
          placeholder="Graphlet Inc."
          onChange={(event) => {
            graph.setContext((ctx) => ({
              ...ctx,
              company: {
                ...ctx.company,
                companyName: event.target.value
              }
            }));
          }}
        />
      </Field>

      <Field label="Team size">
        <input
          type="number"
          min={1}
          value={company.teamSize}
          onChange={(event) => {
            graph.setContext((ctx) => ({
              ...ctx,
              company: {
                ...ctx.company,
                teamSize: Number(event.target.value)
              }
            }));
          }}
        />
      </Field>

      <div className="actions">
        <button onClick={() => graph.back()} disabled={!graph.canGoBack()}>
          Back
        </button>

        <button
          disabled={!canContinue}
          onClick={() =>
            graph.goTo(FlowNode.Review, {
              source: "form",
              field: "company"
            })
          }
        >
          Review
        </button>
      </div>
    </Screen>
  );
};
