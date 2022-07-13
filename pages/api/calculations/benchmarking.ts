// TODO: question: do you calculate Caution, on track, on watch with both partners together or separately.

// benchmark "column" data is initial consultation data set up to measure actual outcomes against
// - prior to annual meeting the advisor will input the "actual" outcomes
//   which should then be used in the actual determination of colour/success/rating
// - the advisor also inputs next years forecast (which becomes next years benchmark)

// TODO: 3 key areas of benchmarking: Cash flow, Contingency, Wealth
// - Some may be outside the scope (YES/NO test)
// - Can be 0, can be 1, can be any 2, can be all 3

// TODO: Cash Flow
// onWatch means <= onTrack but >= caution

// weighting, onTrack and caution are inputs by adviser and editable.
// NOTE: currentPercent is calculated as the difference between the actual value and the benchmark value
/* calculate the delta by taking:

    // FOR income and savings:
    =IF(AND(CF_Weight>0,C16<>"N/A"),IF(Report_Type=2,IFERROR((D16/(D16+G16))*(2*E16-D16)/D16,0)+IFERROR((G16/(D16+G16))*(2*H16-G16)/G16,0),IFERROR((D16/(D16+G16))*(E16-D16)/D16,0)+IFERROR((G16/(D16+G16))*(H16-G16)/G16,0)),"N/A")
   
    // ALTERNATE FORMULA FOR FOR living costs, debt, capital costs, tax:
    =IF(AND(CF_Weight>0,C23<>"N/A"),IF(Report_Type=2,IFERROR((D23/(D23+G23))*(-2*E23+D23)/D23,0)+IFERROR((G23/(D23+G23))*(-2*H23+G23)/G23,0),IFERROR((D23/(D23+G23))*(-E23+D23)/D23,0)+IFERROR((G23/(D23+G23))*(-H23+G23)/G23,0)),"N/A")
*/

// TODO: high level
/*				
// Score individual KPI for each section based on their relative weightings:
Points Score Table (OVERALL SCORE)	
Status          	Individual KPI	    Overall Section					
Caution         	0%                 	0%					
On Watch	        50%             	50%					
On Track	        100%	            75%					

// Adviser can set whether they manage any or all of these 3:
// - scale weightings by the appropriate % given what they set for OVERALL SECTION value.
Combinations    	CF  	IN	    CN	    CF/IN	IN/CN	CF/CN	CF/IN/CN
Cash Flow	        100%			        50%		        50% 	60%
Investment		            100%		    50%	    60%		        20%
Contingency			                100%		    40%	    50%	    20%
*/

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

export const calculateScore = (
  reportType = "initial",
  clientData,
  benchmarkProfile
) => {
  const { cashFlowData, investmentData, contingencyData } = clientData;
  const { cashFlow, contingency, investment } = benchmarkProfile;
  const cashFlowDeltas = calculateCashFlowDeltas(reportType, cashFlowData);
  const contingencyDeltas = calculateContingencyDeltas(contingencyData);
  const investmentDeltas = calculateInvestmentDeltas(investmentData);

  const cashFlowRatings = calculateRatings(cashFlowDeltas, cashFlow);
  const contingencyRatings = calculateRatings(contingencyDeltas, contingency);
  const investmentRatings = calculateRatings(investmentDeltas, investment);
  //const score = calculateCashFlowScores();
  return [cashFlowRatings, contingencyRatings, investmentRatings];
};

const savings = ["super", "investments", "offset"];
const getKPIArea = (area) => {
  if (savings.includes(area)) return "savings";
  else return area;
};

export const calculateRatings = (deltas, benchmarkProfile) => {
  console.log(deltas);

  const savingsData = [];

  let ratings = {};
  for (const [KPI_AREA, data] of Object.entries(deltas)) {
    let area = getKPIArea(KPI_AREA);
    // if (area === "savings") {
    //   savingsData.push([KPI_AREA, data]);
    // }
    ratings[KPI_AREA] = calculateRating(area, benchmarkProfile[area], data);
  }

  // if (savingsData.length > 0) {
  //   ratings["savings"] = combineSavingsAndGetRating(
  //     savingsData,
  //     benchmarkProfile["savings"]
  //   );
  // }
  return ratings;
};

export const combineSavingsAndGetRating = (
  savingsData,
  benchmarkingProfile
) => {
  console.log("----------------");
  console.log(savingsData);
  console.log("----------------");

  const data = savingsData.reduce((acc, [label, delta]) => {
    return acc + delta;
  }, 0);
  const savingsRating = calculateRating("savings", benchmarkingProfile, data);
  console.log(savingsRating);
  return savingsRating;
};

/* income: {
    weighting: 7.5, // as %
    onTrack: -10, // as %, if currentPercent <= onTrack -- client is on track
    caution: -15, // as %, if currentPercent >= caution -- client is on caution
    //onWatch: boolean  // => caution <= currentPercent <= onTrack
  },
*/
export const calculateRating = (
  KPI_AREA,
  { weighting, onTrack, caution },
  delta
) => {
  // riskTolerance: true iff portfolio allocation changed (On Watch)
  //                else false (On Track)

  weighting = (+weighting / 100).toFixed(4);
  //   onTrack = (+onTrack / 100).toFixed(4);
  //   caution = (+caution / 100).toFixed(4);

  if (KPI_AREA === "riskTolerance") {
    if (!delta) {
      return {
        rating: "On Track",
        score: pointsScoreTable.individualKPI.onTrack,
        weightedScore: weighting * pointsScoreTable.individualKPI.onTrack,
      };
    } else {
      return {
        rating: "On Watch",
        score: pointsScoreTable.individualKPI.onWatch,
        weightedScore: weighting * pointsScoreTable.individualKPI.onWatch,
        delta,
      };
    }
  }

  delta *= 100;
  let ratings = {};
  ratings.delta = delta;
  //   if (delta <= caution && delta >= onTrack) {
  //     ratings.rating = "On Watch";
  //     ratings.score = pointsScoreTable.individualKPI.onWatch;
  //     ratings.weightedScore = weighting * pointsScoreTable.individualKPI.onWatch;
  //   }

  if (+delta >= onTrack) {
    ratings.rating = "On Track";
    ratings.score = pointsScoreTable.individualKPI.onTrack;
    ratings.weightedScore = weighting * pointsScoreTable.individualKPI.onTrack;
  } else if (+delta <= caution) {
    ratings.rating = "Caution";
    ratings.score = pointsScoreTable.individualKPI.caution;
    ratings.weightedScore = weighting * pointsScoreTable.individualKPI.caution;
  } else {
    ratings.rating = "On Watch";
    ratings.score = pointsScoreTable.individualKPI.onWatch;
    ratings.weightedScore = weighting * pointsScoreTable.individualKPI.onWatch;
  }
  // console.log(KPI_AREA, weighting, onTrack, caution, delta, ratings);
  // console.log("delta ", delta, ">= ", onTrack, delta >= onTrack);
  // console.log("delta ", delta, "<= ", caution, delta <= caution);

  return ratings;
};

// TODO: Contingency delta formula:
// TODO: Add Estate planning:
//        - Year will last reviewed
//        - Year power of attorney last reviewed
//        - Year enduring guardianship last reviewed
//        - Death Benefit Nominations in place
// (different if there is no partner)
// ((BENCHMARK / (BENCHMARK+BENCHMARK_SPOUSE))       * (ACTUAL-BENCHMARK) / BENCHMARK +
// (BENCHMARK_SPOUSE / (BENCHMARK+BENCHMARK_SPOUSE)) * (ACTUAL_SPOUSE-BENCHMARK_SPOUSE) / BENCHMARK_SPOUSE
export const calculateContingencyDeltas = (contingencyData) => {
  let deltas = {};

  for (const [key, data] of Object.entries(contingencyData)) {
    deltas[key] = calculateContingencyDelta(data);
  }

  return deltas;
};

export const calculateContingencyDelta = (
  clientData,
  clientHasSpouse = true
) => {
  const {
    benchmark: BENCHMARK,
    benchmarkSpouse: BENCHMARK_SPOUSE,
    actual: ACTUAL,
    actualSpouse: ACTUAL_SPOUSE,
  } = clientData;

  if (clientHasSpouse) {
    return (
      ((BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) * (ACTUAL - BENCHMARK)) /
        BENCHMARK +
      ((BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (ACTUAL_SPOUSE - BENCHMARK_SPOUSE)) /
        BENCHMARK_SPOUSE
    ).toFixed(4);
  }
};

// CASH FLOW:
export const calculateCashFlowDeltas = (
  reportType = "initial",
  cashFlowData
) => {
  // NOTE: calculateExpensesDelta === -calculateCashDelta
  // - REFACTOR THIS
  let deltas = {};

  deltas.income = calculateCashDelta(
    reportType,
    cashFlowData.spouse,
    cashFlowData.income
  );
  deltas.tax = calculateCashDelta(
    reportType,
    cashFlowData.spouse,
    cashFlowData.tax
  );
  deltas.livingCosts = calculateExpensesDelta(
    reportType,
    cashFlowData.spouse,
    cashFlowData.livingCosts
  );
  deltas.capitalCosts = calculateExpensesDelta(
    reportType,
    cashFlowData.spouse,
    cashFlowData.capitalCosts
  );
  deltas.debt = calculateExpensesDelta(
    reportType,
    cashFlowData.spouse,
    cashFlowData.debt
  );

  for (const [key, data] of Object.entries(cashFlowData.savings)) {
    deltas[key] = calculateCashDelta(reportType, cashFlowData.spouse, data);
  }

  return deltas;
};

// TODO: CASH FLOW DELTA FORMULA:
// - TWO DIFFERENT FORMULAS (FOR INCOME AND SAVINGS):
//   - one for reportType: midYear                 -- IFERROR((D16/(D16+G16))*(2*E16-D16)/D16,0)+IFERROR((G16/(D16+G16))*(2*H16-G16)/G16, 0)
//   - another for reportType: initial, annual     -- IFERROR((D16/(D16+G16))*(E16-D16)/D16,0)+IFERROR((G16/(D16+G16))*(H16-G16)/G16,0)),"N/A")

// - TWO DIFFERENT FORMULAS (FOR living costs, debt, capital costs, tax):
//   - one for reportType: midYear                 -- IFERROR((D23/(D23+G23))*(-2*E23+D23)/D23,0)+IFERROR((G23/(D23+G23))*(-2*H23+G23)/G23,0),
//   - another for reportType: initial, annual     -- IFERROR((D23/(D23+G23))*(-E23+D23)/D23,0)+IFERROR((G23/(D23+G23))*(-H23+G23)/G23,0)),"N/A")

// FOR income and savings:
//=IF(AND(CF_Weight>0,C16<>"N/A"),IF(Report_Type=2,IFERROR((D16/(D16+G16))*(2*E16-D16)/D16,0)+IFERROR((G16/(D16+G16))*(2*H16-G16)/G16,0),IFERROR((D16/(D16+G16))*(E16-D16)/D16,0)+IFERROR((G16/(D16+G16))*(H16-G16)/G16,0)),"N/A")

// Mid year formula:
//IFERROR((BENCHMARK/(BENCHMARK+BENCHMARK_SPOUSE))*(2*ACTUAL-BENCHMARK)/BENCHMARK,0) +
//IFERROR((BENCHMARK_SPOUSE/(BENCHMARK+BENCHMARK_SPOUSE))*(2*ACTUAL_SPOUSE-BENCHMARK_SPOUSE)/BENCHMARK_SPOUSE,0)

// Initial/annual formula:
//IFERROR((BENCHMARK/(BENCHMARK+BENCHMARK_SPOUSE))*(ACTUAL-BENCHMARK)/BENCHMARK,0) +
//IFERROR((BENCHMARK_SPOUSE/(BENCHMARK+BENCHMARK_SPOUSE))*(ACTUAL_SPOUSE-BENCHMARK_SPOUSE)/BENCHMARK_SPOUSE,0)),"N/A")

export const calculateCashDelta = (
  reportType = "initial",
  clientHasSpouse = false,
  clientData
) => {
  const {
    benchmark: BENCHMARK,
    benchmarkSpouse: BENCHMARK_SPOUSE,
    actual: ACTUAL,
    actualSpouse: ACTUAL_SPOUSE,
  } = clientData;

  if (reportType === "midYear" && clientHasSpouse) {
    return (
      ((BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (2 * ACTUAL - BENCHMARK)) /
        BENCHMARK +
      ((BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (2 * ACTUAL_SPOUSE - BENCHMARK_SPOUSE)) /
        BENCHMARK_SPOUSE
    ).toFixed(4);
  }
  if (
    (reportType === "initial" || reportType === "annual") &&
    clientHasSpouse
  ) {
    return (
      ((BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) * (ACTUAL - BENCHMARK)) /
        BENCHMARK +
      ((BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (ACTUAL_SPOUSE - BENCHMARK_SPOUSE)) /
        BENCHMARK_SPOUSE
    ).toFixed(4);
  }
};

// ALTERNATE FORMULA FOR FOR living costs, debt, capital costs, tax:
//=IF(AND(CF_Weight>0,C23<>"N/A"),IF(Report_Type=2,IFERROR((D23/(D23+G23))*(-2*E23+D23)/D23,0)+IFERROR((G23/(D23+G23))*(-2*H23+G23)/G23,0),IFERROR((D23/(D23+G23))*(-E23+D23)/D23,0)+IFERROR((G23/(D23+G23))*(-H23+G23)/G23,0)),"N/A")

// Mid year formula:
//IFERROR((BENCHMARK/(BENCHMARK+BENCHMARK_SPOUSE))*(-2*ACTUAL+BENCHMARK)/BENCHMARK,0) +
//IFERROR((BENCHMARK_SPOUSE/(BENCHMARK+BENCHMARK_SPOUSE))*(-2*ACTUAL_SPOUSE+BENCHMARK_SPOUSE)/BENCHMARK_SPOUSE,0),

// Initial/annual formula:
//IFERROR((BENCHMARK/(BENCHMARK+BENCHMARK_SPOUSE))*(-ACTUAL+BENCHMARK)/BENCHMARK,0) +
//IFERROR((BENCHMARK_SPOUSE/(BENCHMARK+BENCHMARK_SPOUSE))*(-ACTUAL_SPOUSE+BENCHMARK_SPOUSE)/BENCHMARK_SPOUSE, 0)
export const calculateExpensesDelta = (
  reportType = "initial",
  clientHasSpouse = false,
  clientData
) => {
  const {
    benchmark: BENCHMARK,
    benchmarkSpouse: BENCHMARK_SPOUSE,
    actual: ACTUAL,
    actualSpouse: ACTUAL_SPOUSE,
  } = clientData;

  if (reportType === "midYear" && clientHasSpouse) {
    return (
      ((BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (-2 * ACTUAL + BENCHMARK)) /
        BENCHMARK +
      ((BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (-2 * ACTUAL_SPOUSE + BENCHMARK_SPOUSE)) /
        BENCHMARK_SPOUSE
    ).toFixed(4);
  }
  if (
    (reportType === "initial" || reportType === "annual") &&
    clientHasSpouse
  ) {
    return (
      ((BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) * (-ACTUAL + BENCHMARK)) /
        BENCHMARK +
      ((BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (-ACTUAL_SPOUSE + BENCHMARK_SPOUSE)) /
        BENCHMARK_SPOUSE
    ).toFixed(4);
  }
};

// TODO: INVESTMENT DELTA FORMULA:

// RATE OF RETURN, GROWTH ASSETS, LIQUIDITY:
// =IF(AND(IN_weight>0,B16<>"N/A"),IFERROR((C16/(C16+H16))*(D16-C16)/C16,0)+IFERROR((H16/(C16+H16))*(J16-H16)/H16,0),"N/A")
// =IF(AND(IN_weight>0,B17<>"N/A"),IFERROR((C17/(C17+H17))*(D17-C17)/C17,0)+IFERROR((H17/(C17+H17))*(J17-H17)/H17,0),"N/A")
// =IF(AND(IN_weight>0,B18<>"N/A"),IFERROR((C18/(C18+H18))*(D18-C18)/C18,0)+IFERROR((H18/(C18+H18))*(J18-H18)/H18,0),"N/A")
const investmentTypes = ["rateOfReturn", "growthAssets", "liquidity"];

export const calculateInvestmentDeltas = (investmentData) => {
  let deltas = {};

  for (const [key, data] of Object.entries(investmentData)) {
    if (key === "riskTolerance") deltas[key] = investmentData.changed;
    else if (key === "cashReserves")
      deltas[key] = calculateCashReserveDelta(investmentData.spouse, data);
    else if (investmentTypes.includes(key))
      deltas[key] = calculateInvestmentDelta(investmentData.spouse, data);
  }

  return deltas;
};
// ((BENCHMARK/(BENCHMARK+BENCHMARK_SPOUSE))*(ACTUAL-BENCHMARK)/BENCHMARK)
// +((BENCHMARK_SPOUSE/(BENCHMARK+BENCHMARK_SPOUSE))*(ACTUAL_SPOUSE-BENCHMARK_SPOUSE)/BENCHMARK_SPOUSE
export const calculateInvestmentDelta = (
  clientHasSpouse = false,
  clientData
) => {
  const {
    benchmark: BENCHMARK,
    benchmarkSpouse: BENCHMARK_SPOUSE,
    actual: ACTUAL,
    actualSpouse: ACTUAL_SPOUSE,
  } = clientData;

  if (clientHasSpouse) {
    return (
      ((BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) * (ACTUAL - BENCHMARK)) /
        BENCHMARK +
      ((BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (ACTUAL_SPOUSE - BENCHMARK_SPOUSE)) /
        BENCHMARK_SPOUSE
    ).toFixed(4);
  }
};

// CASH RESERVES:
// =IF(AND(IN_weight>0,B19<>"N/A"),IFERROR((C19/(C19+H19))*(D19-C19),0)+IFERROR((H19/(C19+H19))*(J19-H19),0),"N/A")

// ((BENCHMARK/(BENCHMARK+BENCHMARK_SPOUSE))        * (ACTUAL-BENCHMARK) +
// ((BENCHMARK_SPOUSE/(BENCHMARK+BENCHMARK_SPOUSE)) * (ACTUAL_SPOUSE-BENCHMARK_SPOUSE)
export const calculateCashReserveDelta = (
  clientHasSpouse = false,
  clientData
) => {
  const {
    benchmark: BENCHMARK,
    benchmarkSpouse: BENCHMARK_SPOUSE,
    actual: ACTUAL,
    actualSpouse: ACTUAL_SPOUSE,
  } = clientData;
  if (clientHasSpouse) {
    return (
      (BENCHMARK / (BENCHMARK + BENCHMARK_SPOUSE)) * (ACTUAL - BENCHMARK) +
      (BENCHMARK_SPOUSE / (BENCHMARK + BENCHMARK_SPOUSE)) *
        (ACTUAL_SPOUSE - BENCHMARK_SPOUSE)
    ).toFixed(4);
  }
  // else:
};

// TESTING CODE:
const cashFlowData = require("../../../dummy_data/cashflow_benchmark_data.ts");
const investmentData = require("../../../dummy_data/investment_benchmark_data.ts");
const contingencyData = require("../../../dummy_data/contingency_benchmark_data.ts");
const clientData = { cashFlowData, investmentData, contingencyData };
const benchmarkingProfile = require("../../../dummy_data/benchmarking_profile.ts");

// let score = calculateScore("initial", clientData, benchmarkingProfile);
// console.log(score);

// console.log(calculateCashFlowDeltas("initial", cashFlowData));
// console.log(calculateCashDelta("initial", true, cashFlowData.income));

// console.log(calculateExpensesDelta("initial", true, cashFlowData.tax));
// console.log(calculateCashDelta("initial", true, cashFlowData.savings.super));
// console.log(
//   calculateCashDelta("initial", true, cashFlowData.savings.investments)
// );
// console.log(calculateCashDelta("initial", true, cashFlowData.savings.offset));
// console.log(calculateExpensesDelta("initial", true, cashFlowData.livingCosts));
// console.log(calculateExpensesDelta("initial", true, cashFlowData.capitalCosts));
// console.log(calculateExpensesDelta("initial", true, cashFlowData.debt));

// TESTS: is calculateExpensesDelta just -calculateCashDelta:
// console.log(-calculateCashDelta("initial", true, cashFlowData.tax));
// console.log(-calculateCashDelta("initial", true, cashFlowData.livingCosts));
// console.log(-calculateCashDelta("initial", true, cashFlowData.capitalCosts));
// console.log(-calculateCashDelta("initial", true, cashFlowData.debt));

//console.log(calculateInvestmentDeltas(investmentData));
//console.log(calculateContingencyDeltas(contingencyData));

// benchmarkType: "initial" || "midYear":
async function handler(req, res) {
  if (req.method === "POST") {
    const {
      client,
      assumptions,
      philosophies,
      benchmarkProfile,
      benchmarkType,
    } = req.body;
    // const reshapedAssumptions = DataManager.reshapeAssumtions(assumptions);
    // let score = calculateScore(benchmarkType, client, benchmarkProfile);
    let score = calculateScore(benchmarkType, clientData, benchmarkingProfile);
    res.json(score);
  }
}

export default handler;
