import { useDispatch, useSelector } from "react-redux";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { fetchData } from "../../../store/auth";
import { valuesIn } from "lodash";

const generatePieData = (growthRate, defensiveRate) => {
  // const _cash = assignCashFromScore(score);
  // const _defensive = 100 - _cash - score;

  return [
    ["Growth vs. Defensive", "Percentage"],
    ["Growth", growthRate],
    ["Defensive", defensiveRate],
  ];

  return [
    {
      id: "Growth",
      label: "Growth",
      value: 25,
      // "color": "hsl(170, 70%, 50%)"
    },
    {
      id: "Defensive",
      label: "Defensive",
      value: 75,
      // "color": "hsl(276, 70%, 50%)"
    },
    {
      id: "Cash",
      label: "Cash",
      value: 0,
      // "color": "hsl(282, 70%, 50%)"
    },
  ];
};

const extractAllocationValues = (scoreObject) => {
  const [growth, defensive, cash] = scoreObject;
  const ga = growth.value;
  let da = defensive.value;
  const ca = cash.value;
  da += ca;
  return [ga, da];
};

const calculateDefensiveVsGrowth = (
  goalBasedPieData,
  behaviourModificationLoading,
  behaviouralGrowthRate,
  behaviouralDefensiveRate
) => {
  const goalBasedDefensive = goalBasedPieData?.defensivePercent;
  const goalBasedGrowth = goalBasedPieData?.growthPercent;
  // TODO: (1 - behaviourModificationLoading) * (defensive[portfolio] / 100) +
  //       (behaviourModificationLoading) * clientsSelectedPortfolioDefensiveRate

  if (
    goalBasedPieData === undefined ||
    behaviourModificationLoading === undefined ||
    behaviouralGrowthRate === undefined ||
    behaviouralDefensiveRate === undefined ||
    goalBasedDefensive === undefined ||
    goalBasedGrowth === undefined ||
    Number.isNaN(behaviourModificationLoading) ||
    Number.isNaN(behaviouralGrowthRate) ||
    Number.isNaN(behaviouralDefensiveRate) ||
    Number.isNaN(goalBasedDefensive) ||
    Number.isNaN(goalBasedGrowth)
  )
    return undefined;

  console.log("--- goalBased rates ---");
  console.log(goalBasedDefensive);
  console.log(goalBasedGrowth);

  console.log("--- OTHER VARIABLES ---");
  const behaviourBasedDefensive = behaviouralDefensiveRate / 100;
  const behaviourBasedGrowth = behaviouralGrowthRate / 100;
  const bml = behaviourModificationLoading / 100;
  console.log(bml);
  console.log(behaviourBasedDefensive);
  console.log(behaviourBasedGrowth);

  console.log("--- SCALED RATES ---");
  console.log((1 - bml) * goalBasedDefensive);
  console.log(bml * behaviourBasedDefensive);
  console.log((1 - bml) * goalBasedGrowth);
  console.log(bml * behaviourBasedGrowth);

  const defensiveRate =
    (1 - bml) * goalBasedDefensive + bml * behaviourBasedDefensive;
  const growthRate = (1 - bml) * goalBasedGrowth + bml * behaviourBasedGrowth;
  console.log("--- D V G ----");
  console.log(defensiveRate);
  console.log(growthRate);
  const denominator = defensiveRate + growthRate;
  const scaledGrowthRate = (growthRate / denominator) * 100;
  const scaledDefensiveRate = (defensiveRate / denominator) * 100;
  console.log(scaledGrowthRate, scaledDefensiveRate);
  if (Number.isNaN(scaledGrowthRate) || Number.isNaN(scaledDefensiveRate)) {
    return undefined;
  }
  return [scaledDefensiveRate, scaledGrowthRate];
};

const GoalPie = ({ goalBasedPieData }) => {
  const dispatch = useDispatch();
  const assumptions = useSelector((state) => state.auth.assumptions);
  const riskProfile = useSelector((state) => state.factFind.riskProfile);
  const riskProfileScores = useSelector(
    (state) => state.factFind.riskProfileScores
  );
  const growthVsDefensive = useSelector(
    (state) => state.auth.growthVsDefensive
  );
  const [pieData, setPieData] = useState(undefined);
  const [defaultPortfolio, setDefaultPortfolio] = useState();
  const [growthAllocation, setGrowthAllocation] = useState();
  const [defensiveAllocation, setDefensiveAllocation] = useState();
  const [partnerGrowthAllocation, setPartnerGrowthAllocation] = useState();
  const [partnerDefensiveAllocation, setPartnerDefensiveAllocation] =
    useState();
  const [howToComplete, setHowToComplete] = useState();
  const [behaviouralModificationLoading, setBehaviouralModificationLoading] =
    useState();

  useEffect(() => {
    if (growthVsDefensive === undefined || growthVsDefensive === null) {
      dispatch(fetchData());
    }
  }, []);

  useEffect(() => {
    console.log(goalBasedPieData);
    if (goalBasedPieData !== undefined) {
      const defensiveRate = goalBasedPieData?.defensivePercent;
      const growthRate = goalBasedPieData?.growthPercent;
      if (
        defensiveRate === undefined ||
        growthRate === undefined ||
        Number.isNaN(defensiveRate) ||
        Number.isNaN(growthRate)
      ) {
        return;
      }
      const _pieData = calculateDefensiveVsGrowth(
        goalBasedPieData,
        behaviouralModificationLoading,
        growthAllocation,
        defensiveAllocation
      );
      console.log(_pieData);
      if (_pieData !== undefined) {
        const [defensive, growth] = _pieData;
        setPieData(generatePieData(growth, defensive));
      }
    }
  }, [
    goalBasedPieData,
    growthAllocation,
    defensiveAllocation,
    behaviouralModificationLoading,
  ]);

  useEffect(() => {
    if (assumptions !== undefined) {
      const defaultPortfolio = assumptions.find(
        (ass) => ass.type === "defaultGrowthRate"
      )?.value;

      console.log("-------- ASSUMPTIONS AND BEHAVIOURMOD LOADING ---");
      console.log(assumptions);
      const behaviouralModificationLoading = assumptions.find(
        (ass) => ass.type === "behaviourModificationLoading"
      )?.value;

      //   const bml =
      console.log(behaviouralModificationLoading);

      setDefaultPortfolio(defaultPortfolio);
      setBehaviouralModificationLoading(behaviouralModificationLoading);
    }
    if (riskProfileScores === undefined && growthVsDefensive !== undefined) {
      const [defensive, growth] = growthVsDefensive;
      const defensiveRate = defensive?.[defaultPortfolio];
      const growthRate = growth?.[defaultPortfolio];
      setHowToComplete("joint");
      setGrowthAllocation(growthRate);
      setDefensiveAllocation(defensiveRate);
    } else {
      const howToComplete = riskProfile?.howToComplete;
      if (howToComplete === "joint") {
        const [ga, da] = extractAllocationValues(riskProfileScores["joint"]);
        setHowToComplete(howToComplete);
        setGrowthAllocation(ga);
        setDefensiveAllocation(da);
      } else {
        const [ga, da] = extractAllocationValues(riskProfileScores["joint"]);
        const [gaPartner, daPartner] = extractAllocationValues(
          riskProfileScores["partner"]
        );
        setHowToComplete(howToComplete);
        setGrowthAllocation(ga);
        setDefensiveAllocation(da);
        setPartnerDefensiveAllocation(daPartner);
        setPartnerGrowthAllocation(gaPartner);
      }
    }
  }, [assumptions, riskProfileScores, growthVsDefensive]);

  return (
    <>
      {pieData !== undefined && (
        <Chart
          width={"200px"}
          height={"200px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={pieData}
          options={{
            title: "",
            pieHole: 0.3,
            slices: {
              0: { color: "rgb(166, 206, 227)" },
              1: { color: "rgb(31, 120, 180)" },
              // 1: { color: "rgb(166, 206, 227)" },
              // 0: { color: "darkgreen" },
            },
            legend: "none",
          }}
        />
      )}
    </>
  );
};

export default GoalPie;
