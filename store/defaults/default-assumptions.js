export const defaultBands = [
  {
    id: "0",
    portfolio: "Cash",
    low: 0,
    high: 30,
  },
  {
    id: "1",
    portfolio: "Conservative",
    low: 30,
    high: 50,
  },
  {
    id: "2",
    portfolio: "Mod Conservative",
    low: 50,
    high: 70,
  },
  {
    id: "3",
    portfolio: "Mod Growth",
    low: 70,
    high: 85,
  },
  {
    id: "4",
    portfolio: "Growth",
    low: 70,
    high: 85,
  },
  {
    id: "5",
    portfolio: "High Growth",
    low: 85,
    high: 100,
  },
];

export const returnPercents = {
  Cash: 1,
  "Domestic Fixed Interest": 3,
  "International Fixed Interest": 3,
  "Domestic Property": 5,
  "International Property": 5,
  Alternative: 6,
  "Domestic Equity": 7,
  "International Equity": 7,
};

export const portfolios = [
  {
    id: "0",
    portfolioName: "Cash",
    investmentTerm: 0.5,
    expectedGrowth: 2,
    probabilityNegativeReturn: 0,
    allocations: {
      Cash: 75,
      "Domestic Fixed Interest": 25,
      "International Fixed Interest": 0,
      "Domestic Property": 0,
      "International Property": 0,
      Alternative: 0,
      "Domestic Equity": 0,
      "International Equity": 0,
    },
    bands: {
      id: "0",
      portfolio: "Cash",
      low: 0,
      high: 0,
    },
  },
  {
    id: "2",
    portfolioName: "Conservative",
    investmentTerm: 1.5,
    expectedGrowth: 3,
    probabilityNegativeReturn: 6.7,
    allocations: {
      Cash: 17.2,
      "Domestic Fixed Interest": 16,
      "International Fixed Interest": 26,
      "Domestic Property": 0,
      "International Property": 0,
      Alternative: 14,
      "Domestic Equity": 12.8,
      "International Equity": 14,
    },
    bands: {
      id: "1",
      portfolio: "Conservative",
      low: 30,
      high: 50,
    },
  },
  {
    id: "3",
    portfolioName: "Mod Conservative",
    investmentTerm: 3,
    expectedGrowth: 4,
    probabilityNegativeReturn: 13,
    allocations: {
      Cash: 7.6,
      "Domestic Fixed Interest": 11.25,
      "International Fixed Interest": 20.25,
      "Domestic Property": 0,
      "International Property": 0,
      Alternative: 14.5,
      "Domestic Equity": 19.65,
      "International Equity": 26.75,
    },
    bands: {
      id: "2",
      portfolio: "Mod Conservative",
      low: 50,
      high: 70,
    },
  },
  {
    id: "4",
    portfolioName: "Mod Growth",
    investmentTerm: 4.5,
    expectedGrowth: 5,
    probabilityNegativeReturn: 17,
    allocations: {
      Cash: 7.6,
      "Domestic Fixed Interest": 9.5,
      "International Fixed Interest": 14.5,
      "Domestic Property": 0,
      "International Property": 0,
      Alternative: 14.5,
      "Domestic Equity": 23.9,
      "International Equity": 30,
    },
    bands: {
      id: "3",
      portfolio: "Mod Growth",
      low: 70,
      high: 85,
    },
  },
  {
    id: "5",
    portfolioName: "Growth",
    investmentTerm: 6,
    expectedGrowth: 6,
    probabilityNegativeReturn: 19.6,
    allocations: {
      Cash: 2,
      "Domestic Fixed Interest": 5.75,
      "International Fixed Interest": 8.75,
      "Domestic Property": 0,
      "International Property": 0,
      Alternative: 15,
      "Domestic Equity": 21.75,
      "International Equity": 46.75,
    },
    bands: {
      id: "5",
      portfolio: "Growth",
      low: 85,
      high: 90,
    },
  },
  {
    id: "6",
    portfolioName: "High Growth",
    investmentTerm: 8,
    expectedGrowth: 7,
    probabilityNegativeReturn: 22.2,
    allocations: {
      Cash: 2,
      "Domestic Fixed Interest": 4,
      "International Fixed Interest": 4,
      "Domestic Property": 0,
      "International Property": 0,
      Alternative: 13,
      "Domestic Equity": 24,
      "International Equity": 53,
    },
    bands: {
      id: "6",
      portfolio: "High Growth",
      low: 90,
      high: 100,
    },
  },
];

export const allocations = [
  {
    id: "0",
    assetClass: "Cash",
    "High Growth": 2,
    Growth: 2,
    "Mod Growth": 7.6,
    "Mod Conservative": 10,
    Conservative: 17.2,
    Cash: 75,
    returnPercent: 1,
  },
  {
    id: "1",
    assetClass: "Domestic Fixed Interest",
    "High Growth": 4,
    Growth: 5.75,
    "Mod Growth": 9.5,
    "Mod Conservative": 11.25,
    Conservative: 16,
    Cash: 15,
    returnPercent: 3.5,
  },
  {
    id: "2",
    assetClass: "International Fixed Interest",
    "High Growth": 4,
    Growth: 8.75,
    "Mod Growth": 14.5,
    "Mod Conservative": 20.25,
    Conservative: 26,
    Cash: 10,
    returnPercent: 3.5,
  },
  {
    id: "3",
    assetClass: "Domestic Property",
    "High Growth": 0,
    Growth: 0,
    "Mod Growth": 0,
    "Mod Conservative": 0,
    Conservative: 0,
    Cash: 0,
    returnPercent: 6.25,
  },
  {
    id: "4",
    assetClass: "International Property",
    "High Growth": 0,
    Growth: 0,
    "Mod Growth": 0,
    "Mod Conservative": 0,
    Conservative: 0,
    Cash: 0,
    returnPercent: 6.25,
  },
  {
    id: "5",
    assetClass: "Alternative",
    "High Growth": 13,
    Growth: 15,
    "Mod Growth": 14.5,
    "Mod Conservative": 14.5,
    Conservative: 14,
    Cash: 0,
    returnPercent: 7,
  },
  {
    id: "6",
    assetClass: "Domestic Equity",
    "High Growth": 24,
    Growth: 21.75,
    "Mod Growth": 18.9,
    "Mod Conservative": 17.25,
    Conservative: 12.8,
    Cash: 0.0,
    returnPercent: 7.5,
  },
  {
    id: "7",
    assetClass: "International Equity",
    "High Growth": 53,
    Growth: 46.75,
    "Mod Growth": 35,
    "Mod Conservative": 26.75,
    Conservative: 14,
    Cash: 0.0,
    returnPercent: 7.5,
  },
];
