import { _questions } from "../ff/insurance-form/health-info";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

const DUMMY_ANSWERS = [
  "Excellent",
  167,
  "55kg",
  "Non-smoker",
  0,
  "Yes",
  3,
  "No",
  "",
  "No",
  "",
  "Yes",
  "breast cancer",
  ["Anxiety", "Depression"],
  "No",
  "",
  "Yes",
];

const flexStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  maxWidth: "75%",
};
const questionStyles = {
  fontSize: "1.25rem",
  padding: "0.5rem",
  paddingBottom: "0.5rem",
  paddingTop: "0.5rem",
};
const labelStyles = {
  display: "inline-block",
  paddingLeft: "0.5rem",
  position: "relative",
  top: ".1rem",
};
const radioStyles = {
  display: "flex",
  padding: "0.5rem",
  backgroundColor: "white",
  flexBasis: "50%",
};
const checkboxStyles = {
  padding: "0.5rem",
  backgroundColor: "white",
  flexBasis: "33.33%",
  minWidth: "33.33%",
  maxWidth: "33.33%",
};

const generateRadioJSX = (options, selected, idx, question) => {
  let _styles = {};
  if (options.length > 3) _styles = { ...flexStyles };
  return (
    <>
      {question !== "" && <div style={questionStyles}>{question}</div>}
      <div style={_styles}>
        {options.map((option, _idx) => (
          <div className="p-field-radiobutton" style={radioStyles}>
            <RadioButton
              key={`${idx}_${_idx}`}
              inputId={`${idx}_${_idx}`}
              name={`${idx}_${_idx}`}
              value={option.value}
              disabled
              checked={selected === option.value}
            />
            <label style={labelStyles} htmlFor={`${idx}_${_idx}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

const generateTextinputJSX = (options, selected, idx, question) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <InputText value={selected} disabled style={{ minWidth: "75%" }} />
    </>
  );
};

const generateSelectJSX = (options, selected, idx, question) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <Dropdown
        value={selected}
        options={options}
        disabled
        placeholder={"Please Select"}
      />
      <br />
    </>
  );
};

const generateCheckboxesJSX = (options, selected, idx, question) => {
  let _styles = {};
  if (options.length > 3) _styles = { ...flexStyles };
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <div style={_styles}>
        {options.map((option, idx) => (
          <div key={`cb_${idx}`} className="p-row-2" style={checkboxStyles}>
            <Checkbox
              inputId={`cb_${idx}`}
              value={option}
              disabled
              checked={selected.includes(option)}
            />
            <label
              style={labelStyles}
              htmlFor={`cb_${idx}`}
              className="p-checkbox-label"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

const generateNumberinputJSX = (
  options,
  selected,
  idx,

  question
) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <InputNumber
        value={selected}
        // onChange={(e) => updaterFn(idx, e.value)}
        mode="decimal"
        showButtons
        // buttonLayout="vertical"
        style={{ width: "3rem" }}
        disabled
        // decrementButtonClassName="p-button-secondary"
        // incrementButtonClassName="p-button-secondary"
        // incrementButtonIcon="pi pi-plus"
        // decrementButtonIcon="pi pi-minus"
      />
    </>
  );
};

const generateOptions = (question, options, type, selected, idx) => {
  switch (type) {
    case "number":
      return generateNumberinputJSX(options, selected, idx, question);
    case "select":
      return generateSelectJSX(options, selected, idx, question);

    case "text":
      return generateTextinputJSX(options, selected, idx, question);

    case "checkbox":
      return generateCheckboxesJSX(options, selected, idx, question);

    case "radio":
      return generateRadioJSX(options, selected, idx, question);
  }
  return <div></div>;
};

const HealthForm = ({ clientAnswers }) => {
  return (
    <div>
      {_questions.map(
        (
          { question, options, selected, type, hideInitially, conditional },
          idx
        ) => {
          if (hideInitially) {
            const lastQuestion = _questions[idx - 1];
            const lastQuestionSelected = lastQuestion.selected;
            if (lastQuestionSelected !== conditional) return <></>;
          }

          return (
            <div style={{ margin: "4.5rem" }}>
              {generateOptions(
                question,
                options,
                type,
                clientAnswers === undefined
                  ? DUMMY_ANSWERS[idx]
                  : clientAnswers,
                idx
              )}
              <br />
            </div>
          );
        }
      )}
    </div>
  );
};

export default HealthForm;
