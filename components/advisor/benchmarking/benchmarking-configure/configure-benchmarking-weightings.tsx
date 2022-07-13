import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, authSliceActions } from "../../../../store/auth";
import SimpleCrudTable from "../../../ui/simple-crud-table";
import WeightingSums from "./weighting-sums";

import { getMaxId, allocationSumTemplate } from "../../licensee-allocation";
import { InputNumber } from "primereact/inputnumber";

const templatePadding = "1.5rem";
const templateBorderRadius = "4%";
const transparencyLevel = "0.25";
const onTrackColor = `rgba(76, 175, 79, ${transparencyLevel})`;
const onWatchColor = `rgba(251, 192, 45, ${transparencyLevel})`;
const cautionColor = `rgba(211, 47, 47, ${transparencyLevel})`;

const percentEditor = (onEditorValueChange, id, props, field) => {
  console.log(field);
  const rowName = props.rowData.combination;

  if (field === "cf" || field === "in" || field === "cn")
    return percentBodyTemplate("", props.rowData, { field });
  else if (field === "cf/in" && rowName === "Contingency")
    return percentBodyTemplate("", props.rowData, { field });
  else if (field === "in/cn" && rowName === "Cash Flow")
    return percentBodyTemplate("", props.rowData, { field });
  else if (field === "cf/cn" && rowName === "Investment")
    return percentBodyTemplate("", props.rowData, { field });

  return (
    <InputNumber
      value={props.rowData[field]}
      onValueChange={(e) => onEditorValueChange(id, props, e.value)}
      // suffix="%"
      mode="decimal"
      minFractionDigits={2}
      min={0}
      max={100}
      style={{ maxWidth: "100%" }}
    />
  );
};

const percentBodyTemplate = (fieldType, rowData, { field }) => {
  const percentValue = rowData[field];
  let backgroundColor;

  if (percentValue > 85) {
    backgroundColor = onTrackColor;
  } else if (percentValue > 55) {
    backgroundColor = onWatchColor;
  } else if (percentValue > 25) {
    backgroundColor = cautionColor;
  } else {
    backgroundColor = "transparent";
  }

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        padding: templatePadding,
        borderRadius: templateBorderRadius,
      }}
    >
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

const handleCustomBodyRequirements = (fieldType, rowData, field) => {
  if (fieldType !== "status") return undefined;

  const backgroundColor =
    rowData.status === "Caution"
      ? cautionColor
      : rowData.status === "On Watch"
      ? onWatchColor
      : onTrackColor;
  return customBodyTemplate(backgroundColor, rowData.status);
};

const customEditor = (fieldType, onEditorValueChange, id, props, field) => {
  const customTemplate = handleCustomBodyRequirements(
    fieldType,
    props.rowData,
    field
  );
  if (customTemplate !== undefined) return customTemplate;

  return percentEditor(onEditorValueChange, id, props, field);
};
const customBody = (fieldType, rowData, data) => {
  const customTemplate = handleCustomBodyRequirements(
    fieldType,
    rowData,
    data.field
  );
  if (customTemplate !== undefined) return customTemplate;

  return percentBodyTemplate(fieldType, rowData, data);
};

const defaultStatusAllocs = {
  status: [
    { status: "Caution", kpi: 0, overall: 0 },
    { status: "On Watch", kpi: 50, overall: 50 },
    { status: "On Track", kpi: 100, overall: 75 },
  ],
  combination: [
    {
      combination: "Cash Flow",
      cf: 100,
      in: 0,
      cn: 0,
      "cf/in": 50,
      "in/cn": 0,
      "cf/cn": 50,
      "cf/in/cn": 60,
    },
    {
      combination: "Investment",
      cf: 0,
      in: 100,
      cn: 0,
      "cf/in": 50,
      "in/cn": 60,
      "cf/cn": 0,
      "cf/in/cn": 20,
    },
    {
      combination: "Contingency",
      cf: 0,
      in: 0,
      cn: 100,
      "cf/in": 0,
      "in/cn": 40,
      "cf/cn": 50,
      "cf/in/cn": 20,
    },
  ],
};

const getEmptyAccStatus = (_maxId) => {
  const empty = {
    id: String(_maxId + 1),
    status: "",
    kpi: 0,
    overall: 0,
  };
  return empty;
};

const STATUS_COLS = [
  {
    field: "status",
    header: "Status",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "status"),
      body: customBody.bind(null, "status"),
    },
  },
  {
    field: "kpi",
    header: "Individual KPI",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "kpi"),
      body: customBody.bind(null, "kpi"),
    },
  },
  {
    field: "overall",
    header: "Overall Section Weightinng",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "overall"),
      body: customBody.bind(null, "overall"),
    },
  },
];

const getEmptyAccCombination = (_maxId) => {
  const empty = {
    id: String(_maxId + 1),
    combination: "",
    cf: 0,
    in: 0,
    cn: 0,
    "cf/in": 0,
    "in/cn": 0,
    "cf/cn": 0,
    "cf/in/cn": 0,
  };
  return empty;
};

const COMBINATION_COLS = [
  {
    field: "combination",
    header: "Combination",
    type: "uneditable",
  },
  {
    field: "cf",
    header: "CF",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cf"),
      body: customBody.bind(null, "cf"),
    },
  },
  {
    field: "in",
    header: "IN",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "in"),
      body: customBody.bind(null, "in"),
    },
  },
  {
    field: "cn",
    header: "CN",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cn"),
      body: customBody.bind(null, "cn"),
    },
  },
  {
    field: "cf/in",
    header: "CF/IN",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cf/in"),
      body: customBody.bind(null, "cf/in"),
    },
  },
  {
    field: "in/cn",
    header: "IN/CN",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "in/cn"),
      body: customBody.bind(null, "in/cn"),
    },
  },
  {
    field: "cf/cn",
    header: "CF/CN",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cf/cn"),
      body: customBody.bind(null, "cf/cn"),
    },
  },
  {
    field: "cf/in/cn",
    header: "CF/IN/CN",
    type: "custom",
    options: {
      editor: customEditor.bind(null, "cf/in/cn"),
      body: customBody.bind(null, "cf/in/cn"),
    },
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
  return (
    <SimpleCrudTable
      data={data}
      type={label}
      empty={empty}
      cols={cols}
      addClasses="p-datatable-sm p-datatable-striped"
      actionsToUse={authSliceActions}
      dataSubmitFn={storeSubmitFunction}
      // storeSlice={"auth"}
      // storeNestedPath={[]}
      usingStore={false}
      id={type}
      canCreate={false}
      canDelete={false}
      selectionMode={"single"}
      useSaveRevert={true}
      setParentTempStore={tempSetter}
      handleRevertClicked={revertHandler}
      canSave={canSave}
    />
  );
};

const COL_KEYS = ["cf", "in", "cn", "cf/in", "in/cn", "cf/cn", "cf/in/cn"];

const ConfigureBenchmarkingWeightings = () => {
  const dispatch = useDispatch();
  // cashFlow, contingency, investment:
  const benchmarkingWeightings = useSelector(
    (state) => state.auth.benchmarkingWeightings
  );
  const benchmarkingProfile = useSelector(
    (state) => state.auth.benchmarkingProfile
  );

  const [summedColumns, setSummedColumns] = useState({
    // status: {
    // kpi: undefined,
    // overall: undefined,
    // },
    combination: undefined,
  });
  const [canSaves, setCanSaves] = useState({
    // status: {
    // kpi: false,
    // overall: false,
    // },
    combination: false,
  });

  const _status =
    benchmarkingWeightings?.status !== undefined
      ? benchmarkingWeightings.status
      : defaultStatusAllocs.status;
  const _combination =
    benchmarkingWeightings?.combination !== undefined
      ? benchmarkingWeightings.combination
      : defaultStatusAllocs.combination;
  const [tempStatus, setTempStatus] = useState(_status);
  const [tempCombination, setTempCombination] = useState(_combination);

  const [tempStatusEdited, setTempStatusEdited] = useState([]);
  const [tempCombinationEdited, setTempCombinationEdited] = useState([]);

  const mapSetterToField = new Map([
    ["status", setTempStatus],
    ["combination", setTempCombination],
  ]);

  useEffect(() => {
    _setSummedColumns("status", tempStatus);
  }, [tempStatus]);
  useEffect(() => {
    _setSummedColumns("combination", tempCombination);
  }, [tempCombination]);

  useEffect(() => {
    _setSummedColumns("status", tempStatusEdited);
  }, [tempStatusEdited]);
  useEffect(() => {
    _setSummedColumns("combination", tempCombinationEdited);
  }, [tempCombinationEdited]);

  const _setSummedColumns = (fieldType, updatedState) => {
    if (updatedState === undefined || updatedState?.length === 0) return;
    console.log(fieldType);
    console.log(updatedState);
    const [_cf, _in, _cn] = updatedState;

    const getSummedColumnEmpty = () => ({
      cf: 0,
      "cf/cn": 0,
      "cf/in": 0,
      "cf/in/cn": 0,
      cn: 0,
      combination: "",
      id: 0,
      in: 0,
      "in/cn": 0,
    });

    const summedColumns = COL_KEYS.reduce((acc, next) => {
      const sum = _cf[next] + _in[next] + _cn[next];
      return { ...acc, [next]: sum };
    }, getSummedColumnEmpty());

    const canSave = COL_KEYS.reduce((acc, next) => {
      return acc && summedColumns[next] === 100;
    }, true);

    console.log("---------------");
    console.log(canSave);
    console.log(summedColumns);
    setCanSaves((prevState) => ({ ...prevState, [fieldType]: canSave }));
    setSummedColumns((prevState) => ({
      ...prevState,
      [fieldType]: summedColumns,
    }));
  };

  const setTemps = (benchmarkingWeightings) => {
    setTempStatus(benchmarkingWeightings.status);
    setTempCombination(benchmarkingWeightings.combination);
  };

  useEffect(() => {
    if (benchmarkingWeightings === undefined) {
      dispatch(fetchData());
    } else {
      setTemps(benchmarkingWeightings);
    }
  }, []);

  useEffect(() => {
    if (benchmarkingProfile === undefined) return;
    else {
      if (benchmarkingWeightings === undefined) {
        dispatchChanges({ newVal: tempStatus, key: "status" });
        dispatchChanges({ newVal: tempCombination, key: "combination" });
      }
    }
  }, [benchmarkingProfile]);

  useEffect(() => {
    if (benchmarkingWeightings === undefined) return;
    setTemps(benchmarkingWeightings);
  }, [benchmarkingWeightings]);

  const revertHandler = (type, _data) => {
    console.log("---- handle revert clicked ----");
    console.log(_data);
    const setterFn = mapSetterToField.get(type);
    setterFn(_data);
  };

  const dispatchChanges = ({
    newVal: latestState,
    key,
    // updatedField,
    // updatedValue,
    // rowIndex,
    // action,
    // deleted,
  }) => {
    console.log("--------- DISPATCHING WITH newVal --------");
    console.log(latestState);
    console.log(key);
    // const reshapedState = reshapeBmProfileForStore(latestState);
    // console.log(reshapedState);
    dispatch(
      authSliceActions.updateClientDataNested({
        action: "UPDATE",
        newValue: latestState,
        path: ["benchmarkingWeightings", key],
      })
    );
  };
  console.log("------SUMMED COLUMNS------");
  console.log(summedColumns);

  return (
    <>
      <div>
        {generateCrudTable(
          tempStatus,
          "status",
          "Status",
          setTempStatusEdited,
          revertHandler.bind(null, "status"),
          dispatchChanges,
          true,
          getEmptyAccStatus(getMaxId(defaultStatusAllocs.status)),
          STATUS_COLS
        )}
        {/* {summedColumns.status !== undefined && (
              <WeightingSums
                allocationSumTemplate={allocationSumTemplate}
                summedColumns={summedColumns.status}
                cols={STATUS_COLS}
                sumFields={["kpi", "overall"]}
              />
            )} */}
        <br />
        <br />
      </div>
      <div>
        {generateCrudTable(
          tempCombination,
          "combination",
          "Combination",
          setTempCombinationEdited,
          revertHandler.bind(null, "combination"),
          dispatchChanges,
          canSaves.combination,
          getEmptyAccCombination(getMaxId(defaultStatusAllocs.combination)),
          COMBINATION_COLS
        )}
        {summedColumns.combination !== undefined && (
          <WeightingSums
            allocationSumTemplate={allocationSumTemplate}
            summedColumns={[summedColumns.combination]}
            cols={COMBINATION_COLS}
            sumFields={COL_KEYS}
          />
        )}
        <br />
        <br />
      </div>
    </>
  );
};

export default ConfigureBenchmarkingWeightings;
