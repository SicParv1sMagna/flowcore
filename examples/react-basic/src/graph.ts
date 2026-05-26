import { createComponentGraph } from "@graphlet/react";

import type { Context, Payload } from "./types";

import { CompanyDetailsScreen } from "./screens/CompanyDetailsScreen";
import { PersonalDetailsScreen } from "./screens/PersonalDetailsScreen";
import { PlanScreen } from "./screens/PlanScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";

export const initialContext: Context = {
  profile: {
    name: "",
    email: ""
  },

  selectedPlan: null,

  personal: {
    interests: []
  },

  company: {
    companyName: "",
    teamSize: 1
  },

  completedAt: null
};

export const graph = createComponentGraph<Payload, Context>()(
  [
    [WelcomeScreen, [ProfileScreen]],
    [ProfileScreen, [PlanScreen]],
    [PlanScreen, [PersonalDetailsScreen, CompanyDetailsScreen]],
    [PersonalDetailsScreen, [ReviewScreen]],
    [CompanyDetailsScreen, [ReviewScreen]],
    [ReviewScreen, [PlanScreen, SuccessScreen]],
    [SuccessScreen, [WelcomeScreen]]
  ] as const,
  {
    initial: WelcomeScreen,
    context: initialContext
  }
);
