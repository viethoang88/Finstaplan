import { Button, Progress } from "semantic-ui-react";
import GoalTable from "./goal-table";
import { valueFormatter } from "../../../helpers/util";
import { Avatar } from "primereact/avatar";
import { DownOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../../../store/auth";
import GoalPie from "./goal-pie";

const styleAmount = (amount) => {
  if (amount < 0) {
    return (
      <span style={{ color: "darkred", fontWeight: "bold" }}>
        ({valueFormatter(amount * -1)})
      </span>
    );
  } else {
    return valueFormatter(0);
  }
};

const getColor = (percent) => {
  const percentFunded = percent * 100;
  if (percentFunded >= 100) {
    return "green";
  } else if (percentFunded >= 75) {
    return "olive";
  } else if (percentFunded >= 50) {
    return "yellow";
  } else if (percentFunded >= 25) {
    return "orange";
  } else {
    return "red";
  }
};

const freqToStringMap = new Map([
  ["onceOff", "Once"],
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
  ["fortnightly", "Forthnightly"],
  ["quarterly", "Quarterly"],
  ["biAnnually", "Bi-Annually"],
  ["yearly", "Yearly"],
]);

const sumStyles = { marginRight: "3rem", minWidth: "25rem" };
const labelStyles = {
  fontSize: "1.3rem",
  fontWeight: 350,
  color: "rgb(210,210,210)",
  textAlign: "center",
  position: "relative",
  top: "-1.25rem",
};
const chartLabelStyles = {
  fontSize: "1.3rem",
  fontWeight: 350,
  color: "rgb(210,210,210)",
  position: "relative",
  top: "-1.35rem",
};
const labelSumStyles = {
  fontSize: "1.6rem",
  fontWeight: "bold",
  textAlign: "center",
};

const pieMargin = { top: 50, right: 95, bottom: 50, left: 115 };

const prepDataForTable = (data, gvd, setFundedAmt) => {
  if (!data["Allocation Now"] || !(typeof data["Allocation Now"] === "object"))
    return;
  const defensive = gvd[0];
  const rows = [];
  const pieData = { sum: 0, defensive: 0 };
  const monthlyContributionsData = { sum: 0, defensive: 0 };

  const length = Object.keys(data["Allocation Now"])?.length;

  for (let i = 0; i < length; i++) {
    const startDate = new Date(data["Start Date"][i]).toDateString();
    const endDate = new Date(data["End Date"][i]).toDateString();
    const yearsToStartDate = data["Years to Start Date"][i];
    const rate = data["Rate"][i];
    const allocationNow = data["Allocation Now"][i];
    const portfolio = data["Portfolio"][i];
    const portfolioAmount = data["Portfolio Amount"][i];
    const portfolioAmountRemaining = data["Portfolio Amount Remaining"][i];
    const funded = data["Funded"][i];
    const fundedAmt = data["Funded Amount"][i];
    setFundedAmt((prevState) => {
      if (prevState) {
        return prevState + fundedAmt;
      } else {
        return fundedAmt;
      }
    });
    const monthlySavingsRequired = data["Monthly Savings Required"][i];

    // TODO: (1 - behaviourModificationLoading) * (defensive[portfolio] / 100) +
    //       (behaviourModificationLoading) * clientsSelectedPortfolio * (defensive[portfolio] / 100)

    // if (pieData["defensive"] !== undefined) {
    const amt = fundedAmt * (defensive[portfolio] / 100);
    pieData["defensive"] += amt;
    pieData["sum"] += fundedAmt;
    // } else {
    //   pieData["defensive"] = fundedAmt * (defensive[portfolio] / 100);
    //   pieData["sum"] += fundedAmt;
    // }
    const monthlyAmt = monthlySavingsRequired * (defensive[portfolio] / 100);
    monthlyContributionsData["defensive"] += monthlyAmt;
    monthlyContributionsData["sum"] += monthlySavingsRequired;

    console.log(portfolio);
    console.log(defensive[portfolio]);
    console.log(pieData);

    rows.push({
      startDate,
      endDate,
      yearsToStartDate,
      rate,
      allocationNow,
      portfolio,
      portfolioAmount,
      portfolioAmountRemaining,
      funded,
      fundedAmt,
      monthlySavingsRequired,
    });
  }
  console.log(rows);
  return [rows, pieData, monthlyContributionsData];
};

const GoalItem = ({
  goal,
  percentFunded,
  idx,
  goalData,
  setAllocations,
  pfName,
}) => {
  // Colors: red, orange, yellow, olive, green
  const portfolios = useSelector((state) => state.auth.portfolios);
  const gvd = useSelector((state) => state.auth.growthVsDefensive);
  const dispatch = useDispatch();

  console.log("--- gvd ---");
  console.log(gvd);
  const [goalBasedPieData, setGoalBasedPieData] = useState();
  const [monthlyContributionsPieData, setMonthlyContributionsPieData] =
    useState();
  const [showTable, setShowTable] = useState(false);
  const [shapedData, setShapedData] = useState(undefined);
  const [capitalDeficit, setCapitalDeficit] = useState(undefined);
  const [monthlySumRequired, setMonthlySumRequired] = useState(undefined);
  const [periodsFunded, setPeriodsFunded] = useState(undefined);
  const [fundedAmt, setFundedAmt] = useState();
  const [periodFundingInDeficit, setPeriodFundingInDeficit] =
    useState(undefined);
  const [totalAllocationsRequired, setTotalAllocationsRequired] =
    useState(undefined);

  const goalText = goal["goal"];
  const goalFrequency = goal["goalFrequency"];
  const funded = (percentFunded * 100).toFixed(2);
  const color = getColor(funded);

  useEffect(() => {
    if (portfolios === undefined) {
      dispatch(fetchData());
    }
  }, []);

  useEffect(() => {
    if (goalData === undefined) return;
    const [data, pieData, monthlyData] = prepDataForTable(
      goalData,
      gvd,
      setFundedAmt
    );
    console.log("-------------DATA-------------");
    console.log(data);
    console.log("-------- PIE DATA ------");
    pieData["defensivePercent"] = pieData["defensive"] / pieData["sum"];
    pieData["growthPercent"] = 1 - pieData["defensivePercent"];
    monthlyData["defensivePercent"] =
      monthlyData["defensive"] / monthlyData["sum"];
    monthlyData["growthPercent"] = 1 - monthlyData["defensivePercent"];

    console.log(pieData);
    setGoalBasedPieData(pieData);
    setMonthlyContributionsPieData(monthlyData);

    const lastItem = data[data.length - 1];
    const capDef = lastItem["portfolioAmountRemaining"];
    const monthlySumRequired = data.reduce(
      (acc, goalRow) => acc + goalRow.monthlySavingsRequired,
      0
    );
    const timesFunded = data.filter((goalRow) => goalRow.funded == 1).length;
    const periodFundingInDeficit = data
      .map((goalRow) => goalRow.funded)
      .findIndex((fundPercent) => fundPercent !== 1);

    const summedAllocations = data.reduce((acc, goalRow) => {
      return acc + goalRow.allocationNow;
    }, 0);

    if (data[0].funded === 0) {
      console.log(data[0].allocationNow);
      setCapitalDeficit(-1 * summedAllocations);
    }
    if (data[0].funded === 1) {
      setCapitalDeficit(capDef);
    }
    setMonthlySumRequired(monthlySumRequired);
    setPeriodsFunded(timesFunded);
    setPeriodFundingInDeficit(periodFundingInDeficit + 1);
    setShapedData(data);
    setTotalAllocationsRequired(summedAllocations);
  }, [goalData]);

  return (
    <div
      key={idx}
      style={{
        position: "relative",
        border: "2px solid rgb(235,235,235)",
        borderRadius: "5px",
        marginBottom: "2rem",
        padding: ".85rem",
        borderBottom: "3px solid rgb(70, 70, 70)",
        maxWidth: "1720px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "3.6rem",
          padding: ".25rem",
          fontWeight: "bold",
          backgroundColor: "rgba(252,252,252, 0.7)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: "1px solid white",
          borderBottom: "2px solid rgb(70, 70, 70)",
          // flex: 1,
          borderRadius: 3,
        }}
      >
        <div style={{ marginLeft: "0.6rem", marginTop: "0.35rem" }}>
          <span>
            <Avatar
              label={goal["priority"]}
              className="p-mr-2"
              size="medium"
              style={{ backgroundColor: "lightgreen", color: "#ffffff" }}
              shape="circle"
            />
          </span>
          &nbsp;&nbsp;&nbsp;
          <span>
            {goalText} ({valueFormatter(goal["estimatedCost"])})
          </span>
        </div>
        <div style={{ marginRight: "0.95rem", marginTop: "0.65rem" }}>
          {!showTable && (
            <DownOutlined
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setShowTable(true);
              }}
            />
          )}
          {showTable && (
            <CloseOutlined
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setShowTable(false);
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          // flex: 1,
          flexGrow: 1,
          flexDirection: "row",
          // justifyContent: "center",
          // alignContent: "center",
          width: "100%",
          position: "relative",
          left: 0,
          // placeContent: "unset !important",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: "bold",
            margin: "1.5rem",
            marginTop: "3.2rem",
          }}
        >
          {funded}%
          <br />
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: 350,
              color: "rgb(210,210,210)",
              textAlign: "center",
              position: "relative",
              top: "-0.5rem",
            }}
          >
            Funded
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // flex: 1,
            flexWrap: "wrap",
            // flexGrow: 12,
            marginLeft: "0.4rem",
            position: "relative",
          }}
        >
          <div
            //style={{ display: "absolute", marginLeft: "15rem", width: "100%" }}
            style={{
              // flex: 1,
              // minWidth: "50%",
              // maxWidth: "85vw",
              flexBasis: "100%",
              margin: ".8rem",
              marginTop: "1.2rem",
            }}
          >
            <Progress
              // style={{ maxWidth: "90vw" }}
              percent={funded}
              indicating
              color={color}
            />
          </div>

          {shapedData && (
            <div
              style={{
                display: "flex",
                // flex: 1,
                flexDirection: "row",
                // minWidth: "50%",
                // maxWidth: "100%",
                flexBasis: "100%",
                position: "relative",
                top: "-.8rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={sumStyles}>
                  <div style={labelSumStyles}>
                    {styleAmount(capitalDeficit)}
                  </div>
                  <br />
                  <div style={labelStyles}>Present Capital Deficit</div>
                </div>
              </div>

              <div style={sumStyles}>
                <div style={labelSumStyles}>
                  {valueFormatter(monthlySumRequired)}/mo
                </div>
                <br />
                <div style={labelStyles}>Additional Contributions to Fund</div>
              </div>

              <div style={sumStyles}>
                <div style={labelSumStyles}>
                  {freqToStringMap.get(goalFrequency)}
                </div>
                <br />
                <div style={labelStyles}>Goal Frequency</div>
              </div>

              <div style={sumStyles}>
                <div style={labelSumStyles}>
                  {periodsFunded}&nbsp;/&nbsp;{shapedData.length}
                </div>
                <br />
                <div style={labelStyles}>Periods Funded</div>
              </div>

              {/* <div style={sumStyles}>
                <div style={labelSumStyles}>
                  {periodsFunded !== shapedData.length
                    ? periodFundingInDeficit
                    : "N / A"}
                </div>
                <br />
                <div style={labelStyles}>Period Funding In Deficit</div>
              </div> */}

              <div style={sumStyles}>
                <div style={labelSumStyles}>
                  {valueFormatter(totalAllocationsRequired)}
                </div>
                <br />
                <div style={labelStyles}>Total Allocations Required Now</div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  flexBasis: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {fundedAmt && fundedAmt !== 0 && (
                  <div style={sumStyles}>
                    <GoalPie goalBasedPieData={goalBasedPieData} />
                    <div
                      style={{
                        ...chartLabelStyles,
                        position: "relative",
                        left: "0.25rem",
                      }}
                    >
                      Overall Goal Allocations
                    </div>
                  </div>
                )}

                {monthlyContributionsPieData &&
                  monthlyContributionsPieData?.sum !== 0 && (
                    <div style={sumStyles}>
                      <GoalPie goalBasedPieData={monthlyContributionsPieData} />
                      <div
                        style={{
                          ...chartLabelStyles,
                          position: "relative",
                          right: "2.1rem",
                        }}
                      >
                        Monthly Contributions Allocations
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showTable && shapedData && (
        <div style={{ marginTop: "1.5rem" }}>
          <Divider />
          <GoalTable shapedData={shapedData} />
        </div>
      )}
    </div>
  );
};

export default GoalItem;
