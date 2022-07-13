import { useState } from "react";
import { Label, Button } from "semantic-ui-react";
import { DatePicker, Space, InputNumber, Select, Form, Divider } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;
import { useDrag, ConnectDragSource, DragSource } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import classes from "./goal-dropped.module.css";
import { generateRadioJSX } from "./user-info-form/risk-profile-form";
import { useEffect } from "react";
import styled from "@emotion/styled";

const grid = 8;
const borderRadius = 2;
const colors = {
  soft: "rgb(255, 250, 230)",
  hard: "rgb(255, 196, 0)",
  success: "darkgreen",
};

const getBorderColor = (isDragging, justDropped, colors) =>
  isDragging ? colors.hard : justDropped ? colors.success : "transparent";

const getBackgroundColor = (isDragging, isGroupedOver, justDropped, colors) => {
  if (isDragging) {
    return colors.soft;
  }
  if (justDropped) {
    return "lightgreen";
  }

  if (isGroupedOver) {
    return "rgb(235, 236, 240)";
  }
  return "transparent";
  // return "rgb(255, 255, 255)";
};

const Container = styled.a`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props) =>
    getBorderColor(props.isDragging, props.justDropped, colors)};
  background-color: ${(props) =>
    getBackgroundColor(
      props.isDragging,
      props.isGroupedOver,
      props.justDropped,
      colors
    )};
  box-shadow: ${({ isDragging, justDropped }) =>
    isDragging
      ? `2px 2px 1px ${"rgb(165, 173, 186)"}`
      : justDropped
      ? `2px 2px 1px darkgreen`
      : "none"};
  padding: ${grid}px;
  // min-height: 37px;
  // min-width: 9rem;
  // max-width: 7rem;
  // max-height: 10.25rem;
  margin-bottom: ${grid}px;
  user-select: none;
  transition: all 0.25s;
  /* anchor overrides */
  color: rgb(9, 30, 66);

  &:hover,
  &:active {
    color: rgb(9, 30, 66);
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => colors.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const ContainerTwo = styled.a`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  justify-self: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  text-align: center;
  width: 7.2rem;
  height: 7.2rem;
  /* font-size: 1.4rem !important; */
  border-radius: 50%;
  // background-color: rgba(255, 255, 255, 0.8);
  border: black solid 1.5px;
  // border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props) =>
    getBorderColor(props.isDragging, props.justDropped, colors)};
  background-color: ${(props) =>
    getBackgroundColor(
      props.isDragging,
      props.isGroupedOver,
      props.justDropped,
      colors
    )};
  box-shadow: ${({ isDragging, justDropped }) =>
    isDragging
      ? `2px 2px 1px ${"rgb(165, 173, 186)"}`
      : justDropped
      ? `2px 2px 1px darkgreen`
      : "none"};
  // padding: ${grid}px;
  // min-height: 37px;
  // min-width: 9rem;
  // max-width: 7rem;
  // max-height: 10.25rem;
  // margin-bottom: ${grid}px;
  user-select: none;
  transition: all 0.15s;
  /* anchor overrides */
  // color: rgb(9, 30, 66);

  &:hover,
  &:active {
    color: rgb(9, 30, 66);
    background-color: ${colors.soft};
    text-decoration: none;
    border-color: ${colors.hard};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => colors.hard};
    box-shadow: none;
  }
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    l: { span: 14 },
    xl: { span: 14 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    l: { span: 14 },
    xl: { span: 14 },
  },
};

const tooltipStyles = {
  zIndex: 100000,
  position: "absolute",
  display: "flex",
  alignSelf: "flex-end",
  alignContent: "flex-end",
  justifyContent: "flex-end",
  margin: "0.5rem",
  transition: "scale 1.5s, background-color 1.5s",
};

const labelStyles = {
  position: "absolute",
  zIndex: 100000,
  top: "2.5rem", //"-33.25rem",
  left: "-29rem",
  width: "50rem",
};

export interface GoalProps {
  id: any;
  left: number;
  top: number;
  hideSourceOnDrag?: boolean;
  goal: string;
  idx: number;
  arrIdx: number;

  // Collected Props
  connectDragSource: ConnectDragSource;
  isDragging?: boolean;
}

const rangePicker = <RangePicker />;
const datePicker = <DatePicker />;
// const agePicker = <InputNumber min={0} max={130} />;
const selectGoalFrequency = (
  <Select style={{ width: 220 }}>
    <Option value="onceOff">Once off</Option>
    <Option value="weekly">Weekly</Option>
    <Option value="fortnightly">Fortnightly</Option>
    <Option value="quarterly">Quarterly</Option>
    <Option value="biAnnually">Bi-annually</Option>
    <Option value="yearly">Yearly</Option>
  </Select>
);

const _goalType = (
  <Select style={{ width: 220 }}>
    <Option value="monetary">Monetary</Option>
    <Option value="nonMonetary">Non-Monetary</Option>
  </Select>
);

const _estimateType = (
  <Select placeholder="Select an estimate type" style={{ width: 220 }}>
    <Option value="PV">Present Value</Option>
    <Option value="FV">Future Value</Option>
  </Select>
);

const whenOptions = [
  { label: "At a specific age", value: "age" },
  { label: "By a specific date", value: "date" },
  // { label: "Within an estimated date range", value: "dateRange" },
];

const nmGoalMap = new Map([
  ["Estate Planning/Will", true],
  ["Streamline Budget", true],
  ["Arrange Financial Documents", true],
  ["Plan Insurance Portfolio", true],
  ["Restructure Superannuation", true],
]);

// - Finish "Capturing details" for goals when its on the grid with Popover or tooltip
//   - Date range picker OR Age picker
//   - Estimate of cost (Once off, Monthly, Quarterly, Bi-annually, Yearly)
//   - Is this estimate based on the present value or future value?
//     tooltip helper: (e.g. Present value: "I want the equivalent of what $5000 today could buy me in 10 years." Future value: "I want to go on a trip in 3 years time and it will cost me $3,000, how much is that in todays money")
export const areDetailsRequired = (goal) => {
  console.log("---ARE DETS REQUIRED---");
  console.log(goal);
  console.log(goal.goalType);
  const dateSet =
    (goal.when === "age" && goal.age) ||
    (goal.when === "dateRange" && goal.dateRange) ||
    (goal.when === "date" && goal.date);

  if (goal.goalType === "nonMonetary") {
    return !!!dateSet;
  }

  const frequencySet = goal.goalFrequency === "onceOff" || goal.goalFrequency; //&& goal.numTimes);
  return !(dateSet && frequencySet && goal.estimateType && goal.estimatedCost);
};

// export const basicGoal = ({   when,
//   age,
//   dateRange,
//   date,
//   estimateType,
//   estimatedCost,
//   numTimes,
//   goalFrequency, }) => (
//   <div>
//     <ContainerTwo
//       isDragging={false}
//       groupedOver={false}
//       justDropped={false}
//       // onClick={() => setGoalHovered(true)}
//       style={
//         areDetailsRequired({
//           when,
//           age,
//           dateRange,
//           date,
//           estimateType,
//           estimatedCost,
//           numTimes,
//           goalFrequency,
//         })
//           ? {}
//           : {
//               backgroundColor: "lightgreen",
//               border: "darkgreen solid 1.5px",
//             }
//       }
//     >
//       <span className={classes.goal_button_icon}>{icon}</span>
//       <span className={classes.goal_text}>{goal}</span>
//     </ContainerTwo>
//   </div>);

const DroppedGoal = ({
  goal,
  icon,
  key,
  idx,
  arrIdx,
  id,
  left,
  top,
  connectDragSource,
  connectDragPreview,
  isDragging,
  children,
  hideSourceOnDrag,
  // extra props from form:
  goalFrequency = undefined,
  when = undefined,
  age = undefined,
  dateRange = undefined,
  date = undefined,
  estimateType = undefined,
  estimatedCost = undefined,
  numTimes = undefined,
  goalData,
}) => {
  const [goalState, setGoalState] = useState({
    goal,
    id,
    left,
    top,
    idx,
    arrIdx,
    goalFrequency,
    when,
    age,
    dateRange,
    date,
    estimateType,
    estimatedCost,
    numTimes,
    ...goalData,
  });

  const [goalDetailsRequired, setGoalDetailsRequired] = useState(
    areDetailsRequired({
      when,
      age,
      dateRange,
      date,
      estimateType,
      estimatedCost,
      numTimes,
      goalFrequency,
    })
  );

  const [justDropped, setJustDropped] = useState(false);
  useEffect(() => {
    setGoalDetailsRequired(areDetailsRequired(goalState));
  }, [goalState]);

  useEffect(() => {
    if (isDragging && !justDropped) {
      setJustDropped(true);
      setTimeout(() => {
        setJustDropped(false);
      }, 1000);
    }
  }, [isDragging]);

  const dispatch = useDispatch();
  const firstName = useSelector((state) => state.factFind.primary.firstName);
  const partnerFirstName = useSelector(
    (state) => state.factFind?.partner?.firstName
  );
  const hasPartner = useSelector((state) => state.factFind.hasPartner);

  const _goalFor = (
    <Select defaultValue="joint" style={{ width: 220 }}>
      <Option value="primary">{firstName}'s goal</Option>
      <Option value="partner">{partnerFirstName}'s goal</Option>
      <Option value="joint">Joint goal</Option>
    </Select>
  );

  const _goalFreq =
    goalData.goalFrequency === undefined ? "onceOff" : goalData.goalFrequency;

  const _goalT =
    goalState.goalType === undefined
      ? nmGoalMap.get(goalState.goal)
        ? "nonMonetary"
        : "monetary"
      : goalState.goalType;

  const _whenToAchieve = goalState.when === undefined ? "age" : goalState.when;

  const [_goalFrequency, setGoalFrequency] = useState(_goalFreq);
  const [goalType, setGoalType] = useState(_goalT);
  const [whenToAchieveGoal, setWhenToAchieveGoal] = useState(_whenToAchieve);

  const [goalHovered, setGoalHovered] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setGoalState((prevState) => ({
      ...prevState,
      goalFrequency: _goalFrequency,
    }));
  }, [_goalFrequency]);
  useEffect(() => {
    setGoalState((prevState) => ({
      ...prevState,
      goalType: goalType,
    }));
  }, [goalType]);
  useEffect(() => {
    setGoalState((prevState) => ({
      ...prevState,
      when: whenToAchieveGoal,
    }));
  }, [whenToAchieveGoal]);
  useEffect(() => {
    setGoalState((prevState) => ({
      ...prevState,
      left: left,
    }));
  }, [left]);
  useEffect(() => {
    setGoalState((prevState) => ({
      ...prevState,
      top: top,
    }));
  }, [top]);

  const dispatchUpdates = (newState) => {
    dispatch(
      factFindActions.updateStatePropertyArrayById({
        id,
        property: "goals",
        newValue: newState,
      })
    );
  };

  const handleWhenToAchieveGoalChanged = (idx, value) => {
    setWhenToAchieveGoal(value);
  };

  const handleSave = (values) => {
    setGoalHovered(false);
    setGoalState((prevState) => {
      const newState = { ...prevState, ...values, when: whenToAchieveGoal };
      dispatchUpdates(newState);
      return newState;
    });
  };

  // const handleSaveFailed = ({ values, errorFields, outOfDate }) => {
  //   console.log(values);
  //   console.log(errorFields);
  //   console.log(outOfDate);
  // };

  // const handleChangeFields = (changedFields, allFields) => {
  //   console.log("HANDLE CHANGE FIELDS");
  //   console.log(changedFields);
  //   console.log(allFields);
  // };

  const handleChangeValues = (changedValues, allValues) => {
    if (Object.keys(changedValues).includes("goalFrequency")) {
      setGoalFrequency(changedValues.goalFrequency);
    } else if (Object.keys(changedValues).includes("goalType")) {
      setGoalType(changedValues.goalType);
    }
  };

  const toolTip = (
    <Label
      style={labelStyles}
      pointing="above" // "below"
      // onMouseLeave={() => setGoalHovered(false)}
    >
      <div>
        <span
          style={{
            margin: "2rem",
            position: "absolute",
            right: "4rem",
            top: "-4rem",
            fontSize: "4rem",
            color: "black",
          }}
        >
          <i className="pi pi-close" />
        </span>
        <Form
          {...formItemLayout}
          form={form}
          onFinish={handleSave}
          initialValues={{
            ...goalState,
            goalFrequency: goalData.goalFrequency,
          }}
          // onFinishFailed={handleSaveFailed}
          // onFieldsChange={handleChangeFields}
          onValuesChange={handleChangeValues}
          style={{ backgroundColor: "white" }}
        >
          <h2
            style={{
              fontWeight: 700,
              textAlign: "center",
              background: "#f9fafb",
              // float: "right",
              borderTop: "2px solid rgba(34,36,38,.15)",
              padding: "1rem 1rem",
              width: "100%",
            }}
          >
            {goal}: Goal Details
          </h2>

          {hasPartner && (
            <Form.Item
              initialValue={"joint"}
              name="goalFor"
              label="Whose goal?"
            >
              {_goalFor}
            </Form.Item>
          )}

          <Form.Item
            name="goalType"
            label="Is it a monetary or non-monetary goal?"
            initialValue={goalType}
          >
            {_goalType}
          </Form.Item>

          {goalType === "monetary" && (
            <>
              {" "}
              <Form.Item
                // initialValue={_goalFrequency}
                name="goalFrequency"
                label="Goal frequency"
              >
                {selectGoalFrequency}
              </Form.Item>
              {_goalFrequency !== "onceOff" && (
                <Form.Item
                  name="numTimes"
                  label="How many times will you fund this goal?"
                  tooltip={`(Note: Only put a number here if there is a limit, not if it is a lifetime goal. e.g. Retirement Income)`}
                >
                  <InputNumber min={0} />
                </Form.Item>
              )}
              <Form.Item
                name="estimatedCost"
                label="Estimated cost of goal (per event)"
                // rules={[
                //   {
                //     required: true,
                //     message: "Input an estimated cost",
                //     whitespace: true,
                //   },
                // ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: 115 }}
                />
              </Form.Item>
              <Form.Item
                name="estimateType"
                label="Type of real money estimate"
                tooltip={`(e.g. Present value: "I want the equivalent of what $5000 today could buy me in 10 years." Future value: "I want to go on a trip in 3 years time and it will cost me $3,000, how much is that in todays money")`}
                // rules={[
                //   {
                //     required: true,
                //     message: "Pick a value type",
                //     whitespace: true,
                //   },
                // ]}
              >
                {_estimateType}
              </Form.Item>
            </>
          )}

          <Divider />

          <Form.Item name="when" label="I want to achieve this goal">
            {/* generateRadioJSX = (options, selected, idx, updaterFn, question) */}
            {generateRadioJSX(
              whenOptions,
              whenToAchieveGoal,
              0,
              handleWhenToAchieveGoalChanged,
              ""
            )}
          </Form.Item>

          {whenToAchieveGoal === "date" && (
            <Form.Item
              name="date"
              label="On what date do you want to achieve this goal?"
            >
              {datePicker}
            </Form.Item>
          )}

          {/* {whenToAchieveGoal === "dateRange" && (
            <Form.Item
              name="dateRange"
              label="Within what date range do you want to achieve this goal?"
            >
              {rangePicker}
            </Form.Item>
          )} */}

          {whenToAchieveGoal === "age" && (
            <Form.Item
              name="age"
              label="What age do you want to achieve this goal?"
            >
              <InputNumber min={0} max={130} />
            </Form.Item>
          )}

          <div
            style={{
              background: "#f9fafb",
              // float: "right",
              borderTop: "2px solid rgba(34,36,38,.15)",
              padding: "1rem 1rem",
              textAlign: "right",
              width: "100%",
            }}
          >
            <Button
              content="Cancel"
              labelPosition="right"
              icon="cancel"
              color="black"
              onClick={() => setGoalHovered(false)}
              negative
              style={{ zIndex: "35000" }}
            />

            <Button
              htmlType="submit"
              content="Save changes"
              labelPosition="right"
              icon="checkmark"
              positive
            />
          </div>
        </Form>
      </div>
    </Label>
  );

  icon.props.style.fontSize = "1.55rem";
  const dragPreview = (
    <div>
      <ContainerTwo
        isDragging={isDragging}
        groupedOver={isDragging}
        justDropped={justDropped}
        onClick={() => setGoalHovered(true)}
        style={
          goalDetailsRequired
            ? {}
            : {
                backgroundColor: "lightgreen",
                border: "darkgreen solid 1.5px",
              }
        }
      >
        <span className={classes.goal_button_icon}>{icon}</span>
        <span className={classes.goal_text}>{goal}</span>
      </ContainerTwo>
    </div>
  );
  connectDragPreview(dragPreview);

  return connectDragSource(
    <div
      className={classes.goalContainer}
      key={key}
      style={{ left, top }}
      role="goal"
    >
      <Container
        isDragging={isDragging}
        groupedOver={isDragging}
        justDropped={justDropped}
        //<div
        // key={key}
        // className={classes.goalContainer}
        // role="goal"
        //onMouseEnter={() => setGoalHovered(true)}
        //onMouseLeave={() => setGoalHovered(false)}
      >
        {goalHovered && <div style={tooltipStyles}>{toolTip}</div>}

        <ContainerTwo
          //<div
          // className={classes.goal_button}
          isDragging={isDragging}
          groupedOver={isDragging}
          justDropped={justDropped}
          onClick={() => setGoalHovered(true)}
          style={
            goalDetailsRequired
              ? {}
              : {
                  backgroundColor: "lightgreen",
                  border: "darkgreen solid 1.5px",
                }
          }
        >
          <span className={classes.goal_button_icon}>{icon}</span>
          <span className={classes.goal_text}>{goal}</span>
        </ContainerTwo>
        {/* </div> */}
      </Container>
    </div>
  );
};

// export default DroppedGoal;
export default DragSource(
  "goal",
  {
    beginDrag(props: GoalProps) {
      const { id, left, top, goal, idx, arrIdx } = props;
      return { id, left, top, goal, idx, arrIdx };
    },
    // endDrag(props, monitor, component) {

    // },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  })
)(DroppedGoal);
