import { useState, useEffect } from "react";
import { generateOptions } from "../user-info-form/risk-profile-form";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../../store/fact-find";
import { Button, Icon } from "semantic-ui-react";
import { Card } from "antd";

export const _questions = [
  {
    question: "How would you describe your health?",
    options: [
      { label: "Excellent", value: "Excellent" },
      { label: "Very Good", value: "Very Good" },
      { label: "Good", value: "Good" },
      { label: "Fair", value: "Fair" },
      { label: "Poor", value: "Poor" },
      { label: "Health concerns", value: "Health concerns" },
      { label: "Congenital condition", value: "Congenital condition" },
      { label: "Would rather not say", value: "Would rather not say" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "What is your height?",
    type: "text",
    selected: "",
  },
  {
    question: "What is your weight?",
    type: "text",
    selected: "",
  },
  {
    question: "Do you smoke?",
    type: "select",
    options: [
      { label: "Smoker", value: "Smoker" },
      { label: "Non-smoker", value: "Non-smoker" },
    ],
    selected: null,
  },
  {
    question: "How many cigarettes per day?",
    type: "number",
    selected: 0,
    hideInitially: true,
    conditional: "Smoker",
  },
  {
    question: "Do you drink alcohol?",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    selected: null,
  },
  {
    question: "How many standard drinks per day?",
    type: "number",
    selected: 0,
    hideInitially: true,
    conditional: "Yes",
  },
  {
    question:
      "Are you presently or do you intend to receive treatment for any medical issue?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "What is the issue?",
    type: "text",
    selected: "",
    hideInitially: true,
    conditional: "Yes",
  },
  {
    question:
      "Have you been diagnosed with any significant illness or illnesses in the last five years?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "Please provide details",
    type: "text",
    selected: "",
    hideInitially: true,
    conditional: "Yes",
  },
  {
    question:
      "Has any member of your immediate family been diagnosed with any significant illness or illnesses?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "Please provide details",
    type: "text",
    selected: "",
    hideInitially: true,
    conditional: "Yes",
  },
  {
    question: "Have you ever suffered from any the following?",
    options: [
      "Anxiety",
      "Depression",
      "Back or neck problems",
      "A heart condition",
      "Cancer",
    ],
    type: "checkbox",
    selected: [],
  },
  {
    question:
      "Is there a history of any particular illness in your family e.g. diabetis, heart conditions, genetic disorders?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "Which condition(s)?",
    type: "text",
    selected: "",
    hideInitially: true,
    conditional: "Yes",
  },
  {
    question: "Do you exercise, play any sports or pursue outdoor activities?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
];
/* USAGE:
export const generateOptions = (
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
  graphMax = "auto")
  */
const HealthInfo = () => {
  const [questions, setQuestions] = useState(_questions);
  const [partnerQuestions, setPartnerQuestions] = useState(undefined);
  const [activeForm, setActiveForm] = useState("primary");
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const healthInfo = useSelector((state) => state.factFind?.healthInfo);
  const clientName = useSelector((state) => state.factFind?.primary?.firstName);
  const hasPartner = useSelector((state) => state.factFind?.hasPartner);
  const partnerName = useSelector(
    (state) => state.factFind?.partner?.firstName
  );

  const _clientName =
    clientName === undefined || clientName === ""
      ? "Unnamed Client"
      : clientName;
  const _partnerName =
    partnerName === undefined || partnerName === ""
      ? "Unnamed Partner"
      : partnerName;

  useEffect(() => {
    if (healthInfo !== undefined) {
      if (healthInfo?.primary !== undefined) {
        setQuestions(healthInfo.primary);
      }
      if (healthInfo?.partner !== undefined) {
        setPartnerQuestions(healthInfo.partner);
      }
    }
  }, []);

  console.log(questions);

  const updateQuestionValue = (idx, value) => {
    setQuestions((prevState) => {
      const newQuestions = [...prevState];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      return newQuestions;
    });
  };

  const updateQuestionValuePartner = (idx, value) => {
    setPartnerQuestions((prevState) => {
      const newQuestions = [...prevState];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      return newQuestions;
    });
  };

  const onCheckboxChange = (idx, setter, e) => {
    let selected = [...questions[idx].selected];
    if (e.checked) selected.push(e.value);
    else selected.splice(selected.indexOf(e.value), 1);
    setter(idx, selected);
  };
  //  const { newValue, action, path } = _action.payload;
  useEffect(() => {
    dispatch(
      factFindActions.updateClientDataNested({
        action: "UPDATE",
        newValue: questions,
        path: ["healthInfo", "primary"],
      })
    );
  }, [questions]);

  useEffect(() => {
    if (partnerQuestions === undefined) return;

    dispatch(
      factFindActions.updateClientDataNested({
        action: "UPDATE",
        newValue: questions,
        path: ["healthInfo", "partner"],
      })
    );
  }, [partnerQuestions]);

  return (
    <div style={{ position: "relative" }}>
      <span style={{ fontSize: "1.4rem", marginLeft: "1.5rem" }}>
        Please provide some answers to the following questions in order to make
        any potential underwiting process easier for you:
        <br />
      </span>
      {hasPartner && false && (
        <Card
          className="card"
          style={{
            position: "fixed",
            // top: "2rem",
            right: "10rem",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(244,244,244)",
            padding: "0rem !important",
          }}
        >
          <div>
            <Button
              style={{ width: "20rem", marginBottom: "0.35rem" }}
              icon
              labelPosition="left"
              onClick={() => setActiveForm("primary")}
            >
              <Icon name="wordpress forms" />
              {_clientName}s Health Form
            </Button>
          </div>
          <div>
            <Button
              style={{ width: "20rem" }}
              icon
              labelPosition="left"
              onClick={() => setActiveForm("partner")}
            >
              <Icon name="wordpress forms" />
              {_partnerName}s Health Form
            </Button>
          </div>
        </Card>
      )}

      <div
        style={{
          opacity: activeForm === "primary" ? 1 : 0,
          zIndex: activeForm === "partner" ? 50000 : -1,
          maxWidth: "70rem",
          marginLeft: "3rem",
          marginTop: "1rem",
          padding: "2rem",
          border: "solid rgb(249,249,249) 4px",
        }}
      >
        {questions.map(
          (
            { question, options, selected, type, hideInitially, conditional },
            idx
          ) => {
            if (hideInitially) {
              const lastQuestion = questions[idx - 1];
              const lastQuestionSelected = lastQuestion.selected;
              if (lastQuestionSelected !== conditional) return <></>;
            }

            let updaterFn = updateQuestionValue;
            if (type === "checkbox") {
              updaterFn = onCheckboxChange.bind(null, idx, updateQuestionValue);
            }
            return (
              <>
                {generateOptions(
                  question,
                  options,
                  type,
                  selected,
                  idx,
                  updaterFn
                )}
                <br />
              </>
            );
          }
        )}
      </div>
      {hasPartner && false && (
        <div
          style={{
            opacity: activeForm === "partner" ? 1 : 0,
            zIndex: activeForm === "partner" ? 50000 : -1,
          }}
        >
          {partnerQuestions?.map(
            (
              { question, options, selected, type, hideInitially, conditional },
              idx
            ) => {
              if (hideInitially) {
                const lastQuestion = questions[idx - 1];
                const lastQuestionSelected = lastQuestion.selected;
                if (lastQuestionSelected !== conditional) return <></>;
              }

              let updaterFn = updateQuestionValuePartner;
              if (type === "checkbox") {
                updaterFn = onCheckboxChange.bind(
                  null,
                  idx,
                  updateQuestionValuePartner
                );
              }
              return (
                <>
                  {generateOptions(
                    question,
                    options,
                    type,
                    selected,
                    idx,
                    updaterFn
                  )}
                  <br />
                </>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default HealthInfo;
