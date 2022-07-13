import { Chart } from "react-google-charts";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { expenseTypes } from "../../ff/budget/budget-options/expense";
import { offsetTypes } from "../../ff/budget/budget-options/assets";
import { liabilitiesTypes } from "../../ff/budget/budget-options/liabilities";

const generateOptions = (title) => ({
  indexAxis: "y",
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: title,
    },
  },
});

// HAS:
// "The requirement to cover expenses and liabilities is $a based on the
//  following needs:"
//      - $x of income requirements; sideways bar chart
//        - Spouse income
//        - Rental
//        - Child education
//        - Family living expenses
//        - Other costs?

//      - $y of lump sum payment requirements; sideways bar chart
//        - Each liability gets its own bar
//        - Each lump sum legacy gets its own bar

//      - $z in assets and incomes are available as offsets to you

const barContainerStyles = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "800px",
};
const graphContainerStyles = {
  display: "flex",
  flexDirection: "row",
  minWidth: "1600px",
  maxWidth: "1600px",
  alignContent: "space-between",
  alignItems: "space-between",
  justifyContent: "space-between",
  justifyItems: "space-between",
};

const convertNumberToPrice = (number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 2,
  }).format(number);

const tagToTypeMap = new Map([
  ["expenses", expenseTypes],
  ["offsets", offsetTypes],
  ["liabilities", liabilitiesTypes],
]);

const colorPallette = [
  "#3366CC",
  "#DC3912",
  "#109618",
  "#990099",
  "#0099C6",
  "#DD4477",
];

const generateBarData = (data, type) => {
  // const _cash = assignCashFromScore(score);
  // const _defensive = 100 - _cash - score;
  const metaData = ["Expenses", "$", { role: "style" }];
  const rows = Object.keys(data)
    // .filter((rowKey) => {
    //   const key = rowKey.split("_");
    //   const _key = key[0] === "Child" ? key[1] : key[0];
    //   return _key !== "familyHome";
    // })
    .map((rowKey, idx) => {
      const key = rowKey.split("_");
      const _key = key[0] === "Child" ? key[1] : key[0];

      // console.log(`---- HI with ${type} -----`);
      // console.log(key);
      // console.log(_key);
      // console.log(tagToTypeMap.get(type));

      const rowLabel = tagToTypeMap.get(type)[_key]?.label;

      // let rowLabel;
      // if (type === "expenses") {
      //   rowLabel = expenseTypes[_key]?.label;
      // } else if (type === "offsets") {
      //   rowLabel = offsetTypes[_key]?.label;
      // } else if (type === "liabilities") {
      //   rowLabel = liabilitiesTypes[_key]?.label;
      // }
      return [
        rowLabel,
        data[rowKey],
        `'stroke-color: white; stroke-opacity: 1; stroke-width: 1.5; fill-color: ${
          colorPallette[idx % colorPallette.length]
        }; fill-opacity: 0.2'`,
      ];
    });
  const res = [metaData, ...rows];
  // console.log("--- CHART DATA ----");
  // console.log(rows);
  // console.log(res);
  return res;
};

const generatePieData = (data) => {
  return [
    ["Growth vs. Defensive", "Percentage"],
    ["Growth", 5000],
    ["Defensive", 1000],
  ];
};

const NeedsGraph = ({
  type,
  incomeRequirements = [],
  lumpSumRequirements = [],
  offsets = [],
}) => {
  console.log("--- IN NEEDS GRAPH WITH LUMP SUM REQUIREMENTS ----");
  console.log(lumpSumRequirements);

  const sumOfExpenses = convertNumberToPrice(
    Object.entries(incomeRequirements)
      .map((next) => next[1])
      .reduce((acc, next) => acc + next, 0)
  );
  const sumOfOffsets = convertNumberToPrice(
    Object.entries(offsets)
      .map((next) => next[1])
      .reduce((acc, next) => acc + next, 0)
  );
  const lumpSum = convertNumberToPrice(
    Object.entries(lumpSumRequirements)
      .map((next) => next[1])
      .filter((next) => {
        console.log(next);
        console.log(typeof next);
        console.log(!Number.isNaN(next));
        return typeof next === "number" || !Number.isNaN(next);
      })
      .reduce((acc, next) => acc + next, 0)
  );

  console.log(lumpSum);

  return (
    <Card title={type} style={{ width: 1650 }}>
      <div style={graphContainerStyles}>
        <div style={barContainerStyles}>
          <Card style={{ marginBottom: "2rem" }}>
            {/* <Bar type="bar" data={incomeRequirements} options={incomeOptions} /> */}

            <Chart
              width={"800px"}
              height={"450px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={generateBarData(incomeRequirements, "expenses")}
              options={{
                title: `${sumOfExpenses} of Income Requirements`,
                legend: "none",
                // chartArea: { right: 5 },
              }}
            />
          </Card>
          {/* <Card style={{ width: 750 }}> */}
          <Card>
            {/* <Bar
              type="bar"
              data={lumpSumRequirements}
              options={lumpSumOptions}
            /> */}

            <Chart
              width={"800px"}
              height={"450px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={generateBarData(lumpSumRequirements, "liabilities")}
              options={{
                title: `${lumpSum} of Lump Sum Payment Requirements`,
                legend: "none",
                // chartArea: { left: 25 },
              }}
            />
          </Card>
        </div>
        <div>
          {/* <Card style={{ width: 750 }}> */}
          <Card>
            {/* <Doughnut type="doughnut" data={offsets} options={offsetOptions} /> */}
            <Chart
              width={"900px"}
              height={"900px"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={generateBarData(offsets, "offsets")}
              options={{
                title: `${sumOfOffsets} in Assets and Income are Available as Offsets`,
                pieHole: 0.3,
                // slices: {
                //   0: { color: "rgb(166, 206, 227)" },
                //   1: { color: "rgb(31, 120, 180)" },
                //   2: { color: "rgb(166, 206, 227)" },
                //   3: { color: "darkgreen" },
                //   4: { color: "rgb(166, 206, 227)" },
                //   5: { color: "rgb(31, 120, 180)" },
                // },
                // legend: "none",
              }}
            />
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default NeedsGraph;
