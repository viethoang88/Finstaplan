import { useSelector } from "react-redux";
import SectionHeader from "./section-header";
// import { Bar } from "react-chartjs-2";
// import { Bar } from "@nivo/bar";
import { Chart } from "react-google-charts";

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

/* Expected datasets shape: 
 datasets: [
    // Each Bar where data array index contains each column:
    {
      label: '# of Red Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: '# of Blue Votes',
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: 'rgb(54, 162, 235)',
    },
    {
      label: '# of Green Votes',
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: 'rgb(75, 192, 192)',
    },
  ],
*/
/*
        data={[
          ["City", "2010 Population", "2000 Population"],
          ["New York City, NY", 8175000, 8008000],
          ["Los Angeles, CA", 3792000, 3694000],
          ["Chicago, IL", 2695000, 2896000],
          ["Houston, TX", 2099000, 1953000],
          ["Philadelphia, PA", 1526000, 1517000],
        ]}
*/
export const reshapeLas = (las, portfolios, keys) => {
  const shapedData = [["Asset Class"].concat(keys)];
  const portfolioNames = portfolios.map((pf) => pf.portfolioName);
  const shapingMap = {};

  portfolios.forEach((pf, idx) => {
    shapingMap[pf.portfolioName] = { portfolio: pf.portfolioName }; //, id: idx };
  });

  for (let allocation of las) {
    for (let pfName of portfolioNames) {
      shapingMap[pfName][allocation.assetClass] = allocation[pfName];
    }
  }
  for (let allocation of Object.values(shapingMap)) {
    const newArr = [];
    newArr.push(allocation.portfolio);
    for (let key of keys) {
      newArr.push(allocation[key]);
    }
    shapedData.push(newArr);
  }
  return shapedData;
};

const PortfolioAssetAllocations = () => {
  const licenseeAllocations = useSelector(
    (state) => state.auth.licenseeAllocations
  );
  const portfolios = useSelector((state) => state.auth.portfolios);

  if (portfolios === undefined || licenseeAllocations === undefined)
    return <></>;

  const keys = licenseeAllocations.map((la) => la.assetClass);
  const shapedData = reshapeLas(licenseeAllocations, portfolios, keys);

  return (
    <div style={{ position: "relative" }}>
      <br />
      <br />
      <SectionHeader text={"Portfolio Asset Allocations"} />
      {/* <Bar type={config.type} data={config.data} options={config.options} /> */}
      {/* <Bar
        data={shapedData}
        key={keys}
        indexBy={"portfolio"}
        animate={false}
        layout="horizontal"
        groupMode={"stacked"}
      /> */}
      <div style={{ position: "relative", top: "-1rem" }}>
        <Chart
          width={"100%"}
          height={"750px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={shapedData}
          options={{
            title: "Asset allocations by asset class",
            chartArea: { width: "60%" },
            isStacked: true,
            hAxis: {
              title: "Portfolio Allocations",
              minValue: 0,
            },
            vAxis: {
              title: "Portfolio",
            },
            colors: [
              "#a2f0bc",
              "#12bd4b",
              "#1f78b4",
              "a07aaa",
              "#884c97",
              "#843897",
              "#732392",
              "#a10c4a",
            ], //colors,
          }}

          // For tests
          // rootProps={{ "data-testid": "3" }}
        />
      </div>
    </div>
  );
};

export default PortfolioAssetAllocations;
