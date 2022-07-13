import { Card } from "antd";
import GoalItem from "./goal-item";
import { useSelector } from "react-redux";

import { funds as DUMMY_FUNDS } from "../../../dummy_data/funds";

const calculateAllocations = (goals, funds, portfolios) => {};

const GoalsSummary = ({ useGoals, funded, goals, setAllocations, pfName }) => {
  if (useGoals === undefined || goals === undefined) return <></>;
  const portfolios = useSelector((state) => state.auth.portfolios);
  const funds = useSelector((state) => state.auth.funds);
  const gvd = useSelector((state) => state.auth.growthVsDefensive);

  return (
    <Card>
      {useGoals
        .sort((a, b) => (a["priority"] > b["priority"] ? 1 : -1))
        .map((goal, idx) => (
          <GoalItem
            idx={idx}
            goal={goal}
            percentFunded={funded[idx]}
            goalData={goals[idx]}
            setAllocations={setAllocations}
            pfName={pfName}
          />
        ))}
    </Card>
  );
};

export default GoalsSummary;
