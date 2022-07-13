export const cashFlow = {
  // KPI AREAS: weighting of all areas must sum to 100%
  income: {
    weighting: 7.5, // as %
    onTrack: -10, // as %, if currentPercent <= onTrack => client is on track
    caution: -15, // as %, if currentPercent >= caution => client is on caution
    //onWatch: boolean  // => caution <= currentPercent <= onTrack
  },
  tax: {
    weighting: 2.5,
    onTrack: -7.5,
    caution: -12.5,
  },
  savings: {
    weighting: 20,
    onTrack: -5,
    caution: -10,
  },
  livingCosts: {
    weighting: 35,
    onTrack: -5,
    caution: -10,
  },
  capitalCosts: {
    weighting: 20,
    onTrack: -10,
    caution: -15,
  },
  debt: {
    weighting: 15,
    onTrack: -5,
    caution: -10,
  },
};

// TODO: Contingency / Insurance:
export const contingency = {
  // KPI areas:
  estatePlanning: {
    // Formula for years:
    // delta = MAX(BENCHMARK_YEAR-ACTUAL_YEAR,-ACTUAL_YEAR_SPOUSE+BENCHMARK_YEAR_SPOUSE)
    // Year will last reviewed: Year as integer
    // Year power of attorney last reviewed: Year as integer
    // Year enduring guardianship last reviewed: Year as integer
    // Death benefit nominations in place: BOOLEAN (yes or no)
    weighting: 20,
    onTrack: 3,
    caution: 5,
  },
  // =IF(AND(CN_Weight>0,C21<>"N/A"),IFERROR((D21/(D21+G21))*(E21-D21)/D21,0)+IFERROR((G21/(D21+G21))*(H21-G21)/G21,0),"N/A")
  emergencyFundsAvailable: {
    weighting: 10,
    onTrack: 0,
    caution: -33,
  },
  //=IF(AND(CN_Weight>0,C22<>"N/A"),IFERROR((D22/(D22+G22))*(E22-D22)/D22,0)+IFERROR((G22/(D22+G22))*(H22-G22)/G22,0),"N/A")
  lifeInsurance: {
    weighting: 15,
    onTrack: -10,
    caution: -20,
  },
  //=IF(AND(CN_Weight>0,C23<>"N/A"),IFERROR((D23/(D23+G23))*(E23-D23)/D23,0)+IFERROR((G23/(D23+G23))*(H23-G23)/G23,0),"N/A")
  disabilityInsurance: {
    weighting: 10,
    onTrack: -10,
    caution: -20,
  },
  //=IF(AND(CN_Weight>0,C24<>"N/A"),IFERROR((D24/(D24+G24))*(E24-D24)/D24,0)+IFERROR((G24/(D24+G24))*(H24-G24)/G24,0),"N/A")
  incomeInsurance: {
    weighting: 18,
    onTrack: -10,
    caution: -20,
  },
  //=IF(AND(CN_Weight>0,C25<>"N/A"),IFERROR((D25/(D25+G25))*(E25-D25)/D25,0)+IFERROR((G25/(D25+G25))*(H25-G25)/G25,0),"N/A")
  traumaInsurance: {
    weighting: 19,
    onTrack: -10,
    caution: -20,
  },
  // Either optimal OR not - calculated elsewhere or set elsewhere
  optimalStructure: {
    weighting: 8,
    // onTrack: boolean,
    // caution: boolean
  },
};

// TODO: Wealth/Investment:
export const investment = {
  // DELTA (change) formulas:
  // Portfolio type changed || not changed (Growth, Cash, etc.)
  riskTolerance: {
    weighting: 20,
    //onTrack: boolean, if tolerance unchanged => true else false
    //caution: boolean, if tolerance unchanged => false else true
  },
  // =IF(AND(IN_weight>0,B16<>"N/A"),IFERROR((C16/(C16+H16))*(D16-C16)/C16,0)+IFERROR((H16/(C16+H16))*(J16-H16)/H16,0),"N/A")
  rateOfReturn: {
    weighting: 30,
    onTrack: -20,
    caution: -40,
  },
  // =IF(AND(IN_weight>0,B17<>"N/A"),IFERROR((C17/(C17+H17))*(D17-C17)/C17,0)+IFERROR((H17/(C17+H17))*(J17-H17)/H17,0),"N/A")
  growthAssets: {
    weighting: 20,
    onTrack: 10,
    caution: 20,
  },
  // =IF(AND(IN_weight>0,B18<>"N/A"),IFERROR((C18/(C18+H18))*(D18-C18)/C18,0)+IFERROR((H18/(C18+H18))*(J18-H18)/H18,0),"N/A")
  liquidity: {
    weighting: 15,
    onTrack: -10,
    caution: -20,
  },
  // =IF(AND(IN_weight>0,B19<>"N/A"),IFERROR((C19/(C19+H19))*(D19-C19),0)+IFERROR((H19/(C19+H19))*(J19-H19),0),"N/A")
  // TODO: find out why there are two numbers for onTrack & caution:
  cashReserves: {
    weighting: 15,
    onTrack: 3,
    caution: -2,
    //onTrack: (-1, 3)??
    //caution: (-2, 5)??
  },
};

const defaultStatusAllocs = {
  status: [
    { status: "Caution", kpi: 0, overall: 0 },
    { status: "On Watch", kpi: 50, overall: 50 },
    { status: "On Track", kpi: 100, overall: 75 },
  ],
  combination: [
    {
      combination: "Cash Flow",
      cf: 100,
      in: 0,
      cn: 0,
      "cf/in": 50,
      "in/cn": 0,
      "cf/cn": 50,
      "cf/in/cn": 60,
    },
    {
      combination: "Investment",
      cf: 0,
      in: 100,
      cn: 0,
      "cf/in": 50,
      "in/cn": 60,
      "cf/cn": 0,
      "cf/in/cn": 20,
    },
    {
      combination: "Contingency",
      cf: 0,
      in: 0,
      cn: 100,
      "cf/in": 0,
      "in/cn": 40,
      "cf/cn": 50,
      "cf/in/cn": 20,
    },
  ],
};

const ratingProfile = {
  cashFlow,
  contingency,
  investment,
  defaultStatusAllocs,
};

module.exports = ratingProfile;
