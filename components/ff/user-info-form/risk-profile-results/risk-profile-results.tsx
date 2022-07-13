import classes from "./risk-profile-results.module.css";
import RiskGraph from "../risk-graph";
import { Pie, ResponsivePie } from "@nivo/pie";
import SectionHeader from "./section-header";

const [pieWidth, pieHeight] = [520, 520];
const pieMargin = { top: 50, right: 95, bottom: 50, left: 115 };

const RiskProfileResults = ({
  clientName,
  partnerName,
  shouldScoreTwice,
  scored,
  scoredTwo,
  riskScore,
  riskScoreTwo,
  generatePieData,
  getIncompleteQuestions,
  getIncompleteQuestionsTwo,
  assignXFromScore,
}) => {
  const _clientName = clientName ? clientName : "Client";
  const _partnerName = partnerName ? partnerName : "Partner";
  return (
    <>
      <SectionHeader text={"Risk Profile Results"} />
      {!scored && !shouldScoreTwice && (
        <h3>
          A score cannot be assigned as you have not yet completed questions{" "}
          {getIncompleteQuestions().join(", ")}
        </h3>
      )}
      {!scored && shouldScoreTwice && (
        <h3>
          {`A score cannot be assigned as ${clientName} has not yet completed questions `}
          {getIncompleteQuestions().join(", ")}
        </h3>
      )}
      {!scoredTwo && shouldScoreTwice && (
        <h3>
          {`A score cannot be assigned as ${partnerName} has not yet completed questions `}
          {getIncompleteQuestionsTwo().join(", ")}
        </h3>
      )}
      <div className={classes.score_container}>
        <div className={classes.risk_graph}>
          {!shouldScoreTwice && (
            <RiskGraph
              scored={scored}
              scoredTwo={false}
              userScore={{
                x: riskScore,
                y: assignXFromScore(riskScore),
                label: "Your score",
              }}
            />
          )}
          {shouldScoreTwice && (
            <RiskGraph
              scored={scored}
              scoredTwo={scoredTwo}
              userScore={{
                x: riskScore,
                y: assignXFromScore(riskScore),
                label: `${_clientName}'s score `,
              }}
              userScoreTwo={{
                x: riskScoreTwo,
                y: assignXFromScore(riskScoreTwo),
                label: `${_partnerName}'s score `,
              }}
            />
          )}
        </div>
        <div className={classes.pie_outer}>
          {scored && !shouldScoreTwice && (
            <div className={classes.pie_container}>
              <div className={classes.pie}>
                <h4 className={classes.pie_header}>Your allocations</h4>
                <Pie
                  data={generatePieData(riskScore)}
                  width={pieWidth}
                  height={pieHeight}
                  itemWidth={"100px"}
                  itemHeight={"100px"}
                  margin={pieMargin}
                  innerRadius={0.6}
                  animate={true}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "paired" }}
                  onClick={(node, event) => console.log(node)}
                  // padding={"6rem"}
                  arcLabel={(d) => `${d.value}%`}
                />
              </div>
            </div>
          )}
          {scored && shouldScoreTwice && (
            <div className={classes.pie_container}>
              <div className={classes.pie}>
                <h4 className={classes.pie_header}>
                  {_clientName}'s allocations
                </h4>
                <Pie
                  data={generatePieData(riskScore)}
                  width={pieWidth}
                  height={pieHeight}
                  itemWidth={"100px"}
                  itemHeight={"100px"}
                  margin={pieMargin}
                  innerRadius={0.6}
                  animate={true}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "paired" }}
                  onClick={(node, event) => console.log(node)}
                  // padding={"6rem"}
                  // style={{ fontSize: "1rem" }}
                  arcLabel={(d) => `${d.value}%`}
                />
              </div>
            </div>
          )}
          {scoredTwo && shouldScoreTwice && (
            <div className={classes.pie_container}>
              <div className={classes.pie}>
                <h4 className={classes.pie_header}>
                  {_partnerName}'s allocations
                </h4>
                <Pie
                  data={generatePieData(riskScoreTwo)}
                  width={pieWidth}
                  height={pieHeight}
                  itemWidth={"100px"}
                  itemHeight={"100px"}
                  margin={pieMargin}
                  innerRadius={0.6}
                  animate={true}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "paired" }}
                  onClick={(node, event) => console.log(node)}
                  // padding={"6rem"}
                  arcLabel={(d) => `${d.value}%`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RiskProfileResults;
