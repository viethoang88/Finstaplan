import SimpleCrudTable from "../../../ui/simple-crud-table";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  customBody,
  customEditor,
  handleDataSubmitted,
} from "./inputs-helpers";
import { useEffect } from "react";

const summaryCols = [
  {
    field: "checked",
    header: "",
    type: "custom_editable",
    options: {
      editor: customEditor.bind(null, "investments", "selected"),
      body: customEditor.bind(null, "investments", "selected"),
    },
  },
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
      editor: customEditor.bind(null, "cashFlow", "benchmark"),
      body: customBody.bind(null, "cashFlow", "benchmark"),
    },
  },
  {
    field: "actual",
    header: "Actual",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cashFlow", "benchmark"),
      body: customBody.bind(null, "cashFlow", "benchmark"),
    },
  },
  {
    field: "benchmarkSpouse",
    header: "Benchmark (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cashFlow", "benchmark"),
      body: customBody.bind(null, "cashFlow", "benchmark"),
    },
  },
  {
    field: "actualSpouse",
    header: "Actual (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cashFlow", "benchmark"),
      body: customBody.bind(null, "cashFlow", "benchmark"),
    },
  },
];

const empty = {
  kpiArea: "",
  kpi: "",
  benchmark: 0,
  actual: 0,
  benchmarkPartner: 0,
  actualPartner: 0,
};

const dd = [
  {
    kpiArea: "Income",
    kpi: "Income",
    property: "income",
    benchmark: 800000,
    actual: 690000,
    benchmarkSpouse: 200000,
    actualSpouse: 200000,
    checked: true,
  },
  {
    kpiArea: "Tax",
    kpi: "Tax",
    property: "tax",
    benchmark: 192307,
    actual: 192000,
    benchmarkSpouse: 1230,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Savings",
    kpi: "Super Contributions",
    property: "super",
    benchmark: 20000,
    actual: 1000,
    benchmarkSpouse: 123,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Savings",
    kpi: "Investment Savings",
    property: "investments",
    benchmark: 30000,
    actual: 30000,
    benchmarkSpouse: 123,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Savings",
    kpi: "Offset",
    property: "offset",
    benchmark: 100000,
    actual: 100000,
    benchmarkSpouse: 1213,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Living Costs",
    kpi: "Living Costs",
    property: "livingCosts",
    benchmark: 97000,
    actual: 80000,
    benchmarkSpouse: 12313,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Capital Costs",
    kpi: "Capital Costs",
    property: "capitalCosts",
    benchmark: 15000,
    actual: 0,
    benchmarkSpouse: 313,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Debt",
    kpi: "Debt",
    property: "debt",
    benchmark: 500000,
    actual: 0,
    benchmarkSpouse: 13,
    actualSpouse: 10000,
    checked: true,
  },
];

// dataSubmitFn({
//   newVal: latestState,
//   key: id,
//   updatedField,
//   updatedValue,
//   rowIndex,
//   action,
//   deleted,
// });

const InputsCashflow = ({ hasPartner, maxWidth, handleSetValidInputs }) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([...dd]);
  const dataSubmitFn = handleDataSubmitted("cashFlow", dispatch);
  const cashFlowBenchmarks = useSelector(
    (state) => state?.factFind?.benchmarking?.cashFlow
  );

  useEffect(() => {
    if (cashFlowBenchmarks === undefined) {
      dataSubmitFn({ newVal: tableData });
    }
  }, [tableData]);

  return (
    <div style={{ maxWidth: maxWidth }}>
      <SimpleCrudTable
        data={tableData}
        type={"Cash Flow Benchmarks"}
        empty={empty}
        cols={summaryCols}
        addClasses="p-datatable-sm p-datatable-striped"
        id={"benchmarking"}
        canCreate={false}
        canDelete={false}
        selectionMode={undefined}
        usingStore={false}
        dataSubmitFn={dataSubmitFn}
        displayHeader={false}
        // storeSlice={"factFind"}
        // actionsToUse={authSliceActions}
        // dataSubmitFn={storeSubmitFunction}
        // storeSlice={"auth"}
        // storeNestedPath={[]}
        // usingStore={false}
        // useSaveRevert={true}
        setParentTempStore={setTableData}
        // handleRevertClicked={revertHandler}
        // canSave={canSave}
      />
    </div>
  );
};

export default InputsCashflow;
