// the adviser/dealergroup => let them create cash+5 portfolio names and allocations
// generic template - that is customizable.

// USAGE:
// fony -t "{\"name\": \"name\", \"age\": \"age\", \"address\": \"address\"}" -c 2
const portfolio = [{}, {}, {}];

const benchmark = {};
const philosophies = {};
const assumptions = {};

const dealerGroup = {
  dealerGroupId: {
    groupName: "",
    phone: 0,
    email: "",
    password: "",
    enterprises: ["enterpriseId"],
    philosophies: "philosophyId",
    assumptions: "assumptionId",
    benchmarks: "benchmarkId",
    customPortfolio: ["portfolioId"],
  },
};

const enterprise = {
  enterpriseId: {
    enterpriseName: "Financial Mentors",
    enterpriseLogo: "",
    phone: 0,
    email: "",
    password: "",
    dealerGroup: "dealergroupId",
    clients: ["clientId"],
    advisers: ["adviserId"],
    philosophies: "philosophyId",
    assumptions: "assumptionId",
    benchmarks: "benchmarkId",
    customPortfolio: ["portfolioId"],
  },
};

const adviser = {
  adviserId: {
    name: "Martin Morris",
    profilePicture: "",
    phone: 0,
    email: "",
    password: "",
    dealerGroup: "dealergroupId",
    enterprise: "enterpriseId",
    clients: ["clientId"],
    partners: ["adviserId"],
    philosophies: "philosophyId",
    assumptions: "assumptionId",
    benchmarks: "benchmarkId",
    customPortfolio: ["portfolioId"],
  },
};

// USAGE: fony -t "{\"name\": \"name\", \"age\": \"age\", \"address\": \"address\"}" -c 2
// monthly budget, house, education, superannuation/retirement annuity
//
const client = {
  clientId: {
    name: "",
    joinedDate: "",
    completedIntake: false,
    phone: 0,
    email: "",
    password: "",
    adviser: "adviserId",
    age: 0,
    desiredRetirementAge: 0,
    dependents: {},
    legacies: {}, // donations can be elsewhere than family
    assets: {}, // NOTE: asset allocations settable by clients
    expenses: {},
    liabilities: {},
    riskProfile: {},
    goals: {},
    insurance: {},
    benchmarks: "benchmarkId",
  },
};
