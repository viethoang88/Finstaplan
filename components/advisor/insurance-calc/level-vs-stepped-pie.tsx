import Chart from "react-google-charts";

const typeToLabelMap = new Map([
  ["life", "Life Insurance"],
  ["tpd", "Total & Permanent Disability"],
  ["trauma", "Trauma Insurance"],
  ["ip", "Income Protector Insurance"],
]);

const LevelVsSteppedPie = ({ type, graphData, getPieData }) => {
  // const _graphData = getPieData(graphData, type);
  return (
    <Chart
      width={"550px"}
      height={"550px"}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={[...getPieData(graphData, type)]}
      style={{ padding: 0 }}
      options={{
        title: `${typeToLabelMap.get(type)}`,
        pieHole: 0.3,
        slices: {
          1: { color: "orange" },
          0: { color: "darkblue" },
          //   0: { color: "rgb(166, 206, 227)" },
          //   1: { color: "rgb(31, 120, 180)" },
          //   2: { color: "rgb(166, 206, 227)" },
          //   3: { color: "darkgreen" },
          //   4: { color: "rgb(166, 206, 227)" },
          //   5: { color: "rgb(31, 120, 180)" },
        },
        // legend: "none",
      }}
    />
  );
};

export default LevelVsSteppedPie;
