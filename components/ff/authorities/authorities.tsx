import { useState, useRef, EffectCallback } from "react";
import { generateOptions } from "../user-info-form/risk-profile-form";
import { useSelector, useDispatch } from "react-redux";
import SimpleCrudTable from "../../ui/simple-crud-table";
import SignatureCanvas from "react-signature-canvas";
import AnimatedStepButton from "../../ui/animated-step-button";
import { Form, Divider } from "antd";
import { Card } from "primereact/card";
import classes from "./authorities.module.css";
import { Button } from "primereact/button";
import Sign from "../../ui/sign";
import TFN from "./tfn";
import Investigate from "./investigate";
import { factFindActions } from "../../../store/fact-find";
import { useLazyEffect } from "../user-info-form/risk-profile-results/confirm-accept-profile";
import { useEffect } from "react";

const _questions = [
  {
    question:
      "I understand and acknowledge that by either not accurately or fully completing the Fact Find, any recommendation or advice given by the financial adviser may be inappropriate to my needs and that I risk making a financial commitment to a financial product that may be inappropriate for my needs.",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "I have received, read and understood my financial advisers and their associates AFS Licensee's Financial Services Guide (FSG) version Financial Services Guide (FSG).",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "Unless I have specifically requested otherwise, I confirm and consent to the collection, use and disclosure of my personal information in accordance with the procedures outlined in my financial adviser’s AFS Licensee’s Privacy Policy (which is available to me on request or by logging on to their website). I acknowledge and accept the Privacy Statement contained in this Financial Fact Find.",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "I wish to receive Product Disclosure Statements, Fee Disclosure Statements, Service Renewal Notices, Financial Services Guides, Privacy Policies & Statements of advice Electronically via Email and/or the Client Portal.",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "I have understood the Risk Profile questionnaire and asset allocations and I also understand that the final allocations recommended may vary as a result of my specific financial planning needs.",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "I would like to be contacted from time to time about additional relevant products and services which may suit my needs.",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "I would like to receive documentation via email",
    options: [
      { label: "Yes I agree", value: "Yes" },
      { label: "No I disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
];

const _questionsWithPartner = [
  {
    question:
      "We understand and acknowledge that by either not accurately or fully completing the Fact Find, any recommendation or advice given by the financial adviser may be inappropriate to our needs and that we risk making a financial commitment to a financial product that may be inappropriate for our needs.",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "We have received, read and understood our financial advisers and their associates AFS Licensee's Financial Services Guide (FSG) version Financial Services Guide (FSG).",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "Unless We have specifically requested otherwise, We confirm and consent to the collection, use and disclosure of our personal information in accordance with the procedures outlined in our financial adviser’s AFS Licensee’s Privacy Policy (which is available to us on request or by logging on to their website). We acknowledge and accept the Privacy Statement contained in this Financial Fact Find.",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "We wish to receive Product Disclosure Statements, Fee Disclosure Statements, Service Renewal Notices, Financial Services Guides, Privacy Policies & Statements of advice Electronically via Email and/or the Client Portal.",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "We have understood the Risk Profile questionnaire and asset allocations and We also understand that the final allocations recommended may vary as a result of our specific financial planning needs.",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question:
      "We would like to be contacted from time to time about additional relevant products and services which may suit our needs.",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
  {
    question: "We would like to receive documentation via email",
    options: [
      { label: "Yes we agree", value: "Yes" },
      { label: "No we disagree", value: "No" },
    ],
    type: "radio",
    selected: null,
  },
];

export const emptyPlan = {
  planType: "",
  company: "",
  referenceNumber: "",
  estimatedValue: 0,
};

const planOptions = [
  { label: "Policy", value: "policy" },
  { label: "Investment", value: "investment" },
  { label: "Super", value: "super" },
  { label: "Pension", value: "pension" },
  { label: "Other", value: "other" },
];
const authorityOptions = [
  { label: "Authority to Investigate", value: "toInvestigate" },
  { label: "Appointment as Advisor", value: "asAdvisor" },
  { label: "None", value: "none" },
];

export const cols = [
  {
    field: "planType",
    header: "Type",
    type: "select",
    options: planOptions,
  },
  //   {
  //     field: "planType",
  //     header: "Policy / Investment / Super / Pension",
  //     type: "select",
  //     options: planOptions,
  //   },
  { field: "company", header: "Company", type: "text" },
  {
    field: "referenceNumber",
    header: "Reference Number",
    type: "text",
  },
  {
    field: "estimatedValue",
    header: "Estimated Value",
    type: "price",
  },
  {
    field: "authorityGranted",
    header: "Scope of Authority",
    type: "select",
    options: authorityOptions,
  },
];

const Authorities = () => {
  const dispatch = useDispatch();
  const primary = useSelector((state) => state.factFind.primary);
  const firstName = primary.firstName;
  const lastName = primary.lastName;
  const hasPartner = useSelector((state) => state.factFind.hasPartner);
  const partner = useSelector((state) => state.factFind.partner);
  const _authoritiesData = useSelector(
    (state) => state.factFind.authoritiesData
  );

  // Disclosure questions:
  const [questions, setQuestions] = useState(
    hasPartner ? _questionsWithPartner : _questions
  );
  // Authorities data:
  const [authoritiesData, setAuthoritiesData] = useState({
    TFN: "",
    signature: null,
    signedAt: null,
  });
  const [authoritiesDataPartner, setAuthoritiesDataPartner] = useState({
    TFN: "",
    signature: null,
    signedAt: null,
  });

  const lazyEffectPrimary: EffectCallback = () => {
    if (authoritiesData.TFN !== _authoritiesData?.primary?.TFN) {
      dispatch(
        factFindActions.updateClientDataNestedObject({
          path: ["authoritiesData", "primary"],
          newValue: {
            TFN: authoritiesData.TFN,
          },
        })
      );
    } else if (
      authoritiesData.signedAt !== _authoritiesData?.primary?.signedAt
    ) {
      dispatch(
        factFindActions.updateClientDataNestedObject({
          path: ["authoritiesData", "primary"],
          newValue: {
            signature: authoritiesData.signature,
            signedAt: new Date().toISOString(),
          },
        })
      );
    }
  };
  const lazyEffectPartner: EffectCallback = () => {
    if (authoritiesDataPartner.TFN !== _authoritiesData?.partner?.TFN) {
      dispatch(
        factFindActions.updateClientDataNestedObject({
          path: ["authoritiesData", "partner"],
          newValue: {
            TFN: authoritiesDataPartner.TFN,
          },
        })
      );
    } else if (
      authoritiesDataPartner.signedAt !== _authoritiesData?.partner?.signedAt
    ) {
      dispatch(
        factFindActions.updateClientDataNestedObject({
          path: ["authoritiesData", "partner"],
          newValue: {
            signature: authoritiesDataPartner.signature,
            signedAt: new Date().toISOString(),
          },
        })
      );
    }
  };

  useLazyEffect(lazyEffectPrimary, [authoritiesData], 3000);

  if (hasPartner) {
    useLazyEffect(lazyEffectPartner, [authoritiesDataPartner], 3000);
  }

  const updateTFN = (target, value) => {
    console.log(target, value);
    if (target === "primary") {
      setAuthoritiesData((prevState) => ({ ...prevState, TFN: value }));
    } else if (target === "partner") {
      setAuthoritiesDataPartner((prevState) => ({ ...prevState, TFN: value }));
    }
  };

  const handleTfnBlur = (target, event) => {
    console.log(target, event.target.value);
    const newTFN =
      target === "primary" ? authoritiesData.TFN : authoritiesDataPartner.TFN;
    console.log(newTFN);
    dispatch(
      factFindActions.updateClientDataNestedObject({
        path: ["authoritiesData", target],
        newValue: {
          TFN: event.target.value,
        },
      })
    );
  };

  const [step, setStep] = useState("Disclosure");
  // const [activeIndex, setActiveIndex] = useState(0);

  const updateQuestionValue = (idx, value) => {
    setQuestions((prevState) => {
      const newQuestions = [...prevState];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      console.log(newQuestions);
      const responses = newQuestions.map((nq) => nq.selected);
      dispatch(
        factFindActions.updateClientDataNestedObject({
          path: ["authoritiesData", "disclosure"],
          newValue: {
            type: hasPartner ? "joint" : "individual",
            responses,
          },
        })
      );
      return newQuestions;
    });
  };

  useEffect(() => {
    if (_authoritiesData?.disclosure?.responses) {
      const newQuestions = [...questions];
      for (let i = 0; i < newQuestions.length; i++) {
        newQuestions[i].selected = _authoritiesData.disclosure?.responses[i];
      }
      setQuestions(newQuestions);
    }
    if (_authoritiesData?.primary) {
      setAuthoritiesData((prevState) => ({
        ...prevState,
        ..._authoritiesData.primary,
      }));
    }
    if (_authoritiesData?.partner) {
      setAuthoritiesDataPartner((prevState) => ({
        ...prevState,
        ..._authoritiesData.partner,
      }));
    }
  }, []);

  const updateSignatureHandler = (something) => {
    console.log(something);
  };

  const handleNextClicked = (e) => {
    e.preventDefault();
    console.log(questions);
    setStep("Authorisations");
  };
  const handlePrevClicked = (e) => {
    e.preventDefault;
    setStep("Disclosure");
  };

  const header = (
    <div className={classes.header_container}>
      <img
        src="/assets/images/my-financial-mentors.jpg"
        style={{ maxHeight: "100px", maxWidth: "150px" }}
      />
    </div>
  );

  const extractNames = (firstName, lastName, target = "Client") => {
    if (firstName) {
      if (lastName) {
        return `${firstName}`;
      } else {
        return `${firstName}`;
      }
    } else {
      return target;
    }
  };

  return (
    <Card
      title={step}
      header={header}
      className={`${classes.container} p-shadow-24`}
    >
      <span className={classes.names}>
        {!hasPartner && `${firstName},`}
        {hasPartner &&
          `We, ${extractNames(firstName, lastName)} and ${extractNames(
            partner.firstName,
            partner.lastName,
            "Partner"
          )},`}
        <br />
      </span>
      <div>
        {step === "Disclosure" && (
          <div>
            <Form>
              {questions.map(({ question, options, selected, type }, idx) => {
                return (
                  <Form.Item
                    name={idx}
                    key={idx}
                    rules={[
                      { required: true, message: "Please select an option" },
                    ]}
                  >
                    {generateOptions(
                      question,
                      options,
                      type,
                      selected,
                      idx,
                      updateQuestionValue
                    )}
                    <br />
                  </Form.Item>
                );
              })}
            </Form>
            <div className={classes.step_button}>
              <AnimatedStepButton
                direction="right"
                text="Continue"
                onClick={handleNextClicked}
              />
            </div>
          </div>
        )}
        {step === "Authorisations" && (
          <div>
            <TFN
              updaterFn={updateTFN.bind(null, "primary")}
              authoritiesData={authoritiesData}
              onBlur={handleTfnBlur.bind(null, "primary")}
            />
            <br />
            <Divider />
            <br />
            <Investigate cols={cols} emptyPlan={emptyPlan} target={"primary"} />
            <br />
            {hasPartner && (
              <>
                <Divider />
                <TFN
                  updaterFn={updateTFN.bind(null, "partner")}
                  authoritiesData={authoritiesDataPartner}
                  onBlur={handleTfnBlur.bind(null, "partner")}
                />
                <Investigate
                  cols={cols}
                  emptyPlan={emptyPlan}
                  target={"partner"}
                />
              </>
            )}
            <div>
              <Divider />

              <h3>Signed</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyItems: "space-between",
                  alignItems: "space-between",
                }}
              >
                <Sign
                  firstName={firstName}
                  lastName={lastName}
                  signatureUpdateHandler={updateSignatureHandler.bind(
                    null,
                    "primary"
                  )}
                />
                {hasPartner && (
                  <Sign
                    firstName={partner?.firstName}
                    lastName={partner?.lastName}
                    signatureUpdateHandler={updateSignatureHandler.bind(
                      null,
                      "partner"
                    )}
                  />
                )}
              </div>
            </div>
            <div className={classes.step_button}>
              <AnimatedStepButton
                direction="left"
                text="Previous"
                onClick={handlePrevClicked}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Authorities;
