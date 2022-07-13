import AddBudgetItem from "./add-budget-item";
import classes from "./budget.module.css";
import { useSelector } from "react-redux";
import BudgetPerson from "./budget-person";
import BudgetTree from "./budget-tree";
import ParentSize from "@visx/visx/node_modules/@visx/responsive/lib/components/ParentSize";
import ItemTree from "./item-tree";
import ChartsContainer from "../charts/charts-container";

import {
  defaultIncomes,
  defaultExpenses,
  defaultAssets,
  defaultLiabilities,
} from "./default_data";
import { useState } from "react";
import { useEffect } from "react";
import BudgetSummary from "./budget-summary";

// types: budget (incomes/expenses)
//        balance sheet (assets/liabilities)
const typesMap = {
  budget: ["incomes", "expenses"],
  balanceSheet: ["assets", "liabilities"],
};
const defaultDataMap = {
  budget: [defaultIncomes, defaultExpenses],
  balanceSheet: [defaultAssets, defaultLiabilities],
};

const shouldRenderWithDefaults = (type, state) => {
  if (state.hasPartner) {
    return (
      state.primary?.[type]?.length === 0 &&
      state.partner?.[type]?.length === 0 &&
      state.joint?.[type]?.length === 0
    );
  } else {
    return (
      state.primary?.[type]?.length === 0 && state.joint?.[type]?.length === 0
    );
  }
};

// incomes
//   .filter((income) => !taxFreeIncomes.includes(type))
//   .reduce((acc, nextIncome) => acc + nextIncome)
//   .map((amt) => calculateTax(amt));

/* Low and middle class income tax offset */

export const calculateTax = (income, medicareLevy = 0) => {
  let tax = 0;
  if (income >= 180001) {
    tax += 51667 + 0.45 * (income - 180001);
  } else if (income >= 120001) {
    tax += 0.37 * (income - 120001) + 29467;
  } else if (income >= 45001) {
    tax += 0.325 * (income - 45001) + 5092;
  } else if (income >= 18201) {
    tax += 0.19 * (income - 18201);
  }
  return tax + medicareLevy * income;
};

const Budget = ({ type }) => {
  const { primary, partner, hasPartner, joint } = useSelector(
    (state) => state.factFind
  );

  const [incoming, outgoing] = typesMap[type];
  const [incomingDefaults, outgoingDefaults] = defaultDataMap[type];

  const [renderWithDefaultsIncoming, setRenderWithDefaultsIncoming] =
    useState(true);
  const [renderWithDefaultsOutgoing, setRenderWithDefaultsOutgoing] =
    useState(true);

  const extractRelevantStateAndCheckRerender = () => {
    const relevantState = {};
    relevantState["primary"] = primary;
    relevantState["hasPartner"] = hasPartner;
    relevantState["partner"] = partner;
    relevantState["joint"] = joint;
    const shouldRenderIncoming = shouldRenderWithDefaults(
      incoming,
      relevantState
    );
    const shouldRenderOutgoing = shouldRenderWithDefaults(
      outgoing,
      relevantState
    );

    if (renderWithDefaultsIncoming !== shouldRenderIncoming)
      setRenderWithDefaultsIncoming(shouldRenderIncoming);
    if (renderWithDefaultsOutgoing !== shouldRenderOutgoing)
      setRenderWithDefaultsOutgoing(shouldRenderOutgoing);
  };

  useEffect(() => {
    extractRelevantStateAndCheckRerender();
  }, [primary[type], partner[type], joint[type]]);

  return (
    <div className={classes.container}>
      <BudgetSummary type={type} incoming={incoming} outgoing={outgoing} />

      <div className={classes.incoming}>
        <AddBudgetItem
          type={incoming}
          defaults={incomingDefaults}
          renderWithDefaults={renderWithDefaultsIncoming}
        />
        <ItemTree
          relevantData={["primary", incoming, outgoing]}
          position="left"
          distance="3rem"
          topOffset="4rem"
          borderPosition="borderRight"
          paddingPosition="paddingRight"
        />
      </div>

      <div className={classes.people}>
        <div className={classes.chart_container}>
          <ChartsContainer
            type={type}
            limitedRender={true}
            limitedRenderType={type}
          />
        </div>

        <div className={classes.ui_people}>
          <BudgetPerson {...primary.uiData} />

          {hasPartner && (
            <>
              <BudgetPerson {...partner.uiData} />
            </>
          )}
        </div>

        {hasPartner && (
          <div className={classes.joint_itemtree}>
            <ItemTree
              relevantData={["joint", incoming, outgoing]}
              position="bottom"
              borderPosition="borderTop"
              topOffset="4.5rem"
              paddingPosition="paddingTop"
              extraStyles={{
                display: "flex",
                alignSelf: "center",
                justifySelf: "center",
              }}
            />
          </div>
        )}
      </div>

      <div className={classes.outgoing}>
        <AddBudgetItem
          type={outgoing}
          defaults={outgoingDefaults}
          renderWithDefaults={renderWithDefaultsOutgoing}
        />
        {hasPartner && (
          <ItemTree
            relevantData={["partner", incoming, outgoing]}
            position="right"
            borderPosition="borderLeft"
            topOffset="4.5rem"
            paddingPosition="paddingLeft"
          />
        )}
      </div>
    </div>
  );
};

export default Budget;
