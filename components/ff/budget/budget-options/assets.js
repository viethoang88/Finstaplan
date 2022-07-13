import { income } from "./income";

export const assets = [
  {
    key: "0",
    label: "Cash",
    data: "cash",
    icon: "pi pi-fw pi-dollar",
    selectable: false,
    children: [
      {
        key: "0-0",
        label: "Bank Account",
        data: "bankAccount",
        icon: "pi pi-fw pi-dollar",
        parentType: "cash",
      },
      {
        key: "0-1",
        label: "Offset Account",
        data: "offsetAccount",
        icon: "pi pi-fw pi-dollar",
        parentType: "cash",
      },
      {
        key: "0-1",
        label: "Term Deposits",
        data: "termDeposits",
        icon: "pi pi-fw pi-dollar",
        parentType: "cash",
      },
      {
        key: "0-2",
        label: "Other",
        data: "otherCash",
        icon: "pi pi-fw pi-dollar",
        parentType: "cash",
      },
    ],
  },
  {
    key: "1",
    label: "Personal Property",
    data: "personalProperty",
    icon: "pi pi-fw pi-wallet",
    selectable: false,
    children: [
      {
        key: "1-0",
        label: "Motor vehicle",
        icon: "fas fa-car",
        data: "motorVehicle",
        parentType: "personalProperty",
      },
      {
        key: "1-1",
        label: "Trailer / Boat / Caravan",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "otherVehicle",
        parentType: "personalProperty",
      },
      {
        key: "1-2",
        label: "Jewellery",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "jewellery",
        parentType: "personalProperty",
      },
      {
        key: "1-3",
        label: "Art / Antique",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "artOrAntique",
        parentType: "personalProperty",
      },
      {
        key: "1-4",
        label: "Clothing",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "clothing",
        parentType: "personalProperty",
      },
      {
        key: "1-5",
        label: "Furniture / Household Contents",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "householdContents",
        parentType: "personalProperty",
      },
      {
        key: "1-6",
        label: "Other Personal Property",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "otherPersonalProperty",
        parentType: "personalProperty",
      },
    ],
  },
  {
    key: "2",
    label: "Superannuation / Pension",
    data: "superAndPension",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "2-0",
        label: "Superannuation",
        icon: "pi pi-fw pi-calendar-plus",
        data: "super",
        parentType: "superAndPension",
      },
      {
        key: "2-1",
        label: "Account-based Pension",
        icon: "pi pi-fw pi-calendar-plus",
        data: "accountBasedPension",
        parentType: "superAndPension",
      },
      // {
      //   key: "2-2",
      //   label: "Income-based Pension",
      //   icon: "pi pi-fw pi-calendar-plus",
      //   data: "pension",
      //   parentType: "superAndPension",
      // },
      // {
      //   key: "2-3",
      //   label: "Other Pension",
      //   icon: "pi pi-fw pi-calendar-plus",
      //   data: "otherPension",
      //   parentType: "superAndPension",
      // },
    ],
  },
  {
    key: "3",
    label: "Real Estate",
    data: "realEstate",
    icon: "pi pi-fw pi-home",
    selectable: false,
    children: [
      {
        key: "3-0",
        label: "Family home",
        icon: "pi pi-fw pi-home",
        data: "familyHome",
        parentType: "realEstate",
      },
      {
        key: "3-1",
        label: "Holiday home",
        icon: "pi pi-fw pi-home",
        data: "holidayHome",
        parentType: "realEstate",
      },
      {
        key: "3-2",
        label: "Investment Property",
        icon: "pi pi-fw pi-home",
        data: "investmentProperty",
        parentType: "realEstate",
      },
      {
        key: "3-3",
        label: "Other Property",
        icon: "pi pi-fw pi-home",
        data: "otherRealEstate",
        parentType: "realEstate",
      },
    ],
  },
  {
    key: "4",
    label: "Other Investments",
    data: "otherInvestments",
    icon: "pi pi-fw pi-chart-bar",
    selectable: false,
    children: [
      {
        key: "4-0",
        label: "Fixed interest investment",
        icon: "pi pi-fw pi-chart-bar",
        data: "fixedInterestInvestment",
        parentType: "otherInvestments",
      },
      {
        key: "4-1",
        label: "Shares",
        icon: "pi pi-fw pi-chart-bar",
        data: "shares",
        parentType: "otherInvestments",
      },
      {
        key: "4-2",
        label: "Bonds",
        icon: "pi pi-fw pi-chart-bar",
        data: "bonds",
        parentType: "otherInvestments",
      },
      {
        key: "4-3",
        label: "Debts owed to you",
        icon: "pi pi-fw pi-chart-bar",
        data: "debtsOwed",
        parentType: "otherInvestments",
      },
      {
        key: "4-4",
        label: "Managed investments",
        icon: "pi pi-fw pi-chart-bar",
        data: "managedInvestments",
        parentType: "otherInvestments",
      },
      {
        key: "4-5",
        label: "Margin Loan investment",
        icon: "pi pi-fw pi-chart-bar",
        data: "marginLoan",
        parentType: "otherInvestments",
      },
    ],
  },
];

export const offsetTypes = [...assets, ...income]
  .flatMap((cat) => cat.children)
  .reduce((acc, next) => {
    acc[next.data] = next;
    return acc;
  }, {});
