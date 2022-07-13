import { Checkbox, Row, Col } from "antd";
import { useState, useRef, useEffect } from "react";
// import { useFormContext, Controller } from "react-hook-form";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useSelector, useDispatch } from "react-redux";
import { factFindActions } from "../../../store/fact-find";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import { Slider } from "antd";
import classes from "./why-money-input.module.css";
// import { Radio } from "antd";
// import Advisors from "./advisors";
// import ControlledInput from "./controlled-input";

const specificInvestmentsSliders = [
  "Term Deposits",
  "Ethical Investments",
  "Investment Transparency",
  "Alternative Investments",
  "Range of Managers and Styles",
];

const questionKeyMap = (question) => {
  const map = {
    "Term Deposits": "termDeposits",
    "Ethical Investments": "ethicalInvestments",
    "Investment Transparency": "investmentTransparency",
    "Alternative Investments": "alternativeInvestments",
    "Range of Managers and Styles": "rangeOfManagersAndStyles",
    "Lowest cost is the primary goal": "lowestCost",
    "Seeking value for money": "valueForMoney",
    "Willing to pay for relevant features": "willingToPayForFeatures",
    "Willing to pay for talented managers": "willingToPayForManagers",
  };

  return map[question];
};

const feesAndCostsSliders = [
  "Lowest cost is the primary goal",
  "Seeking value for money",
  "Willing to pay for relevant features",
];

const options = [
  // { label: "Build a home", value: "Build a home" },
  // { label: "Buy a property", value: "Buy a property" },
  // { label: "Move to another place", value: "Move to another place" },
  // { label: "Travel", value: "Travel" },
  // { label: "Buy a new car", value: "Buy a new car" },
  { label: "Save more/spend less", value: "Save more/spend less" },
  { label: "Manage retirement income", value: "Manage retirement income" },
  { label: "Plan to retire", value: "Plan to retire" },
  { label: "Contribute to super", value: "Contribute to super" },
  {
    label: "Manage investment portfolio",
    value: "Manage investment portfolio",
  },
  { label: "Manage debt", value: "Manage debt" },
  { label: "Invest a lump sum", value: "Invest a lump sum" },
  { label: "Set up a SMSF", value: "Set up a SMSF" },
  {
    label: "Check insurance cover and policies",
    value: "Check insurance cover and policies",
  },
  {
    label: "Make better financial decisions",
    value: "Make better financial decisions",
  },
  { label: "Start a family", value: "Start a family" },
  // { label: "Start a business", value: "Start a business" },
  { label: "Help the kids out", value: "Help the kids out" },
  { label: "Fund education", value: "Fund education" },
  { label: "Look after extended family", value: "Look after extended family" },
];

const defaultInputs = {
  termDeposits: 1,
  ethicalInvestments: 1,
  investmentTransparency: 1,
  rangeOfManagersAndStyles: 1,
  alternativeInvestments: 1,
  lowestCost: 1,
  valueForMoney: 1,
  willingToPayForFeatures: 1,
};

const infoText = (
  <>
    1 - Strongly Disagree
    <br /> 2 - Disagree
    <br /> 3 - No Opinion
    <br /> 4 - Agree
    <br /> 5 - Strongly Agree
    <br />
    <br />
  </>
);

const WhyMoneyInput = ({ name, inputFor }) => {
  // const {
  //   reset,
  //   setValue,
  //   register,
  //   handleSubmit,
  //   formState,
  //   control,
  //   getValues,
  // } = useFormContext();

  // const otherAdvisers = getValues("otherAdvisers");
  const currentInputs = useSelector(
    (state) => state.factFind[inputFor]["whyMoney"]
  );
  const currentCheckboxInputs = useSelector(
    (state) => state.factFind[inputFor]["wants"]
  );
  // console.log(currentCheckboxInputs);
  // console.log(currentInputs);
  // console.log(inputFor);

  const [opts, setOptions] = useState(options);
  const [activeIndex, setActiveIndex] = useState(null);
  const [newOption, setNewOption] = useState("");
  const [sliderValues, setSliderValues] = useState(
    currentInputs === undefined ? defaultInputs : currentInputs
  );
  const [currentCheckedLabels, setCurrentCheckedLabels] = useState(undefined);

  useEffect(() => {
    if (currentCheckboxInputs === undefined || opts === undefined) return;

    const optLabels = opts?.map((opt) => opt.label);
    const newOpts = currentCheckboxInputs?.filter(
      (opt) => !optLabels.includes(opt)
    );
    const newOptObjects = newOpts?.map((opt) => ({ value: opt, label: opt }));
    try {
      setOptions([...opts, ...newOptObjects]);
    } catch (e) {
      setOptions(opts);
    }
    setCurrentCheckedLabels(currentCheckboxInputs);
  }, [currentCheckboxInputs]);

  const dispatch = useDispatch();

  const pushOption = (option) => {
    setOptions((prevOptions) => [...prevOptions, option]);
  };
  const onChangeHandler = (checkedVals) => {
    dispatch(
      factFindActions.updateClientDataNested({
        path: [inputFor, "wants"],
        action: "UPDATE",
        newValue: checkedVals,
      })
    );
  };

  // const newOptionRef = useRef();
  const addOptionHandler = (e) => {
    e.preventDefault();
    // console.log(newOptionRef.current.value);
    const newOpt = newOption.charAt(0).toUpperCase() + newOption.slice(1);
    pushOption({ value: newOpt, label: newOpt });
    setNewOption("");
  };

  const [min, max] = [0, 5];

  const sliderChangeHandler = (questionKey, value) => {
    // console.log(questionKey, value);
    setSliderValues((prevState) => {
      const newValues = {
        ...prevState,
        [questionKey]: value,
      };
      console.log(newValues);
      dispatch(
        factFindActions.updateClientDataNested({
          path: [inputFor, "whyMoney"],
          action: "UPDATE",
          newValue: newValues,
        })
      );
      return newValues;
    });
  };

  const onCheckboxChange = (checkedValues) => {
    // console.log(checkedValues);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        What's important to you?*&nbsp;&nbsp;(Optional)
      </h1>
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <AccordionTab header="How do you feel about specific investments?">
          {infoText}
          {specificInvestmentsSliders?.map((question) => {
            const questionKey = questionKeyMap(question);
            const value = sliderValues[questionKey];
            const mid = ((max - min) / 2).toFixed(5);
            const preColorCls = value >= mid ? "" : classes.iconwrapperactive;
            const nextColorCls = value >= mid ? classes.iconwrapperactive : "";
            return getSliderJSX(
              sliderChangeHandler,
              questionKey,
              question,
              preColorCls,
              nextColorCls,
              value
            );
            // <div>
            //   <div className={classes.question}>{question}</div>

            //   <div className={classes.iconwrapper}>
            //     <FrownOutlined
            //       className={classes.anticon + " " + preColorCls}
            //     />
            //     <Slider
            //       marks={[0, 1, 2, 3, 4, 5]}
            //       max={5}
            //       min={1}
            //       step={1}
            //       // tooltipVisible
            //       onChange={sliderChangeHandler.bind(null, questionKey)}
            //       value={value}
            //     />
            //     <SmileOutlined
            //       className={classes.anticon + " " + nextColorCls}
            //     />
            //   </div>
            //   <br />
            //   <br />
            // </div>
          })}
        </AccordionTab>
        <AccordionTab header="How do you feel about fees and costs?">
          {infoText}
          {feesAndCostsSliders?.map((question) => {
            const questionKey = questionKeyMap(question);
            const value = sliderValues[questionKey];
            const mid = ((max - min) / 2).toFixed(5);
            const preColorCls = value >= mid ? "" : classes.iconwrapperactive;
            const nextColorCls = value >= mid ? classes.iconwrapperactive : "";
            return getSliderJSX(
              sliderChangeHandler,
              questionKey,
              question,
              preColorCls,
              nextColorCls,
              value
            );
          })}
        </AccordionTab>

        <AccordionTab header="Reasons for seeking financial advice">
          <Checkbox.Group
            defaultValue={currentCheckedLabels}
            onChange={onChangeHandler}
            name={"wants"}
            // style={{ width: "100%" }}
          >
            <Row>
              {opts &&
                opts?.map((opt) => {
                  return (
                    <Col span={10}>
                      <Checkbox key={opt.value} value={opt.label}>
                        {opt.label}
                      </Checkbox>
                    </Col>
                  );
                })}
            </Row>
            <Row>
              <Col span={12}>
                <div className={`p-field ${classes.add_option}`}>
                  <label
                    htmlFor="newOption"
                    className={`p-d-block ${classes.add_option_label}`}
                  >
                    Add option
                  </label>
                  <InputText
                    id="newOption"
                    value={newOption}
                    className={`p-d-block ${classes.add_option_text}`}
                    onChange={(e) => setNewOption(e.target.value)}
                    // ref={newOptionRef}
                    // className="p-d-block"
                  />
                  <Button
                    icon="pi pi-plus"
                    className={`p-button-raised p-button-rounded p-button-outlined p-button-success ${classes.add_option_button}`}
                    onClick={addOptionHandler}
                  />
                </div>
              </Col>
            </Row>
          </Checkbox.Group>
        </AccordionTab>

        {/* <AccordionTab header="Other Advisers">
          <div className={classes.inputcontainer}>
            <span className={classes.inputlabel}>
              Do you have any other advisors?
            </span>
            <ControlledInput
              control={control}
              name="otherAdvisers"
              type="radio"
              onSubmit={onSubmit}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </ControlledInput>
            {otherAdvisers && <Advisors />}
          </div>
        </AccordionTab> */}
      </Accordion>
    </>

    // <Controller
    //   name={name}
    //   control={control}
    //   // rules={{ required: "First name is required" }}
    //   render={({
    //     field, //{ onChange, onBlur, value, name, ref },
    //     fieldState: { invalid, isTouched, isDirty, error },
    //   }) => <Checkbox.Group options={opts} onChange={field.onChange} />}
    // />
  );
};

export default WhyMoneyInput;

const getSliderJSX = (
  sliderChangeHandler,
  questionKey,
  question,
  preColorCls,
  nextColorCls,
  value
) => {
  return (
    <div>
      <div className={classes.question}>{question}</div>

      <div className={classes.iconwrapper}>
        <FrownOutlined className={classes.anticon + " " + preColorCls} />
        <Slider
          marks={[0, 1, 2, 3, 4, 5]}
          max={5}
          min={1}
          step={1}
          // tooltipVisible
          onChange={sliderChangeHandler.bind(null, questionKey)}
          value={value}
        />
        <SmileOutlined className={classes.anticon + " " + nextColorCls} />
      </div>
      <br />
      <br />
    </div>
  );
};
