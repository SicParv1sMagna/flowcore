import type { Context } from "./types";

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
