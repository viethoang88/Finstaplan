import { useEffect } from "react";
import { useState } from "react";
import SimpleCrudTable from "../../../ui/simple-crud-table";
import {
  customEditor,
  customBody,
  handleDataSubmitted,
} from "./inputs-helpers";
import { useDispatch, useSelector } from "react-redux";

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
      editor: customEditor.bind(null, "investments", "benchmark"),
      body: customBody.bind(null, "investments", "benchmark"),
    },
  },
  {
    field: "actual",
    header: "Actual",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "investments", "benchmark"),
      body: customBody.bind(null, "investments", "benchmark"),
    },
  },
  {
    field: "benchmarkSpouse",
    header: "Benchmark (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "investments", "benchmark"),
      body: customBody.bind(null, "investments", "benchmark"),
    },
  },
  {
    field: "actualSpouse",
    header: "Actual (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "investments", "benchmark"),
      body: customBody.bind(null, "investments", "benchmark"),
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
    kpiArea: "Estate Planning",
    kpi: "Year Will last reviewed",
    property: "will",
    benchmark: 2020,
    actual: 2012,
    benchmarkSpouse: 2100,
    actualSpouse: 2100,
    checked: true,
  },
  {
    kpiArea: "Estate Planning",
    kpi: "Year Power of attorney last reviewed",
    property: "powerOfAttorney",
    benchmark: 2020,
    actual: 2019,
    benchmarkSpouse: 2020,
    actualSpouse: 2020,
    checked: true,
  },
  {
    kpiArea: "Estate Planning",
    kpi: "Year Enduring Guardianship last reviewed",
    property: "guardianship",
    benchmark: 2016,
    actual: 1000,
    benchmarkSpouse: 123,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Estate Planning",
    kpi: "Death Benefit Nominations in Place",
    property: "deathBenefit",
    benchmark: "Yes",
    actual: "Yes",
    benchmarkSpouse: "Yes",
    actualSpouse: "Yes",
    checked: true,
  },
  {
    kpiArea: "Emergency Funds Available",
    kpi: "Emergency Funds Available (in Months)",
    property: "emergencyFundsAvailable",
    benchmark: 6,
    actual: 3,
    benchmarkSpouse: 12,
    actualSpouse: 12,
    checked: true,
  },
  {
    kpiArea: "Insurance",
    kpi: "Life Insurance",
    property: "lifeInsurance",
    benchmark: 2000000,
    actual: 1500000,
    benchmarkSpouse: 121212,
    actualSpouse: 121212,
    checked: true,
  },
  {
    kpiArea: "Insurance",
    kpi: "TPD Insurance",
    property: "disabilityInsurance",
    benchmark: 0,
    actual: 0,
    benchmarkSpouse: 0,
    actualSpouse: 0,
    checked: true,
  },
  {
    kpiArea: "Insurance",
    kpi: "Income Protector Insurance",
    property: "incomeInsurance",
    benchmark: 180000,
    actual: 160000,
    benchmarkSpouse: 1000,
    actualSpouse: 10000,
    checked: true,
  },
  {
    kpiArea: "Insurance",
    kpi: "Trauma Insurance",
    property: "traumaInsurance",
    benchmark: 350000,
    actual: 260000,
    benchmarkSpouse: 1232,
    actualSpouse: 21213,
    checked: true,
  },
  {
    kpiArea: "Insurance",
    kpi: "Optimal Insurance Policies",
    property: "optimalInsurance",
    benchmark: "Yes",
    actual: "No",
    benchmarkSpouse: "Yes",
    actualSpouse: "Yes",
    checked: true,
  },
];

const InputsContingency = ({ hasPartner, maxWidth, handleSetValidInputs }) => {
  const dispatch = useDispatch();
  const dataSubmitFn = handleDataSubmitted("contingency", dispatch);
  const [tableData, setTableData] = useState([...dd]);

  const contingencyBenchmarks = useSelector(
    (state) => state?.factFind?.benchmarking?.contingency
  );

  useEffect(() => {
    if (contingencyBenchmarks === undefined) {
      dataSubmitFn({ newVal: tableData });
    }
  }, [tableData]);

  return (
    <div style={{ maxWidth: maxWidth }}>
      <SimpleCrudTable
        data={tableData}
        type={"Contingency Benchmarks"}
        empty={empty}
        cols={summaryCols}
        addClasses="p-datatable-sm p-datatable-striped"
        id={"benchmarking"}
        canCreate={false}
        canDelete={false}
        // selectionMode={}
        usingStore={false}
        displayHeader={false}
        setParentTempStore={setTableData}
        dataSubmitFn={dataSubmitFn}
        // storeSlice={"factFind"}
        // actionsToUse={authSliceActions}
        // dataSubmitFn={storeSubmitFunction}
        // storeSlice={"auth"}
        // storeNestedPath={[]}
        // usingStore={false}
        // useSaveRevert={true}
        // setParentTempStore={tempSetter}
        // handleRevertClicked={revertHandler}
        // canSave={canSave}
      />
    </div>
  );
};

export default InputsContingency;
