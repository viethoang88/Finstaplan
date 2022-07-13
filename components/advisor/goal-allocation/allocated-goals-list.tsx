import GoalsSummary from "./goals-summary";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { valueFormatter } from "../../../helpers/util";
import GoalAllocations from "./goal-allocations";

const parseData = (dataArray) => {
  if (dataArray?.reduce === undefined) return {};
  // return dataArray.reduce((acc, [pfName, goalsJSONarray, fundedPercents]) => {
  return dataArray.reduce((acc, next) => {
    const pfData = {};
    if (next === undefined) return {};
    const pfName = next[0];
    const goalsJSONarray = next[1];
    const fundedPercents = next[2];
    if (goalsJSONarray?.map === undefined) return {};
    pfData["goals"] = goalsJSONarray?.map((goal) => JSON.parse(goal));
    // .map((goalData, idx) => {
    //   console.log("--- MAPPING THROUGH GOAL DATA ---");
    //   console.log(goalData);
    //   const years = goalData["Years to Start Date"];
    //   console.log(years);
    //   const fixedPfs = {};
    //   for (let i = 0; i <= Object.keys(years).length; i++) {
    //     console.log(years[idx]);
    //     if (years[idx] < 1.5) {
    //       fixedPfs[i] = "Cash";
    //     } else if (years[idx] < 3) {
    //       fixedPfs[i] = "Conservative";
    //     } else {
    //       fixedPfs[i] = goalData["Portfolio"][i];
    //     }
    //   }

    //   goalData["Portfolio"] = fixedPfs;

    //   return goalData;
    // });

    // .sort((a, b) => (a["priority"] > b["priority"] ? 1 : -1));
    pfData["funded"] = [...fundedPercents];
    acc[pfName] = pfData;
    return acc;
  }, {});
};

const AllocatedGoalsList = ({
  dataFromComputation,
  computedGoals,
  pfNameToValueMap,
  setAllocations,
}) => {
  if (dataFromComputation === undefined) return;
  console.log(
    "-- THIS SHOULD MATCH THE DATA RETURNED FROM THE COMPUTATION ---"
  );
  console.log(dataFromComputation);
  const parsedData = parseData(dataFromComputation);
  console.log("--- PARSED RESULTS DATA SORTED BY KEYS ---");
  console.log(parsedData);
  return (
    <div>
      {Object.keys(parsedData).map((pfName) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              {pfName} ({valueFormatter(pfNameToValueMap[pfName])})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Overall Portfolio Allocations</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <GoalAllocations />
              </AccordionDetails>
            </Accordion>

            <GoalsSummary
              pfName={pfName}
              useGoals={computedGoals[pfName]}
              goals={parsedData[pfName]["goals"]}
              funded={parsedData[pfName]["funded"]}
              setAllocations={setAllocations}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AllocatedGoalsList;
