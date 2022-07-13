import classes from "./goal-map.module.css";
import GoalBin from "./goal-bin";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import { useEffect } from "react";

// EXPECTED SHAPE:
// boxes: {
//   a: {
//     top: 20,
//     left: 80,
//     title: "Drag me around",
//     icon: "",
//     goal: "test1",
//   },
//   b: { top: 180, left: 20, title: "Drag me too", icon: "", goal: "test2" },
// },
// const reshapeGoals = (goals) => {
//   if (goals?.reduce === undefined) return;
//   let top = 755;
//   let left = -30;

//   let countUnmovedGoals = 0;
//   const reshapedGoals = goals?.reduce((acc, goal, idx) => {
//     const newGoal = { ...goal };
//     if (countUnmovedGoals === 14) {
//       top += 100;
//       left = -30;
//     }
//     newGoal.arrIdx = idx;

//     if (!newGoal.top && !newGoal.left) countUnmovedGoals++;

//     if (!newGoal.top) {
//       newGoal.top = top;
//       top -= 100;
//     }
//     if (!newGoal.left) {
//       newGoal.left = left;
//       left += 110;
//     }
//     return { ...acc, [newGoal.id]: newGoal };
//   }, {});
//   return reshapedGoals;
// };

const reshapeGoals = (goals) => {
  if (goals?.reduce === undefined) return;

  let left = 1520;
  let top = -100;

  let countUnmovedGoals = 0;

  const reshapedGoals = goals?.reduce((acc, goal, idx) => {
    const newGoal = { ...goal };

    if (countUnmovedGoals % 2 === 0) {
      top += 100;
      left = 1520;
    }

    newGoal.arrIdx = idx;

    if (!newGoal.left || newGoal.left >= 1519) {
      countUnmovedGoals++;
      newGoal.top = top;
      top -= 100;
      newGoal.left = left;
      left += 110;
    }

    // if (!newGoal.top && !newGoal.left) countUnmovedGoals++;

    // if (!newGoal.top) {
    //   newGoal.top = top;
    //   top -= 100;
    // }
    // if (!newGoal.left) {
    //   newGoal.left = left;
    //   left += 110;
    // }

    return { ...acc, [newGoal.id]: newGoal };
  }, {});
  return reshapedGoals;
};

export const GoalMap = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.factFind.goals);
  const hasPartner = useSelector((state) => state.factFind.hasPartner);

  useEffect(() => {
    console.log(goals);
    console.log(reshapeGoals(goals));
  }, [goals]);

  const numGoals = Object.keys(goals).length;
  const existingGoals = numGoals > 0;
  let reshapedGoals = null;
  if (existingGoals) reshapedGoals = reshapeGoals(goals);

  /*
  // USAGE:
     updateClientDataNested(state, _action) {
      const { newValue, action, path } = _action.payload;
      const [key, index, property] = path;
  */
  const updateGoal = (goal: Object, idx: number) => {
    dispatch(
      factFindActions.updateClientDataNested({
        action: "UPDATE_OBJECT_AT_INDEX",
        newValue: goal,
        path: ["goals", idx],
      })
    );
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div className={classes.header_text}>
          {hasPartner ? "Our " : "My"} Goals...
        </div>
      </div>
      <table className={classes.outer}>
        <thead>
          <tr className={`box p-shadow-24 ${classes.row_1}`}>
            <th className={classes.th_0} colSpan="1"></th>
            <th className={classes.th_1} colSpan="2">
              Short term
            </th>
            <th className={classes.th_3}>Medium term</th>
            <th className={classes.th_4}>Long term</th>
          </tr>
          <tr className={classes.row_2}>
            <th className={classes.th_0}></th>
            <th className={`${classes.th_1} ${classes.shortterm}`}>
              0-2 years
            </th>
            <th className={classes.th_1_2}>2-4 years</th>
            <th className={classes.th_3}>4-7 years</th>
            <th className={classes.th_4}>7+ years</th>
          </tr>
        </thead>
        <div className={classes.goal_bin}>
          <GoalBin
            goals={reshapedGoals}
            updateStoredGoal={(goal, idx) => updateGoal(goal, idx)}
          />
        </div>
        <tbody>
          <tr className={classes.row}>
            <td className={`${classes.td_0} ${classes.need}`}>Need</td>
            <td className={classes.td_1}></td>
            <td className={classes.td_1_2}></td>
            <td className={classes.td_2}></td>
            <td className={classes.td_3}></td>
          </tr>
          <tr className={classes.row}>
            <td className={`${classes.td_0} ${classes.want}`}>Want</td>
            <td className={classes.td_1}></td>
            <td className={classes.td_1_2}></td>
            <td className={classes.td_2}></td>
            <td className={classes.td_3}></td>
          </tr>
        </tbody>
      </table>
      <div className={classes.unassigned_header}>Unassigned Goals</div>
    </div>
  );
};

export default GoalMap;
