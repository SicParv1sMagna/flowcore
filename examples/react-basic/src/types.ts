import type { Graph } from "@graphlet/core";
import type { ReactNode } from "react";

import type { FlowNode } from "./nodes";

export type Plan = "personal" | "business";

export type Payload =
  | {
      source: "button";
    }
  | {
      source: "form";
      field: string;
    }
  | {
      source: "system";
    };

export type Context = {
  profile: {
    name: string;
    email: string;
  };

  selectedPlan: Plan | null;

  personal: {
    interests: string[];
  };

  company: {
    companyName: string;
    teamSize: number;
  };

  completedAt: string | null;
};

export type AppGraph = Graph<FlowNode, Payload, Context>;

export type ScreenProps = {
  graph: AppGraph;
  snapshot: ReturnType<AppGraph["getSnapshot"]>;
};

export type ScreenComponent = (props: ScreenProps) => ReactNode;
