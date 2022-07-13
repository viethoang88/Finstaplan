import Formulae from "./Formulae";
// const Formulae = {
//   compoundInterest: (amount, rate, num_periods) => {
//     return 1;
//   },
// };
export default class DataCalculator {
  public fv(amount, rate, num_periods) {
    // return Formulae.futureValueAnnuity(amount, rate, num_periods);
    return Formulae.compoundInterest(amount, rate, num_periods);
  }
  public fvs(amount, rate, num_periods) {
    const results = [];
    for (let i = 0; i <= num_periods; i++) {
      results.push(Formulae.compoundInterest(amount, rate, i));
    }
    return results;
  }

  private validateIsNumber(num, _else, op) {
    return !Number.isNaN(Number(num)) ? op(num) : _else;
  }
  public getGraphData(
    numYears,
    aggSumForAssets,
    aggSumForLiabilities,
    aggSumForExpenses,
    cpi,
    taxToBeDeductedFromInvestmentReturns,
    familyHomeValue,
    {
      preRate = 3,
      postRate = 3,
      numYearsUntilEnough,
      monthlyContributions,
      rpDelta,
      rentDelta,
      monthlyExpensesDelta,
    }
  ) {
    let ne = numYearsUntilEnough;
    // console.log(
    //   "---------------- IN GET GRAPH DATA OF DATACALC --------------"
    // );
    // console.log(numYearsUntilEnough);
    // console.log(ne);
    // console.log(aggSumForAssets);
    // console.log(familyHomeValue);
    // console.log(aggSumForExpenses);
    // console.log(aggSumForLiabilities);
    // console.log({
    //   preRate,
    //   postRate,
    //   numYearsUntilEnough,
    //   monthlyContributions,
    //   rpDelta,
    //   rentDelta,
    //   monthlyExpensesDelta,
    // });
    // console.log(taxToBeDeductedFromInvestmentReturns);
    // console.log(preRate);
    // console.log(postRate);

    // console.log("------NUM YEARS------");
    // console.log(numYears);

    const CPI = cpi / 100;
    const initialNetWorth =
      aggSumForAssets - familyHomeValue - (ne === 0 ? aggSumForLiabilities : 0);

    // const initialContributions =
    //   ne <= 0
    //     ? 0
    //     : this.validateIsNumber(monthlyContributions, 0, (num) => num * 12);

    const initialExpenses =
      aggSumForExpenses -
      this.validateIsNumber(monthlyExpensesDelta, 0, (num) => num * 12);
    // Year / Growth / Expenses / Net Worth
    const results = new Array();

    const expensesResults = new Array();
    const netWorthsResults = new Array();

    expensesResults.push(-1 * initialExpenses);
    netWorthsResults.push(initialNetWorth);

    results.push([0, 0, -1 * initialExpenses, initialNetWorth]);

    // year 0 is when the downscaling of rent and property occurs:
    //this.validateIsNumber(rpDelta, 0, (num) => num);
    //this.validateIsNumber(monthlyExpensesDelta, 0, (num) => num * 12)

    // console.log("--------INITIAL VALUES ----------");
    // console.log(aggSumForExpenses);
    // console.log(monthlyExpensesDelta * 12);
    // console.log(results);

    for (let i = 1; i <= numYears; i++) {
      let growthRate = (ne <= 0 ? postRate : preRate) / 100;
      let downScalingHome = 0;
      let downScalingRent = 0;

      if (ne === 0) {
        downScalingHome = this.validateIsNumber(rpDelta, 0, (num) =>
          Formulae.compoundInterest(num, CPI, i)
        );
        downScalingRent = this.validateIsNumber(
          rentDelta,
          0,
          (num) => num * 12
        );
        // console.log("------RP/RENT DELTAS AT ENOUGH YEAR 0 -------");
        // console.log(rpDelta);
        // console.log(downScalingHome);
      }

      let contributions =
        ne <= 0
          ? 0
          : this.validateIsNumber(monthlyContributions, 0, (num) => num * 12);

      const currentExpenses = -1 * results[i - 1][2] - downScalingRent;

      if (Number.isNaN(Number(currentExpenses))) return;

      // const expenses = Formulae.futureValueAnnuity(currentExpenses, CPI, 1);
      const expenses = currentExpenses * (1 + CPI);

      const currentAssets = results[i - 1][3] + contributions + downScalingHome;
      // Formulae.compoundInterest(contributions / 12, 12, growthRate);
      const _currentAssets = currentAssets >= 0 ? currentAssets : 0;

      if (Number.isNaN(Number(currentAssets - currentExpenses))) return;

      // const nextYearAssets = Formulae.futureValueAnnuity(
      //   currentAssets - currentExpenses,
      //   growthRate,
      //   1
      // );

      const nextYearAssets =
        (_currentAssets -
          (ne <= 0 ? currentExpenses : 0) -
          (ne === 0 && i !== 1 ? aggSumForLiabilities : 0)) *
        (1 + growthRate);

      const growth =
        (_currentAssets - (ne <= 0 ? currentExpenses : 0)) * growthRate;
      const _growth = growth >= 0 ? growth : 0;

      const netWorth = nextYearAssets;
      // - (growth * taxToBeDeductedFromInvestmentReturns);
      if (i <= 7) {
        console.log("MONTHLY EXPENSES DELTA");
        console.log(
          this.validateIsNumber(monthlyExpensesDelta, 0, (num) => num * 12)
        );
        console.log("CURRENT EXPENSES");
        console.log(currentExpenses);
        console.log("EXPENSES AFTER CPI");
        console.log(expenses);
        console.log("----USING GROWTH RATE------");
        console.log(growthRate);
        console.log("---WITH CONTRIBUTIONS----");
        console.log(contributions);
        console.log("--------VALUES--------");
        console.log(currentAssets);
        console.log(nextYearAssets);
        console.log(growth);
        console.log(netWorth);
        console.log(ne);
      }

      ne -= 1;
      results.push([i, _growth, -1 * expenses, netWorth]);
      expensesResults.push(-1 * expenses);
      netWorthsResults.push(netWorth);
    }
    return {
      graphData: results,
      expenses: expensesResults,
      netWorths: netWorthsResults,
    };
  }

  /* Net worth
  // initial net worth = total assets - assets.familyHome - all liabilities
  //                   - future value of that at growth of the portfolio - tax
  // - Current Net worth = currentNetValue - expenses
  // - Growth = (current net worth) * rate * (1 - taxRate)
  */
  public getNetWorths(
    numYears,
    preRate,
    postRate,
    aggSumForAssets,
    aggSumForLiabilities,
    fvsOfExpenses,
    familyHomeValue,
    taxToBeDeductedFromInvestmentReturns,
    numPeriods
  ) {
    if (numPeriods === 0) {
      const initialNetWorth =
        aggSumForAssets -
        aggSumForLiabilities -
        (!Number.isNaN(Number(familyHomeValue)) ? familyHomeValue : 0);
      const results = [[initialNetWorth, 0]];
      for (let i = 1; i <= numYears; i++) {
        const currentNetWorth =
          this.fv(results[i - 1][0], postRate, 1) - fvsOfExpenses[i - 1];
        const growth =
          currentNetWorth *
          postRate *
          (1 - taxToBeDeductedFromInvestmentReturns);
        const netWorthAfterGrowth = currentNetWorth + growth;
        results.push([netWorthAfterGrowth, growth]);
      }
      return results;
    } else {
      let np = numPeriods;
      const initialNetWorth =
        aggSumForAssets -
        (!Number.isNaN(Number(familyHomeValue)) ? familyHomeValue : 0);
      const results = [[initialNetWorth, 0]];
      for (let i = 1; i <= numYears; i++) {
        const rate = np <= 0 ? postRate : preRate;

        let currentNetWorth =
          this.fv(results[i - 1][0], rate, 1) - fvsOfExpenses[i - 1];
        if (np === 0) currentNetWorth -= aggSumForLiabilities;
        const growth =
          currentNetWorth * rate * (1 - taxToBeDeductedFromInvestmentReturns);
        const netWorthAfterGrowth = currentNetWorth + growth;
        results.push([netWorthAfterGrowth, growth]);
        np -= 1;
      }
      return results;
    }
  }
}
