import Chart from "react-google-charts";
// import { useSelector, useDispatch } from "react-redux";
import { funds as DUMMY_FUNDS } from "../../../dummy_data/funds";
import { useSelector } from "react-redux";

const extractGraphDataFromFunds = (
  funds,
  selectedPortfolio,
  proposedPortfolio
) => {
  if (funds === undefined) return;

  return [["Allocation", "Behavioural", "Proposed"]].concat(
    funds.map((fund, idx) => {
      const fundName = fund["fund"];
      const selectedPercent = fund[selectedPortfolio];
      const proposedPercent = fund[proposedPortfolio];
      return [fundName, selectedPercent, proposedPercent];
    })
  );
};

const GoalAllocations = () => {
  const funds = useSelector((state) => state.auth.funds);
  const fundsData = extractGraphDataFromFunds(
    DUMMY_FUNDS,
    "Mod Growth",
    "High Growth"
  );

  console.log("--- GRAPH DATA FOR FUNDS ---");
  console.log(fundsData);

  return (
    <>
      <div>
        <Chart
          width={"100%"}
          height={"200px"}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Allocation", "Defensive", "Growth"],
            ["Behavioural", 31.6, 68.4],
            ["Proposed", 40.56, 59.44],
          ]}
          options={{
            title: "Behavioural vs. Proposed Allocations",
            isStacked: true,
            chartArea: { width: "35%" },
            hAxis: {
              minValue: 0,
            },
            vAxis: {},
            colors: [
              "rgb(31, 120, 180)",
              "rgb(166, 206, 227)",
              "#a2f0bc",
              "#12bd4b",
              "#1f78b4",
              "a07aaa",
              "#884c97",
              "#843897",
              "#732392",
              "#a10c4a",
            ], //colors
          }}
        />
      </div>
      <div style={{ position: "relative", top: "-.8rem" }}>
        <Chart
          width={"100%"}
          height={"550px"}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Allocation", "Behavioural", "Proposed"],
            ["Cash", 7.6, 17.05],
            ["Domestic Fixed Interest", 9.5, 7.3],
            ["Domestic Property", 0, 0],
            ["International Property", 0, 0],
            ["Alternative", 14.5, 12.05],
            ["Domestic Equity", 18.9, 15.85],
            ["International Equity", 35, 31.46],
          ]}
          options={{
            title: "Asset Allocations",
            chartArea: { width: "50%" },
            hAxis: {
              minValue: 0,
            },
            toolTip: {
              formatter: {
                type: "NumberFormat",
                column: [1, 2],
                options: {
                  prefix: "%",
                },
              },
            },
            vAxis: {
              formatter: {
                type: "NumberFormat",
                column: [1, 2],
                options: {
                  prefix: "%",
                },
              },
            },
            colors: [
              "rgb(31, 120, 180)",
              "rgb(166, 206, 227)",
              "#a2f0bc",
              "#12bd4b",
              "#1f78b4",
              "a07aaa",
              "#884c97",
              "#843897",
              "#732392",
              "#a10c4a",
            ], //colors
          }}
        />
      </div>
      {fundsData !== undefined && (
        <div style={{ position: "relative", top: "-.8rem" }}>
          <Chart
            width={"100%"}
            height={"550px"}
            chartType="ColumnChart"
            loader={<div>Loading Chart</div>}
            data={fundsData}
            options={{
              title: "Fund Allocations",
              chartArea: { width: "50%" },
              hAxis: {
                minValue: 0,
              },
              toolTip: {
                formatter: {
                  type: "NumberFormat",
                  column: [1, 2],
                  options: {
                    prefix: "%",
                  },
                },
              },
              vAxis: {
                formatter: {
                  type: "NumberFormat",
                  column: [1, 2],
                  options: {
                    prefix: "%",
                  },
                },
              },
              colors: [
                "rgb(31, 120, 180)",
                "rgb(166, 206, 227)",
                "#a2f0bc",
                "#12bd4b",
                "#1f78b4",
                "a07aaa",
                "#884c97",
                "#843897",
                "#732392",
                "#a10c4a",
              ], //colors
            }}
          />
        </div>
      )}
    </>
  );
};

export default GoalAllocations;
