export const expense = [
  {
    key: "0",
    label: "General Financial Expenses",
    data: "financialExpense",
    icon: "pi pi-fw pi-dollar",
    selectable: false,
    children: [
      {
        key: "0-0",
        label: "Personal loan repayments (car, etc)",
        data: "personalLoanExpense",
        icon: "pi pi-fw pi-cog",
        parentType: "financialExpense",
        bucket: "nd",
      },
      {
        key: "0-1",
        label: "Credit card repayments (Interest only)",
        data: "creditCardRepaymentsExpense",
        icon: "pi pi-fw pi-cog",
        parentType: "financialExpense",
        bucket: "nd",
      },
      {
        key: "0-2",
        label: "Lease repayments, equipment rental",
        data: "leaseRepaymentsExpense",
        icon: "pi pi-fw pi-cog",
        parentType: "financialExpense",
        bucket: "nd",
      },
      {
        key: "0-3",
        label: "Other Financial Expenses",
        data: "otherFinancialExpense",
        icon: "pi pi-fw pi-cog",
        parentType: "financialExpense",
        bucket: "semi",
      },
    ],
  },
  {
    key: "1",
    label: "Home Expenses",
    data: "homeExpense",
    icon: "pi pi-fw pi-home",
    selectable: false,
    children: [
      {
        key: "1-0",
        label: "Residential Mortgage",
        icon: "pi pi-fw pi-home",
        data: "residentialMortgageExpense",
        parentType: "homeExpense",
        bucket: "semi",
      },
      {
        key: "1-1",
        label: "Body Corporate Fees",
        icon: "pi pi-fw pi-home",
        data: "bodyCorporateFeesExpense",
        parentType: "homeExpense",
        bucket: "nd",
      },
      {
        key: "1-2",
        label: "Rates & Taxes (local council fees, property taxes, etc)",
        icon: "pi pi-fw pi-home",
        data: "ratesAndTaxesExpense",
        parentType: "homeExpense",
        bucket: "nd",
      },
      {
        key: "1-3",
        label: "Home maintenance & renovations",
        icon: "pi pi-fw pi-home",
        data: "homeMaintenanceAndRenovationsExpense",
        parentType: "homeExpense",
        bucket: "semi",
      },
      {
        key: "1-4",
        label: "Rent",
        icon: "pi pi-fw pi-home",
        data: "rentExpense",
        parentType: "homeExpense",
        bucket: "nd",
      },
      {
        key: "1-5",
        label:
          "Home services (cleaning, pest control, gardening, pool maintenance, etc)",
        icon: "pi pi-fw pi-home",
        data: "homeServicesExpense",
        parentType: "homeExpense",
        bucket: "semi",
      },
      {
        key: "1-6",
        label: "Phone, Mobile, Television and Internet",
        icon: "pi pi-fw pi-home",
        data: "homeEntertainmentExpense",
        parentType: "homeExpense",
        bucket: "d",
      },
      {
        key: "1-7",
        label: "Utilities (electricity, gas, water, etc)",
        icon: "pi pi-fw pi-home",
        data: "homeUtilitiesExpense",
        parentType: "homeExpense",
        bucket: "nd",
      },
    ],
  },
  {
    key: "2",
    label: "Living Expenses",
    data: "livingExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "2-0",
        label: "All General Living Expenses",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "generalLivingExpenses",
        parentType: "livingExpense",
        bucket: "semi",
      },
      {
        key: "2-1",
        label: "Groceries",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "groceriesExpense",
        parentType: "livingExpense",
        bucket: "semi",
      },
      {
        key: "2-2",
        label: "Clothes & Shoes",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "clothesExpense",
        parentType: "livingExpense",
        bucket: "semi",
      },
      {
        key: "2-3",
        label: "Household purchases (Appliances, furniture, linen etc)",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "householdItemsExpense",
        parentType: "livingExpense",
        bucket: "semi",
      },
      {
        key: "2-4",
        label: "Laundy & Dry-cleaning",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "laundryExpense",
        parentType: "livingExpense",
        bucket: "semi",
      },
      {
        key: "2-5",
        label: "Donations & Gifts",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "donationsAndGiftsExpense",
        parentType: "livingExpense",
        bucket: "d",
      },
      {
        key: "2-6",
        label: "Birthdays",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "birthdaysExpense",
        parentType: "livingExpense",
        bucket: "d",
      },
      {
        key: "2-7",
        label: "Other Living Expense",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "otherLivingExpense",
        parentType: "livingExpense",
        bucket: "semi",
      },
    ],
  },
  {
    key: "3",
    label: "Personal Care",
    data: "personalCareExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "3-1",
        label: "Medical Bills",
        icon: "pi pi-fw pi-calendar-plus",
        data: "medicalBillsExpense",
        parentType: "livingExpense",
        bucket: "nd",
      },
      {
        key: "3-2",
        label: "Pharmacy prescriptions",
        icon: "pi pi-fw pi-calendar-plus",
        data: "prescriptionsExpense",
        parentType: "livingExpense",
        bucket: "nd",
      },
      {
        key: "3-3",
        label: "Hair care & products",
        icon: "pi pi-fw pi-calendar-plus",
        data: "hairCareExpense",
        parentType: "livingExpense",
        bucket: "d",
      },
      {
        key: "3-4",
        label: "Beauty products & treatments",
        icon: "pi pi-fw pi-calendar-plus",
        data: "beautyExpense",
        parentType: "livingExpense",
        bucket: "d",
      },
      {
        key: "3-5",
        label: "Other Personal Care Expense",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "otherPersonalCareExpense",
        parentType: "livingExpense",
        bucket: "d",
      },
    ],
  },
  {
    key: "4",
    label: "Professional Expenses",
    data: "professionalExpense",
    icon: "pi pi-fw pi-briefcase",
    selectable: false,
    children: [
      {
        key: "4-1",
        label: "Professional memberships",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "professionalMembershipsExpense",
        parentType: "professionalExpense",
        bucket: "nd",
      },
      {
        key: "4-2",
        label: "Indemnity insurance",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "indemnityInsuranceProfessionalExpense",
        parentType: "professionalExpense",
        bucket: "nd",
      },
      {
        key: "4-3",
        label: "Continuing education and studying",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "studyingProfessionalExpense",
        parentType: "professionalExpense",
        bucket: "semi",
      },
      {
        key: "4-4",
        label: "Other",
        // icon: "pi pi-fw pi-calendar-plus",
        data: "otherProfessionalExpense",
        parentType: "professionalExpense",
        bucket: "semi",
      },
    ],
  },
  {
    key: "5",
    label: "Car, Transport and Recreational Vehicle Expenses",
    data: "transportExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "5-0",
        label: "Vehicle registration",
        icon: "pi pi-fw pi-calendar-plus",
        data: "vehicleRegistrationExpense",
        parentType: "transportExpense",
        bucket: "nd",
      },
      {
        key: "5-1",
        label: "Vehicle license fees and fines",
        icon: "pi pi-fw pi-calendar-plus",
        data: "vehicleFeesExpense",
        parentType: "transportExpense",
        bucket: "nd",
      },
      {
        key: "5-2",
        label: "Gas",
        icon: "pi pi-fw pi-calendar-plus",
        data: "vehicleGasExpense",
        parentType: "transportExpense",
        bucket: "nd",
      },
      {
        key: "5-3",
        label: "Toll fees",
        icon: "pi pi-fw pi-calendar-plus",
        data: "vehicleTollsExpense",
        parentType: "transportExpense",
        bucket: "nd",
      },
      {
        key: "5-4",
        label: "Public transport fares, taxis & uber",
        icon: "pi pi-fw pi-calendar-plus",
        data: "otherTravelExpense",
        parentType: "transportExpense",
        bucket: "semi",
      },
      {
        key: "5-5",
        label:
          "Recreational vehicle (boat, caravan, trailer, etc.) registration, storage & maintenance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "recreationalVehicleExpense",
        parentType: "transportExpense",
        bucket: "d",
      },
    ],
  },
  {
    key: "6",
    label: "Insurance Premiums Expenses",
    data: "insuranceExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "6-0",
        label: "Life Insurance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "lifeInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
      {
        key: "6-1",
        label: "Total & Permanent Disability Insurance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "tpdInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
      {
        key: "6-2",
        label: "Trauma Insurance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "traumaInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
      {
        key: "6-3",
        label: "Income Protection",
        icon: "pi pi-fw pi-calendar-plus",
        data: "incomeProtectionInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
      {
        key: "6-4",
        label: "Private Health Insurance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "privateHealthInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
      {
        key: "6-5",
        label: "Home & Contents Insurance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "homeInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
      {
        key: "6-6",
        label:
          "Vehicle Insurance (car, motorbike, boat, caravan, trailer, etc)",
        icon: "pi pi-fw pi-calendar-plus",
        data: "vehicleInsuranceExpense",
        parentType: "insuranceExpense",
        bucket: "semi",
      },
    ],
  },
  {
    key: "7",
    label: "Leisure & Entertainment Expenses",
    data: "leisureExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "7-0",
        label: "Travel and Vacations",
        icon: "pi pi-fw pi-calendar-plus",
        data: "travelAndVacationsExpense",
        parentType: "leisureExpense",
        bucket: "d",
      },
      {
        key: "7-1",
        label: "Eating out or ordering in",
        icon: "pi pi-fw pi-calendar-plus",
        data: "foodLeisureExpense",
        parentType: "leisureExpense",
        bucket: "d",
      },
      {
        key: "7-2",
        label: "Movies & Concerts",
        icon: "pi pi-fw pi-calendar-plus",
        data: "moviesAndConcertsExpense",
        parentType: "leisureExpense",
        bucket: "d",
      },
      {
        key: "7-3",
        label: "Sports, hobbies or club memberships",
        icon: "pi pi-fw pi-calendar-plus",
        data: "hobbiesExpense",
        parentType: "leisureExpense",
        bucket: "d",
      },
      {
        key: "7-4",
        label: "Parties, anniversaries, etc",
        icon: "pi pi-fw pi-calendar-plus",
        data: "personalEventExpense",
        parentType: "leisureExpense",
        bucket: "d",
      },
      {
        key: "7-5",
        label: "Other types of Leisure & Entertainment",
        icon: "pi pi-fw pi-calendar-plus",
        data: "otherLeisureExpense",
        parentType: "leisureExpense",
        bucket: "d",
      },
    ],
  },
  {
    key: "8",
    label: "Fees & Charges",
    data: "feesAndChargesExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "8-0",
        label: "Bank fees",
        icon: "pi pi-fw pi-calendar-plus",
        data: "bankFeesExpense",
        parentType: "feesAndChargesExpense",
        bucket: "nd",
      },
      {
        key: "8-1",
        label: "Accountant fees",
        icon: "pi pi-fw pi-calendar-plus",
        data: "accountantFeesExpense",
        parentType: "feesAndChargesExpense",
        bucket: "nd",
      },
      {
        key: "8-2",
        label: "Financial Advisor fees",
        icon: "pi pi-fw pi-calendar-plus",
        data: "financialAdvisorFeesExpense",
        parentType: "feesAndChargesExpense",
        bucket: "nd",
      },
      {
        key: "8-3",
        label: "Other service fees",
        icon: "pi pi-fw pi-calendar-plus",
        data: "otherFeesAndChargesExpense",
        parentType: "feesAndChargesExpense",
        bucket: "nd",
      },
    ],
  },
  {
    key: "9",
    label: "Investment Expenses",
    data: "investmentExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "9-0",
        label: "Investment property loan/mortgage repayment",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentPropertyRepaymentExpense",
        parentType: "investmentExpense",
        bucket: "semi",
      },
      {
        key: "9-1",
        label: "Investment property upkeep & maintenance",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentPropertyUpkeepExpense",
        parentType: "investmentExpense",
        bucket: "semi",
      },
      {
        key: "9-2",
        label: "Managed Funds",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentManagedFundExpense",
        parentType: "investmentExpense",
        bucket: "d",
      },
      {
        key: "9-3",
        label: "Pension/Superannuation Salary Sacrifice",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentPensionSalarySacrificeExpense",
        parentType: "investmentExpense",
        bucket: "d",
      },
      {
        key: "9-4",
        label: "Pension/Superannuation Non-Concessional",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentPensionNonConcessionalExpense",
        parentType: "investmentExpense",
        bucket: "d",
      },
      {
        key: "9-5",
        label: "Bonds (RSA, etc)",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentBondsExpense",
        parentType: "investmentExpense",
        bucket: "d",
      },
      {
        key: "9-6",
        label: "Gearing",
        icon: "pi pi-fw pi-calendar-plus",
        data: "investmentGearingExpense",
        parentType: "investmentExpense",
        bucket: "d",
      },
      {
        key: "9-7",
        label: "Other Investment Expense",
        icon: "pi pi-fw pi-calendar-plus",
        data: "otherInvestmentExpense",
        parentType: "investmentExpense",
        bucket: "d",
      },
    ],
  },
  {
    key: "10",
    label: "Child Expenses",
    data: "childExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "10-0",
        label: "Education",
        icon: "pi pi-fw pi-calendar-plus",
        data: "childEducationExpense",
        parentType: "childExpense",
        bucket: "semi",
      },
      {
        key: "10-1",
        label: "Childcare & Babysitting",
        icon: "pi pi-fw pi-calendar-plus",
        data: "childcareExpense",
        parentType: "childExpense",
        bucket: "semi",
      },
      {
        key: "10-2",
        label: "Equipment, Toys & Entertainment",
        icon: "pi pi-fw pi-calendar-plus",
        data: "childEquipmentExpense",
        parentType: "childExpense",
        bucket: "d",
      },
      {
        key: "10-3",
        label: "Pocket money",
        icon: "pi pi-fw pi-calendar-plus",
        data: "childPocketMoneyExpense",
        parentType: "childExpense",
        bucket: "d",
      },
      {
        key: "10-4",
        label: "Other child related expense",
        icon: "pi pi-fw pi-calendar-plus",
        data: "otherChildExpense",
        parentType: "childExpense",
        bucket: "semi",
      },
    ],
  },
  {
    key: "11",
    label: "Medical Expenses",
    data: "medicalExpense",
    icon: "pi pi-fw pi-calendar",
    selectable: false,
    children: [
      {
        key: "11-0",
        label: "Medical Tests",
        icon: "pi pi-fw pi-calendar-plus",
        data: "medicalTestExpense",
        parentType: "medicalExpense",
        bucket: "nd",
      },
      {
        key: "11-1",
        label: "Medication & Prescriptions",
        icon: "pi pi-fw pi-calendar-plus",
        data: "medicalMedsExpense",
        parentType: "medicalExpense",
        bucket: "nd",
      },
      {
        key: "11-2",
        label: "Medical Treatments",
        icon: "pi pi-fw pi-calendar-plus",
        data: "medicalTreatmentsExpense",
        parentType: "medicalExpense",
        bucket: "nd",
      },
      {
        key: "11-3",
        label: "Medical/Hospital Bills",
        icon: "pi pi-fw pi-calendar-plus",
        data: "medicalHospitalExpense",
        parentType: "medicalExpense",
        bucket: "nd",
      },
      {
        key: "11-4",
        label: "Doctor & Caregivers",
        icon: "pi pi-fw pi-calendar-plus",
        data: "medicalCarersExpense",
        parentType: "medicalExpense",
        bucket: "nd",
      },
    ],
  },
];

export const expenseTypes = [
  {
    children: [
      {
        label: "Extra Help Required",
        data: "extraHelpRequired",
      },
    ],
  },
  ...expense,
]
  .flatMap((expenseCategory) => expenseCategory.children)
  .reduce((acc, next) => {
    acc[next.data] = next;
    return acc;
  }, {});
