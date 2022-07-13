import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import {
  aggSumByOwner,
  extractLabelsFromData,
  extractDataFromState,
} from "../ff/charts/charts-container";
import DataManager from "../../classes/DataManager";
import BudgetContainer from "./budget-container";
import GraphsContainer from "./graphs-container";
import { authSliceActions, fetchData } from "../../store/auth";

import { tjaart } from "../../dummy_data/client-examples";
import { Checkbox } from "primereact/checkbox";

/*
  Assuming a renter: 
  - Lever: increase rental/decrease rental 
  - Lever: purchase property => amount 
    - rental stops 
    - assets decrease by amount of property
*/

const EnoughCalculator = () => {
  const dispatch = useDispatch();
  const assumptions = useSelector((state) => state.auth.assumptions);
  const portfolios = useSelector((state) => state.auth.portfolios);

  useEffect(() => {
    if (!portfolios || !assumptions) dispatch(fetchData());
  }, []);

  const clientData = useSelector((state) => state.factFind);
  // FOR TESTING PURPOSES:
  const clientDataTest = tjaart;
  const [useTestData, setUseTestData] = useState(true);

  const [dataManager, setDataManager] = useState(undefined);
  const [preRate, setPreRate] = useState(undefined);
  const [postRate, setPostRate] = useState(undefined);
  const [selectedPre, setSelectedPre] = useState("Growth");
  const [selectedRetirement, setSelectedRetirement] = useState("Conservative");
  const [enoughAge, setEnoughAge] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [residentialProperty, setResidentialProperty] = useState(0);
  const [rent, setRent] = useState(0);
  const [monthlyContributions, setMonthlyContributions] = useState(0);
  const [recomputeGraph, setRecomputeGraph] = useState(false);
  // if (!!assumptions || !!portfolios || !!clientData) return <></>;

  // const _dataManager = useMemo(() => {
  //   if (useTestData) {
  //     return new DataManager(clientDataTest, assumptions);
  //   } else {
  //     return new DataManager(clientData, assumptions);
  //   }
  // }, [portfolios, assumptions, useTestData]);

  useEffect(() => {
    if (useTestData) {
      setDataManager(new DataManager(clientDataTest, assumptions));
    } else {
      setDataManager(new DataManager(clientData, assumptions));
    }
  }, [useTestData, portfolios, assumptions]);

  useEffect(() => {
    const preRate = portfolios?.find((el) => el.portfolioName === selectedPre);
    setPreRate(preRate);
  }, [selectedPre, portfolios]);

  useEffect(() => {
    const postRate = portfolios?.find(
      (el) => el.portfolioName === selectedRetirement
    );
    setPostRate(postRate);
  }, [selectedRetirement, portfolios]);

  useEffect(() => {
    if (dataManager) {
      const allRefsKeyedByType = dataManager?.getAllRefsKeyedByType();
      const aggSumForAll = dataManager?.getAggregateSumForAll();
      const rentExpense = allRefsKeyedByType?.expenses?.rentExpense;
      const residence = allRefsKeyedByType?.assets?.familyHome;
      const isRenter = !!rentExpense?.[0]?.value;
      const isHomeOwner = !!residence?.[0]?.value;
      setMonthlyExpenses(aggSumForAll?.expenses / 12);
      setResidentialProperty(residence?.[0]?.value);
      setRent(rentExpense?.[0]?.value);
      setRecomputeGraph(false);
    }
  }, [dataManager]);

  if (!dataManager) return <></>;

  // dataManager.calculateAssumptions(assumptions);
  const maxNumYears = dataManager.getAssumption(
    "yearsUntilMortalityForYoungestPartner"
  );
  // const _aggSumByOwner = aggSumByOwner(clientData);
  // const dataAggdKeyedByType = dataManager?.getAllCategoriesKeyedByType();
  const allRefsKeyedByType = dataManager?.getAllRefsKeyedByType();
  const aggSumForAll = dataManager?.getAggregateSumForAll();
  const rentExpense = allRefsKeyedByType?.expenses?.rentExpense;
  const residence = allRefsKeyedByType?.assets?.familyHome;
  const isRenter = !!rentExpense?.[0]?.value;
  const isHomeOwner = !!residence?.[0]?.value;
  // const monthlyExpenses = aggSumForAll?.expenses / 12;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: 5000,
        backgroundColor: "rgba(230,230,230)",
        padding: "1.25rem",
      }}
    >
      <div style={{ marginBottom: "5rem" }}>
        <Checkbox
          value={useTestData}
          onChange={(e) => {
            setUseTestData(e.checked);
            console.log(e.checked);
          }}
          checked={useTestData}
        />
        &nbsp;&nbsp;&nbsp;Use test data
      </div>
      <GraphsContainer
        // totalIncomes={aggSumForAll.incomes}
        // totalExpenses={aggSumForAll.expenses}
        // futureValueExpenses={futureValueExpenses}
        // currentNetWorth={0}
        portfolios={portfolios}
        enoughAge={enoughAge}
        setEnoughAge={setEnoughAge}
        monthlyExpenses={monthlyExpenses}
        setMonthlyExpenses={setMonthlyExpenses}
        preRate={preRate?.expectedGrowth}
        postRate={postRate?.expectedGrowth}
        selectedPre={selectedPre}
        setSelectedPre={setSelectedPre}
        selectedRetirement={selectedRetirement}
        setSelectedRetirement={setSelectedRetirement}
        residentialProperty={residentialProperty}
        setResidentialProperty={setResidentialProperty}
        monthlyContributions={monthlyContributions}
        setMonthlyContributions={setMonthlyContributions}
        rent={rent}
        setRent={setRent}
        recomputeGraph={recomputeGraph}
        handleRecomputeGraph={() =>
          setRecomputeGraph((prevState) => !prevState)
        }
        maxNumYears={maxNumYears}
        getGraphData={dataManager?.getGraphData.bind(dataManager)}
        getSummaryGraphData={dataManager?.getSummaryGraphData.bind(dataManager)}
        isRenter={isRenter}
        isHomeOwner={isHomeOwner}
      />
      <BudgetContainer
        incomes={[]}
        expenses={[]}
        assets={[]}
        liabilities={[]}
      />
    </div>
  );
};
export default EnoughCalculator;
