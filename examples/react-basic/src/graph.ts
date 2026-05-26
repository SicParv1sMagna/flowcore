import { createComponentGraph } from "@graphlet/react";

import { initialContext } from "./context";
import { FlowNode } from "./nodes";

import type { Context, Payload } from "./types";

import { CompanyDetailsScreen } from "./screens/CompanyDetailsScreen";
import { PersonalDetailsScreen } from "./screens/PersonalDetailsScreen";
import { PlanScreen } from "./screens/PlanScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";

export const graph = createComponentGraph<Payload, Context>()(
  [
    [FlowNode.Welcome, [FlowNode.Profile]],
    [FlowNode.Profile, [FlowNode.Plan]],
    [FlowNode.Plan, [FlowNode.PersonalDetails, FlowNode.CompanyDetails]],
    [FlowNode.PersonalDetails, [FlowNode.Review]],
    [FlowNode.CompanyDetails, [FlowNode.Review]],
    [FlowNode.Review, [FlowNode.Plan, FlowNode.Success]],
    [FlowNode.Success, [FlowNode.Welcome]]
  ] as const,
  {
    initial: FlowNode.Welcome,
    context: initialContext,
    components: {
      [FlowNode.Welcome]: WelcomeScreen,
      [FlowNode.Profile]: ProfileScreen,
      [FlowNode.Plan]: PlanScreen,
      [FlowNode.PersonalDetails]: PersonalDetailsScreen,
      [FlowNode.CompanyDetails]: CompanyDetailsScreen,
      [FlowNode.Review]: ReviewScreen,
      [FlowNode.Success]: SuccessScreen
    }
  }
);
