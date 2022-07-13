export const assumptions = {
  growthRate: {
    CPI: 2,
    livingExpense: 1,
    education: 4,
    GACPI: 2.5,
    depreciatingAsset: -15,
  },
  investmentReturns: {
    income: 50,
    expenses: 50,
  },
  reductions: {
    marketValue: 15,
    livingExpenseInDeathOfPartner: 25,
    livingExpenseInRetirement: 20,
    other: 0,
  },
  taxation: {
    taxOnIncomeGrowth: 30,
    taxOnCapitalGrowth: 10,
    taxOnFutureCapitalGrowth: 15,
    taxOnLumpSumInsurance: 10,
  },
  other: {
    mortalityAge: 95,
    yearsOnLevelPremium: 15,
    maximumAgeForIncomeProtection: 70,
    maximumAgeToFundChildren: 25,
    retirementAge: 70,
    // allocate 25% to behaviour and 75% to goals
    behaviourModificationLoading: 25, // for goals
  },
};
