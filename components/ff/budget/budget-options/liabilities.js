export const liabilities = [
  {
    key: "0",
    label: "General Debt",
    data: "general",
    icon: "pi pi-fw pi-cog",
    selectable: false,
    children: [
      {
        key: "0-0",
        label: "Credit card balance",
        data: "creditCardBalance",
        icon: "pi pi-fw pi-credit-card",
        parentType: "generalDebt",
      },
      {
        key: "0-1",
        label: "Bank overdraft",
        data: "bankOverdraft",
        icon: "pi pi-fw pi-angle-double-down",
        parentType: "generalDebt",
      },
      {
        key: "0-2",
        label: "Other",
        data: "otherDebt",
        icon: "pi pi-fw pi-angle-double-down",
        parentType: "generalDebt",
      },
    ],
  },
  {
    key: "2",
    label: "Mortgage",
    data: "mortgage",
    icon: "pi pi-fw pi-calendar-minus",
    selectable: false,
    children: [
      {
        key: "1-0",
        label: "Residential Mortgage",
        icon: "pi pi-fw pi-calendar-minus",
        data: "residentialMortgage",
        parentType: "mortgage",
      },
      {
        key: "1-1",
        label: "Investment Mortgage",
        icon: "pi pi-fw pi-calendar-minus",
        data: "investmentMortgage",
        parentType: "mortgage",
      },
    ],
  },
  {
    key: "2",
    label: "Other Loans",
    data: "otherLoans",
    icon: "pi pi-fw pi-calendar-minus",
    selectable: false,
    children: [
      {
        key: "2-0",
        label: "Motor vehicle(s)",
        icon: "pi pi-fw pi-calendar-minus",
        data: "motorVehicleLoan",
        parentType: "otherLoans",
      },
      {
        key: "2-1",
        label: "Personal Loan",
        icon: "pi pi-fw pi-calendar-minus",
        data: "personalLoan",
        parentType: "otherLoans",
      },
      {
        key: "2-2",
        label: "Investment Loan",
        icon: "pi pi-fw pi-calendar-minus",
        data: "investmentLoan",
        parentType: "otherLoans",
      },
      {
        key: "2-3",
        label: "Margin Loan on Shares",
        icon: "pi pi-fw pi-calendar-minus",
        data: "marginLoanOnShares",
        parentType: "otherLoans",
      },
      {
        key: "2-4",
        label: "Investment Property",
        icon: "pi pi-fw pi-calendar-minus",
        data: "investmentPropertyLoan",
        parentType: "otherLoans",
      },
      {
        key: "2-5",
        label: "Retail store cards",
        icon: "pi pi-fw pi-calendar-minus",
        data: "retailStoreCardLoan",
        parentType: "otherLoans",
      },
      {
        key: "2-6",
        label: "Other Debt",
        icon: "pi pi-fw pi-calendar-minus",
        data: "otherLoan",
        parentType: "otherLoans",
      },
    ],
  },
];

export const liabilitiesTypes = [
  {
    children: [
      {
        label: "Estimated Tax on Insurance Payout",
        data: "estimatedTaxOnInsurancePayout",
      },
      { label: "Change of Housing/Car", data: "changeHousingOrCar" },
      { label: "Upfront Medical Costs", data: "medicalExpenses" },
      { label: "Lump Sum Legacy Payment", data: "lumpSumLegacy" },
    ],
  },
  ,
  ...liabilities,
]
  .flatMap((cat) => cat.children)
  .reduce((acc, next) => {
    acc[next?.data] = next;
    return acc;
  }, {});
