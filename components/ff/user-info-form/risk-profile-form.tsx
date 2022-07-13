import { useDispatch, useSelector } from "react-redux";
import { Accordion, AccordionTab } from "primereact/accordion";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";
import { Form } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import classes from "./risk-profile-form.module.css";
import { Line } from "@nivo/line";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import _ from "lodash";

import factFind, { factFindActions } from "../../../store/fact-find";
import Results from "./risk-profile-results/results";
import ConfirmAcceptProfile from "./risk-profile-results/confirm-accept-profile";

const commonProperties = {
  width: 500,
  height: 500,
  margin: { top: 40, right: 40, bottom: 50, left: 95 },
  animate: true,
  //   enableSlices: "x",
};

const dotsGraph1 = (idx, updaterFn, selected) => {
  return (
    <div>
      <div className={classes.line_dot_one}>
        <RadioButton
          value={1}
          onChange={(e) => updaterFn(idx, 1)}
          checked={selected === 1}
        />
      </div>
      <div className={classes.line_dot_two}>
        <RadioButton
          value={"B"}
          onChange={(e) => updaterFn(idx, 2)}
          checked={selected === 2}
        />
      </div>
      <div className={classes.line_dot_three}>
        <RadioButton
          value={"C"}
          onChange={(e) => updaterFn(idx, 3)}
          checked={selected === 3}
        />
      </div>
      <div className={classes.line_dot_four}>
        <RadioButton
          value={4}
          onChange={(e) => updaterFn(idx, 4)}
          checked={selected === 4}
        />
      </div>
      <div className={classes.line_dot_five}>
        <RadioButton
          value={5}
          onChange={(e) => updaterFn(idx, 5)}
          checked={selected === 5}
        />
      </div>
    </div>
  );
};

const dotsGraph2 = (idx, updaterFn, selected) => {
  return (
    <div>
      <div className={classes.line_two_dot_zero}>
        <RadioButton
          value={0}
          onChange={(e) => updaterFn(idx, 0)}
          checked={selected === 0}
        />
      </div>
      <div className={classes.line_two_dot_one}>
        <RadioButton
          value={1}
          onChange={(e) => updaterFn(idx, 1)}
          checked={selected === 1}
        />
      </div>
      <div className={classes.line_two_dot_two}>
        <RadioButton
          value={2}
          onChange={(e) => updaterFn(idx, 2)}
          checked={selected === 2}
        />
      </div>
      <div className={classes.line_two_dot_three}>
        <RadioButton
          value={3}
          onChange={(e) => updaterFn(idx, 3)}
          checked={selected === 3}
        />
      </div>
      <div className={classes.line_two_dot_four}>
        <RadioButton
          value={4}
          onChange={(e) => updaterFn(idx, 4)}
          checked={selected === 4}
        />
      </div>
      <div className={classes.line_two_dot_five}>
        <RadioButton
          value={5}
          onChange={(e) => updaterFn(idx, 5)}
          checked={selected === 5}
        />
      </div>
    </div>
  );
};

/* USAGE: generateOptions(
                      question,
                      options,
                      type,
                      selected,
                      idx,
                      updateQuestionValue,
                      // NOT REQUIRED:
                      min,
                      max,
                      xAxis,
                      yAxis,
                      dotsGraphFn,
                      graphMax,
                      graphScale
                    )}*/

const _howToComplete = [
  "Would you like to do a single risk profile or multiple?",
  [
    {
      label: "Jointly",
      value: "joint",
    },
    {
      label: "Individually",
      value: "separate",
    },
    // {
    //   label: "By asset class",
    //   value: "assets",
    // },
  ],
  "radio",
];

const _questions = [
  {
    question:
      "How positive are you about the markets and your investment performing well in next 5 years?",
    // options: [
    //   "Very Positive",
    //   "Positive",
    //   "Neutral",
    //   "Negative",
    //   "Very Negative",
    // ],
    options: [
      {
        label: "Very Positive",
        value: 5,
      },
      {
        label: "Positive",
        value: 4,
      },
      {
        label: "Neutral",
        value: 3,
      },
      {
        label: "Negative",
        value: 2,
      },
      {
        label: "Very Negative",
        value: 1,
      },
    ],
    type: "radio",
    selected: null,
  },

  {
    // TABLE
    question: "What type of investment experience do you have?",
    options: [
      {
        id: "1",
        option: "A",
        text: "I have investment experience in basic banking products and term deposits and I have never invested in outside bank accounts and term deposits.",
        value: 0,
      },
      {
        id: "2",
        option: "B",
        text: "I have had minimal exposure to investment products outside the basic banking products, such as bonds and property.",
        value: 1,
      },
      {
        id: "3",
        option: "C",
        text: "I have had some investment experience and have had some exposure to property and equities in the past.",
        value: 2,
      },
      {
        id: "4",
        option: "D",
        text: "I have had some experience in all the major asset classes, including domestic shares and have had minimal experience with international shares.",
        value: 3,
      },
      {
        id: "5",
        option: "E",
        text: "I have had a lot of experience in all asset classes, with particular focus on Domestic and International equities.",
        value: 4,
      },
      {
        id: "6",
        option: "F",
        text: "I have had a great deal of experience in all the asset classes including the overseas share markets and ‘exotic’ investment products.",
        value: 5,
      },
    ],
    type: "table",
    selected: null,
  },

  {
    question:
      "Which number describes the amount of short term risk you have taken with financial decisions in the past?",
    options: [1, 2, 3, 4, 5],
    type: "scale",
    min: "Very Low Risk",
    max: "Very High Risk",
    selected: null,
  },
  {
    question:
      "Which best describes your reaction to short-term (less than 1 year) losses on your investments?",
    //options: ["Not worried", "It happens", "Acceptable", "Worried", "Panic"],
    options: [
      {
        label: "Not worried",
        value: 5,
      },
      {
        label: "It happens",
        value: 4,
      },
      {
        label: "Acceptable",
        value: 3,
      },
      {
        label: "Worried",
        value: 2,
      },
      {
        label: "Panic",
        value: 1,
      },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "There is usually a trade-off between risk and return, which describes your preferences best?",
    // linear plot:
    options: [
      {
        id: "some",
        data: [
          { id: 0, x: 0.01, y: 0.01, key: " " },
          { id: 1, x: 1, y: 1, key: "A" },
          { id: 2, x: 2, y: 2, key: "B" },
          { id: 3, x: 3, y: 3, key: "C" },
          { id: 4, x: 4, y: 4, key: "D" },
          { id: 5, x: 5, y: 5, key: "E" },
        ],
      },
    ],
    type: "lineGraph",
    graphScale: "linear",
    yAxis: "Risk",
    xAxis: "Return",
    dotsGraphFn: dotsGraph1,
    selected: null,
  },
  {
    question:
      "If your investment strategy were for the long term (a minimum of 7 years), how would you react if in 6 month time your portfolio value had decreased by 15% or more?",
    options: [
      {
        id: 1,
        text: "I will not accept any declines in the value of my investment portfolio.",
        option: "A",
        value: 0,
      },
      {
        id: 2,
        text: "I would transfer my investments to more stable investment markets.",
        option: "B",
        value: 1,
      },
      {
        id: 3,
        text: "I would be somewhat concerned but can accept very short-term volatility in the markets however if markets did continue to fall in the short-term, I would discuss my investments with my adviser and ask for guidance.",
        option: "C",
        value: 2,
      },
      {
        id: 4,
        text: "Primarily, I would adopt a ‘wait and see’ approach to see if the investments improve before making a decision.",
        option: "D",
        value: 3,
      },
      {
        id: 5,
        text: "I knew the risks and volatility levels were higher and I would leave the original long-term strategy in place to let it run its course.",
        option: "E",
        value: 4,
      },
      {
        id: 6,
        text: "As I expect long-term growth, I would intend on investing more money given the current market conditions to take advantage of the lower average investment prices.",
        option: "F",
        value: 5,
      },
    ],
    type: "table",
    selected: null,
  },
  {
    question:
      "Looking at the graph, what pattern of investment return are you most comfortable with? (Usually the less volatile the return pattern, the lower the return over a longer investment cycle)",
    options: [
      {
        id: "some",
        data: [
          { id: 0, x: 0.01, y: 0.01, key: " " },
          { id: 1, x: 5, y: 1.2, key: "Cash" },
          { id: 2, x: 10, y: 1.75, key: "Conservative" },
          { id: 3, x: 15, y: 1.95, key: "Moderately Conservative" },
          { id: 4, x: 20, y: 2.15, key: "Moderate Growth" },
          { id: 5, x: 25, y: 2.25, key: "Growth" },
          { id: 6, x: 30, y: 2.35, key: "High Growth" },
        ],
      },
    ],
    type: "lineGraph",
    yAxis: "Risk",
    xAxis: "Return",
    graphScale: "log",
    dotsGraphFn: dotsGraph2,
    selected: null,
    graphMax: 100,
  },
  {
    question: "Which of these profiles do you most identify with?",
    options: [
      {
        id: 1,
        text: "Preserving my capital is the most important factor when you consider your savings or the amount you wish to invest.",
        option: "A",
        value: 1,
      },
      {
        id: 2,
        text: "I prefer lower risk investments but am willing to accept small downside risk to my capital to achieve a higher potential return than cash.",
        option: "B",
        value: 2,
      },
      {
        id: 3,
        text: "I am prepared to assume a moderate amount of capital risk but with a lower allocation in growth assets to manage potential downsides.",
        option: "C",
        value: 3,
      },
      {
        id: 4,
        text: "I am prepared to accept some more capital risk with a view to enhancing potential returns.",
        option: "D",
        value: 4,
      },
      {
        id: 5,
        text: "I understand that this investment is for the long term and capital risk is acceptable in order to maximise potential returns.",
        option: "E",
        value: 5,
      },
    ],
    type: "table",
    selected: null,
  },
];

const questionStyles = {
  fontSize: "1.25rem",
  padding: "0.5rem",
  paddingBottom: "0.5rem",
  paddingTop: "0.5rem",
};
const radioStyles = {
  display: "flex",
  padding: "0.5rem",
  backgroundColor: "white",
  flexBasis: "50%",
};
const labelStyles = {
  display: "inline-block",
  paddingLeft: "0.5rem",
  position: "relative",
  top: ".1rem",
};
const flexStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  maxWidth: "75%",
};

export const generateRadioJSX = (
  options,
  selected,
  idx,
  updaterFn,
  question
) => {
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
              onChange={(e) => updaterFn(idx, e.value)}
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

const generateTextinputJSX = (options, selected, idx, updaterFn, question) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <InputText
        value={selected}
        onChange={(e) => updaterFn(idx, e.target.value)}
        style={{ minWidth: "75%" }}
      />
    </>
  );
};

const generateNumberinputJSX = (
  options,
  selected,
  idx,
  updaterFn,
  question
) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <InputNumber
        value={selected}
        // onChange={(e) => updaterFn(idx, e.value)}
        onValueChange={(e) => updaterFn(idx, e.value)}
        mode="decimal"
        showButtons
        // buttonLayout="vertical"
        style={{ width: "3rem" }}
        // decrementButtonClassName="p-button-secondary"
        // incrementButtonClassName="p-button-secondary"
        // incrementButtonIcon="pi pi-plus"
        // decrementButtonIcon="pi pi-minus"
      />
    </>
  );
};

const checkboxStyles = {
  padding: "0.5rem",
  backgroundColor: "white",
  flexBasis: "33.33%",
  minWidth: "33.33%",
  maxWidth: "33.33%",
};
const generateCheckboxesJSX = (options, selected, idx, updaterFn, question) => {
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
              onChange={updaterFn}
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

const generateSelectJSX = (options, selected, idx, updaterFn, question) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <Dropdown
        value={selected}
        options={options}
        onChange={(e) => updaterFn(idx, e.value)}
        placeholder={"Please Select"}
      />
      <br />
    </>
  );
};

const generateMultiSelectJSX = (
  options,
  selected,
  idx,
  updaterFn,
  question
) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <MultiSelect
        key={idx}
        display="chip"
        value={selected}
        options={options}
        onChange={(e) => updaterFn(idx, e.value)}
        placeholder={"None"}
      />
      <br />
    </>
  );
};

const generateEditableTableJSX = (
  options,
  selected,
  idx,
  updaterFn,
  question
) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <DataTable value={options} dataKey="id">
        <Column
          style={{ maxWidth: "4rem", width: "4rem" }}
          key="option"
          field="option"
        ></Column>
        <Column key="text" field="text"></Column>
      </DataTable>
    </>
  );
};

const generateTableJSX = (options, selected, idx, updaterFn, question) => {
  return (
    <>
      <div style={questionStyles}>{question}</div>
      <DataTable
        value={options}
        selectionMode="single"
        selection={selected}
        onSelectionChange={(e) => {
          console.log(e.value);
          updaterFn(idx, e.value);
        }}
        dataKey="id"
      >
        <Column
          style={{ maxWidth: "4rem", width: "4rem" }}
          key="option"
          field="option"
        ></Column>
        <Column key="text" field="text"></Column>
      </DataTable>
    </>
  );
};

const generateScaleJSX = (
  options,
  selected,
  idx,
  updaterFn,
  question,
  min,
  max
) => {
  return (
    <div>
      <div style={questionStyles}>{question}</div>
      <div className={classes.option_container}>
        <div className={classes.option_min}>{min}</div>
        {options.map((option) => (
          <div
            className={`${classes.option} ${
              option === selected ? classes.option_selected : ""
            }`}
            onClick={() => updaterFn(idx, option)}
          >
            {option}
          </div>
        ))}
        <div className={classes.option_max}>{max}</div>
      </div>
    </div>
  );
};

//   id: string | number
//     data: Datum[]
//     [key: string]: any
const generateLineGraphJSX = (
  options,
  selected,
  idx,
  updaterFn,
  question,
  xAxis,
  yAxis,
  dotsGraphFn,
  graphMax = "auto",
  graphScale = "linear"
) => {
  return (
    <div style={{ zIndex: 4000 }}>
      <div style={questionStyles}>{question}</div>
      {dotsGraphFn(idx, updaterFn, selected)}
      <div className={classes.chart_x_axis}>{yAxis}</div>
      <div className={classes.chart_y_axis}>{xAxis}</div>
      <Line
        {...commonProperties}
        // curve="monotoneX"
        data={options}
        pointSize={22}
        enablePointLabel
        pointLabel={(d) => {
          return d.key;
        }}
        // data={[
        //   {
        //     id: "fake corp. A",
        //     data: [
        //       { x: 0, y: 7 },
        //       { x: 1, y: 5 },
        //       { x: 2, y: 11 },
        //       { x: 3, y: 9 },
        //       { x: 4, y: 13 },
        //       { x: 7, y: 16 },
        //       { x: 9, y: 12 },
        //     ],
        //   },
        // ]}
        colors={{ scheme: "paired" }}
        // xScale={{
        //   type: "linear",
        //   min: 0,
        //   max: graphMax,
        // }}
        yScale={{
          type: "linear",
          min: 0,
          max: 5,
        }}
        axisBottom={null}
        axisLeft={null}
        // axisBottom={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: xAxis,
        //   legendPosition: "middle",
        //   legendOffset: 36,
        // }}
        // axisLeft={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: yAxis,
        //   legendPosition: "middle",
        //   legendOffset: -57,
        // }}
        // isInteractive={true}
        // onClick={(node, event) => console.log(node, event)}
        enableGridX={true}
        enableGridY={true}
        pointLabelYOffset={-18}
      />
    </div>
  );
};

export const generateOptions = (
  question,
  options,
  type,
  selected,
  idx,
  updaterFn,
  min = null,
  max = null,
  xAxis = null,
  yAxis = null,
  dotsGraphFn = null,
  graphMax = "auto",
  graphScale = "linear"
) => {
  switch (type) {
    case "number":
      return generateNumberinputJSX(
        options,
        selected,
        idx,
        updaterFn,
        question
      );
    case "select":
      return generateSelectJSX(options, selected, idx, updaterFn, question);
    case "multiselect":
      return generateMultiSelectJSX(
        options,
        selected,
        idx,
        updaterFn,
        question
      );
    case "text":
      return generateTextinputJSX(options, selected, idx, updaterFn, question);

    case "checkbox":
      return generateCheckboxesJSX(options, selected, idx, updaterFn, question);
    case "radio":
      return generateRadioJSX(options, selected, idx, updaterFn, question);
    case "table":
      return generateTableJSX(options, selected, idx, updaterFn, question);
    case "editabletable":
      return generateEditableTableJSX(
        options,
        selected,
        idx,
        updaterFn,
        question
      );
    case "scale":
      return generateScaleJSX(
        options,
        selected,
        idx,
        updaterFn,
        question,
        min,
        max
      );
    case "lineGraph":
      return generateLineGraphJSX(
        options,
        selected,
        idx,
        updaterFn,
        question,
        xAxis,
        yAxis,
        dotsGraphFn,
        graphScale
      );
  }
  return <div></div>;
};

const scoreRiskProfile = (questions) => {
  return (
    (questions.reduce((acc, nxt) => {
      if (Number.isInteger(nxt.selected)) {
        return acc + nxt.selected;
      } else {
        try {
          return acc + nxt.selected.value;
        } catch (e) {
          return acc;
        }
      }
    }, 0) *
      100) /
    40
  );
};

export const assignCashFromScore = (score) => {
  if (score <= 30) return 5;
  else if (score <= 50) return 4;
  else if (score <= 70) return 3;
  else if (score <= 85) return 2;
  else if (score <= 99) return 1;
  else return 0;
};
const assignXFromScore = (score) => {
  const cash = assignCashFromScore(score);
  return (100 - cash / 2 + 2.5 - score) / 100;
};

const convertToPercent = (number) => {
  return number;
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumSignificantDigits: 2,
  }).format(number);
};

const generatePieData = (score) => {
  const _cash = assignCashFromScore(score);
  const _defensive = 100 - _cash - score;

  return [
    {
      id: "Growth",
      label: "Growth",
      value: convertToPercent(score),
      // "color": "hsl(170, 70%, 50%)"
    },
    {
      id: "Defensive",
      label: "Defensive",
      value: convertToPercent(_defensive),
      // "color": "hsl(276, 70%, 50%)"
    },
    {
      id: "Cash",
      label: "Cash",
      value: convertToPercent(_cash),
      // "color": "hsl(282, 70%, 50%)"
    },
  ];
};

// if hasPartner:
//   first question: joint, joint & client(s), client(s)
const buildQs = (updaterFn, questions, qsFor = "") => {
  return questions.map(
    (
      {
        question,
        options,
        selected,
        type,
        min,
        max,
        xAxis,
        yAxis,
        dotsGraphFn,
        graphMax,
        graphScale,
      },
      idx
    ) => {
      return (
        <AccordionTab key={idx + 99} header={`Question ${idx + 1}`}>
          <Form.Item
            name={`${idx}`}
            // value={selected}
            rules={[{ required: true, message: "Please select an option" }]}
          >
            {generateOptions(
              question,
              options,
              type,
              selected,
              idx,
              updaterFn,
              min,
              max,
              xAxis,
              yAxis,
              dotsGraphFn,
              graphMax,
              graphScale
            )}
          </Form.Item>
        </AccordionTab>
      );
    }
  );
};

const buildQsTwice = (
  updaterFn,
  updaterFnTwo,
  questions,
  questionsTwo,
  qsFor = "primary",
  qsForTwo = "partner",
  firstName = "",
  partnerFirstName = ""
) => {
  return questions.map(
    (
      {
        question,
        options,
        selected,
        type,
        min,
        max,
        xAxis,
        yAxis,
        dotsGraphFn,
        graphMax,
        graphScale,
      },
      idx
    ) => {
      const {
        question: questionTwo,
        options: optionsTwo,
        selected: selectedTwo,
        type: typeTwo,
        min: minTwo,
        max: maxTwo,
        xAxis: xAxisTwo,
        yAxis: yAxisTwo,
        dotsGraphFn: dotsGraphFnTwo,
        graphMax: graphMaxTwo,
        graphScale: graphScaleTwo,
      } = questionsTwo[idx];
      return (
        <AccordionTab key={idx + 99} header={`Question ${idx + 1}`}>
          <Form.Item
            name={`${idx}_${qsFor}`}
            // value={selected}
            rules={[{ required: true, message: "Please select an option" }]}
          >
            {generateOptions(
              `${
                firstName !== "" ? `${firstName}, ${question}` : `${question}`
              }`,
              options,
              type,
              selected,
              idx,
              updaterFn,
              min,
              max,
              xAxis,
              yAxis,
              dotsGraphFn,
              graphMax,
              graphScale
            )}
          </Form.Item>
          <Form.Item
            name={`${idx}_${qsForTwo}`}
            // value={selected}
            rules={[{ required: true, message: "Please select an option" }]}
          >
            {generateOptions(
              `${
                partnerFirstName !== ""
                  ? `${partnerFirstName}, ${question}`
                  : `${question}`
              }`,
              optionsTwo,
              typeTwo,
              selectedTwo,
              idx,
              updaterFnTwo,
              minTwo,
              maxTwo,
              xAxisTwo,
              yAxisTwo,
              dotsGraphFnTwo,
              graphMaxTwo,
              graphScaleTwo
            )}
          </Form.Item>
        </AccordionTab>
      );
    }
  );
};

const storeScores = (dispatcher, riskProfile, forTarget) => {
  if (forTarget === undefined) return;

  console.log("---- RISK PROFILE ---");
  console.log(riskProfile);

  dispatcher(
    factFindActions.updateClientDataNested({
      action: "UPDATE",
      path: ["riskProfileScores", forTarget],
      newValue: riskProfile,
    })
  );
};

const dispatchUpdate = (path, newValue, dispatcher) => {
  const answers = newValue.map((nv) => nv.selected);
  dispatcher(
    factFindActions.updateClientDataNested({
      action: "UPDATE",
      path,
      newValue: answers,
    })
  );
};

const assignPortfolioWithFixedBands = (fixedBands, score) => {
  if (fixedBands === undefined) return undefined;
  for (let band of fixedBands) {
    if (score <= band.low || score >= band.high) {
      return band.portfolio;
    }
  }
};

const RiskProfileForm = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.factFind);
  console.log(store);

  const doDuplicateQuestions = () => {
    const duplicateQuestions = JSON.parse(JSON.stringify(_questions));
    duplicateQuestions[4]["dotsGraphFn"] = dotsGraph1;
    duplicateQuestions[6]["dotsGraphFn"] = dotsGraph2;
    return duplicateQuestions;
  };

  const hasPartner = useSelector((state) => state.factFind.hasPartner);
  const _clientName = useSelector((state) => state.factFind.primary.firstName);
  const _partnerName = useSelector((state) => state.factFind.partner.firstName);
  const riskProfile = useSelector((state) => state.factFind.riskProfile);
  const fixedBands = useSelector((state) => state.auth.fixedBands);
  const howToComplete: string = useSelector(
    (state) => state.factFind.riskProfile?.howToComplete
  );
  const [questions, setQuestions] = useState(_questions);
  const [questionsTwo, setQuestionsTwo] = useState(
    hasPartner ? doDuplicateQuestions() : []
  );
  const [howToCompleteForm, setHowToCompleteForm] = useState(howToComplete);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resultsActiveIndex, setResultsActiveIndex] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [scored, setScored] = useState(false);
  const [riskScoreTwo, setRiskScoreTwo] = useState(0);
  const [scoredTwo, setScoredTwo] = useState(false);

  useEffect(() => {
    console.log("stuff changed");
    console.log(riskScore);
    console.log(riskScoreTwo);
  }, [questions, questionsTwo]);
  // useEffect(() => {
  //   if (hasPartner) {
  //     const duplicateQuestions = JSON.parse(JSON.stringify(_questions));
  //     duplicateQuestions[4]["dotsGraphFn"] = dotsGraph1;
  //     duplicateQuestions[6]["dotsGraphFn"] = dotsGraph2;
  //     setQuestionsTwo(duplicateQuestions);
  //   }
  // }, [hasPartner]);

  const loadQuestionsFromData = (
    data = [null, null, null, null, null, null, null]
  ) => {
    const duplicateQuestions = doDuplicateQuestions();
    for (let i = 0; i < duplicateQuestions.length; i++) {
      duplicateQuestions[i].selected = data[i];
    }
    return duplicateQuestions;
  };

  useEffect(() => {
    if (howToComplete === "joint") {
      if (riskProfile.joint !== undefined) {
        const loadedQuestions = loadQuestionsFromData(riskProfile.joint);
        setQuestions(loadedQuestions);
        shouldScore(loadedQuestions, setRiskScore, setScored);
      }
      if (riskProfile.primary !== undefined) {
        const loadedQuestions = loadQuestionsFromData(riskProfile.primary);
        setQuestions(loadedQuestions);
        shouldScore(loadedQuestions, setRiskScore, setScored);
      }
    } else {
      if (riskProfile.primary !== undefined) {
        const loadedQuestions = loadQuestionsFromData(riskProfile.primary);
        setQuestions(loadedQuestions);
        shouldScore(loadedQuestions, setRiskScore, setScored);
      }
      if (riskProfile.partner !== undefined) {
        const loadedQuestions = loadQuestionsFromData(riskProfile.partner);
        shouldScore(loadedQuestions, setRiskScoreTwo, setScoredTwo);
        setQuestionsTwo(loadedQuestions);
      }
    }
  }, []);

  const updateQuestionValue = (formFor, idx, value) => {
    let newQuestions;
    if (formFor === "joint" || formFor === "primary") {
      newQuestions = [...questions];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      setQuestions(newQuestions);
      shouldScore(newQuestions, setRiskScore, setScored, "joint");
      dispatchUpdate(["riskProfile", formFor], newQuestions, dispatch);
    } else {
      newQuestions = [...questionsTwo];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      setQuestionsTwo(newQuestions);
      shouldScore(newQuestions, setRiskScoreTwo, setScoredTwo, formFor);
      dispatchUpdate(["riskProfile", formFor], newQuestions, dispatch);
    }
  };

  const shouldScore = (
    newQuestions,
    setRiskScore,
    setScored,
    formFor = undefined
  ) => {
    const allQuestionsAnswered = !newQuestions
      .map((question) => question.selected)
      .some((sel) => sel == null);

    if (allQuestionsAnswered) {
      const riskScore = scoreRiskProfile(newQuestions);
      setRiskScore(riskScore);
      setScored(true);

      const scores = generatePieData(riskScore);
      scores["score"] = riskScore;
      scores["portfolio"] = assignPortfolioWithFixedBands(
        fixedBands,
        riskScore
      );
      console.log("--- IS PORTFOLIO BEING ALLOCATED CORRECTLY");
      console.log(scores);

      storeScores(dispatch, scores, formFor);
    }
  };

  const getIncompleteQuestions = (questions) => {
    const incompleteQuestionIndices = [];
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].selected === null) {
        incompleteQuestionIndices.push(i + 1);
      }
    }
    return incompleteQuestionIndices;
  };

  const handleHowToCompleteForm = (idx, value) => {
    console.log(idx);
    console.log(value);
    setHowToCompleteForm(value);
    dispatch(
      factFindActions.updateClientDataNested({
        path: ["riskProfile", "howToComplete"],
        action: "UPDATE",
        newValue: value,
      })
    );
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 3000,
        top: "7rem",
        paddingLeft: "7rem",
        maxWidth: "110rem",
        minWidth: "75rem",
        // backgroundColor: "white",
      }}
    >
      <Form style={{ backgroundColor: "white" }}>
        <Accordion
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {hasPartner && (
            <AccordionTab
              key={6969}
              header={`How would you like to complete a risk profile?`}
            >
              {/* USAGE:   generateOptions(question,
                                           options,
                                           type,
                                           selected,
                                           idx,
                                           updaterFn, */}
              {generateOptions(
                _howToComplete[0],
                _howToComplete[1],
                _howToComplete[2],
                howToCompleteForm,
                0,
                handleHowToCompleteForm
              )}
            </AccordionTab>
          )}
          {hasPartner &&
            howToCompleteForm === "joint" &&
            buildQs(
              updateQuestionValue.bind(null, "joint"),
              questions,
              "Joint Response"
            )}
          {/* {hasPartner &&
            howToCompleteForm !== "joint" &&
            buildQs(
              updateQuestionValue.bind(null, "primary"),
              questions,
              _clientName
            )} */}
          {hasPartner &&
            howToCompleteForm !== "joint" &&
            // buildQs(
            //   updateQuestionValue.bind(null, "partner"),
            //   questionsTwo,
            //   _partnerName
            // )}}
            buildQsTwice(
              updateQuestionValue.bind(null, "primary"),
              updateQuestionValue.bind(null, "partner"),
              questions,
              questionsTwo,
              "primary",
              "partner",
              _clientName,
              _partnerName
            )}
          {!hasPartner &&
            buildQs(
              updateQuestionValue.bind(null, "primary"),
              questions,
              _clientName
            )}
        </Accordion>
        <div>
          <Accordion
            activeIndex={resultsActiveIndex}
            onTabChange={(e) => setResultsActiveIndex(e.index)}
          >
            <AccordionTab key={9991} header={`Results`}>
              <Results
                clientName={_clientName}
                partnerName={_partnerName}
                shouldScoreTwice={hasPartner && howToCompleteForm !== "joint"}
                scored={scored}
                scoredTwo={scoredTwo}
                generatePieData={generatePieData}
                riskScore={riskScore}
                riskScoreTwo={riskScoreTwo}
                getIncompleteQuestions={getIncompleteQuestions.bind(
                  null,
                  questions
                )}
                getIncompleteQuestionsTwo={getIncompleteQuestions.bind(
                  null,
                  questionsTwo
                )}
                assignXFromScore={assignXFromScore}
              />
              <ConfirmAcceptProfile scored={scored} scoredTwo={scoredTwo} />
            </AccordionTab>
          </Accordion>
        </div>
      </Form>
    </div>
  );
};

export default RiskProfileForm;
