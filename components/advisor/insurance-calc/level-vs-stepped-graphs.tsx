import LevelVsSteppedPie from "./level-vs-stepped-pie";

const keys = ["life", "tpd", "trauma", "ip"];

const LevelVsSteppedGraphs = ({ graphData, getPieData }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexBasis: "2",
        flexWrap: "wrap",
      }}
    >
      {keys.map((k) => (
        <div style={{ flex: "0 0 18%", position: "relative", left: ".252rem" }}>
          <LevelVsSteppedPie
            type={k}
            graphData={graphData}
            getPieData={getPieData}
          />
        </div>
      ))}
    </div>
  );
};

export default LevelVsSteppedGraphs;
