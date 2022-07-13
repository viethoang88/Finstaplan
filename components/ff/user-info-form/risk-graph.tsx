import {
  VictoryChart,
  VictoryStack,
  VictoryTheme,
  VictoryGroup,
  VictoryPortal,
  VictoryScatter,
  VictoryArea,
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
  VictoryLegend,
  LineSegment,
} from "victory";
import { assignCashFromScore } from "./risk-profile-form";

const brackets = [
  "Conservative",
  "Mod Conservative",
  "Mod Growth",
  "Growth",
  "High Growth",
];

const generatePoints = () => {
  // array of {x: [0-100], y: [0.00-1]} where y = defensive%
  const growth = [];
  const defensive = [];
  const cash = [];

  for (let i = 0; i <= 100; i++) {
    const _cash = assignCashFromScore(i);
    cash.push({ x: i, y: _cash / 100 });
    growth.push({ x: i, y: i / 100 });
    defensive.push({ x: i, y: (100 - _cash - i) / 100 });
  }
  return [growth, defensive, cash];
};

const RiskGraph = ({
  userScore,
  userScoreTwo = null,
  scored,
  scoredTwo = false,
}) => {
  // const growth = [
  //   { x: "Conservative", y: "35%" },
  //   { x: "Mod Conservative", y: "50%" },
  //   { x: "Mod Growth", y: "65%" },
  //   { x: "Growth", y: "75%" },
  //   { x: "High Growth", y: "90%" },
  // ];
  // const defensive = [
  //   { x: "Conservative", y: "65%" },
  //   { x: "Mod Conservative", y: "50%" },
  //   { x: "Mod Growth", y: "35%" },
  //   { x: "Growth", y: "25%" },
  //   { x: "High Growth", y: "10%" },
  // ];

  // const growth = [
  //   { x: "Conservative", y: 0.3 },
  //   { x: "Mod Conservative", y: 0.55 },
  //   { x: "Mod Growth", y: 0.7 },
  //   { x: "Growth", y: 0.85 },
  //   { x: "High Growth", y: 0.99 },
  // ];
  // const defensive = [
  //   { x: "Conservative", y: 0.65 },
  //   { x: "Mod Conservative", y: 0.41 },
  //   { x: "Mod Growth", y: 0.26 },
  //   { x: "Growth", y: 0.12 },
  //   { x: "High Growth", y: 0 },
  // ];
  // const cash = [
  //   { x: "Conservative", y: 0.05 },
  //   { x: "Mod Conservative", y: 0.04 },
  //   { x: "Mod Growth", y: 0.04 },
  //   { x: "Growth", y: 0.03 },
  //   { x: "High Growth", y: 0.01 },
  // ];
  console.log(userScore);

  const mapFromXs = (values, tickValues) => {
    const _mapFromXs = tickValues.reduce((acc, x, idx) => {
      acc[x] = brackets[idx];
      return acc;
    }, {});
    return (value) => _mapFromXs[value];
  };
  // const growth = [
  //   { x: 15, y: 0.3 },
  //   { x: 40, y: 0.55 },
  //   { x: 60, y: 0.7 },
  //   { x: 77.5, y: 0.85 },
  //   { x: 100, y: 0.99 },
  // ];
  // const defensive = [
  //   { x: 15, y: 0.65 },
  //   { x: 40, y: 0.41 },
  //   { x: 60, y: 0.26 },
  //   { x: 77.5, y: 0.12 },
  //   { x: 100, y: 0 },
  // ];
  // const cash = [
  //   { x: 15, y: 0.05 },
  //   { x: 40, y: 0.04 },
  //   { x: 60, y: 0.04 },
  //   { x: 77.5, y: 0.03 },
  //   { x: 100, y: 0.01 },
  // ];

  // const growth = [
  //   { x: 15, y: 0.15 },
  //   { x: 40, y: 0.25 },
  //   { x: 60, y: 0.45 },
  //   { x: 77.5, y: 0.65 },
  //   { x: 100, y: 0.99 },
  // ];
  // const defensive = [
  //   { x: 15, y: 0.85 },
  //   { x: 40, y: 0.75 },
  //   { x: 60, y: 0.55 },
  //   { x: 77.5, y: 0.35 },
  //   { x: 100, y: 0 },
  // ];
  // const cash = [
  //   { x: 15, y: 0.05 },
  //   { x: 40, y: 0.04 },
  //   { x: 60, y: 0.04 },
  //   { x: 77.5, y: 0.03 },
  //   { x: 100, y: 0.01 },
  // ];
  // ["darkgreen", "rgb(51, 77, 92)", "darkorange"];
  const colorScaleForGraph = ["#b2df8a", "#1f78b4", "#a6cee3"];
  const [growth, defensive, cash] = generatePoints();

  const tickValues = [10, 35, 55, 75, 95];
  const map = mapFromXs(growth, tickValues);

  return (
    <div>
      <VictoryChart
        // domain={{ y: [0, 1] }}
        // x: [0, 100] }}

        // scale={{ x: "time" }}
        width={800}
        // height={400}
        // animate={{
        //   duration: 2000,
        //   onLoad: { duration: 1000 },
        // }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          dependentAxis
          domain={[0, 1]}
          // standalone={false}
          // tickLabelComponent={<VictoryLabel text={({ x, y }) => [`${y}%`]} />}
          tickFormat={(t) => `${t * 100}%`}
        />

        <VictoryAxis
          crossAxis
          // domain={[0, 100]}
          // standalone={false}
          tickValues={tickValues}
          // tickValues={[0, 20, 40, 60, 90]}
          tickFormat={(t) => {
            // console.log(t);
            return map(t);
          }}
          style={{
            ticks: { stroke: "transparent" },
            // axisLabel: { position: "relative", left: "-10rem" },
            // grid: { stroke: "grey" },
            // axis: { stroke: "#756f6a" },
          }}
          // offsetX={-5000}
          // gridComponent={<LineSegment style={{ zIndex: 5000 }} />}
          // theme={VictoryTheme.material}
          // axisComponent={<LineSegment type={"axis"} />}
        />
        {/* <VictoryAxis />
        {[
          "Conservative",
          "Mod Conservative",
          "Mod Growth",
          "Growth",
          "High Growth",
        ].map((d, i) => {
          return (
            <VictoryAxis
              crossAxis
              key={i}
              label={d}
              style={{ tickLabels: { fill: "none" } }}
              axisValue={cash[i].x}
            />
          );
        })} */}

        <VictoryLegend
          x={252}
          y={10}
          orientation="horizontal"
          gutter={20}
          style={{ border: { stroke: "black" } }}
          colorScale={colorScaleForGraph}
          data={[
            { name: "Cash" },
            { name: "Defensive allocations" },
            { name: "Growth allocations" },
          ]}
        />

        <VictoryStack
          colorScale={colorScaleForGraph}
          labelComponent={<VictoryTooltip />}
        >
          <VictoryGroup
            // offset={3}
            data={cash}
          >
            <VictoryArea />
            {/* <VictoryPortal>
              <VictoryScatter
                style={{ data: { fill: "black" } }}
                // labels={true}
                // labelComponent={
                //   <VictoryLabel text={({ datum }) => [`${datum.y * 100}%`]} />
                // }
              />
            </VictoryPortal> */}
          </VictoryGroup>

          <VictoryGroup
            // offset={3}
            data={defensive}
          >
            <VictoryArea />
            {/* <VictoryPortal>
              <VictoryScatter
                style={{ data: { fill: "black" } }}
                labels={true}
                labelComponent={
                  <VictoryLabel text={({ datum }) => [`${datum.y * 100}%`]} />
                }
              />
            </VictoryPortal> */}
          </VictoryGroup>

          <VictoryGroup
            data={growth}
            // offset={3}
          >
            <VictoryArea />
            {scored && (
              <VictoryPortal>
                <VictoryScatter
                  style={{ data: { fill: "darkgreen", border: "black" } }}
                  size={5}
                  data={[userScore]}
                  labelComponent={
                    <VictoryLabel
                      text={({ datum }) => userScore.label}
                      backgroundPadding={[4]}
                      angle={-45}
                      dy={-17}
                      dx={6}
                      textAnchor="start"
                      backgroundStyle={[
                        { fill: "white", opacity: 0.55, borderRadius: "25%" },
                      ]}
                    />
                  }
                />
              </VictoryPortal>
            )}
            {scoredTwo && (
              <VictoryPortal>
                <VictoryScatter
                  style={{ data: { fill: "darkgreen", border: "black" } }}
                  size={5}
                  data={[userScoreTwo]}
                  labelComponent={
                    <VictoryLabel
                      text={({ datum }) => userScoreTwo.label}
                      backgroundPadding={[4]}
                      angle={-45}
                      dy={-17}
                      dx={6}
                      textAnchor="start"
                      backgroundStyle={[
                        { fill: "white", opacity: 0.55, borderRadius: "25%" },
                      ]}
                    />
                  }
                />
              </VictoryPortal>
            )}
            {/* <VictoryPortal>
              <VictoryScatter style={{ data: { fill: "black" } }} />
            </VictoryPortal> */}
          </VictoryGroup>
        </VictoryStack>
      </VictoryChart>
    </div>
  );
};

export default RiskGraph;
