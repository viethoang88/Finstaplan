import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { factFindActions } from "../../../../store/fact-find";

export const handleDataSubmitted = (area, dispatcher) => {
  return ({
    newVal: latestState,
    // key: id,
    // updatedField,
    // updatedValue,
    // rowIndex,
    // action,
    // deleted,
  }) => {
    dispatcher(
      factFindActions.updateClientDataNested({
        action: "UPDATE",
        path: ["benchmarking", area],
        newValue: latestState,
      })
    );
  };
};

const templatePadding = "1.5rem";
const templateBorderRadius = "4%";
const transparencyLevel = "0.25";
const onTrackColor = `rgba(76, 175, 79, ${transparencyLevel})`;
const onWatchColor = `rgba(251, 192, 45, ${transparencyLevel})`;
const cautionColor = `rgba(211, 47, 47, ${transparencyLevel})`;
const onTrackColorSolid = `rgb(76, 175, 79)`;
const onWatchColorSolid = `rgb(251, 192, 45)`;
const cautionColorSolid = `rgb(211, 47, 47)`;

export const checkboxEditor = (onEditorValueChange, id, props, field) => {
  const checked = props.rowData["checked"];
  return (
    <Checkbox
      value={checked}
      tooltip={"Use this benchmark"}
      onChange={(e) => {
        onEditorValueChange(id, props, e.checked);
      }}
      checked={checked}
      style={{
        maxWidth: "2rem",
        padding: 0,
        margin: 0,
        // position: "relative",
        // left: "1.5rem",
      }}
    />
  );
};

const yesNoOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const yearOptions = (function () {
  const year = new Date().getFullYear();
  const options = [];
  for (let i = year - 10; i <= year + 10; i++) {
    options.push(i);
  }
  return options;
})();

export const selectEditor = (
  options,
  onEditorValueChange,
  id,
  props,
  field
) => {
  return (
    <div style={{ maxWidth: "5.5rem !important" }}>
      <Dropdown
        value={props.rowData[field]}
        options={options}
        onChange={(e) => onEditorValueChange(id, props, e.value)}
        placeholder={"Select"}
        style={{ maxWidth: "5.5rem !important", width: "5.5rem !important" }}
      />
    </div>
  );
};

const priceEditor = (onEditorValueChange, id, props, field) => {
  return (
    <div style={{ maxWidth: "5.5rem !important" }}>
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
        // style={{ maxWidth: "5.5rem !important", width: "5.5rem !important" }}
        inputStyle={{ maxWidth: "5.5rem" }}
      />
    </div>
  );
};

const percentEditor = (onEditorValueChange, id, props, field) => {
  return (
    <div style={{ width: "25%", maxWidth: "5.5rem !important" }}>
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        // suffix="%"
        mode="decimal"
        minFractionDigits={2}
        // style={{ maxWidth: "5.5rem", width: "25%" }}
        inputStyle={{ maxWidth: "5.5rem" }}
      />
    </div>
  );
};

const percentBodyTemplate = (fieldType, rowData, { field }) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumSignificantDigits: 6,
  }).format(rowData[field] / 100);
};

const monthsBodyTemplate = (fieldType, rowData, { field }) => {
  return `${rowData[field]} Months`;
};
const plainBodyTemplate = (fieldType, rowData, { field }) => {
  return `${rowData[field]}`;
};

const monthsEditor = (onEditorValueChange, id, props, field) => {
  return (
    <InputNumber
      value={props.rowData[field]}
      mode="decimal"
      min={0}
      max={60}
      onValueChange={(e) => onEditorValueChange(id, props, e.value)}
      // style={{ maxWidth: "5.5rem !important", width: "5.5rem !important" }}
      inputStyle={{ maxWidth: "5.5rem" }}
    />
  );
};

const priceBodyTemplate = (fieldType, rowData, { field }) => {
  const currValue = rowData[field];
  if (
    Number.isNaN(currValue) ||
    currValue === undefined ||
    currValue === 0 ||
    !Number.isFinite(currValue)
  ) {
    return "N / A";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(rowData[field]);
};

const scoreBodyTemplate = (fieldType, rowData, { field }) => {
  return `${rowData.score}%`;
};
const ratingBodyTemplate = (fieldType, rowData, { field }) => {
  const rating = rowData.rating;
  if (fieldType === "ratingLast" && rowData[fieldType] === undefined)
    return disabledBody(fieldType, rowData, { field });
  const color =
    rating === "Caution"
      ? cautionColor
      : rating === "On Track"
      ? onTrackColor
      : onWatchColor;
  return customBodyTemplate(color, rowData[field]);
};

const statusBodyTemplate = (fieldType, rowData, { field }) => {
  const rating = rowData.rating;
  const color =
    rating === "Caution"
      ? cautionColorSolid
      : rating === "On Track"
      ? onTrackColorSolid
      : onWatchColorSolid;
  return customScoreBodyTemplate(color, rating);
};

const didRiskToleranceChange = (rowData) => {
  const client = rowData?.actual === rowData?.benchmark;
  if (rowData?.actualSpouse && rowData?.benchmarkSpouse) {
    const partner = rowData?.actualSpouse === rowData?.benchmarkSpouse;
    return client && partner ? "Unchanged" : "Changed";
  }
  return client ? "Unchanged" : "Changed";
};

const contingencyEstatePlanningDeltas = (fieldType, rowData, field) => {};

const deltaBodyTemplate = (fieldType, rowData, { field }) => {
  console.log(field);
  console.log(rowData);
  if (rowData?.property === "riskTolerance") {
    return didRiskToleranceChange(rowData);
  } else if (rowData?.property === "optimalInsurance") {
    // return isInsuranceOptimal
  } else if (rowData?.kpiArea === "Estate Planning") {
    return contingencyEstatePlanningDeltas(fieldType, rowData, field);
  }
  return Number.isFinite(rowData[field])
    ? `${rowData[field].toFixed(2)}%`
    : "N / A";
};

const customScoreBodyTemplate = (color, render) => {
  return (
    <div
      style={{
        backgroundColor: "rgb(243,243,243)",
        padding: templatePadding,
        borderRadius: templateBorderRadius,
        textAlign: "center",
        color: color,
        fontWeight: "bold",
      }}
    >
      {render}
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

const disabledBody = (fieldType, rowData, { field }) => {
  return (
    <div
      style={{
        width: "100%",
        padding: "1.5rem",
        backgroundColor: "rgba(239,239,239, 0.45)",
        color: "rgba(25,25,25, .2)",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      N / A
    </div>
  );
};

let editorAssignerMap = new Map([
  ["optimalInsurance", selectEditor.bind(null, yesNoOptions)],
  ["rateOfReturn", percentEditor],
  ["growthAssets", percentEditor],
  ["liquidity", monthsEditor],
  ["cashReserves", monthsEditor],
  ["will", selectEditor.bind(null, yearOptions)],
  ["powerOfAttorney", selectEditor.bind(null, yearOptions)],
  ["guardianship", selectEditor.bind(null, yearOptions)],
  ["deathBenefit", selectEditor.bind(null, yesNoOptions)],
  ["emergencyFundsAvailable", monthsEditor],
]);

let bodyAssignerMap = new Map([
  ["optimalInsurance", plainBodyTemplate],
  ["riskTolerance", plainBodyTemplate],
  ["rateOfReturn", percentBodyTemplate],
  ["growthAssets", percentBodyTemplate],
  ["liquidity", monthsBodyTemplate],
  ["will", plainBodyTemplate],
  ["powerOfAttorney", plainBodyTemplate],
  ["guardianship", plainBodyTemplate],
  ["deathBenefit", plainBodyTemplate],
  ["emergencyFundsAvailable", monthsBodyTemplate],
  ["cashReserves", monthsBodyTemplate],
  ["status", statusBodyTemplate],
  ["rating", ratingBodyTemplate],
  ["ratingLast", ratingBodyTemplate],
  ["delta", deltaBodyTemplate],
  ["score", scoreBodyTemplate],
]);

// ["riskTolerance", selectEditor.bind(null, portfolioOptions)]
export const addKeyToEditorAssignerMap = (key, editor, options = []) => {
  editorAssignerMap.set(key, editor.bind(null, options));
};

const getEditor = (_type) => {
  return editorAssignerMap.get(_type) || priceEditor;
};

const getBody = (_type) => {
  return bodyAssignerMap.get(_type) || priceBodyTemplate;
};

// area in ["cashFlow", "investment", "contingency"]
// fieldType in ["benchmark", "actual", "benchmarkSpouse", "actualSpouse"]
export const customEditor = (
  area,
  fieldType,
  onEditorValueChange,
  id,
  props,
  field
) => {
  if (fieldType === "selected") {
    return checkboxEditor(onEditorValueChange, id, props, field);
  }
  if (area === "results") {
    return getResultsBody(area, fieldType, props.rowData, { field });
  }

  const property = props?.rowData?.property;
  const editor = getEditor(property);
  return editor(onEditorValueChange, id, props, field);
};

const _specialFields = [
  "benchmark",
  "actual",
  "benchmarkSpouse",
  "actualSpouse",
];
const getResultsBody = (area, fieldType, rowData, data) => {
  if (_specialFields.includes(data.field)) {
    return getBody(rowData.property)(fieldType, rowData, data);
  }
  return getBody(fieldType)(fieldType, rowData, data);
};

export const customBody = (area, fieldType, rowData, data) => {
  const checked = rowData?.checked;
  if (!checked) return disabledBody(fieldType, rowData, data);
  if (area === "results") return getResultsBody(area, fieldType, rowData, data);
  const property = rowData?.property;
  const bodyTemplate = getBody(property);
  return bodyTemplate(fieldType, rowData, data);
};
