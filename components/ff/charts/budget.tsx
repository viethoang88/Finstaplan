import { useState, useMemo, useEffect } from "react";
import { Card } from "primereact/card";
import classes from "./charts-container.module.css";
import { TabView, TabPanel } from "primereact/tabview";
import { PieChartOutlined, BarChartOutlined } from "@ant-design/icons";
import { Pie } from "@nivo/pie";
import { Bar } from "@nivo/bar";
import { valueFormatter } from "../../../helpers/util";
import { expense } from "../budget/budget-options/expense";

// import { getHighContrastNoAdjustStyle } from "@fluentui/react";
// import { useValueFormatter } from "@nivo/core";
// BUDGET:
// Totals (Bar), (PIE):: Incomes, Expenses, Expense Types, Breakdown

// const header = <div className={classes.header}>HELLO</div>;
// const footer = <div className={classes.footer}>GOODBYE</div>;

const shouldRenderPie = (data) => {
  if (data === undefined) return false;
  for (let d of data) {
    if (d.value > 0) return true;
  }
  return false;
};

const Budget = ({
  type,
  aggSumByOwnerOutgoing,
  aggSumByOwnerIncoming,
  aggSumTotalsByType,
  barKeys,
  legendKeys,
  typeOne,
  typeTwo,
  width,
  height,
  showLegend = false,
  bucketedExpenses = undefined,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const headerTotals = (
    <span>
      Totals <BarChartOutlined />
    </span>
  );
  const headerIncoming = (
    <span>
      {typeOne} <PieChartOutlined />
    </span>
  );
  const headerOutgoing = (
    <span>
      {typeTwo} <PieChartOutlined />
    </span>
  );
  const [pieWidth, pieHeight] = [550, 350];
  const barMargin = { top: 5, right: 150, bottom: 75, left: 65 };
  const pieMargin = { top: 35, right: 75, bottom: 35, left: 75 };

  console.log("USING LEGEND KEYS IN BAR");
  console.log(legendKeys);

  const legendsConfig = [
    {
      dataFrom: legendKeys,
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 120,
      translateY: 0,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      symbolSize: 20,
      effects: [
        {
          on: "hover",
          style: {
            itemOpacity: 1,
          },
        },
      ],
    },
  ];

  const _legend = showLegend ? legendsConfig : [];
  console.log("------------------------------------");
  // console.log(aggSumByOwnerOutgoing.filter((sum) => sum.value !== 0));

  console.log(aggSumTotalsByType);

  const tabPanels = [
    <TabPanel
      header={headerTotals}
      contentStyle={{
        width: "100%",
        minHeight: height,
      }}
    >
      <Bar
        data={aggSumTotalsByType}
        tooltipFormat={(d) => valueFormatter(d)}
        borderWidth={3}
        borderRadius={5}
        enableGridX={true}
        enableGridY={true}
        keys={barKeys}
        indexBy="type"
        height={pieHeight}
        width={pieWidth}
        margin={barMargin}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "paired" }}
        label={(d) => valueFormatter(d)}
        borderColor="#fff"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          format: (value) => valueFormatter(value),
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "amount",
          legendPosition: "middle",
          legendOffset: -80,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={_legend}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </TabPanel>,
    <TabPanel header={headerIncoming}>
      {shouldRenderPie(aggSumByOwnerIncoming) && (
        <Pie
          data={aggSumByOwnerIncoming.filter((sum) => sum.value !== 0)}
          arcLabel={(d) => valueFormatter(d)}
          tooltipFormat={(d) => String(valueFormatter(d))}
          borderWidth={3}
          borderRadius={5}
          width={pieWidth}
          height={pieHeight}
          itemWidth={"100px"}
          itemHeight={"100px"}
          margin={pieMargin}
          innerRadius={0.6}
          animate={true}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "paired" }}
          onClick={(node, event) => console.log(node)}
          // padding={"6rem"}
        />
      )}
    </TabPanel>,
    <TabPanel header={headerOutgoing}>
      {shouldRenderPie(aggSumByOwnerOutgoing) && (
        <Pie
          data={aggSumByOwnerOutgoing.filter((sum) => sum.value !== 0)}
          arcLabel={(d) => valueFormatter(d)}
          tooltipFormat={(d) => String(valueFormatter(d))}
          borderWidth={3}
          borderRadius={5}
          width={pieWidth}
          height={pieHeight}
          itemWidth={"100px"}
          itemHeight={"100px"}
          margin={pieMargin}
          innerRadius={0.6}
          animate={true}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "paired" }}
          // padding={"6rem"}
        />
      )}
    </TabPanel>,
  ];
  //{/* expected shape: [{id: "Discretionary", value: n}, {id: "Non-Discretionary", value: n}, {id: "Semi-Discretionary", value: n}] */}

  if (type === "budget") {
    tabPanels.push(
      <TabPanel
        header={"Budgefy"}
        disabled={typeTwo === "Expenses" && bucketedExpenses === undefined}
      >
        {shouldRenderPie(bucketedExpenses) && (
          <Pie
            data={bucketedExpenses?.filter((sum) => sum.value !== 0)}
            arcLabel={(d) => valueFormatter(d)}
            tooltipFormat={(d) => String(valueFormatter(d))}
            borderWidth={3}
            borderRadius={5}
            width={pieWidth}
            height={pieHeight}
            itemWidth={"100px"}
            itemHeight={"100px"}
            margin={pieMargin}
            innerRadius={0.6}
            animate={true}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "paired" }}
          />
        )}
      </TabPanel>
    );
  }

  return (
    // <Card style={{ width: width, height: height }}>
    <div
      style={{
        width: width,
        height: height,
        minHeight: height,
        marginBottom: "2rem",
      }}
    >
      <TabView
        className={classes.tab_view}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {tabPanels}
      </TabView>
    </div>
  );
};

export default Budget;
