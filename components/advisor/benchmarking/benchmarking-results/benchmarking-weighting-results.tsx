import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, authSliceActions } from "../../../../store/auth";
import SimpleCrudTable from "../../../ui/simple-crud-table";
import WeightingSums from "../benchmarking-configure/weighting-sums";

import {
  getMaxId,
  addTwoObjectsByKeys,
  allocationSumTemplate,
} from "../../licensee-allocation";
import { InputNumber } from "primereact/inputnumber";

Map.prototype.getKey = function (targetValue) {
  let iterator = this[Symbol.iterator]();
  for (const [key, value] of iterator) {
    if (value === targetValue) return key;
  }
};

const templatePadding = "1.5rem";
const templateBorderRadius = "4%";
const transparencyLevel = "0.25";
const onTrackColor = `rgba(76, 175, 79, ${transparencyLevel})`;
const onWatchColor = `rgba(251, 192, 45, ${transparencyLevel})`;
const cautionColor = `rgba(211, 47, 47, ${transparencyLevel})`;

const mapTypeToLabel = new Map([
  ["income", "Income"],
  ["tax", "Tax"],
  ["savings", "Savings"],
  ["livingCosts", "Living Costs"],
  ["capitalCosts", "Capital Costs"],
  ["debt", "Debt"],
  ["estatePlanning", "Estate Planning"],
  ["emergencyFundsAvailable", "Emergency Funds Available"],
  ["lifeInsurance", "Life Insurance"],
  ["disabilityInsurance", "Disability Insurance"],
  ["incomeInsurance", "Income Insurance"],
  ["traumaInsurance", "Trauma Insurance"],
  ["optimalStructure", "Optimal Insurance Structure"],
  ["riskTolerance", "Risk Tolerance"],
  ["rateOfReturn", "Rate of Return"],
  ["growthAssets", "Growth Assets"],
  ["liquidity", "Liquidity"],
  ["cashReserves", "Cash Reserves"],
]);

const mapLabelToType = (label) => {
  //return [...mapTypeToLabel].find(([key, value]) => label === value)[0];
  return mapTypeToLabel.getKey(label);
};

const getEmptyAcc = (_maxId) => {
  const empty = {
    id: String(_maxId + 1),
    weighting: 0,
    onTrack: 0,
    caution: 0,
    onWatch: "",
    score: 0,
    weightedScore: 0,
    rating: "",
  };
  return empty;
};

// const reshapeBmProfileForTable = (section) => {
//   if (section === undefined) return [];
//   const reshapedData = [];
//   let idx = 0;
//   for (let [key, value] of Object.entries(section)) {
//     reshapedData.push({
//       weighting: value?.weighting,
//       onTrack: value?.onTrack,
//       caution: value?.caution,
//       onWatch: `${value?.onTrack} <= delta <= ${value?.caution}`,
//       kpiArea: mapTypeToLabel.get(key),
//       id: String(idx),
//     });
//     idx += 1;
//   }
//   return reshapedData;
// };
// const reshapeBmProfileForStore = (section) => {
//   return section.reduce((acc, next) => {
//     return {
//       ...acc,
//       [mapLabelToType(next.kpiArea)]: {
//         weighting: next?.weighting,
//         onTrack: next?.onTrack,
//         caution: next?.caution,
//         // onWatch: `${next?.onTrack} <= delta <= ${next?.caution}`,
//       },
//     };
//   }, {});
// };

const percentEditor = (onEditorValueChange, id, props, field) => {
  return (
    <InputNumber
      value={props.rowData[field]}
      onValueChange={(e) => onEditorValueChange(id, props, e.value)}
      // suffix="%"
      mode="decimal"
      minFractionDigits={2}
      style={{ maxWidth: "100%" }}
    />
  );
};

const percentBodyTemplate = (fieldType, rowData, { field }) => {
  const backgroundColor =
    fieldType === "onTrack"
      ? onTrackColor
      : fieldType === "caution"
      ? cautionColor
      : "transparent";

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        padding: templatePadding,
        borderRadius: templateBorderRadius,
        textAlign: fieldType !== "weighting" ? "center" : "left",
      }}
    >
      {fieldType === "onTrack" && <span>Delta &le;&nbsp;</span>}
      {fieldType === "caution" && <span>Delta &ge;&nbsp;</span>}
      {new Intl.NumberFormat("en-US", {
        style: "percent",
        maximumSignificantDigits: 6,
      }).format(rowData[field] / 100)}
    </div>
  );
};

const customBodyTemplate = (color, render) => {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: templatePadding,
        borderRadius: templateBorderRadius,
        textAlign: "center",
      }}
    >
      {render}
    </div>
  );
};

const onWatchTemplate = (id, props, field) => {
  return onWatchTemplateBody(props.rowData, field); //props.rowData[field];
};

const onWatchTemplateBody = (rowData, { field }) => {
  const customTemplate = handleCustomBodyRequirements(
    "onWatch",
    rowData,
    field
  );
  if (customTemplate !== undefined) return customTemplate;

  return (
    <div
      style={{
        backgroundColor: onWatchColor,
        padding: templatePadding,
        borderRadius: templateBorderRadius,
        textAlign: "center",
      }}
    >
      {rowData.onTrack}% &le; Delta &le; {rowData.caution}%
    </div>
  );
};

const handleCustomBodyRequirements = (fieldType, rowData, field) => {
  if (fieldType === "weighting") return undefined;

  const backgroundColor =
    fieldType === "onTrack"
      ? onTrackColor
      : fieldType === "caution"
      ? cautionColor
      : "transparent";

  if (rowData.kpiArea === "Optimal Insurance Structure") {
    if (fieldType === "onWatch") {
      return customBodyTemplate(onWatchColor, "N/A");
    }
    const render = fieldType === "onTrack" ? "Yes" : "No";
    return customBodyTemplate(backgroundColor, render);
  } else if (rowData.kpiArea === "Risk Tolerance") {
    if (fieldType === "onWatch") {
      return customBodyTemplate(onWatchColor, "N/A");
    }
    const render = fieldType === "onTrack" ? "Unchanged" : "Changed";
    return customBodyTemplate(backgroundColor, render);
  } else {
    return undefined;
  }
};

const customEditor = (fieldType, onEditorValueChange, id, props, field) => {
  if (fieldType === "onWatch") return onWatchTemplate(id, props, field);
  const customTemplate = handleCustomBodyRequirements(
    fieldType,
    props.rowData,
    field
  );
  if (customTemplate !== undefined) return customTemplate;

  return percentEditor(onEditorValueChange, id, props, field);
};
const customBody = (fieldType, rowData, data) => {
  //   console.log("I AM A CUSTOM BODY FN FOR ", fieldType);
  //   console.log(rowData);
  if (fieldType === "onWatch") return onWatchTemplateBody(rowData, data);

  const customTemplate = handleCustomBodyRequirements(
    fieldType,
    rowData,
    data.field
  );
  if (customTemplate !== undefined) return customTemplate;

  return percentBodyTemplate(fieldType, rowData, data);
};

const KPI_COLS = [
  { field: "kpiArea", header: "KPI Areas", type: "uneditable" },
  {
    field: "weighting",
    header: "Section Weighting",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "weighting"),
      body: customBody.bind(null, "weighting"),
    },
  },
  {
    field: "onTrack",
    header: "On Track",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "onTrack"),
      body: customBody.bind(null, "onTrack"),
    },
  },
  {
    field: "onWatch",
    header: "On Watch",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "onWatch"),
      body: customBody.bind(null, "onWatch"),
    },
  },
  {
    field: "caution",
    header: "On Caution",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "caution"),
      body: customBody.bind(null, "caution"),
    },
  },
  {
    field: "score",
    header: "Score",
    type: "uneditable_percent",
  },
  {
    field: "weightedScore",
    header: "Weighted Score",
    type: "uneditable_percent",
  },
  {
    field: "rating",
    header: "Rating",
    type: "uneditable",
  },
];

const generateCrudTable = (
  data,
  type,
  label,
  tempSetter,
  revertHandler,
  storeSubmitFunction,
  canSave,
  empty = {},
  cols = {}
) => {
  console.log(data);
  return (
    <SimpleCrudTable
      data={data}
      type={label}
      empty={empty}
      cols={cols}
      addClasses="p-datatable-sm p-datatable-striped"
      usingStore={false}
      id={type}
      canCreate={false}
      canDelete={false}
      selectionMode={undefined}
      //   useSaveRevert={true}
      //   setParentTempStore={tempSetter}
      //   handleRevertClicked={revertHandler}
      //   canSave={canSave}
    />
  );
};

const BenchmarkingWeightingResults = () => {
  // cashFlow, contingency, investment:
  //   const benchmarkingProfile = useSelector(
  //     (state) => state.auth.benchmarkingProfile
  //   );
  //   const [summedColumns, setSummedColumns] = useState({
  //     cashFlow: undefined,
  //     contingency: undefined,
  //     investment: undefined,
  //   });
  //   const [canSaves, setCanSaves] = useState({
  //     cashFlow: false,
  //     contingency: false,
  //     investment: false,
  //   });

  //   const [tempCashflow, setTempCashflow] = useState(
  //     reshapeBmProfileForTable(benchmarkingProfile?.cashFlow)
  //   );
  //   const [tempContingency, setTempContingency] = useState(
  //     reshapeBmProfileForTable(benchmarkingProfile?.contingency)
  //   );
  //   const [tempInvestment, setTempInvestment] = useState(
  //     reshapeBmProfileForTable(benchmarkingProfile?.investment)
  //   );

  //   const [tempCashflowEdited, setTempCashflowEdited] = useState([]);
  //   const [tempContingencyEdited, setTempContingencyEdited] = useState([]);
  //   const [tempInvestmentEdited, setTempInvestmentEdited] = useState([]);

  //   const mapSetterToField = new Map([
  //     ["cashFlow", setTempCashflow],
  //     ["contingency", setTempContingency],
  //     ["investment", setTempInvestment],
  //   ]);

  //   useEffect(() => {
  //     _setSummedColumns("cashFlow", tempCashflow);
  //   }, [tempCashflow]);
  //   useEffect(() => {
  //     _setSummedColumns("contingency", tempContingency);
  //   }, [tempContingency]);
  //   useEffect(() => {
  //     _setSummedColumns("investment", tempInvestment);
  //   }, [tempInvestment]);

  //   useEffect(() => {
  //     _setSummedColumns("cashFlow", tempCashflowEdited);
  //   }, [tempCashflowEdited]);
  //   useEffect(() => {
  //     _setSummedColumns("contingency", tempContingencyEdited);
  //   }, [tempContingencyEdited]);
  //   useEffect(() => {
  //     _setSummedColumns("investment", tempInvestmentEdited);
  //   }, [tempInvestmentEdited]);

  //   const _setSummedColumns = (fieldType, updatedState) => {
  //     if (updatedState.length === 0) return;
  //     console.log(updatedState);
  //     const sum = updatedState.reduce((acc, next) => acc + next.weighting, 0);
  //     const summedColumns = [
  //       {
  //         weighting: sum,
  //         id: "0",
  //         caution: "",
  //         kpiArea: "",
  //         onTrack: "",
  //         onWatch: "",
  //       },
  //     ];
  //     setCanSaves((prevState) => ({ ...prevState, [fieldType]: sum === 100 }));
  //     setSummedColumns((prevState) => ({
  //       ...prevState,
  //       [fieldType]: summedColumns,
  //     }));
  //   };

  //   const setTemps = (benchmarkingProfile) => {
  //     const cf = reshapeBmProfileForTable(benchmarkingProfile.cashFlow);
  //     const cont = reshapeBmProfileForTable(benchmarkingProfile.contingency);
  //     const inv = reshapeBmProfileForTable(benchmarkingProfile.investment);
  //     setTempCashflow(cf);
  //     setTempContingency(cont);
  //     setTempInvestment(inv);
  //   };

  useEffect(() => {
    if (benchmarkingProfile === undefined) {
      dispatch(fetchData());
    } else {
      setTemps(benchmarkingProfile);
    }
  }, []);

  useEffect(() => {
    if (benchmarkingProfile === undefined) return;
    setTemps(benchmarkingProfile);
  }, [benchmarkingProfile]);

  const revertHandler = (type, _data) => {
    console.log("---- handle revert clicked ----");
    console.log(_data);
    const setterFn = mapSetterToField.get(type);
    setterFn(_data);
  };

  return <></>;
};

export default BenchmarkingWeightingResults;

//   <div>
//     {generateCrudTable(
//       tempCashflow,
//       "cashFlow",
//       "Cash Flow",
//       setTempCashflowEdited,
//       revertHandler.bind(null, "cashFlow"),
//       dispatchChanges,
//       canSaves.cashFlow,
//       getEmptyAcc(getMaxId(tempCashflow)),
//       KPI_COLS
//     )}
//     {summedColumns.cashFlow !== undefined && (
//       <WeightingSums
//         allocationSumTemplate={allocationSumTemplate}
//         summedColumns={summedColumns.cashFlow}
//         cols={KPI_COLS}
//         sumFields={["weighting"]}
//       />
//     )}
//   </div>
