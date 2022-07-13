import GoalMap from "./goal-map";
import { useState, useCallback } from "react";
import { ItemMeta, Transition } from "semantic-ui-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import classes from "./user-goals.module.css";
import { Box } from "grommet";
import { createId } from "../../helpers/util";
import Goal from "./user-goal";
import { Select } from "antd";
const { Option } = Select;
import { useSelector, useDispatch } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUniversity,
  faBaby,
  faCar,
  faBabyCarriage,
  faPlaneDeparture,
  faDog,
  faCat,
  faBicycle,
  faMotorcycle,
  faHiking,
  faCouch,
  faTv,
  faLaptop,
  faBuilding,
  faBalanceScale,
  faFirstAid,
  faXRay,
  faHeartbeat,
  faProcedures,
  faPaintRoller,
  faUtensils,
  faTabletAlt,
  faUmbrellaBeach,
  faDumbbell,
  faMoneyCheckAlt,
  faSkiing,
  faGolfBall,
  faAnchor,
  faAsterisk,
  faAward,
  faBath,
  faBriefcase,
  faBoxOpen,
  faCaravan,
  faCartPlus,
  faChurch,
  faSchool,
  faTruckLoading,
  faChartLine,
  faGem,
  faPortrait,
  faUserMd,
  faUserGraduate,
  faHeart,
  faFileInvoiceDollar,
  faFileAlt,
  faSitemap,
  faScroll,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { faBlackTie } from "@fortawesome/free-brands-svg-icons";
import { useEffect } from "react";

const iconStyles = {
  fontSize: "2.8rem",
  maxWidth: "2.9rem",
  maxHeight: "2.9rem",
  color: "black",
  // marginRight: ".75rem",
  // position: "relative",
  // top: ".15rem",
};

export const iconOptions = [
  <FontAwesomeIcon style={iconStyles} icon={faAsterisk} />,
  <FontAwesomeIcon style={iconStyles} icon={faPortrait} />,
  <FontAwesomeIcon style={iconStyles} icon={faAward} />,
  <FontAwesomeIcon style={iconStyles} icon={faBriefcase} />,
  <FontAwesomeIcon style={iconStyles} icon={faChartLine} />,
  <FontAwesomeIcon style={iconStyles} icon={faBalanceScale} />,
  <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  <FontAwesomeIcon style={iconStyles} icon={faSchool} />,
  <FontAwesomeIcon style={iconStyles} icon={faUserGraduate} />,
  <FontAwesomeIcon style={iconStyles} icon={faUniversity} />,
  <FontAwesomeIcon style={iconStyles} icon={faChurch} />,
  <FontAwesomeIcon style={iconStyles} icon={faBoxOpen} />,
  <FontAwesomeIcon style={iconStyles} icon={faTruckLoading} />,
  <FontAwesomeIcon style={iconStyles} icon={faUtensils} />,
  <FontAwesomeIcon style={iconStyles} icon={faHome} />,
  <FontAwesomeIcon style={iconStyles} icon={faBuilding} />,
  <FontAwesomeIcon style={iconStyles} icon={faCartPlus} />,
  <FontAwesomeIcon style={iconStyles} icon={faBath} />,
  <FontAwesomeIcon style={iconStyles} icon={faCouch} />,
  <FontAwesomeIcon style={iconStyles} icon={faHeart} />,
  <FontAwesomeIcon style={iconStyles} icon={faGem} />,
  <FontAwesomeIcon style={iconStyles} icon={faTv} />,
  <FontAwesomeIcon style={iconStyles} icon={faLaptop} />,
  <FontAwesomeIcon style={iconStyles} icon={faTabletAlt} />,
  <FontAwesomeIcon style={iconStyles} icon={faCaravan} />,
  <FontAwesomeIcon style={iconStyles} icon={faCar} />,
  <FontAwesomeIcon style={iconStyles} icon={faBicycle} />,
  <FontAwesomeIcon style={iconStyles} icon={faMotorcycle} />,
  <FontAwesomeIcon style={iconStyles} icon={faDog} />,
  <FontAwesomeIcon style={iconStyles} icon={faCat} />,
  <FontAwesomeIcon style={iconStyles} icon={faPaintRoller} />,
  <FontAwesomeIcon style={iconStyles} icon={faBaby} />,
  <FontAwesomeIcon style={iconStyles} icon={faBabyCarriage} />,
  <FontAwesomeIcon style={iconStyles} icon={faPlaneDeparture} />,
  <FontAwesomeIcon style={iconStyles} icon={faUmbrellaBeach} />,
  <FontAwesomeIcon style={iconStyles} icon={faAnchor} />,
  <FontAwesomeIcon style={iconStyles} icon={faSkiing} />,
  <FontAwesomeIcon style={iconStyles} icon={faGolfBall} />,
  <FontAwesomeIcon style={iconStyles} icon={faDumbbell} />,
  <FontAwesomeIcon style={iconStyles} icon={faUserMd} />,
  <FontAwesomeIcon style={iconStyles} icon={faProcedures} />,
  <FontAwesomeIcon style={iconStyles} icon={faHeartbeat} />,
  <FontAwesomeIcon style={iconStyles} icon={faFirstAid} />,
  <FontAwesomeIcon style={iconStyles} icon={faXRay} />,
  <FontAwesomeIcon style={iconStyles} icon={faHiking} />,
  <FontAwesomeIcon style={iconStyles} icon={faFileInvoiceDollar} />,
  <FontAwesomeIcon style={iconStyles} icon={faFileAlt} />,
  <FontAwesomeIcon style={iconStyles} icon={faSitemap} />,
  <FontAwesomeIcon style={iconStyles} icon={faScroll} />,
  <FontAwesomeIcon style={iconStyles} icon={faUserShield} />,
];

const selectIconOptions = iconOptions.map((icon, idx) => ({
  icon: icon,
  key: idx,
}));

const colors = [
  "#f8f7fc",
  "#e7e3f6",
  "#d0c8ed",
  "#b8ace3",
  "#a191da",
  "#8975d1",
  "#745dc9",
  "#5f44c1",
  "#5239ab",
  "#463193",
  // "#3a297a",
  "#f0f7f8",
  "#cde6e7",
  "#9bccd0",
  "#69b3b8",
  "#458e93",
  "#2e5e61",
  "#295457",
];

const defaultGoals = [
  {
    id: createId(),
    goal: "Retirement",
    // icon: iconOptions[34],
    idx: 34,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faUmbrellaBeach} />,
  },
  {
    id: createId(),
    goal: "Comfortable Retirement Income",
    // icon: iconOptions[6],
    idx: 6,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Estate Planning/Will",
    // icon: iconOptions[6],
    idx: 48,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Streamline Budget",
    // icon: iconOptions[6],
    idx: 45,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Arrange Financial Documents",
    // icon: iconOptions[6],
    idx: 46,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Plan Insurance Portfolio",
    // icon: iconOptions[6],
    idx: 49,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Restructure Superannuation",
    // icon: iconOptions[6],
    idx: 47,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Overseas Trip",
    // icon: iconOptions[6],
    idx: 33,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Regular Vacations",
    // icon: iconOptions[6],
    idx: 44,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Education",
    // icon: iconOptions[6],
    idx: 8,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Wedding",
    // icon: iconOptions[6],
    idx: 19,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Have children",
    // icon: iconOptions[6],
    idx: 31,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Buy/Build a Residential Property",
    // icon: iconOptions[6],
    idx: 14,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Buy/Build an Investment Property",
    // icon: iconOptions[6],
    idx: 15,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Renovate Property",
    // icon: iconOptions[6],
    idx: 30,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Relocate Home",
    // icon: iconOptions[6],
    idx: 12,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Seek a Medical Treatment",
    // icon: iconOptions[6],
    idx: 39,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Start a Business",
    // icon: iconOptions[6],
    idx: 3,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Gift",
    // icon: iconOptions[6],
    idx: 2,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Donation",
    // icon: iconOptions[6],
    idx: 6,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "Pay off Debts",
    // icon: iconOptions[6],
    idx: 5,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
  {
    id: createId(),
    goal: "New Car",
    // icon: iconOptions[6],
    idx: 25,
    //icon: <FontAwesomeIcon style={iconStyles} icon={faMoneyCheckAlt} />,
  },
];

const filterSelectedGoals = (goals, selectedGoals) => {
  return goals.filter(
    (goal) =>
      selectedGoals.findIndex(
        (selectedGoal) => goal?.["goal"] === selectedGoal?.["goal"]
      ) === -1
  );
};

const UserGoals = ({ formStep, stepOne, stepTwo }) => {
  // 5 and 6 are goals steps, 5 is creating goals, 6 is placing and detailing them
  const showGoalMap = formStep === stepTwo;
  const showGoalInputs = formStep === stepOne;

  const dispatch = useDispatch();
  const _goals = useSelector((state) => state.factFind.goals);
  const numGoals = Object.keys(_goals).length;
  const existingGoals = numGoals > 0;

  const [selectedGoals, setSelectedGoals] = useState(
    existingGoals ? _goals : []
  );
  const [goals, setGoals] = useState([...defaultGoals]);

  const [newGoal, setNewGoal] = useState(null);
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [hoveredGoal, setHoveredGoal] = useState("");

  useEffect(() => {
    if (selectedGoals && selectedGoals?.length > 0) {
      const storedGoalsData = [...selectedGoals];
      dispatch(
        factFindActions.updateState({
          goals: storedGoalsData,
        })
      );

      // dispatch(
      //   factFindActions.compareAndUpdateArray({
      //     property: "goals",
      //     newValue: storedGoalsData,
      //     matchOn: "goal",
      //   })
      // );
    }

    if (selectedGoals.length === 0 && _goals.length === 1) {
      dispatch(
        factFindActions.updateState({
          goals: [],
        })
      );
    }
  }, [selectedGoals]);

  const removeDroppedGoalHandler = (idx) => {
    const newGoals = goals.filter((goal) => goal.idx !== idx);
    setGoals(newGoals);
  };

  const handleSelectGoal = (id) => {
    const newGoals = goals.filter((goal) => goal.id !== id);
    const selectedGoal = goals.find((goal) => goal.id === id);
    setGoals(newGoals);
    setSelectedGoals((prevState) => [...prevState, selectedGoal]);
  };

  const handleDeleteGoal = (id) => {
    const newGoals = selectedGoals.filter((goal) => goal.id !== id);
    setSelectedGoals(newGoals);
  };

  const handleSubmitGoal = () => {
    setSubmittingGoal(true);
    const newGoalText = newGoal.goal[0].toUpperCase() + newGoal.goal.slice(1);
    setTimeout(() => {
      setNewGoal({ id: createId(), goal: "", idx: 0 });
      setSubmittingGoal(false);
      setSelectedGoals((prevState) => [
        ...prevState,
        {
          id: newGoal.id ? newGoal.id : createId(),
          goal: newGoalText,
          // icon: selectIconOptions[newGoal.icon].icon,
          idx: newGoal.idx ? newGoal.idx : 0,
          arrIdx: prevState.length,
        },
      ]);
    }, 3000);
  };

  return (
    <div className={classes.container}>
      {showGoalInputs && (
        <div className={classes.add_new_goal}>
          <Transition.Group animation={"fly down"} duration={800}>
            {newGoal && (
              <div key={newGoal.id} className={classes.newGoal}>
                {/* <Button
              icon={`pi pi-check ${classes.add_goal_icon}`}
              className={`p-shadow-24 p-button-raised p-button-rounded p-button-success ${classes.add_goal}`}
              onClick={() => setNewGoal({ id: createId, goal: "" })}
              tooltip="newGoal"
            > */}
                <div
                  className={`p-shadow-24 p-button-raised p-button-text ${classes.add_goal_input}`}
                >
                  <div>
                    <InputText
                      value={newGoal.goal}
                      className={classes.goalInput}
                      placeholder={"Add a new goal..."}
                      onChange={(e) =>
                        setNewGoal((prevState) => ({
                          ...prevState,
                          id: newGoal.id ? newGoal.id : createId(),
                          goal: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Select
                      // placeholder={iconOptions[0]}
                      onChange={(iconElement) =>
                        setNewGoal((prevState) => {
                          const newState = { ...prevState };
                          // iconElement is the index of the icon in iconOptions:
                          // newState.icon = iconElement;
                          newState.idx = iconElement;
                          return newState;
                        })
                      }
                      style={{
                        position: "relative",
                        left: "-.25rem",
                      }}
                      placeholder={iconOptions[0]}
                      size={"large"}
                    >
                      {selectIconOptions.map((opt) => (
                        <Option key={opt.key} value={opt.key}>
                          {opt.icon}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className={classes.save_button_container}>
                    <Button
                      icon={`pi pi-save ${classes.save_button_icon}`}
                      className={`p-shadow-24 p-button-raised p-button-rounded p-button-warning ${classes.save_button}`}
                      onClick={handleSubmitGoal}
                      tooltip="Select an Image that represents this goal and save your new goal"
                    />
                  </div>
                  <div
                    className={`p-shadow-24 p-button-raised p-button-text ${classes.add_goal_input}`}
                  >
                    <div>
                      <InputText
                        value={newGoal.goal}
                        className={`${classes.goalInputShadowed} ${
                          submittingGoal && classes.submittingGoal
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!newGoal && (
              <Button
                icon={`pi pi-plus ${classes.add_button_icon}`}
                className={`p-shadow-24 p-button-raised p-button-rounded p-button-success ${classes.add_button}`}
                onClick={() => setNewGoal({ id: createId(), goal: "" })}
                tooltip="Add new goal"
              />
            )}
          </Transition.Group>
        </div>
      )}
      <div className={classes.goals}>{showGoalMap && <GoalMap />}</div>

      {!showGoalMap && goals && (
        <div className={classes.list_goals}>
          <div className={classes.header_container}>
            <h1 className={classes.header_text}>
              Select any goals that apply or create your own
            </h1>
          </div>
          <Box
            key={"goalBox"}
            direction={showGoalInputs ? "row" : "row"}
            wrap={showGoalInputs ? true : false}
            style={
              showGoalMap
                ? { position: "absolute", top: "-12rem", left: "-5rem" }
                : {}
            }
          >
            {selectedGoals.map(({ id, goal, icon, idx }, _idx) => {
              iconOptions[idx].props.style.fontSize = "2.88rem";
              return (
                <div className={classes.goal_list_container}>
                  <Goal
                    type="goal"
                    id={id}
                    goal={goal}
                    key={id}
                    color={"#689F38"}
                    clickable={false}
                    width={14}
                    height={14}
                    icon={iconOptions[idx]}
                    removeDroppedGoal={removeDroppedGoalHandler}
                  />
                  <div className={classes.goal_delete}>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-warning p-shadow-24"
                      onClick={() => handleDeleteGoal(id)}
                      tooltip={"Delete this goal"}
                    />
                  </div>
                  <div className={classes.goal_text}>{goal}</div>
                </div>
              );
            })}

            {filterSelectedGoals(goals, selectedGoals).map(
              ({ id, goal, icon, idx }, _idx) => {
                iconOptions[idx].props.style.fontSize = "2.88rem";
                return (
                  <div className={classes.goal_list_container}>
                    <div onClick={() => handleSelectGoal(id)}>
                      <Goal
                        type="goal"
                        id={id}
                        goal={goal}
                        key={id}
                        color={colors[_idx % colors.length]}
                        clickable={false}
                        width={14}
                        height={14}
                        icon={iconOptions[idx]}
                        removeDroppedGoal={removeDroppedGoalHandler}
                      />
                    </div>
                    <div
                      onMouseEnter={() => setHoveredGoal(String(idx))}
                      onMouseLeave={() => setHoveredGoal("")}
                      className={classes.goal_delete}
                    >
                      {hoveredGoal !== String(idx) && (
                        <Button
                          icon="pi pi-times"
                          className="p-button-rounded p-button-warning p-shadow-24"
                        />
                      )}
                      {hoveredGoal === String(idx) && (
                        <Button
                          icon="pi pi-check"
                          className="p-button-rounded p-button-success p-shadow-24"
                          onClick={() => handleSelectGoal(id)}
                          tooltip={"Select this goal"}
                        />
                      )}
                    </div>
                    <div className={classes.goal_text}>{goal}</div>
                  </div>
                );
              }
            )}
          </Box>
        </div>
      )}
    </div>
  );
};

export default UserGoals;
