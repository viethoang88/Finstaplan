// Unit(s) under test:
import {
  calculateScore,
  calculateRatings,
  combineSavingsAndGetRating,
  calculateRating,
  calculateContingencyDeltas,
  calculateContingencyDelta,
  calculateCashFlowDeltas,
  calculateCashDelta,
  calculateExpensesDelta,
  calculateInvestmentDeltas,
  calculateInvestmentDelta,
  calculateCashReserveDelta,
} from "../../pages/api/calculations/benchmarking";
import DataManager from "../../classes/DataManager";

// TESTING CODE:
const cashFlowData = require("../../../dummy_data/cashflow_benchmark_data.ts");
const investmentData = require("../../../dummy_data/investment_benchmark_data.ts");
const contingencyData = require("../../../dummy_data/contingency_benchmark_data.ts");
const clientData = { cashFlowData, investmentData, contingencyData };
const benchmarkingProfile = require("../../../dummy_data/benchmarking_profile.ts");

const pointsScoreTable = {
  individualKPI: {
    caution: 0,
    onWatch: 50,
    onTrack: 100,
  },
  overallKPI: {
    caution: 0,
    onWatch: 50,
    onTrack: 75,
  },
};

// Can be top-level, in any describe
//beforeAll(() => {})
//beforeEach(() => {})
//afterEach(() => {})
//afterAll(() => {})

const testClients = [clientData];
const testClient = testClients[0];
let dataManager;

// beforeAll(() => {
//   dataManager = new DataManager(testClient);
// });

describe("it calculates contingency deltas and weighted scores", () => {
  // calculateContingencyDeltas,
  // calculateContingencyDelta,
});

describe("calculateAssumptions tests", () => {
  // calculateAssumptions = (clientData, assumptions)
  let assumptions;
  let clientData;

  beforeEach(() => {
    assumptions = {
      other: {
        mortalityAge: 70,
        retirementAge: 65,
        maximumAgeToFundChildren: 25,
      },
      taxation: {
        taxOnIncomeGrowth: 0.258,
        taxOnFutureCapitalGrowth: 0.106,
      },
      investmentReturns: {
        income: 0.323,
        expenses: 0.456,
      },
    };
    clientData = {
      hasPartner: false,
      hasChildren: false,
      primary: { dateOfBirth: "Mon Jan 1 1981" }, // 40 years old
    };
  });
});
