import { useGraph } from "@graphlet/react";

import type { ScreenComponent } from "../types";

import { Field, Screen } from "../components/Screen";
import { PlanScreen } from "./PlanScreen";

export const ProfileScreen: ScreenComponent = ({ graph }) => {
  const { snapshot } = useGraph(graph);

  const canContinue =
    snapshot.context.profile.name.trim().length > 0 &&
    snapshot.context.profile.email.trim().length > 0;

  return (
    <Screen title="Profile" eyebrow="Step 1">
      <Field label="Name">
        <input
          value={snapshot.context.profile.name}
          placeholder="Ada Lovelace"
          onChange={(event) => {
            graph.setContext((ctx) => ({
              ...ctx,
              profile: {
                ...ctx.profile,
                name: event.target.value
              }
            }));
          }}
        />
      </Field>

      <Field label="Email">
        <input
          value={snapshot.context.profile.email}
          placeholder="ada@example.com"
          onChange={(event) => {
            graph.setContext((ctx) => ({
              ...ctx,
              profile: {
                ...ctx.profile,
                email: event.target.value
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
            graph.goTo(PlanScreen, {
              source: "form",
              field: "profile"
            })
          }
        >
          Continue
        </button>
      </div>
    </Screen>
  );
};
