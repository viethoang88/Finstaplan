import { Chart } from "react-google-charts";
import SimpleCrudTable from "../../../ui/simple-crud-table";

const makeGaugeChart = () => {
  return (
    <Chart
      width={800}
      height={300}
      chartType="Gauge"
      loader={<div>Loading Chart</div>}
      data={[
        ["Label", "Value"],
        ["Cash Flow", 97],
        ["Investment", 65],
        ["Contingency", 37.5],
      ]}
      options={{
        redFrom: 0,
        redTo: 50,
        yellowFrom: 50,
        yellowTo: 75,
        greenFrom: 75,
        greenTo: 100,
        minorTicks: 25,
      }}
    />
  );
};

const makeOverallChart = () => {
  return (
    <Chart
      width={800}
      height={300}
      chartType="Gauge"
      loader={<div>Loading Chart</div>}
      data={[
        ["Label", "Value"],
        ["Overall", 79],
      ]}
      options={{
        redFrom: 0,
        redTo: 50,
        yellowFrom: 50,
        yellowTo: 75,
        greenFrom: 75,
        greenTo: 100,
        minorTicks: 25,
      }}
    />
  );
};

// const STATUS_COLS = [
//   {
//     field: "status",
//     header: "Status",
//     type: "custom",
//     options: {
//       editor: customEditor.bind(null, "status"),
//       body: customBody.bind(null, "status"),
//     },
//   },
//   {
//     field: "kpi",
//     header: "Individual KPI",
//     type: "custom",
//     options: {
//       editor: customEditor.bind(null, "kpi"),
//       body: customBody.bind(null, "kpi"),
//     },
//   },
//   {
//     field: "overall",
//     header: "Overall Section Weightinng",
//     type: "custom",
//     options: {
//       editor: customEditor.bind(null, "overall"),
//       body: customBody.bind(null, "overall"),
//     },
//   },
// ];

const summaryCols = [
  {
    field: "category",
    header: "Category",
    type: "uneditable",
  },
  {
    field: "score",
    header: "Score",
    type: "uneditable_percent",
  },
  { field: "weightage", header: "Weightage", type: "uneditable_percent" },
  {
    field: "weightedScore",
    header: "Weighted Score",
    type: "uneditable_percent",
  },
];

const dd = [
  {
    category: "Cash Flow Planning",
    score: 94,
    weightage: 60,
    weightedScore: 56,
  },
  {
    category: "Investment Planning",
    score: 60,
    weightage: 20,
    weightedScore: 12,
  },
  {
    category: "Cash Flow Planning",
    score: 56,
    weightage: 20,
    weightedScore: 9,
  },
];

const BenchmarkSummary = ({}) => {
  return (
    <>
      <div>
        <SimpleCrudTable
          addClasses={"p-datatable-striped p-datatable-sm"}
          selectionMode={"single"}
          usingStore={false}
          data={dd}
          cols={summaryCols}
          type="High Level Summary"
          canCreate={false}
          canDelete={false}
          maxWidth={"65%"}
        />
        <br />
        <br />
      </div>
      <div>{makeGaugeChart()}</div>
      <div>{makeOverallChart()}</div>
    </>
  );
};

export default BenchmarkSummary;
