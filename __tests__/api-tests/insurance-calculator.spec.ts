// Unit(s) under test:
import {
  getTaxToBeDeductedFromInvestmentReturns,
  insuranceCalculator,
  calculateAge,
  getMinAgeFromClientData,
  getMinAge,
  calculateAssumptions,
  getNPV,
  getNPVone,
  getAllLiabilities,
  usingPython,
  handler,
} from "../../pages/api/calculations/insurance";
import DataManager from "../../classes/DataManager";

// Test data:
import { tjaart } from "../../dummy_data/client-examples";
import { assumptions } from "../../dummy_data/assumptions";
import { philosophies } from "../../dummy_data/philosophies";

// Can be top-level, in any describe
//beforeAll(() => {})
//beforeEach(() => {})
//afterEach(() => {})
//afterAll(() => {})
const testClients = [tjaart];
const testClient = testClients[0];
let dataManager;
// let testClient;
// beforeAll(() => {
//   dataManager = new DataManager(testClient);
// });
describe("test NPV", () => {
  it("correctly calculates NPV", () => {
    const incomeFlows = [123500];
    for (let i = 1; i <= 27; i++) {
      const inc = incomeFlows[i - 1] * (1 + 0.02);
      incomeFlows.push(inc);
    }
    const npvs = [];
    console.log(getNPVone(123500, 0.045, 0.02, 28));
  });
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
  // 1) No children, no partner
  it("Outputs the correct values when there are no children and no partner", () => {
    const {
      taxToBeDeductedFromInvestmentReturns,
      yearsUntilRetirementForYoungestPartner,
      yearsUntilMortalityPrimary,
    } = calculateAssumptions(clientData, assumptions);
    expect(taxToBeDeductedFromInvestmentReturns).toBe("0.1317");
    expect(yearsUntilRetirementForYoungestPartner).toBe(
      assumptions.other.retirementAge - 40
    );
    expect(yearsUntilMortalityPrimary).toBe(
      assumptions.other.mortalityAge - 40
    );
  });
  // 2) Children (one), no partner
  it("Outputs the correct values when there is one child and no partner", () => {
    clientData.hasChildren = true;
    clientData.primary.dateOfBirth = "Mon Jan 1 2001"; // 20 years old
    clientData.children = [
      { firstName: "lala", dateOfBirth: "Mon Jan 1 2021" }, // not 1 year old yet.
    ];
    const {
      taxToBeDeductedFromInvestmentReturns,
      yearsUntilRetirementForYoungestPartner,
      yearsUntilMortalityPrimary,
      numYearsToSupportChildren,
    } = calculateAssumptions(clientData, assumptions);
    expect(taxToBeDeductedFromInvestmentReturns).toBe("0.1317");
    expect(yearsUntilRetirementForYoungestPartner).toBe(
      assumptions.other.retirementAge - 20
    );
    expect(yearsUntilMortalityPrimary).toBe(
      assumptions.other.mortalityAge - 20
    );
    expect(numYearsToSupportChildren.length).toBe(1);
    expect(numYearsToSupportChildren[0][1]).toBe(25);
  });
  // 2.1) Children (5), no partner:
  it("Outputs the correct values when there is many childen and no partner", () => {
    clientData.hasChildren = true;
    clientData.primary.dateOfBirth = "Mon Jan 1 1972"; // 49 years old
    clientData.children = [
      { firstName: "lala", dateOfBirth: "Mon Jan 1 2021" }, // not 1 year old yet.
      { firstName: "lili", dateOfBirth: "Mon Jan 1 2020" }, // 1
      { firstName: "lolo", dateOfBirth: "Mon Jan 1 1996" }, // 25 years old
      { firstName: "lala", dateOfBirth: "Mon Jan 1 2005" }, // 16
      { firstName: "lyly", dateOfBirth: "Mon Dec 1 2003" }, // 17 (hasn't turned 18 yet)
    ];
    const yearsToSupport = [25, 24, 0, 9, 8];
    const {
      taxToBeDeductedFromInvestmentReturns,
      yearsUntilRetirementForYoungestPartner,
      yearsUntilMortalityPrimary,
      numYearsToSupportChildren,
    } = calculateAssumptions(clientData, assumptions);
    expect(taxToBeDeductedFromInvestmentReturns).toBe("0.1317");
    expect(yearsUntilRetirementForYoungestPartner).toBe(
      assumptions.other.retirementAge - 49
    );
    expect(yearsUntilMortalityPrimary).toBe(
      assumptions.other.mortalityAge - 49
    );
    expect(numYearsToSupportChildren.length).toBe(5);
    for (let i = 0; i < numYearsToSupportChildren.length; i++) {
      expect(numYearsToSupportChildren[i][1]).toBe(yearsToSupport[i]);
    }
  });
  // 3) No children, partner
  it("Outputs the correct values when there are no childen and a partner", () => {});
  // 4) Children, partner
  it("Outputs the correct values when there is childen and a partner", () => {
    clientData.hasChildren = true;
    clientData.hasPartner = true;
    clientData.primary.dateOfBirth = "Mon Jan 1 1942"; // 79 years old
    clientData.partner = { dateOfBirth: "Mon Jan 1 1972", firstName: "lulu" }; // 49 years old
    clientData.children = [
      { firstName: "lala", dateOfBirth: "Mon Jan 1 2021" }, // not 1 year old yet.
      { firstName: "lili", dateOfBirth: "Mon Dec 1 1996" }, // 24
    ];
    const {
      taxToBeDeductedFromInvestmentReturns,
      yearsUntilRetirementForYoungestPartner,
      yearsUntilMortalityPrimary,
      yearsUntilMortalityPartner,
      numYearsToSupportChildren,
    } = calculateAssumptions(clientData, assumptions);

    expect(yearsUntilRetirementForYoungestPartner).toBe(
      assumptions.other.retirementAge - 49
    );
    expect(yearsUntilMortalityPrimary).toBe(
      assumptions.other.mortalityAge - 79
    );
    expect(yearsUntilMortalityPartner).toBe(
      assumptions.other.mortalityAge - 49
    );
    expect(numYearsToSupportChildren.length).toBe(2);
    expect(numYearsToSupportChildren[0][1]).toBe(25);
    expect(numYearsToSupportChildren[1][1]).toBe(1);
  });
});

describe("getAllLiabilities tests", () => {
  it("does stuff", () => {
    // const newAssumptions = {
    //   ...assumptions,
    //   ...calculateAssumptions(tjaart, assumptions),
    // };
    // const d = getAllLiabilities(tjaart, newAssumptions, philosophies);

    const d = insuranceCalculator(testClient, philosophies, assumptions);
    // console.log(typeof d);
    // console.log(d);
    // // console.log(d.index_arr);
    // // console.log(d.index_arr.length);
    // // console.log(d.iloc({ rows: ["0:"] }).value.data);

    // d.print();

    // console.log(d.arraySync());
    // console.log(d.loc({ rows: [0] }).values);
    // console.log(d.loc({ columns: ["type"] }).tensor);
    // console.log(d.loc({ columns: ["type"] }).values);
    // console.log(d.loc({ columns: ["class"] }).values);
  });
});

describe("Insurance Calculator tests", () => {
  describe("Basic helper functions", () => {
    it("getTaxToBeDeductedFromInvestmentReturns works", function () {
      const taxOnIncomeGrowth = 0.3;
      const taxOnCapitalGrowth = 0.1;
      const taxOnFutureCapitalGrowth = 0.15;
      const investmentReturnsIncome = 0.5;
      const investmentReturnsExpense = 0.5;
      expect(
        getTaxToBeDeductedFromInvestmentReturns(
          taxOnIncomeGrowth,
          investmentReturnsIncome,
          taxOnFutureCapitalGrowth,
          investmentReturnsExpense
        )
      ).toEqual("0.2250");
    });

    it("Correctly calculates the age of primary and partner", () => {
      const testValidation = testClient.testValidation;
      const primaryDoB = new Date(testClient.primary.dateOfBirth);
      expect(calculateAge(primaryDoB)).toBe(testValidation.primaryAge);
      if (testClient.hasPartner) {
        const partnerDoB = new Date(testClient.partner.dateOfBirth);
        expect(calculateAge(partnerDoB)).toBe(testValidation.partnerAge);
      }
    });

    // NOTE: this test will break when any fake persons birthday occurs:
    it("Correctly returns the min age of primary and partner", () => {
      expect(getMinAge(40, 39)).toBe(39);
      expect(getMinAge(39, 40)).toBe(39);
      expect(getMinAge(40, 40)).toBe(40);

      const bigAgeDifferencePrimaryOlder = getMinAgeFromClientData({
        hasPartner: true,
        primary: { dateOfBirth: new Date("Fri Jan 1 1940") }, // 81
        partner: { dateOfBirth: new Date("Mon Dec 21 2001") }, // 19
      });
      const noPartnerWithPartnerData = getMinAgeFromClientData({
        hasPartner: false,
        primary: { dateOfBirth: new Date("Mon Jan 1 1981") }, // 40
        partner: { dateOfBirth: new Date("Mon Dec 21 2001") }, // 19
      });
      const noPartner = getMinAgeFromClientData({
        hasPartner: false,
        primary: { dateOfBirth: new Date("Mon Jan 1 1981") }, // 40
      });
      const smallAgeDifferencePartnerOlder = getMinAgeFromClientData({
        hasPartner: true,
        primary: { dateOfBirth: new Date("Mon Jan 1 1981") }, // 40
        partner: { dateOfBirth: new Date("Mon Jan 1 1982") }, // 39
      });

      expect(bigAgeDifferencePrimaryOlder).toBe(19);
      expect(noPartner).toBe(40);
      expect(noPartnerWithPartnerData).toBe(40);
      expect(smallAgeDifferencePartnerOlder).toBe(39);
    });

    it("Module correctly sets up calculated assumptions", function () {
      // Years until retirement for youngest partner: 39
      // Years to support children:
      // Tax to be deducted from investment returns: 0.2550
      // Net Investment return (TBA -- rate comes from portfolio)
    });

    it("Correctly sets up refs to expenses", () => {
      const testValidation = testClient.testValidation;
      const dm = new DataManager(testClient);
      const expensesRef = dm.getRefsByType("expenses");
      let totalExpenses = 0;
      expect(Object.keys(expensesRef).length).toBe(
        testValidation.numPeopleWithExpenses
      );
      for (let person of testValidation.people) {
        if (expensesRef[person]) {
          totalExpenses += expensesRef[person].length;
          expect(expensesRef[person].length).toBe(
            testValidation.expensesByPerson[person]
          );
        }
      }
      expect(totalExpenses).toBe(testValidation.numExpenses);
    });

    it("Correctly sums all expenses", () => {
      const dm = new DataManager(testClient);
      const testValidation = testClient.testValidation;
      const totalExpenses = dm.getAggregateSumForSomeCategory("expenses");
      expect(totalExpenses).toBe(testValidation.totalExpenses);
    });

    it("Correctly finds expenses in the joint section", () => {
      const testValidation = testClient.testValidation;
      const newTestClient = { ...testClient };
      const newJoint = { ...testClient.joint };
      const newExpenseValues = [50100.5, 125000, 2500.25];
      newJoint.expenses = [
        {
          class: "investmentPropertyUpkeepExpense",
          type: "investmentExpense",
          value: newExpenseValues[0],
        },
        {
          class: "bankFeesExpense",
          type: "feesAndChargesExpense",
          value: newExpenseValues[1],
        },
        {
          class: "travelAndVacationsExpense",
          type: "leisureExpense",
          value: newExpenseValues[2],
        },
      ];
      newTestClient.joint = newJoint;
      const dm = new DataManager(newTestClient);
      const totalExpenses = dm.getAggregateSumForSomeCategory("expenses");
      expect(totalExpenses).toBe(
        testValidation.totalExpenses +
          newExpenseValues.reduce((acc, nextVal) => acc + nextVal, 0)
      );
    });

    it("Correctly sets up refs to liabilities", () => {
      const testValidation = testClient.testValidation;
      const dm = new DataManager(testClient);
      const liabilitiesRef = dm.getRefsByType("liabilities");
      let total = 0;
      expect(Object.keys(liabilitiesRef).length).toBe(
        testValidation.numPeopleWithLiabilities
      );
      for (let person of testValidation.people) {
        if (liabilitiesRef[person]) {
          total += liabilitiesRef[person].length;
          expect(liabilitiesRef[person].length).toBe(
            testValidation.liabilitiesByPerson[person]
          );
        }
      }
      expect(total).toBe(testValidation.numLiabilities);
    });

    it("Correctly sums all liabilities", () => {
      const dm = new DataManager(testClient);
      const testValidation = testClient.testValidation;
      const totalExpenses = dm.getAggregateSumForSomeCategory("liabilities");
      expect(totalExpenses).toBe(testValidation.totalLiabilities);
    });

    it("Correctly finds liabilities in the joint section", () => {
      const testValidation = testClient.testValidation;
      const newTestClient = { ...testClient };
      const newJoint = { ...testClient.joint };
      newJoint.liabilities = [
        {
          class: "marginLoanOnShares",
          type: "otherLoans",
          value: 65000,
        },
      ];
      newTestClient.joint = newJoint;
      const dm = new DataManager(newTestClient);
      const totalLiabilities = dm.getAggregateSumForSomeCategory("liabilities");
      expect(totalLiabilities).toBe(testValidation.totalLiabilities + 65000);
    });

    it("Correctly sets up refs to assets", () => {
      const testValidation = testClient.testValidation;
      const dm = new DataManager(testClient);
      const assetsRef = dm.getRefsByType("assets");
      let total = 0;
      expect(Object.keys(assetsRef).length).toBe(
        testValidation.numPeopleWithAssets
      );
      for (let person of testValidation.people) {
        if (assetsRef[person]) {
          total += assetsRef[person].length;
          expect(assetsRef[person].length).toBe(
            testValidation.assetsByPerson[person]
          );
        }
      }
      expect(total).toBe(testValidation.numAssets);
    });

    it("Accurately sums the value of assets", () => {
      const dm = new DataManager(testClient);
      const testValidation = testClient.testValidation;
      const totalAssets = dm.getAggregateSumForSomeCategory("assets");
      expect(totalAssets).toBe(testValidation.totalAssets);
    });

    it("Correctly finds assets in the joint section", () => {
      const testValidation = testClient.testValidation;
      const newTestClient = { ...testClient };
      const newJoint = { ...testClient.joint };
      newJoint.assets = [
        {
          class: "fixedInterestInvestment",
          type: "otherInvestments",
          value: 105000,
        },
      ];
      newTestClient.joint = newJoint;
      const dm = new DataManager(newTestClient);
      const totalAssets = dm.getAggregateSumForSomeCategory("assets");
      expect(totalAssets).toBe(testValidation.totalAssets + 105000);
    });

    it("Correctly sets up refs to incomes", () => {
      const testValidation = testClient.testValidation;
      const dm = new DataManager(testClient);
      const incomesRef = dm.getRefsByType("incomes");
      let total = 0;
      expect(Object.keys(incomesRef).length).toBe(
        testValidation.numPeopleWithIncomes
      );
      for (let person of testValidation.people) {
        if (incomesRef[person]) {
          total += incomesRef[person].length;
          expect(incomesRef[person].length).toBe(
            testValidation.incomesByPerson[person]
          );
        }
      }
      expect(total).toBe(testValidation.numIncomes);
    });

    it("Accurately sums the value of incomes", () => {
      const dm = new DataManager(testClient);
      const testValidation = testClient.testValidation;
      const totalIncomes = dm.getAggregateSumForSomeCategory("incomes");
      expect(totalIncomes).toBe(testValidation.totalIncomes);
    });

    it("Correctly finds incomes in the joint section", () => {
      const testValidation = testClient.testValidation;
      const newTestClient = { ...testClient };
      const newJoint = { ...testClient.joint };
      const newIncomeValues = [25000.72, 60000, 125000.22];
      newJoint.incomes = [
        {
          class: "rentalIncome",
          type: "investmentIncome",
          value: newIncomeValues[0],
        },
        {
          class: "otherIncome",
          type: "personalIncome",
          value: newIncomeValues[1],
        },
        {
          class: "investmentIncome",
          type: "investmentIncome",
          value: newIncomeValues[2],
        },
      ];
      newTestClient.joint = newJoint;
      const dm = new DataManager(newTestClient);
      const totalIncomes = dm.getAggregateSumForSomeCategory("incomes");
      expect(totalIncomes).toBe(
        testValidation.totalIncomes +
          newIncomeValues.reduce((acc, nextVal) => acc + nextVal, 0)
      );
    });
  });
});

describe("Using python script", () => {
  it("works", (done) => {
    // const pythonProcess = usingPython(tjaart);
    // pythonProcess.stdout.on("data", (data) => {
    //   console.log(data);
    //   done();
    // });
    // usingPython(tjaart).then((res) => {
    //   console.log(res);
    //   done();
    // });
  });
});
