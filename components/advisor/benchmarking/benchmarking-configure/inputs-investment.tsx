import { useEffect, useState } from "react";
import SimpleCrudTable from "../../../ui/simple-crud-table";
import {
  customEditor,
  customBody,
  selectEditor,
  addKeyToEditorAssignerMap,
  handleDataSubmitted,
} from "./inputs-helpers";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../../../../store/auth";

const summaryCols = [
  // {
  //   field: "kpiArea",
  //   header: "KPI Area",
  //   type: "uneditable",
  // },
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
      editor: customEditor.bind(null, "investments", "actual"),
      body: customBody.bind(null, "investments", "actual"),
    },
  },
  {
    field: "benchmarkSpouse",
    header: "Benchmark (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "investments", "benchmarkSpouse"),
      body: customBody.bind(null, "investments", "benchmarkSpouse"),
    },
  },
  {
    field: "actualSpouse",
    header: "Actual (Partner)",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "investments", "actualSpouse"),
      body: customBody.bind(null, "investments", "actualSpouse"),
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
    kpiArea: "Risk Tolerance",
    kpi: "Risk Tolerance",
    property: "riskTolerance",
    benchmark: "Growth",
    actual: "Growth",
    benchmarkSpouse: "Growth",
    actualSpouse: "Growth",
    checked: true,
  },
  {
    kpiArea: "Rate of Return",
    kpi: "Rate of Return",
    property: "rateOfReturn",
    benchmark: 5.7,
    actual: 6.0,
    benchmarkSpouse: 12,
    actualSpouse: 10,
    checked: true,
  },
  {
    kpiArea: "Growth Assets",
    kpi: "Growth Assets",
    property: "growthAssets",
    benchmark: 50,
    actual: 56,
    benchmarkSpouse: 12,
    actualSpouse: 10,
    checked: true,
  },
  {
    kpiArea: "Liquidity",
    kpi: "Liquidity",
    property: "liquidity",
    benchmark: 10,
    actual: 12,
    benchmarkSpouse: 12,
    actualSpouse: 10,
    checked: true,
  },
  {
    kpiArea: "Cash Reserves",
    kpi: "Cash Reserves",
    property: "cashReserves",
    benchmark: 4,
    actual: 1,
    benchmarkSpouse: 5,
    actualSpouse: 1,
    checked: true,
  },
];

const InputsInvestment = ({ hasPartner, maxWidth, handleSetValidInputs }) => {
  const portfolios = useSelector((state) => state.auth.portfolios);
  const assumptions = useSelector((state) => state.auth.assumptions);
  const gvd = useSelector((state) => state.auth.growthVsDefensive);
  const [renderTable, setRenderTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [portfolioOptions, setPortfolioOptions] = useState();

  const dispatch = useDispatch();
  const dataSubmitFn = handleDataSubmitted("investment", dispatch);

  // NEED TO SET THIS:
  const selectedPortfolioRate = (state) =>
    state.factFind?.riskProfile?.portfolios;

  const investmentBenchmarks = useSelector(
    (state) => state?.factFind?.benchmarking?.investment
  );

  useEffect(() => {
    if (
      investmentBenchmarks === undefined ||
      investmentBenchmarks.length === 0
    ) {
      dataSubmitFn({ newVal: tableData });
    }
  }, [tableData]);

  useEffect(() => {
    if (portfolios === undefined) {
      dispatch(fetchData);
    }
  }, []);

  useEffect(() => {
    if (portfolios === undefined) return;

    const portfolioOptions = portfolios.map((pf) => ({
      label: pf.portfolioName,
      value: pf.portfolioName,
    }));

    const defaultPortfolioName = assumptions.find(
      (ass) => ass.type === "defaultGrowthRate"
    )?.value;
    const defaultPortfolio = portfolios.find(
      (pf) => pf.portfolioName === defaultPortfolioName
    );
    const defaultGrowthRate = defaultPortfolio?.expectedGrowth;
    const [_, growth] = gvd;
    const defaultGrowthAllocations = growth?.[defaultPortfolioName];
    setTableData((prevState) => {
      const newState = [...dd];
      const newRoR = { ...newState[1] };
      newRoR["benchmark"] = defaultGrowthRate;
      const newGrowthAssets = { ...newState[2] };
      newGrowthAssets["benchmark"] = defaultGrowthAllocations;
      console.log(newState);
      return newState;
    });
    // setPortfolioOptions();
    addKeyToEditorAssignerMap("riskTolerance", selectEditor, portfolioOptions);
  }, [portfolios]);

  useEffect(() => {
    console.log(tableData);
    if (tableData.length > 0) {
      setRenderTable(true);
    }
  }, [tableData]);

  return (
    <div style={{ maxWidth: maxWidth }}>
      {renderTable && (
        <SimpleCrudTable
          data={tableData}
          type={"Investment Benchmarks"}
          empty={empty}
          cols={summaryCols}
          addClasses="p-datatable-sm p-datatable-striped"
          id={"benchmarking"}
          canCreate={false}
          canDelete={false}
          selectionMode={undefined}
          usingStore={false}
          dataSubmitFn={() => {}}
          handleSelectClicked={() => {}}
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
      )}
    </div>
  );
};

export default InputsInvestment;
