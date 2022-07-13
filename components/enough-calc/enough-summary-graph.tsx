import { Chart } from "react-google-charts";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import Formulae from "../../classes/Formulae";
/*   
        <Chart
          width={"100%"}
          height={"750px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={shapedData}
          options={{
            title: "Asset allocations by asset class",
            chartArea: { width: "60%" },
            isStacked: true,
            hAxis: {
              title: "Portfolio Allocations",
              minValue: 0,
            },
            vAxis: {
              title: "Portfolio",
            },
            colors: colors,
          }}

          // For tests
          // rootProps={{ "data-testid": "3" }}
        />*/

const buildGraph = (graphData, enough) => {
  if (graphData === undefined) return;

  const expenses = graphData.expenses.slice(0, enough);
  const netWorths = graphData.netWorths.slice(0, enough);
  const enoughNumber = Formulae.getNPVoverArray(3.5, 0, expenses);
  const startingCapital = Formulae.getNPVoverArray(3.5, 0, netWorths);
  console.log("------- BUILDING SUMMARY GRAPH WITH --------");
  console.log(enoughNumber);
  console.log(startingCapital);

  const data = [
    ["", 8633518, 0, 0],
    ["", 0, 1268800, 2248000],
  ];

  return (
    <Chart
      width={"35vw"}
      height={"450px"}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      // Enough Number / Starting Capital / Total Retirement Incomes
      data={[
        ["", "Enough Number", "Starting Capital", "Total Retirement Incomes"],
        ...data,
      ]}
      options={{
        backgroundColor: "transparent",
        is3D: true,
        isStacked: true,
        bars: "vertical",
        colors: ["lightskyblue", "lightgreen", "lightsalmon"],
        hAxis: { title: "$ Amount", format: "currency" },
        // hAxis: { title: "Years from now", ticks: ticks },
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

const EnoughSummaryGraph = ({
  getSummaryGraphData,
  recomputeGraph,
  configOptions,
  enough,
}) => {
  const [graphData, setGraphData] = useState(undefined);

  const graph = useMemo(() => buildGraph(graphData, enough), [graphData]);
  useEffect(() => {
    const summaryGraphData = getSummaryGraphData(configOptions);
    console.log(summaryGraphData);
    setGraphData(summaryGraphData);
  }, [recomputeGraph]);
  return (
    <div
      style={{
        position: "relative",
        top: "-18rem",
        zIndex: 350,
        maxWidth: "35vw",
      }}
    >
      {graph}
    </div>
  );
};

export default EnoughSummaryGraph;
