import {
  VictoryBar,
  VictoryChart,
  VictoryScatter,
  VictoryGroup,
  VictoryTheme,
  VictoryTransition,
  VictoryTooltip,
} from "victory";

import { Chart } from "react-google-charts";
import { useMemo } from "react";

const flyoutStyles = {
  stroke: "tomato",
  strokeWidth: 2,
  backgroundColor: "white",
};

const buildGraph = (data) => {
  if (data === undefined) return <></>;
  let ticks = [];
  for (let i = 0; i < data.length; i++) ticks.push(i);
  ticks = ticks.filter((v) => v % 3 === 0);
  return (
    <Chart
      width={"85vw"}
      height={"750px"}
      chartType="ComboChart"
      loader={<div>Loading Chart</div>}
      // style={{ backgroundColor: "transparent" }}
      // Year / Growth / Expenses / Net Worth
      data={[
        ["Years from now", "Growth", "Expenses", "Investable Assets"],
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
        backgroundColor: "transparent",
        // is3D: true,
        colors: ["lightskyblue", "salmon", "lightgreen"],
        title: "Enough Graph",
        vAxis: { title: "$ Amount", format: "currency" },
        hAxis: { title: "Years from now", ticks: ticks },
        seriesType: "bars",
        // series: { 5: { type: "area" } },
        series: { 2: { type: "area" } },
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

const EnoughGraph = ({
  // totalIncomes,
  // totalExpenses,
  // currentNetWorth,
  // futureValueExpenses,
  recomputeGraph,
  getGraphData,
  configOptions,
}) => {
  // const graphData = futureValueExpenses?.map((exp, idx) => [idx, exp]);
  // console.log(graphData);

  const chart = useMemo(() => {
    console.log("RE-RENDERING GRAPH WITH NEW DATA");
    console.log(getGraphData);
    console.log(configOptions);
    if (getGraphData !== undefined) {
      console.log("CALLING GETGRAPHDATA");
      const _graphData = getGraphData(configOptions);
      console.log(_graphData);
      return buildGraph(_graphData);
    }

    // return buildGraph(getGraphData(configOptions));
    return buildGraph([0, 0, 0, 0]);
  }, [recomputeGraph]);

  return <div style={{ position: "relative", top: "-6rem" }}>{chart}</div>;
};

export default EnoughGraph;

/*
const victoryChart = (
  <VictoryTransition
    animate={{
      duration: 2000,
      onLoad: { duration: 1000 },
      onEnter: { duration: 500, before: () => ({ y: 0 }) },
    }}
  >
    <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
      <VictoryGroup offset={20} colorScale={"qualitative"}>
        <VictoryBar
          data={[
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
          ]}
          labels={({ datum }) => `$${datum.y}`}
          labelComponent={<VictoryTooltip flyoutStyle={flyoutStyles} />}
        />
        <VictoryBar
          data={[
            { x: 1, y: 2 },
            { x: 2, y: 1 },
            { x: 3, y: 7 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 5 },
          ]}
          labels={({ datum }) => `$${datum.y}`}
          labelComponent={<VictoryTooltip flyoutStyle={flyoutStyles} />}
        />
        <VictoryBar
          data={[
            { x: 1, y: 3 },
            { x: 2, y: 4 },
            { x: 3, y: 9 },
          ]}
          labels={({ datum }) => `$${datum.y}`}
          labelComponent={<VictoryTooltip flyoutStyle={flyoutStyles} />}
        />
      </VictoryGroup>
      <VictoryScatter
        style={{ data: { fill: "#c43a31" } }}
        size={7}
        data={[
          { x: 5, y: 7 },
          { x: 4, y: 4 },
          { x: 3, y: 5 },
          { x: 1, y: 2 },
          { x: 2, y: 3 },
        ]}
        labels={({ datum }) => `$${datum.y}`}
        labelComponent={<VictoryTooltip flyoutStyle={flyoutStyles} />}
      />
    </VictoryChart>
  </VictoryTransition>
);
*/
