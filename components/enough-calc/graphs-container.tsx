import EnoughGraph from "./enough-graph";
import EnoughSummaryGraph from "./enough-summary-graph";
import Levers from "./levers";
import { useEffect, useState } from "react";

const verifyIsNumber = (number) => {
  return !Number.isNaN(Number(number));
};

const GraphsContainer = ({
  // totalIncomes,
  // totalExpenses,
  // currentNetWorth,
  // futureValueExpenses,
  portfolios,
  enoughAge,
  setEnoughAge,
  monthlyExpenses,
  setMonthlyExpenses,
  preRate,
  postRate,
  selectedPre,
  setSelectedPre,
  selectedRetirement,
  setSelectedRetirement,
  residentialProperty,
  setResidentialProperty,
  monthlyContributions,
  setMonthlyContributions,
  rent,
  setRent,
  handleRecomputeGraph,
  recomputeGraph,
  maxNumYears,
  getGraphData,
  getSummaryGraphData,
  isRenter,
  isHomeOwner,
}) => {
  const baseRent = 10000;
  const baseHouse = 2500000;
  const [initConfig, setConfig] = useState({
    startingRp: undefined,
    startingRent: 0,
    startingExpenses: undefined,
    maxRp: undefined,
    minRp: undefined,
    maxRent: undefined,
    minRent: undefined,
    meMax: undefined,
  });
  useEffect(() => {
    setConfig({
      startingRp: residentialProperty,
      startingRent: rent || 0,
      startingExpenses: monthlyExpenses,
      maxRp: residentialProperty * 2 || baseHouse * 2,
      minRp: 0,
      maxRent: rent * 2 || baseRent * 2,
      minRent: 0,
      meMax: monthlyExpenses * 2,
    });
  }, []);

  const [deltas, setDeltas] = useState({
    rpDelta: 0,
    rentDelta: 0,
    monthlyExpensesDelta: 0,
  });

  // const _rpDelta = initConfig?.startingRp - residentialProperty;
  // const _rentDelta = initConfig?.startingRent - rent;
  // const _monthlyExpensesDelta = initConfig?.startingExpenses - monthlyExpenses;
  // const rpDelta = verifyIsNumber(_rpDelta) ? _rpDelta : 0;
  // const rentDelta = verifyIsNumber(_rentDelta) ? _rpDelta : 0;
  // const monthlyExpensesDelta = verifyIsNumber(_monthlyExpensesDelta)
  //   ? _rpDelta
  //   : 0;

  const updateDeltas = (target, targetStarting, value) => {
    const _delta = initConfig?.[targetStarting] - value;
    if (verifyIsNumber(_delta)) {
      setDeltas((prevState) => ({
        ...prevState,
        [target]: _delta,
      }));
    }
  };
  useEffect(() => {
    updateDeltas("monthlyExpensesDelta", "startingExpenses", monthlyExpenses);
  }, [monthlyExpenses]);

  useEffect(() => {
    updateDeltas("rentDelta", "startingRent", rent);
  }, [rent]);

  useEffect(() => {
    updateDeltas("rpDelta", "startingRp", residentialProperty);
  }, [residentialProperty]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "2rem",
          marginLeft: "0rem",
          justifyContent: "space-between",
        }}
      >
        <EnoughGraph
          // totalIncomes={totalIncomes}
          // totalExpenses={totalExpenses}
          // currentNetWorth={currentNetWorth}
          // futureValueExpenses={futureValueExpenses}
          recomputeGraph={recomputeGraph}
          configOptions={{
            preRate,
            postRate,
            numYearsUntilEnough: enoughAge,
            monthlyContributions,
            ...deltas,
          }}
          getGraphData={getGraphData}
        />

        <Levers
          portfolios={portfolios}
          enoughAge={enoughAge}
          setEnoughAge={setEnoughAge}
          monthlyExpenses={monthlyExpenses}
          setMonthlyExpenses={setMonthlyExpenses}
          monthlyContributions={monthlyContributions}
          setMonthlyContributions={setMonthlyContributions}
          selectedPre={selectedPre}
          setSelectedPre={setSelectedPre}
          selectedRetirement={selectedRetirement}
          setSelectedRetirement={setSelectedRetirement}
          residentialProperty={residentialProperty}
          setResidentialProperty={setResidentialProperty}
          rent={rent}
          setRent={setRent}
          handleRecomputeGraph={handleRecomputeGraph}
          maxNumYears={maxNumYears}
          initConfig={initConfig}
          isRenter={isRenter}
          isHomeOwner={isHomeOwner}
        />
      </div>
      <div
        style={{
          padding: "2rem",
          // display: "flex",
          // justifyItems: "center",
          // justifyContent: "center",
        }}
      >
        {/* <EnoughSummaryGraph
          getSummaryGraphData={getSummaryGraphData}
          recomputeGraph={recomputeGraph}
          enough={enoughAge}
          configOptions={{
            preRate,
            postRate,
            numYearsUntilEnough: enoughAge,
            monthlyContributions,
            ...deltas,
          }}
        /> */}
      </div>
    </div>
  );
};

export default GraphsContainer;
