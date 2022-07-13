import { useSelector } from "react-redux";
import { useState } from "react";
import { Card } from "primereact/card";
import classes from "./charts-container.module.css";
import { TabView, TabPanel } from "primereact/tabview";
import {
  PieChartOutlined,
  BarChartOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import Budget from "./budget";
// import BalanceSheet from "./balance-sheet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBalanceScale, faTable } from "@fortawesome/free-solid-svg-icons";
import { add } from "lodash";

import { createId } from "../../../helpers/util";
import DataManager from "../../../classes/DataManager";

// e.g. expense
const aggSumByTypeLabel = (data) => {};
const testData = {
  primary: {
    firstName: "Timmy",
    expenses: [
      {
        id: createId(),
        type: "some type",
        value: 500,
        label: "some label",
        frequency: "monthly",
      },
      {
        id: createId(),
        type: "other type",
        value: 1500,
        label: "other label",
        frequency: "annually",
      },
      {
        id: createId(),
        type: "third type",
        value: 2500,
        label: "third label",
        frequency: "biAnnually",
      },
      {
        id: createId(),
        type: "fourth type",
        value: 3500,
        label: "fourth label",
        frequency: "quarterly",
      },
    ],
    incomes: [
      {
        id: createId(),
        type: "some type",
        value: 53000,
        label: "some label",
        frequency: "monthly",
      },
      {
        id: createId(),
        type: "other type",
        value: 25500,
        label: "other label",
        frequency: "annually",
      },
      {
        id: createId(),
        type: "third type",
        value: 250000,
        label: "third label",
        frequency: "biAnnually",
      },
      {
        id: createId(),
        type: "fourth type",
        value: 3300,
        label: "fourth label",
        frequency: "quarterly",
      },
    ],
    assets: [
      { id: createId(), type: "some type", value: 50000, label: "some label" },
      { id: createId(), type: "other type", value: 250, label: "other label" },
      { id: createId(), type: "third type", value: 2500, label: "third label" },
      {
        id: createId(),
        type: "fourth type",
        value: 30000,
        label: "fourth label",
      },
      { id: createId(), type: "some type", value: 50000, label: "some label" },
      { id: createId(), type: "other type", value: 250, label: "other label" },
      { id: createId(), type: "third type", value: 2500, label: "third label" },
    ],
    liabilities: [
      { id: createId(), type: "some type", value: 25000, label: "some label" },
      {
        id: createId(),
        type: "other type",
        value: 55500,
        label: "other label",
      },
      {
        id: createId(),
        type: "third type",
        value: 30000,
        label: "third label",
      },
      {
        id: createId(),
        type: "fourth type",
        value: 300,
        label: "fourth label",
      },
    ],
  },
  partner: {
    firstName: "Luxanna",
    expenses: [
      {
        id: createId(),
        type: "some type",
        value: 500,
        label: "some label",
        frequency: "monthly",
      },
      {
        id: createId(),
        type: "other type",
        value: 69500,
        label: "other label",
        frequency: "annually",
      },
      {
        id: createId(),
        type: "third type",
        value: 2500,
        label: "third label",
        frequency: "biAnnually",
      },
      {
        id: createId(),
        type: "fourth type",
        value: 3500,
        label: "fourth label",
        frequency: "quarterly",
      },
    ],
    incomes: [
      {
        id: createId(),
        type: "some type",
        value: 5000,
        label: "some label",
        frequency: "monthly",
      },
      {
        id: createId(),
        type: "other type",
        value: 69690,
        label: "other label",
        frequency: "annually",
      },
      {
        id: createId(),
        type: "third type",
        value: 2500,
        label: "third label",
        frequency: "biAnnually",
      },
      {
        id: createId(),
        type: "fourth type",
        value: 300,
        label: "fourth label",
        frequency: "quarterly",
      },
    ],
    assets: [
      { id: createId(), type: "some type", value: 50000, label: "some label" },
      { type: "other type", value: 250, label: "other label" },
      { type: "third type", value: 2500, label: "third label" },
      { type: "fourth type", value: 30000, label: "fourth label" },
      { type: "third type", value: 2500, label: "third label" },
      { type: "third type", value: 25000, label: "third label" },
    ],
    liabilities: [
      { id: createId(), type: "some type", value: 25000, label: "some label" },
      { id: createId(), type: "other type", value: 500, label: "other label" },
      {
        id: createId(),
        type: "third type",
        value: 30000,
        label: "third label",
      },
      {
        id: createId(),
        type: "fourth type",
        value: 300,
        label: "fourth label",
      },
    ],
  },
  dependents: [
    {
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 5000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
  ],
  jointDependents: [
    {
      firstName: "Zoey",
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 5000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
    {
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 5000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
  ],
  partnerDependents: [
    {
      firstName: "Lana",
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 53000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 25500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 250000,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 55500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
  ],
  children: [
    {
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 5000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
    {
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 5000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
    {
      expenses: [
        {
          id: createId(),
          type: "some type",
          value: 500,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 1500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 3500,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      incomes: [
        {
          id: createId(),
          type: "some type",
          value: 5000,
          label: "some label",
          frequency: "monthly",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
          frequency: "annually",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
          frequency: "biAnnually",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
          frequency: "quarterly",
        },
      ],
      assets: [
        {
          id: createId(),
          type: "some type",
          value: 50000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 250,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 2500,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 30000,
          label: "fourth label",
        },
      ],
      liabilities: [
        {
          id: createId(),
          type: "some type",
          value: 25000,
          label: "some label",
        },
        {
          id: createId(),
          type: "other type",
          value: 500,
          label: "other label",
        },
        {
          id: createId(),
          type: "third type",
          value: 30000,
          label: "third label",
        },
        {
          id: createId(),
          type: "fourth type",
          value: 300,
          label: "fourth label",
        },
      ],
    },
  ],
};

/* OUTPUT SHAPE: [
  {
    id: "Non-discretionary",
    value: n
  },
  { 
    id: "Discretionary", 
    value: n
  },
  {
    id: "Semi-Discretionary",
    value: n,  
  }
]
*/
const bucketExpenses = (expenses) => {
  if (expenses === undefined) return;

  const nd = {
    id: "Non-discretionary",
    value: 0,
  };
  const semi = {
    id: "Semi-discretionary",
    value: 0,
  };
  const d = {
    id: "Discretionary",
    value: 0,
  };
  const obj = {
    nd,
    semi,
    d,
  };

  expenses.forEach((expense) => {
    if (expense?.bucket) {
      obj[expense.bucket].value +=
        expense.value * frequencyToNumberMap(expense.frequency);
    }
  });
  const outputArray = [nd, semi, d];
  console.log("--- BUCKETED EXSPENSES OUTPUT ----");
  console.log(outputArray);
  return outputArray;
};

const frequencyToNumberMap = (frequency): number => {
  if (frequency === undefined) return 1;

  const multipliers = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12,
    annually: 1,
    biAnnually: 2,
    quarterly: 4,
  };
  return multipliers[frequency];
};

// for bar chart (DATA SHAPE FOR ONE BAR):
/*
[
  {
    "country": "AD",
    "hot dog": 164,
    "hot dogColor": "hsl(169, 70%, 50%)",
    "burger": 96,
    "burgerColor": "hsl(44, 70%, 50%)",
    "sandwich": 55,
    "sandwichColor": "hsl(206, 70%, 50%)",
    "kebab": 176,
    "kebabColor": "hsl(147, 70%, 50%)",
    "fries": 27,
    "friesColor": "hsl(241, 70%, 50%)",
    "donut": 154,
    "donutColor": "hsl(235, 70%, 50%)"
  },
*/
const _aggSumTotalsByType = ({ incomes, expenses, liabilities, assets }) => {
  const reducer = (acc, { value }) => {
    if (value) return (acc += value);
    return acc;
  };
  const _incomes = {
    type: "incomes",
    incomes: incomes.reduce(reducer, 0),
  };
  const _expenses = {
    type: "expenses",
    expenses: expenses.reduce(reducer, 0),
  };
  const _liabilities = {
    type: "liabilities",
    liabilities: liabilities.reduce(reducer, 0),
  };
  const _assets = {
    type: "assets",
    assets: assets.reduce(reducer, 0),
  };
  return {
    incomes: _incomes,
    expenses: _expenses,
    liabilities: _liabilities,
    assets: _assets,
  };
};

const getExpensesByType = (type) => {};

const _aggSumByType = (data, key) => {
  const primaryData = data.primary[key];
  const partnerData = data.partner[key];
  const children = data.children;
  const dependents = data.dependents;
  const jointDependents = data.jointDependents;
  const partnerDependents = data.partnerDependents;
};

// key in ["incomes", "expenses", "liabilities", "assets"]
export const extractDataFromArray = (key, arr, id) => {
  return arr
    ?.map((person) => {
      return [person?.firstName, person?.[key]];
    })
    .reduce(
      (acc, [person, data]) => {
        if (data?.value) {
          acc.value += data.value;
        }
        return acc;
      },
      { id, value: 0 }
    );
};

export const extractDataFromState = (
  data,
  key,
  incoming = "incomes",
  outgoing = "expenses"
) => {
  const primary = data.primary;
  const partner = data.partner;
  const children = data.children;
  const dependents = data.dependents;
  const jointDependents = data.jointDependents;
  const partnerDependents = data.partnerDependents;
  const joint = data.joint;

  const primaryName =
    data.primary?.firstName !== undefined ? data.primary.firstName : "Client";
  const partnerName =
    data.partner?.firstName !== undefined ? data.partner.firstName : "Partner";

  const primaryData = primary[key].reduce(
    (acc, next) => {
      acc.value += frequencyToNumberMap(next.frequency) * next.value;
      return acc;
    },
    { id: primaryName, value: 0 }
  );
  const partnerData =
    partner[key] &&
    partner[key].reduce(
      (acc, next) => {
        acc.value += frequencyToNumberMap(next.frequency) * next.value;
        return acc;
      },
      { id: partnerName, value: 0 }
    );

  const jointData =
    joint[key] &&
    joint[key].reduce(
      (acc, next) => {
        acc.value += frequencyToNumberMap(next.frequency) * next.value;
        return acc;
      },
      { id: "Joint", value: 0 }
    );

  let childrenData;
  // const childrenData =
  const childrenDatas = extractDataFromArray(key, children, "children");

  //.map(([childName, data]) => {})
  // .reduce(
  //   (acc, childValuesOfKey) => {
  //     acc.value += childValuesOfKey.value;
  //     return acc;
  //   },
  //   { id: "children", value: 0 }
  // );
  if (key === "expenses") console.log(childrenDatas);

  const dependentsData = extractDataFromArray(key, dependents, "dependents");
  const jointDependentsData = extractDataFromArray(
    key,
    jointDependents,
    "jointDependents"
  );
  const partnerDependentsData = extractDataFromArray(
    key,
    partnerDependents,
    "partnerDependents"
  );

  return [
    primaryData ? primaryData : {},
    partnerData ? partnerData : {},
    joint ? jointData : {},
    childrenData ? childrenData : {},
    dependentsData ? dependentsData : {},
    jointDependentsData ? jointDependentsData : {},
    partnerDependentsData ? partnerDependentsData : {},
  ].filter((obj) => Object.entries(obj).length > 0);
};

const tabIconStyles = {
  fontSize: "1.5rem",
  maxWidth: "1.6rem",
  maxHeight: "1.6rem",
  marginRight: ".95rem",
  position: "relative",
  top: ".15rem",
};

// console.log(extractDataFromState(testData, "incomes"));

// agg sum by partner, primary, children, dependents, jointDependents:
export const aggSumByOwner = (data) => ({
  incomes: extractDataFromState(data, "incomes"),
  expenses: extractDataFromState(data, "expenses"),
  liabilities: extractDataFromState(data, "liabilities"),
  assets: extractDataFromState(data, "assets"),
});

// const aggSumTotalsByType = _aggSumTotalsByType(aggSumByOwner);

// <PieChartOutlined />
// <BarChartOutlined />;

// BUDGET:
// Totals (Bar), (PIE):: Incomes, Expenses, Expense Types, Breakdown

// BALANCE SHEET:
// Totals (Bar), (PIE):: Assets, Liabilities
const budgetHeader = (
  <span>
    Budget&nbsp;&nbsp; <FontAwesomeIcon icon={faTable} style={tabIconStyles} />
  </span>
);
const balanceHeader = (
  <span>
    Balance Sheet&nbsp;&nbsp;
    <FontAwesomeIcon icon={faBalanceScale} style={tabIconStyles} />
  </span>
);

// const header = <div className={classes.header}>HELLO</div>;
// const footer = <div className={classes.footer}>GOODBYE</div>;

export const extractLabelsFromData = (data) =>
  Object.keys(data).map((key) => data[key][0]["label"]);

const ChartsContainer = ({
  type,
  limitedRender = false,
  limitedRenderType = undefined,
  width = 550,
  height = 350,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const clientData = useSelector((state) => state.factFind);
  const _aggSumByOwner = aggSumByOwner(clientData);
  const dataManager = new DataManager(clientData);
  const dataAggdKeyedByType = dataManager.getAllCategoriesKeyedByType();
  const allRefsKeyedByType = dataManager.getAllRefsKeyedByType();

  const incomeLegendKeys = extractLabelsFromData(allRefsKeyedByType.incomes);
  const expenseLegendKeys = extractLabelsFromData(allRefsKeyedByType.expenses);
  const assetsLegendKeys = extractLabelsFromData(allRefsKeyedByType.assets);
  const liabilitiesLegendKeys = extractLabelsFromData(
    allRefsKeyedByType.liabilities
  );

  const incomeBarKeys = Object.keys(dataAggdKeyedByType.incomes).filter(
    (k) => k !== "type"
  );
  const expenseBarKeys = Object.keys(dataAggdKeyedByType.expenses).filter(
    (k) => k !== "type"
  );
  const assetsBarKeys = Object.keys(dataAggdKeyedByType.assets).filter(
    (k) => k !== "type"
  );
  const liabilitiesBarKeys = Object.keys(
    dataAggdKeyedByType.liabilities
  ).filter((k) => k !== "type");

  console.log("ALL REFS KEYED BY TYPE");
  const expenses = dataManager.getTypeArray("expenses");
  console.log(expenses);
  console.log(allRefsKeyedByType?.expenses);
  console.log(dataAggdKeyedByType?.expenses);

  // USE THESE FOR THE GRAPHS HOVER AND LEGEND:
  console.log(expenseLegendKeys);

  console.log(expenseBarKeys);

  const bucketedExpenses = bucketExpenses(expenses);
  // console.log(allRefsKeyedByType);
  // console.log(dataAggdKeyedByType);
  // console.log(_aggSumByOwner);

  // console.log("INCOME BAR KEYS");
  // console.log(incomeBarKeys);

  // console.log("INCOME LEGEND KEYS");
  // console.log(incomeLegendKeys);

  // console.log(dataAggdKeyedByType);
  // console.log(aggSumTotalsByType);
  // console.log(dataManager.getAggregateSumForAll());
  // sum of all incomes owned by primary, partner, children, dependents, joint dependents:
  // const aggSumByPersonType = {
  //   incomes: extractDataFromState(clientData, "incomes"),
  //   expenses: extractDataFromState(clientData, "expenses"),
  //   liabilities: extractDataFromState(clientData, "liabilities"),
  //   assets: extractDataFromState(clientData, "assets"),
  // };
  // const __aggSumTotalsByType = _aggSumTotalsByType(aggSumByPersonType);

  const balanceSheet = (
    <Budget
      type={type}
      typeOne="Assets"
      typeTwo="Liabilities"
      aggSumByOwnerIncoming={_aggSumByOwner.assets}
      aggSumByOwnerOutgoing={_aggSumByOwner.liabilities}
      aggSumTotalsByType={[
        dataAggdKeyedByType.liabilities,
        dataAggdKeyedByType.assets,
      ]}
      barKeys={assetsBarKeys.concat(liabilitiesBarKeys)}
      legendKeys={assetsLegendKeys.concat(liabilitiesLegendKeys)}
      width={width}
      height={height}
      bucketedExpenses={undefined}
    />
  );

  const budget = (
    <Budget
      type={type}
      typeOne="Incomes"
      typeTwo="Expenses"
      aggSumByOwnerIncoming={_aggSumByOwner.incomes}
      aggSumByOwnerOutgoing={_aggSumByOwner.expenses}
      aggSumTotalsByType={[
        dataAggdKeyedByType.incomes,
        dataAggdKeyedByType.expenses,
      ]}
      barKeys={incomeBarKeys.concat(expenseBarKeys)}
      legendKeys={incomeLegendKeys.concat(expenseLegendKeys)}
      width={width}
      height={height}
      bucketedExpenses={bucketedExpenses}
    />
  );

  if (limitedRender) {
    return limitedRenderType === "budget" ? budget : balanceSheet;
  }

  return (
    <div className={classes.container}>
      {/* <Card title="Title" footer={footer} header={header}> */}
      <Card>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel
            header={balanceHeader}
            contentClassName={classes.container_tab}
          >
            {balanceSheet}
          </TabPanel>
          <TabPanel
            header={budgetHeader}
            contentClassName={classes.container_tab}
          >
            {budget}
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default ChartsContainer;
