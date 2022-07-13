import SimpleCrudTable from "../../../ui/simple-crud-table";
import {
  customEditor,
  customBody,
} from "../benchmarking-configure/inputs-helpers";
const summaryCols = [
  {
    field: "kpiArea",
    header: "KPI Area",
    type: "uneditable",
  },
  {
    field: "kpi",
    header: "KPI",
    type: "uneditable",
  },
  {
    field: "benchmark",
    header: "Benchmark",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "benchmark"),
      body: customBody.bind(null, "results", "benchmark"),
    },
  },
  {
    field: "actual",
    header: "Actual",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "actual"),
      body: customBody.bind(null, "results", "actual"),
    },
  },
  {
    field: "benchmarkSpouse",
    header: "Benchmark (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "benchmarkSpouse"),
      body: customBody.bind(null, "results", "benchmarkSpouse"),
    },
  },
  {
    field: "actualSpouse",
    header: "Actual (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "actualSpouse"),
      body: customBody.bind(null, "results", "actualSpouse"),
    },
  },
  {
    field: "delta",
    header: "Delta",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "delta"),
      body: customBody.bind(null, "results", "delta"),
    },
  },
  {
    field: "rating",
    header: "Rating (This Year)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "rating"),
      body: customBody.bind(null, "results", "rating"),
    },
  },
  {
    field: "ratingLast",
    header: "Rating (Last Year)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "ratingLast"),
      body: customBody.bind(null, "results", "ratingLast"),
    },
  },
  {
    field: "status",
    header: "Status",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "status"),
      body: customBody.bind(null, "results", "status"),
    },
  },
  {
    field: "score",
    header: "Score",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "results", "score"),
      body: customBody.bind(null, "results", "score"),
    },
  },
];

export const shapeBenchmarkDataForResultsTable = (
  settings,
  results,
  benchmarkSettings
) => {
  const mergedData = [];
  let idx = 0;
  for (let obj of benchmarkSettings) {
    mergedData.push({ id: idx, ...obj, ...results[obj.property] });
    idx += 1;
  }
  return mergedData;
};

const BenchmarkResults = ({
  resultsData,
  profileData,
  type,
  benchmarkSettings,
}) => {
  if (benchmarkSettings === undefined) return <></>;

  const data = shapeBenchmarkDataForResultsTable(
    profileData,
    resultsData,
    benchmarkSettings
  );
  console.log("------ reshaped data ------");
  console.log(data);
  return (
    <SimpleCrudTable
      addClasses={"p-datatable-striped p-datatable-sm"}
      selectionMode={undefined}
      usingStore={false}
      data={data}
      cols={summaryCols}
      type={type}
      canCreate={false}
      canDelete={false}
      maxWidth={"100%"}
    />
  );
};

export default BenchmarkResults;
