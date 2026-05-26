import type { Graph } from "@graphlet/core";

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

export type ScreenComponent = (props: ScreenProps) => React.ReactNode;

export type AppGraph = Graph<ScreenComponent, Payload, Context>;

export type ScreenProps = {
  graph: AppGraph;
  snapshot: ReturnType<AppGraph["getSnapshot"]>;
};
