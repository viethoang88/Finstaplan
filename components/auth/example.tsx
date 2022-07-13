// TPD: total and permanent disability
// IP: Income protection insurance
import dfd from "danfojs-node";
import _ from "lodash";

// Level vs. Stepped:
// - level (for at least x years -- assumption)
// - stepped

// expenses per year increase by CPI

// ASSUMPTIONS:
// - Tax to be deducted from investment returns, net investment return are functions
//   of other assumptions (calculate these on the fly)
const getTaxToBeDeductedFromInvestmentReturns = (
  taxOnIncomeGrowth,
  investmentReturnsIncome,
  taxOnFutureCapitalGrowth,
  investmentReturnsExpense
) =>
  taxOnIncomeGrowth * investmentReturnsIncome +
  taxOnFutureCapitalGrowth * investmentReturnsExpense;

// ((assets by class).dot(portfolioRatesByAssetClass)) * (1-taxToBeDeducted)
const getNetInvestmentReturn = (
  taxOnIncomeGrowth,
  investmentReturnsIncome,
  taxOnFutureCapitalGrowth,
  investmentReturnsExpense,
  portfolioRate, // ARRAY: function of asset classes
  assets // ARRAY: corresponding to pr classes
) => {
  const taxToBeDeductedFromInvestmentReturns =
    getTaxToBeDeductedFromInvestmentReturns(
      taxOnIncomeGrowth,
      investmentReturnsIncome,
      taxOnFutureCapitalGrowth,
      investmentReturnsExpense
    );
  const _portfolioRate = new dfd.Series(portfolioRate);
  const _assets = new dfd.Series(assets);
  return (
    _assets.mul(_portfolioRate) * (1 - taxToBeDeductedFromInvestmentReturns)
  );
};

// SET of offset classes for incomes/assets
// OTHER incomes for offset

// IF no dependents/spouse: on death --> living expenses => 0

// NOTE: every calculation for primary or partner is until mortality age
//       every calculation for children is until MaximumAgeToFundChildrensEducation
// - add up all legacies, change of housing/car, all liabilities, medical requirements
//   liabilities, etc.
//   -- see 73-74 income requirements tab excel.

// STEP 1: Find all liabilities (AND CAPITAL REQUIREMENTS TO COVER THEM)
//       : Joint, and for both partners
// - NOTE: add medicalRequirements, changeOfHousingCar ((24-25 philosophies table)) in event of
//   TPD or Trauma
// ## From philosophies - **Rows 10-16**: (advisor sets how much of different liability classes they want to
//    repay in the event of):
// - Life   (Death)
// - TPD    (Disability)
// - Trauma (Bad injury, stroke, heart-attack -- out of work for a period, will recover)

// STEP 2: Find all expenses for family -- which expenses stay and which go away
// - EXPENSES create INCOME REQUIREMENTS: See income requirements tab on excel
//   - one set of income requirements for TPD/Life/Trauma
// ## From philosophies - **Rows 18-20**
// - NOTE: ADD extraHelpRequired ((philosophies row 21)) to expenses in event of TPD.
// - e.g. $100,000 expenses pre-death, 100,000 * (1 - livingExpensesInDeath) ((from ASSUMPTION row 16))
//      => 75,000 UNTIL AGE OF RETIREMENT
//   => 75,000 * (1 - LivingExpenseInRetirement ((from ASSUMPTION row 17)))
//   - what capital amount is required to generate 75,000 a year for (a, x, y, ...) years.
//   - mortalityAge - livingPartners age for rest of expenses.
//   - x,y,z,...: variables for  number of children, FROM ASSUMPTION: MaximumAgeToFund
//     ChildrensEducation - children age (forall children).
// - Rental is an expense: if renting, increase rent cost by CPI
// - TODO: KEY POINT:
//   - Sum all expenses for every year until mortality age, then calculate NPV from now for
//     all expenses forever.
//   - For calculating NPV: formula is affected by portfolio choice re rate of growth
//     n is based on num year till death, decreasing n-1 forall years from 0.

// STEP 3: Find what assets & incomes are available to offset against liabilities and expenses from STEP 1-2
// - assets => lump sum -->
//   - USING Philosophies OFFSETS to reduce value of corresponding assets.
//     - ((Philosophies row 39-48))
//   - assumption is that assets are sold to cover liabilities and expenses on event of TPD/Life
// - incomes => reduce income expectation based on event (reduced for living spouse by
//   ((philosophies row 50))).

// STEP 4: find minimum coverage requirements pre-offsets.
// - e.g. I need $2mil of life cover
// - from minimumCOverage requirements pre-offset ((from philosophies row 32)) (cos trying to create liquidity)

// STEP FINAL: apply taxOnCapital ((from assumptions row 20)) to any lump sum for life cover and tpd sections
// - e.g. client needs $5mil (debts/future expenses-> income requirements)
//        - $4mil offsets    (assets being sold/income still generated/insurance cover/investment income, etc.)
//        - net amount required: $1mil - 1.1*$1mil => 1.1mil
const exampleClient = {
  age: 55,
  job: {
    title: "software engineer",
    income: 150000,
    incomeRate: "annual",
  },
  spouse: {
    age: 50,
    job: {
      title: "professor",
      income: 120000,
      incomeRate: "annual",
    },
  },
  joint: {
    assets: {
      familyHome: 5000000,
    },
    liabilities: {},
  },
  liabilities: {
    creditCardBalance: 7573,
    bankOverdraft: 5000,
    personalLoan: 10000,
    investmentLoan: 50000,
  },
  expenses: {
    financial: [
      {
        name: "loanRepayment",
        loanRepayment: 1233,
        frequency: "Quarterly",
        type: "living",
      },
    ],
    home: [
      {
        name: "mortgage",
        mortgage: 2000,
        frequency: "Monthly",
        type: "living",
      },
    ],
    living: [], // personal care and living expenses per garbrial budget
    professional: [],
    carAndTransport: [],
    insurance: [],
    leisure: [
      {
        holidays: 10000,
        frequency: "Bi-annually",
        type: "lifestyle",
      },
    ],
    feesAndCharges: [],
    investments: [
      {
        managedFunds: 50000,
        frequency: "Monthly",
        type: "savings",
      },
    ],
    children: [],
  },
  dependents: [
    {
      age: 20,
      name: "Timmy",
      legacyNominee: true,
      relationship: "both",
    },
    {
      age: 15,
      name: "Lisa",
      legacyNominee: true,
      relationship: "both",
    },
    {
      age: 80,
      name: "Midge",
      legacyNominee: false,
      relationship: "spouse",
    },
  ],
};

const phils = {
  retirementAge: 65,
};

const assumpts = {
  cpi: 3.5,
  maxAgeToFundChildEd: 25,
};

type INSURANCE_CALCULATION_OPTIONS = {
  PRINCIPAL_MORTALITY_AGE: number;
  SPOUSE_MORTALITY_AGE: number;
  PRINCIPAL_RETIREMENT_AGE: number;
  SPOUSE_RETIREMENT_AGE: number;
};

// type INSURANCE_CALCULATION_TYPES = {
//     INSURANCE_NEEDS: ,
//     OFFSETS: number,                   // years
// }

type EXPENSE_TYPES = {
  LIVING_EXPENSES: number;
  RENTAL: number;
};

const getMinAge = (primaryAge, partnerAge) =>
  primaryAge < partnerAge ? primaryAge : partnerAge;

// Living and personal expenses for either client or spouse:
// - client dies: n = retirementAgePhilosphy - partnerAge
// - partner dies: n = retirementAgePhilosphy - primaryAge

// Disability:
// - n = retirementAgePhilosophy - getMinAge(primaryAge, partnerAge);

const nFunctionMapper = (expenseType) => {
  const functions = {};

  return functions[expenseType];
};

const getYoungestRetirementAge = (primaryAge, partnerAge, philosophyAge) => {};

const getN = (client, philosophies, assumptions) => {
  const { age: principalAge, expenses } = client;
  const { age: partnerAge } = client.spouse;
  const { retirementAge } = philosophies;

  const {
    financial,
    home,
    living,
    professional,
    carAndTransport,
    insurance,
    leisure,
    feesAndCharges,
    investments,
  } = expenses;
};

// can call NPV with no n
