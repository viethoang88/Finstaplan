export const defaultIncomes = {
  initialValues: [
    {
      fieldKey: 0,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "0-0" },
      value: undefined,
    },
    {
      fieldKey: 1,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "0-1" },
      value: undefined,
    },
    {
      fieldKey: 2,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-1" },
      value: undefined,
    },
    {
      fieldKey: 3,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "0-3" },
      value: undefined,
    },
    {
      fieldKey: 4,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "0-4" },
      value: undefined,
    },
    {
      fieldKey: 5,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "0-5" },
      value: undefined,
    },
    {
      fieldKey: 6,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-0" },
      value: undefined,
    },
  ],
  selectedNodeKey: {
    0: "0-0",
    1: "0-1",
    2: "1-1",
    3: "0-3",
    4: "0-4",
    5: "0-5",
    6: "1-0",
  },
  selectedNodeData: {
    0: {
      value: "0-0",
      data: "salaryIncome",
      label: "Salary & Overtime",
      icon: "pi pi-fw pi-briefcase",
    },
    1: {
      value: "0-1",
      data: "bonusIncome",
      label: "Bonus",
      icon: "pi pi-fw pi-calendar-plus",
    },
    2: {
      value: "1-1",
      data: "investmentIncome",
      label: "Investment income (interest, dividends)",
      icon: "pi pi-fw pi-angle-double-up",
    },
    3: {
      value: "0-3",
      data: "pensionIncome",
      label: "Government Pensions & Allowances",
      icon: "pi pi-fw pi-envelope",
    },
    4: {
      value: "0-4",
      data: "superIncome",
      label: "Superannuation",
      icon: "pi pi-fw pi-envelope",
    },
    5: {
      value: "0-5",
      data: "socialSecurity",
      label: "Social Security",
      icon: "pi pi-fw pi-envelope",
    },
    6: {
      value: "1-0",
      data: "investmentPropertyIncome",
      label: "Rental income",
      icon: "pi pi-fw pi-angle-double-up",
    },
  },
};

export const defaultExpenses = {
  initialValues: [
    {
      fieldKey: 0,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "2-1" },
      value: undefined,
    },
    {
      fieldKey: 1,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-0" },
      value: undefined,
    },
    {
      fieldKey: 2,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-4" },
      value: undefined,
    },
    {
      fieldKey: 3,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-6" },
      value: undefined,
    },
    {
      fieldKey: 4,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-7" },
      value: undefined,
    },
    {
      fieldKey: 5,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "2-0" },
      value: undefined,
    },
    {
      fieldKey: 6,
      belongsTo: undefined,
      frequency: undefined,
      type: { value: "1-0" },
      value: undefined,
    },
  ],
  selectedNodeKey: {
    0: "2-1",
    1: "1-0",
    2: "1-4",
    3: "1-6",
    4: "1-7",
    5: "2-0",
    6: "0-1",
  },
  selectedNodeData: {
    0: {
      value: "2-1",
      data: "groceriesExpense",
      label: "Groceries",
      icon: undefined,
    },
    1: {
      value: "1-0",
      data: "residentialMortgageExpense",
      label: "Residential Mortgage",
      icon: "pi pi-fw pi-home",
    },
    2: {
      value: "1-4",
      data: "rentExpense",
      label: "Rent",
      icon: "pi pi-fw pi-home",
    },
    3: {
      value: "1-6",
      data: "homeEntertainmentExpense",
      label: "Phone, Mobile, Television and Internet",
      icon: "pi pi-fw pi-home",
    },
    4: {
      value: "1-7",
      data: "homeUtilitiesExpense",
      label: "Utilities (electricity, gas, water, etc)",
      icon: "pi pi-fw pi-home",
    },
    5: {
      value: "2-0",
      data: "generalLivingExpenses",
      label: "All General Living Expenses",
      icon: undefined,
    },
    6: {
      value: "0-1",
      data: "creditCardRepaymentsExpense",
      label: "Credit card repayments (Interest only)",
      icon: "pi pi-fw pi-cog",
    },
  },
};

export const defaultAssets = {
  initialValues: [],
  selectedNodeKey: {},
  selectedNodeData: {},
};

export const defaultLiabilities = {
  initialValues: [],
  selectedNodeKey: {},
  selectedNodeData: {},
};

export default {
  defaultIncomes,
  defaultExpenses,
  defaultAssets,
  defaultLiabilities,
};
