import LevelVsSteppedTable from "./level-vs-stepped-table";
import LevelVsSteppedTableTwo from "./level-vs-stepped-table-two";
import LevelVsSteppedGraphs from "./level-vs-stepped-graphs";

const DUMMY_DATA = [
  { category: "Level", life: 210106, tpd: 528294, trauma: 209683, ip: 64212 },
  { category: "Stepped", life: 70035, tpd: 176098, trauma: 69894, ip: 21404 },
  { category: "Year 1", life: 280142, tpd: 704391, trauma: 279578, ip: 85616 },
];

const getPieData = (data, key) => {
  console.log(data);
  console.log(key);
  return [
    ["", "Stepped vs. Level"],
    ["Stepped", data?.stepped?.[key]],
    ["Level", data?.level?.[key]],
  ];
};

const PIE_DATA = {
  level: {
    life: 210106,
    tpd: 528294,
    trauma: 209683,
    ip: 64212,
  },
  stepped: {
    life: 70035,
    tpd: 176098,
    trauma: 69894,
    ip: 21404,
  },
};

/*if (numYears < 15):   life.stepped = life.level + life.stepped 
                        tpd.stepped = tpd.level + tpd.stepped 
                        trauma.stepped = trauma.level + trauma.stepped
                        ip.stepped = ip.level + ip.stepped 

else:                   life.stepped = life.stepped; life.level = life.level.    
*/

const LevelVsStepped = ({ steppedVsLevelData }) => {
  console.log("--- level vs stepped ---");
  console.log(steppedVsLevelData);
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <div style={{ width: "55%" }}>
        <LevelVsSteppedGraphs graphData={PIE_DATA} getPieData={getPieData} />
      </div>
      <div style={{ width: "45%" }}>
        <LevelVsSteppedTable shapedData={DUMMY_DATA} />
        <LevelVsSteppedTableTwo shapedData={DUMMY_DATA} />
      </div>
    </div>
  );
};

export default LevelVsStepped;
