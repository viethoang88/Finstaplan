import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, Divider } from "antd";
// import GoalItem from "./goal-item";
import GoalsSummary from "./goals-summary";
import GoalCapturingTable from "./goal-capturing-table";
import PortfolioCapturingTable from "./portfolio-capturing-table";

import { Button } from "semantic-ui-react";
import { fetchData, getClientSetActive } from "../../../store/auth";
import { TabView, TabPanel } from "primereact/tabview";
import ActiveClientRequired from "../active-client-required";
// import GoalAllocations from "./goal-allocations";

import Container from "./goal-pf-dnd/container";
import { PrimaryButton } from "@fluentui/react";
import AllocatedGoalsList from "./allocated-goals-list";
// import AllocatedGoalList from "./allocated-goals-list";

const DUMMY_DATA = {
  goals: [
    '{"Start Date":{"0":1903843495824},"End Date":{"0":1903843495824},"Years to Start Date":{"0":8.6079234973},"Rate":{"0":0.0558313179},"Allocation Now":{"0":95349.2026631769},"Portfolio":{"0":"High Growth"},"Portfolio Amount":{"0":1000000},"Portfolio Amount Remaining":{"0":904650.7973368231},"Funded":{"0":1.0},"Funded Amount":{"0":95349.2026631769},"Monthly Savings Required":{"0":0}}',
    '{"Start Date":{"0":1651382695824,"1":1682918695824,"2":1714541095824,"3":1746077095824,"4":1777613095824,"5":1809149095824,"6":1840771495824,"7":1872307495824,"8":1903843495824,"9":1935379495824,"10":1967001895824,"11":1998537895824,"12":2030073895824,"13":2061609895824,"14":2093232295824,"15":2124768295824,"16":2156304295824,"17":2187840295824,"18":2219462695824,"19":2250998695824,"20":2282534695824,"21":2314070695824,"22":2345693095824,"23":2377229095824,"24":2408765095824,"25":2440301095824,"26":2471923495824,"27":2503459495824,"28":2534995495824},"End Date":{"0":1682918695824,"1":1714541095824,"2":1746077095824,"3":1777613095824,"4":1809149095824,"5":1840771495824,"6":1872307495824,"7":1903843495824,"8":1935379495824,"9":1967001895824,"10":1998537895824,"11":2030073895824,"12":2061609895824,"13":2093232295824,"14":2124768295824,"15":2156304295824,"16":2187840295824,"17":2219462695824,"18":2250998695824,"19":2282534695824,"20":2314070695824,"21":2345693095824,"22":2377229095824,"23":2408765095824,"24":2440301095824,"25":2471923495824,"26":2503459495824,"27":2534995495824,"28":2566531495824},"Years to Start Date":{"0":0.6079234973,"1":1.6079234973,"2":2.6079234973,"3":3.6079234973,"4":4.6079234973,"5":5.6079234973,"6":6.6079234973,"7":7.6079234973,"8":8.6079234973,"9":9.6079234973,"10":10.6079234973,"11":11.6079234973,"12":12.6079234973,"13":13.6079234973,"14":14.6079234973,"15":15.6079234973,"16":16.6079234973,"17":17.6079234973,"18":18.6079234973,"19":19.6079234973,"20":20.6079234973,"21":21.6079234973,"22":22.6079234973,"23":23.6079234973,"24":24.6079234973,"25":25.6079234973,"26":26.6079234973,"27":27.6079234973,"28":28.6079234973},"Rate":{"0":1.0,"1":0.02715875,"2":0.0383478076,"3":0.0443088347,"4":0.0473021691,"5":0.0497718105,"6":0.0523495904,"7":0.0541947363,"8":0.0558313179,"9":0.057105971,"10":0.0581268014,"11":0.0589627594,"12":0.0596598956,"13":0.0602501385,"14":0.0607563226,"15":0.0611952111,"16":0.0615793874,"17":0.061918482,"18":0.0622199903,"19":0.0624898335,"20":0.062732751,"21":0.0629525813,"22":0.0631524666,"23":0.0633350033,"24":0.0635023562,"25":0.0636563441,"26":0.0637985065,"27":0.0639301554,"28":0.0640524153},"Allocation Now":{"0":122031.5541301143,"1":120158.0673695562,"2":116906.179603156,"3":113375.2003478292,"4":110142.3520742465,"5":106693.7780438777,"6":102801.3943421495,"7":99093.2156038887,"8":95349.2026631769,"9":91765.877574462,"10":88330.1742944974,"11":85032.1746741845,"12":81863.8631572453,"13":78818.4545431853,"14":75890.0078591968,"15":73073.1927025497,"16":70363.1412834479,"17":67755.3509994048,"18":65245.6178374646,"19":62829.9893606464,"20":60504.7304560212,"21":58266.2976446316,"22":56111.3192773177,"23":54036.5798702449,"24":52039.0074146992,"25":50115.6628672814,"26":48263.731269503,"27":46480.5141077039,"28":44763.4226340836},"Portfolio":{"0":"Cash","1":"Cash","2":"Conservative","3":"Mod Conservative","4":"Mod Conservative","5":"Mod Growth","6":"Growth","7":"Growth","8":"High Growth","9":"High Growth","10":"High Growth","11":"High Growth","12":"High Growth","13":"High Growth","14":"High Growth","15":"High Growth","16":"High Growth","17":"High Growth","18":"High Growth","19":"High Growth","20":"High Growth","21":"High Growth","22":"High Growth","23":"High Growth","24":"High Growth","25":"High Growth","26":"High Growth","27":"High Growth","28":"High Growth"},"Portfolio Amount":{"0":904650.7973368231,"1":782619.2432067088,"2":662461.1758371525,"3":545554.9962339965,"4":432179.7958861673,"5":322037.4438119208,"6":215343.6657680431,"7":112542.2714258936,"8":13449.0558220049,"9":-95349.2026631769,"10":-187115.0802376389,"11":-275445.2545321363,"12":-360477.4292063207,"13":-442341.292363566,"14":-521159.7469067513,"15":-597049.754765948,"16":-670122.9474684978,"17":-740486.0887519456,"18":-808241.4397513504,"19":-873487.057588815,"20":-936317.0469494615,"21":-996821.7774054826,"22":-1055088.0750501142,"23":-1111199.3943274319,"24":-1165235.9741976769,"25":-1217274.9816123762,"26":-1267390.6444796575,"27":-1315654.3757491605,"28":-1362134.8898568645},"Portfolio Amount Remaining":{"0":782619.2432067088,"1":662461.1758371525,"2":545554.9962339965,"3":432179.7958861673,"4":322037.4438119208,"5":215343.6657680431,"6":112542.2714258936,"7":13449.0558220049,"8":-95349.2026631769,"9":-187115.0802376389,"10":-275445.2545321363,"11":-360477.4292063207,"12":-442341.292363566,"13":-521159.7469067513,"14":-597049.754765948,"15":-670122.9474684978,"16":-740486.0887519456,"17":-808241.4397513504,"18":-873487.057588815,"19":-936317.0469494615,"20":-996821.7774054826,"21":-1055088.0750501142,"22":-1111199.3943274319,"23":-1165235.9741976769,"24":-1217274.9816123762,"25":-1267390.6444796575,"26":-1315654.3757491605,"27":-1362134.8898568645,"28":-1406898.312490948},"Funded":{"0":1.0,"1":1.0,"2":1.0,"3":1.0,"4":1.0,"5":1.0,"6":1.0,"7":1.0,"8":0.1410505326,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0,"21":0.0,"22":0.0,"23":0.0,"24":0.0,"25":0.0,"26":0.0,"27":0.0,"28":0.0},"Funded Amount":{"0":122031.5541301143,"1":120158.0673695562,"2":116906.179603156,"3":113375.2003478292,"4":110142.3520742465,"5":106693.7780438777,"6":102801.3943421495,"7":99093.2156038887,"8":13449.0558220049,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0,"21":0.0,"22":0.0,"23":0.0,"24":0.0,"25":0.0,"26":0.0,"27":0.0,"28":0.0},"Monthly Savings Required":{"0":0.0,"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":619.361252311,"9":599.2858618014,"10":503.4439094719,"11":426.6287312886,"12":364.1445772177,"13":312.6924325891,"14":269.8884738179,"15":233.9688354088,"16":203.6016724745,"17":177.7636205872,"18":155.6562991419,"19":136.6484927177,"20":120.235247883,"21":106.008381782,"22":93.6348545585,"23":82.8406647489,"24":73.398690667,"25":65.1193952199,"26":57.8436381957,"27":51.437059835,"28":45.7856499098}}',
    '{"Start Date":{"0":1903843495824},"End Date":{"0":1903843495824},"Years to Start Date":{"0":8.6051912568},"Rate":{"0":0.0558313179},"Allocation Now":{"0":95356.162176351},"Portfolio":{"0":"High Growth"},"Portfolio Amount":{"0":-1406898.42},"Portfolio Amount Remaining":{"0":-1502254.8311184139},"Funded":{"0":0},"Funded Amount":{"0":0},"Monthly Savings Required":{"0":721.4091805856}}',
  ],
  goalOverallFundedPercents: [1.0, 0.39365161484590144, 0],
};

const DUMMY_GOALS = [
  {
    goal: "Retirement Income",
    goalFrequency: "yearly",
    when: "date",
    date: "2022-05-1T05:24:55.824Z",
    dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
    age: 65,
    estimateType: "PV",
    estimatedCost: 120000,
    goalType: "monetary",
    priority: 2,
    numTimes: 29,
  },
  {
    goal: "Buy a Racehorse",
    goalFrequency: "onceOff",
    when: "date",
    date: "2030-05-1T05:24:55.824Z",
    dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
    age: 65,
    estimateType: "PV",
    estimatedCost: 120000,
    goalType: "monetary",
    priority: 1,
  },
  {
    goal: "Buy New Car",
    goalFrequency: "onceOff",
    when: "date",
    date: "2030-05-1T05:24:55.824Z",
    dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
    age: 65,
    estimateType: "PV",
    estimatedCost: 120000,
    goalType: "monetary",
  },
];

const DUMMY_PORTFOLIOS = [];

// dataArray is [[goal1JSON, goal2JSON, goal3JSON, ...], [goal1FundedPercent, goal2FundedPercent, goal3FundedPercent...]]
const parseData = (dataArray) => {
  const [goalsJSON, fundedPercents] = dataArray;
  // const fp = data.goalOverallFundedPercents;
  const parsedData = {};
  parsedData["goals"] = goalsJSON.map((goal) => JSON.parse(goal));
  parsedData["funded"] = [...fundedPercents];
  return parsedData;
};

// Requires: "clientData", "behaviouralRate", "portfolios", "clientData", "assignedGoals"
// - clientData: primary.dateOfBirth,
//               partner.dateOfBirth
//               hasPartner
// - behaviouralRate: portfolios[clientPortfolio][returnRate]
// - portfolios: all portfolios
// - assignedGoals: [[portfolioValue, portfolioName, goalsForThatPortfolio], ...]
const performCalculations = async (
  assumptions,
  portfolios,
  clientData,
  behaviourGrowthRate, // from assigned portfolio
  assignedGoals,
  setComputedData,
  setLoading,
  setLoaded,
  setComputedGoals,
  useGoals
) => {
  setLoading(true);
  // if (assumptions === undefined) return;
  //const url = `${process.env.ROOT_URL}/api/calculations/insurance`;
  // const url =
  //   "https://9ec580v6xi.execute-api.us-east-1.amazonaws.com/Prod/hello";
  const url = `/api/calculations/goals`;

  const requiredClientData = {
    primary: { dateOfBirth: clientData.primary.dateOfBirth },
    partner: { dateOfBirth: clientData.partner.dateOfBirth },
    hasPartner: clientData.hasPartner,
  };
  const behaviouralRate = 6.93;
  const _assignedGoals = assignedGoals
    .filter((amt, pfName, goals) => goals && goals.length !== 0)
    .map(([amt, pfName, goals]) => {
      return [
        amt,
        pfName,
        goals.filter((goal) => goal?.when && goal?.[goal?.when]),
      ];
    });

  const data = {
    assumptions,
    portfolios,
    clientData: requiredClientData,
    behaviouralRate: behaviouralRate,
    assignedGoals: _assignedGoals,
  };

  console.log("--- MAKING GOAL CALCULATION REQUEST WITH");
  console.log(_assignedGoals);

  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    // headers: {
    //   "Content-Type": "application/json",
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((res) => {
      // console.log("--------MY  RES--------");
      // const resText = res.text();
      // console.log(resText);
      // return resText;
      return res.json();
      // return JSON.parse(res.body);
    })
    // .then((res) => JSON.parse(res?.body)) // parses JSON response into native JavaScript objects)
    .then((data) => {
      console.log("--- Received goals data from backend ---");
      console.log(data);

      setLoading(false);
      setComputedData(data);

      console.log(
        "--- THESE ARE THE COMPUTED AND REDUCED GOALS READY FOR DISPLAY IN THE BACKEND ---"
      );
      const computedGoals = useGoals
        .filter(
          (goal) =>
            goal.assignedPortfolio !== "Unassigned Goals" &&
            goal[goal.when] !== undefined
        )
        .reduce((acc, next) => {
          if (acc[next.assignedPortfolio]) {
            acc[next.assignedPortfolio].push(next);
          } else {
            acc[next.assignedPortfolio] = [next];
          }
          return acc;
        }, {});

      console.log(computedGoals);
      setComputedGoals(computedGoals);
      setLoading(false);
      setLoaded(true);
    })
    .catch((err) => {
      setLoading(false);
    });
};

export const mergeAuthorisedPortfolios = (
  primary,
  partner,
  activeClient,
  hasPartner
) => {
  const authorisedPortfolios =
    (primary &&
      primary?.map &&
      primary?.map((pf) => ({
        ...pf,
        owner: "primary",
        firstName: activeClient?.["primary"],
      }))) ||
    [];
  if (hasPartner) {
    const partnerAuthorisedPortfolios =
      (partner &&
        partner?.map &&
        partner?.map((pf) => ({
          ...pf,
          owner: "partner",
          firstName: activeClient?.["partner"],
        }))) ||
      [];
    return [...authorisedPortfolios, ...partnerAuthorisedPortfolios];
  }
  return authorisedPortfolios;
};

/*
  Expected shape and usage:

  def performGoalAllocations(assumptions, behaviourGrowthRate, portfolios, clientData, assignedGoals):
    return [calculateGoalsAllocations(assumptions, behaviourGrowthRate, goals, portfolios, clientData, portfolioValue)
        for [portfolioValue, portfolioName, goals] in assignedGoals]
*/
const reshapeGoalsForBackend = (goals, portfolios) => {
  const reshapedGoals = [];
  for (let goal of goals) {
    const pf = goal.assignedPortfolio;

    console.log("--- GOAL IS ---");
    console.log(goal);
    console.log("--- assigned PF ---");
    console.log(pf);

    if (pf !== "Unassigned Goals") {
      const idx = reshapedGoals.findIndex((rg) => rg[1] === pf);
      console.log("--- idx found ---");
      console.log(idx);
      console.log("--- IN ---");
      const duplicateForTesting = [...reshapedGoals];
      console.log(duplicateForTesting);
      console.log("--- for goal ---");
      console.log(goal);
      if (idx !== -1) reshapedGoals[idx][2].push(goal);
      else {
        const portfolioValue = portfolios.find(
          (p) => p.company === pf
        )?.estimatedValue;
        reshapedGoals.push([portfolioValue, pf, [goal]]);
      }
    }
  }
  console.log("--- RESHAPED GOALS ---");
  console.log(reshapedGoals);
  return reshapedGoals;
};

const calcGoals = (
  assumptions,
  portfolios,
  clientData,
  behaviourGrowthRate, // from assigned portfolio
  assignedGoals,
  setComputedData,
  setLoading,
  setLoaded
) => {
  setLoading(true);

  setTimeout(() => {
    setComputedData(parseData(DUMMY_DATA));
    setLoading(false);
    setLoaded(true);
  }, 3000);
};

const _setAllocations = (setAllocations, data) => {
  console.log(data);
};

const GoalCalc = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.factFind.goals);
  const portfolios = useSelector((state) => state.auth.portfolios);
  const clientData = useSelector((state) => state.factFind);
  const funds = useSelector((state) => state.auth.funds);
  const behaviourGrowthRate = 6.9;
  const [activeIndex, setActiveIndex] = useState(0);
  const [useGoals, setUseGoals] = useState();
  const [shapedGoals, setShapedGoals] = useState();
  const [computedData, setComputedData] = useState(undefined);
  const [prioritiesValidated, setPrioritiesValidated] = useState(false);
  const [goalsCalculating, setGoalsCalculating] = useState(false);
  const [goalsCalculated, setGoalsCalculated] = useState(false);
  const [computedGoals, setComputedGoals] = useState();
  const [usePortfolios, setUsePortfolios] = useState([]);
  const [pfNameToValueMap, setPfNameToValueMap] = useState({});
  const [allocations, setAllocations] = useState({});

  const activeClient = useSelector((state) => state.auth.activeClient);
  const philosophies = useSelector((state) => state.auth.philosophies);
  const assumptions = useSelector((state) => state.auth.assumptions);
  const hasPartner = useSelector((state) => state.factFind.hasPartner);
  const primaryAuthorisedPortfolios = useSelector(
    (state) => state.factFind.primary?.authorities
  );
  const partnerAuthorisedPortfolios = useSelector(
    (state) => state.factFind.partner?.authorities
  );

  useEffect(() => {
    const clientId = activeClient?.id;
    console.log("--- GOT THEIR ID LOL ---");
    console.log(clientId);
    if (clientId) {
      dispatch(getClientSetActive(clientId));
    }
  }, [activeClient]);

  useEffect(() => {
    if (
      assumptions === undefined ||
      assumptions?.length === 0 ||
      philosophies === undefined ||
      Object.keys(philosophies).length === 0
    ) {
      dispatch(fetchData());
    }
  }, []);

  useEffect(() => {
    if (goals && goals?.length > 0) {
      setUseGoals(goals);
      const preppedGoalsForReshaping = goals.map((goal) => {
        if (goal.assignedPortfolio === undefined) {
          return { ...goal, assignedPortfolio: "Unassigned Goals" };
        }
        return goal;
      });
      const reshapedGoals = reshapeGoalsForBackend(
        preppedGoalsForReshaping,
        usePortfolios
      );
      setShapedGoals(reshapedGoals);
    }
  }, [goals, usePortfolios]);

  // useEffect(() => {
  //   //if (useGoals === undefined || Object.keys(useGoals)?.length === 0) return;
  //   //const priorities = Object.values(useGoals).map((goal) => goal["priority"]);
  //   if (!prioritiesValidated && useGoals?.map && typeof useGoals === "object") {
  //     console.log(useGoals);
  //     const priorities = useGoals?.map((g) => g["priority"]);
  //     console.log(priorities);
  //     // Ensure priorities 1:n are set for all goals:
  //     const duplicateGoals = [...useGoals];
  //     for (let i = 1; i <= priorities?.length; i++) {
  //       const prioritySet = priorities.includes(i);
  //       if (!prioritySet) {
  //         const newGoal = { ...duplicateGoals[i - 1] };
  //         newGoal["priority"] = i;
  //         duplicateGoals[i - 1] = newGoal;
  //       }
  //     }
  //     console.log(duplicateGoals);
  //     duplicateGoals.sort((a, b) => (a["priority"] > b["priority"] ? 1 : -1));
  //     console.log(duplicateGoals);
  //     setPrioritiesValidated(true);
  //     setUseGoals(duplicateGoals);
  //   }
  // }, [useGoals, prioritiesValidated]);

  useEffect(() => {
    const authorisedPortfolios = mergeAuthorisedPortfolios(
      primaryAuthorisedPortfolios,
      partnerAuthorisedPortfolios,
      activeClient,
      hasPartner
    );
    if (authorisedPortfolios.length > 0) {
      setUsePortfolios(authorisedPortfolios);
      console.log("--- AUTHORISED PORTFOLIOS ---");
      console.log(authorisedPortfolios);
      const pfNameToValueMap = authorisedPortfolios.reduce((acc, nextPf) => {
        acc[nextPf?.company] = nextPf?.estimatedValue;
        return acc;
      }, {});
      console.log("--- PF NAME TO VALUE MAP ----");
      console.log(pfNameToValueMap);
      setPfNameToValueMap(pfNameToValueMap);
    }
  }, [primaryAuthorisedPortfolios, partnerAuthorisedPortfolios]);

  return (
    <div>
      <ActiveClientRequired
        activeClient={activeClient}
        feature={"Goal Allocation"}
      />
      {activeClient !== undefined && (
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          style={{ minWidth: "1650px" }}
        >
          <TabPanel header="Capturing">
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center" }}>
                {activeClient?.["lastName"]} Family
              </h2>
              <PortfolioCapturingTable
                authorisedPortfolios={usePortfolios}
                primary={activeClient?.primary}
                partner={hasPartner ? activeClient?.partner : undefined}
              />
            </div>
            <Divider />
            <Container
              goals={useGoals}
              portfolios={usePortfolios}
              dispatcher={dispatch}
              activeIndex={activeIndex}
            />
            <Divider />
            <div style={{ marginTop: "1.5rem", marginBottom: "18rem" }}>
              <GoalCapturingTable
                goals={goals}
                authorisedPortfolios={usePortfolios}
              />
            </div>
          </TabPanel>
          <TabPanel header="Summary">
            <Button
              style={{ width: "100%" }}
              content={
                goalsCalculating
                  ? "Calculating Goals"
                  : computedData
                  ? "Recalculate Goals"
                  : "Calculate Goals"
              }
              icon="calculator"
              labelPosition="left"
              // disabled={calculatedData !== undefined}
              onClick={(e) => {
                if (shapedGoals) {
                  performCalculations(
                    // calcGoals(
                    assumptions,
                    portfolios,
                    clientData,
                    behaviourGrowthRate, // from assigned portfolio
                    shapedGoals,
                    setComputedData,
                    setGoalsCalculating,
                    setGoalsCalculated,
                    setComputedGoals,
                    useGoals
                  );
                } else {
                }
              }}
              loading={goalsCalculating}
              positive={goalsCalculated}
            />
            {/* {computedData && computedGoals && (
              <GoalsSummary
                useGoals={computedGoals}
                goals={computedData["goals"]}
                funded={computedData["funded"]}
              />
            )} */}
            {computedData && computedGoals && (
              <AllocatedGoalsList
                computedGoals={computedGoals}
                dataFromComputation={computedData}
                pfNameToValueMap={pfNameToValueMap}
                setAllocations={_setAllocations.bind(null, setAllocations)}
              />
            )}
          </TabPanel>
          {/* <TabPanel header="Allocations">
            <GoalAllocations />
          </TabPanel> */}
        </TabView>
      )}
    </div>
  );
};

export default GoalCalc;
