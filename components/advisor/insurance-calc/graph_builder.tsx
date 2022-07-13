import { Chart } from "react-google-charts";
import DataManager from "../../../classes/DataManager";
import { tjaart } from "../../../dummy_data/client-examples";
import Formulae from "../../../classes/Formulae";

let dm;

const convertParallelArraysToChartData = (
  arrays,
  reshapeOp = (val) => val,
  duplicate = false,
  duplicateOp = (val) => val
) => {
  const results = [];
  const arrLengths = arrays.map((arr) => arr.length);
  const maxLength = Math.max(...arrLengths);

  // console.log("ABOUT TO CONVERT TO PARALLEL ARRAYS");
  // console.log(arrays);
  // console.log(maxLength);

  for (let i = 0; i < maxLength; i++) {
    const innerArray = [i];
    for (let j = 0; j < arrays.length; j++) {
      const currentValue = arrays[j][i];
      if (Number.isFinite(currentValue)) {
        innerArray.push(reshapeOp(currentValue));
        if (duplicate) {
          innerArray.push(duplicateOp(currentValue));
        }
      } else {
        innerArray.push(0);
        if (duplicate) {
          innerArray.push(0);
        }
      }
    }
    results.push(innerArray);
  }
  return results;
};

export const buildIpGraph = (clientData, assumptions) => {
  if (assumptions === undefined || assumptions.lenght === 0) return;
  // console.log(clientData);
  // console.log(assumptions);
  if (dm === undefined) {
    dm = new DataManager(tjaart, assumptions);
  }
  const fvByPerson = dm.getFutureSalaryValuesByPerson("incomes");
  // console.log(fvByPerson);

  const dataLabels = Object.keys(fvByPerson).flatMap((name) => [
    `${name}'s IP Benefits (Before Tax)`,
    `${name}'s' IP Benefits (After Tax)`,
  ]);
  // console.log(dataLabels);

  const taxRate = 0.1;
  const graphData = convertParallelArraysToChartData(
    Object.values(fvByPerson),
    (val) => val * 0.75,
    true,
    (val) => val * 0.75 * (1 - taxRate)
  );
  // console.log(graphData);
  //   if (data === undefined) return <></>;
  //   if (
  //     clientData === undefined ||
  //     assumptions === undefined
  //   )
  //     return <></>;

  const ticks = graphData.map(([idx]) => idx);
  return (
    <div style={{ minWidth: "100%", padding: 0, margin: 0 }}>
      <Chart
        width={"100%"}
        height={"750px"}
        chartType="ComboChart"
        loader={<div>Loading Chart</div>}
        // Year / Growth / Expenses / Net Worth
        data={[["Years from now"].concat(dataLabels), ...graphData]}
        options={{
          backgroundColor: "#fff",
          // is3D: true,
          colors: ["lightskyblue", "lightgreen", "darkblue", "darkgreen"],
          title: "Income Protection",
          vAxis: { title: "", format: "currency" },
          hAxis: { title: "Years from now", ticks: ticks },
          seriesType: "bars",
          // series: {
          //   0: { type: "line" },
          //   // 1: { type: "line" },
          //   2: { type: "area" },
          //   3: { type: "line" },
          // },
          animation: {
            duration: 1000,
            easing: "out",
            startup: true,
          },
          enableInteractivity: true,
        }}
      />
    </div>
  );
};

export const buildRequirementsGraph = (
  title,
  incomeRequirements,
  liabilities,
  offsets,
  totalRequirement,
  minimumRequirement
) => {
  // console.log("--- ***BUILDING A REQUIREMENTS GRAPH*** ---");
  // console.log(incomeRequirements);
  // console.log(offsets);
  const npvIncomeReq = incomeRequirements;
  const npvOffsets = offsets;

  // console.log(npvIncomeReq);
  // console.log(npvOffsets);
  // console.log(liabilities);
  // console.log(totalRequirement);
  // console.log(minimumRequirement);

  // const npvIncomeReq = Formulae.getNPVoverArray(
  //   3.5,
  //   0,
  //   Object.values(incomeRequirements)
  // );
  // const npvOffsets = Formulae.getNPVoverArray(3.5, 0, Object.values(offsets));
  // console.log(npvIncomeReq);
  // console.log(npvOffsets);
  //   const graphData = [
  //     [
  //       "",
  //       "Income Requirements",
  //       "Liabilities & Other Lump Sum",
  //       "Offsets",
  //       "Total Requirements",
  //       "Minimum Requirements",
  //     ],
  //     [
  //       "",
  //       npvIncomeReq,
  //       liabilities,
  //       npvOffsets,
  //       totalRequirement,
  //       minimumRequirement,
  //     ],
  //   ];

  const graphData = [
    [
      "Category",
      "$ Value",
      { role: "style" },
      {
        sourceColumn: 0,
        role: "annotation",
        type: "string",
        calc: "stringify",
      },
    ],
    ["Expense Requirements", npvIncomeReq, "salmon", null],
    ["Liabilities & Other Lump Sum", liabilities, "lightsalmon", null],
    ["Offsets", npvOffsets, "orange", null],
    ["Total Requirements", totalRequirement, "darkgreen", null],
    ["Minimum Requirements", minimumRequirement, "lightgreen", null],
  ];

  return (
    <Chart
      width={"100%"}
      height={"750px"}
      chartType="ColumnChart"
      loader={<div>Loading Chart</div>}
      data={graphData}
      options={{
        backgroundColor: "#fff",
        // is3D: true,
        // colors: ["salmon", "lightsalmon", "orange", "darkgreen", "lightgreen"],
        title: title,
        vAxis: { title: "", format: "currency" },
        hAxis: { title: "" },
        animation: {
          duration: 1000,
          easing: "out",
          startup: true,
        },
        enableInteractivity: true,
        bar: { groupWidth: "85%" },
        legend: { position: "none" },
      }}
    />
  );
};
