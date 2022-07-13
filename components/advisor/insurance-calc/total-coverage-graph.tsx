import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTheme,
  VictoryAxis,
  VictoryArea,
} from "victory";

import { Chart } from "react-google-charts";

const convertToCash = (amount) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const buildGraph = (data, ticks, title) => {
  if (data === undefined) return <></>;

  // ticks = ticks.filter((v) => v % 3 === 0);
  return (
    <Chart
      width={"85vw"}
      height={"750px"}
      chartType="ComboChart"
      loader={<div>Loading Chart</div>}
      // Year / Growth / Expenses / Net Worth
      data={[
        [
          "Years from now",
          "Lump Sum Requirements",
          "Expense Requirements",
          "Net Needs (Expenses + Lump sum - Offsets)",
          "Offsets (Assets + Incomes)",
        ],
        ...data,
      ]}
      // data={[
      //   [
      //     "Month",
      //     "Bolivia",
      //     "Ecuador",
      //     "Madagascar",
      //     "Papua New Guinea",
      //     "Rwanda",
      //     "Average",
      //   ],

      //   ["2004/05", 165, 938, 522, 998, 450, 614.6],
      //   ["2005/06", 135, 1120, 599, 1268, 288, 682],
      //   ["2006/07", 157, 1167, 587, 807, 397, 623],
      //   ["2007/08", 139, 1110, 615, 968, 215, 609.4],
      //   ["2008/09", 136, 691, 629, 1026, 366, 569.6],
      // ]}
      options={{
        backgroundColor: "#fff",
        // is3D: true,
        colors: ["lightskyblue", "salmon", "lightgreen", "orange"],
        title: title,
        vAxis: { title: "", format: "currency" },
        hAxis: { title: "Years from now", ticks: ticks },
        seriesType: "bars",
        series: {
          0: { type: "line" },
          // 1: { type: "line" },
          2: { type: "area" },
          3: { type: "line" },
        },
        animation: {
          duration: 1000,
          easing: "out",
          startup: true,
        },
        enableInteractivity: true,
      }}
    />
  );
};

const TotalCoverageGraph = ({
  expenseData,
  lumpSumData,
  offsetData,
  netNeedsData,
  yearsUntilMortality,
  title,
}) => {
  const graphData = [];
  const ticks = [];
  for (let i = 0; i < yearsUntilMortality; i++) {
    graphData.push([
      i,
      lumpSumData,
      -expenseData[String(i)],
      netNeedsData[String(i)],
      offsetData[String(i)],
    ]);
    ticks.push(i);
  }

  return <>{buildGraph(graphData, ticks, title)}</>;
};

const TotalCoverageGraphOld = ({
  expenseData,
  lumpSumData,
  offsetData,
  netNeedsData,
  yearsUntilMortality,
}) => {
  const expenses = [];
  const lumpsum = [];
  const offset = [];
  const netNeeds = [];
  const xAxis = [];

  for (let i = 0; i < yearsUntilMortality; i++) {
    expenses.push({ x: i, y: -expenseData[String(i)] });
    lumpsum.push({ x: i, y: lumpSumData });
    offset.push({ x: i, y: offsetData[String(i)] });
    netNeeds.push({ x: i, y: netNeedsData[String(i)] });
    xAxis.push(i);
  }

  return (
    <VictoryChart theme={VictoryTheme.material} width={1600}>
      <VictoryLegend
        x={252}
        y={10}
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: "black" } }}
        colorScale={["darkblue", "rgb(51, 77, 92)", "darkorange", "darkgreen"]}
        data={[
          { name: "Expense requirements" },
          { name: "Lump sum requirements" },
          { name: "Offsets (assets & incomes)" },
          { name: "Net needs (expenses + lump sum requirements - offsets)" },
        ]}
      />
      <VictoryAxis
        dependentAxis
        style={{
          axisLabel: { padding: 10, angle: 45 },
        }}
        domain={[-200000, 700000]}
        offsetX={95}
        // tickValues={[
        //   -200000, -100000, 0, 100000, 200000, 300000, 400000, 500000, 600000,
        //   700000,
        // ]}
        // standalone={false}
        // tickLabelComponent={<VictoryLabel text={({ x, y }) => [`${y}%`]} />}
        tickFormat={(t) =>
          t > 0 ? `${convertToCash(t)}` : `(${convertToCash(t)})`
        }
      />

      <VictoryAxis
        crossAxis
        offsetX={300}
        // domain={[0, 100]}
        // standalone={false}
        tickValues={xAxis}
        // tickFormat={(t) => {
        // }}
        // style={{ ticks: { stroke: "transparent" } }}
      />
      <VictoryLine
        style={{
          data: { stroke: "darkblue" },
          parent: { border: "1px solid #ccc" },
        }}
        data={offset}
      />
      <VictoryLine
        style={{
          data: { stroke: "rgb(51, 77, 92)" },
          parent: { border: "1px solid #ccc" },
        }}
        data={lumpsum}
      />
      <VictoryLine
        style={{
          data: { stroke: "darkorange" },
          parent: { border: "1px solid #ccc" },
        }}
        data={expenses}
      />
      <VictoryLine
        style={{
          data: { stroke: "darkgreen" },
          parent: { border: "1px solid #ccc" },
        }}
        data={netNeeds}
      />
      {/* <VictoryArea
        style={{
          data: { stroke: "rgba(250,250,250,.25)" },
          parent: { border: "1px solid rgba(250,250,250,.25)" },
        }}
        data={netNeeds}
      /> */}
    </VictoryChart>
  );
};

export default TotalCoverageGraph;
