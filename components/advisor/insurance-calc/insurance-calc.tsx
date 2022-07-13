import ActiveClientRequired from "../active-client-required";
import NeedsGraph from "./needs-graph";
import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";
import SummaryTable from "./summary-table";
import TotalCoverageGraph from "./total-coverage-graph";
import {
  authSliceActions,
  fetchData,
  getClientSetActive,
} from "../../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { buildIpGraph, buildRequirementsGraph } from "./graph_builder";
import DataManager from "../../../classes/DataManager";
import { Card } from "antd";
import { Button } from "semantic-ui-react";
import { DUMMY_CALCULATED_DATA } from "../../../dummy_data/calculated_insurance";
import CalculatingButton from "../../ui/calculating-button";
import LevelVsStepped from "./level-vs-stepped";
import {
  transformsByCategorySumNpv,
  transformAggLiabilities,
  calculateNetRequirements,
  extractNetRequirements,
  sumCategories,
  shapeTotalRequirementsSummary,
  extractMinimumRequirements,
} from "./insurance-calc-helpers";
import TotalRequirementsSummary from "./total-requirements-summary";
// TODO: netPerYear is only returning data for the first year, have to hack together a sum....

/* Data shape:
const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
*/

export const performCalculations = async (
  philosophies,
  assumptions,
  portfolios,
  clientData,
  setter,
  setCalculating,
  setCalculated,
  requestType = "full"
) => {
  setCalculating(true);
  // if (assumptions === undefined) return;
  //const url = `${process.env.ROOT_URL}/api/calculations/insurance`;
  // const url =
  //   "https://9ec580v6xi.execute-api.us-east-1.amazonaws.com/Prod/hello";
  const url = `/api/calculations/insurance`;

  // const data = {
  //   philosophies,
  //   assumptions: assumptions, //DataManager.reshapeAssumptions(assumptions),
  //   client: clientData,
  // };

  // const portfolios = clientData?.advisor?.portfolios;
  const useClientData = { ...clientData, advisor: { portfolios: portfolios } };
  delete useClientData["goals"];
  delete useClientData["formSteps"];
  delete useClientData["authoritiesData"];
  delete useClientData["advisors"];
  delete useClientData["existingStructures"];
  delete useClientData["existingStructuresDetails"];
  delete useClientData["healthInfo"];
  delete useClientData["insuranceInfo"];
  delete useClientData["values"];
  const data = {
    philosophies,
    assumptions,
    clientData: useClientData,
    requestType,
  };
  console.log("XXXX SENDING INSURANCE API REQUEST WITH XXXX");
  console.log(data);
  console.log("--- AND JSON ---");
  console.log(JSON.stringify(data));

  return fetch(url, {
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
      // const resText = res.text();
      // return resText;
      // return JSON.parse(res.body);
      console.log("--- DATA ARRIVED ---");
      return res.json();
    })
    .then((data) => {
      if (data.message) {
        console.log(data.message);
        return;
      }
      if (data.error) {
        console.log(data.error);
        setCalculating(false);
        return;
      }
      console.log("--- SUCCESSFUL REQUEST WITH ---");
      console.log(data);
      setter(data);
      setCalculating(false);
      setCalculated(true);
    })
    .catch((err) => {
      console.log("--- REQUEST FAILED WITH ERROR ---");
      console.error(err);
      setCalculating(false);
    });
};

const InsuranceCalc = ({ renderFromFactFind = false }) => {
  const activeClient = useSelector((state) => state.auth.activeClient);
  const philosophies = useSelector((state) => state.auth.philosophies);
  const assumptions = useSelector((state) => state.auth.assumptions);
  const portfolios = useSelector((state) => state.auth.portfolios);
  const clientData = useSelector((state) => state.factFind);
  const primaryName = clientData?.primary?.firstName;
  const partnerName = clientData?.partner?.firstName;
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [calculatedData, setCalculatedData] = useState(
    renderFromFactFind ? undefined : DUMMY_CALCULATED_DATA
  );

  useEffect(() => {
    const clientId = activeClient?.id;
    if (clientId) {
      dispatch(getClientSetActive(clientId));
    }
  }, [activeClient]);

  // const offsetsData = JSON.parse(
  //   '{"life":{"0":646011.15,"1":662550.272354625,"2":679518.0593366368,"3":696925.7317068544,"4":714784.806248712,"5":733107.1036255106,"6":751904.756447204,"7":771190.2175523196,"8":790976.2685107782,"9":811276.0283535199,"10":832102.962535012,"11":853470.8921348703,"12":875394.0033049942,"13":897886.8569687943,"14":920964.3987792543,"15":944641.9693427647,"16":968935.314715842,"17":993860.5971820434,"18":1019434.4063165777,"19":1045673.7703463235,"20":1072596.1678131619,"21":1100219.5395487524,"22":1128562.3009690945,"23":1157643.3546974414,"24":1187482.1035243631,"25":1218098.4637139961,"26":1249512.8786657497,"27":1281746.3329409994,"28":1314820.3666645496,"29":1129440.2710591746,"30":1159876.0442488997,"31":1191132.7737631381,"32":1223232.6193130619,"33":1256198.3390725283,"34":1290053.305846961,"35":1324821.5236791922,"36":1360527.6449040878,"37":1397196.987664077,"38":1434855.5538980563,"39":1473530.0478164514,"40":1513247.8948755914,"41":1554037.26126488,"42":1595927.0739206355,"43":1638947.041080832,"44":1683127.6733953597,"45":1728500.3056068327,"46":1775097.1188173518,"47":1822951.1633570748,"48":1872096.3822708561,"49":1922567.6354396662,"50":1974400.7243539453,"51":2027632.4175565289,"52":2082300.476773221,"53":2138443.6837496338},"tpd":{"0":769511.15,"1":788520.272354625,"2":808007.4593366368,"3":827984.9197068545,"4":848465.178008712,"5":869461.0828207106,"6":890985.8152263081,"7":913052.8975070057,"8":935676.202064558,"9":958869.9605783754,"10":982648.7734043646,"11":1007027.6192216099,"12":1032021.8649334686,"13":1057647.2758298381,"14":1083920.0260175189,"15":1110856.7091257947,"16":1138474.3492945326,"17":1166790.4124523078,"18":1195822.8178922476,"19":1225589.9501535066,"20":1256110.6712164886,"21":1287404.3330201455,"22":1319490.7903099156,"23":1352390.4138250791,"24":1386124.1038345536,"25":1420713.3040303902,"26":1456180.0157884716,"27":1492546.812806176,"28":1529836.8561270295,"29":1129440.2710591746,"30":1159876.0442488997,"31":1191132.7737631381,"32":1223232.6193130619,"33":1256198.3390725283,"34":1290053.305846961,"35":1324821.5236791922,"36":1360527.6449040878,"37":1397196.987664077,"38":1434855.5538980563,"39":1473530.0478164514,"40":1513247.8948755914,"41":1554037.26126488,"42":1595927.0739206355,"43":1638947.041080832,"44":1683127.6733953597,"45":1728500.3056068327,"46":1775097.1188173518,"47":1822951.1633570748,"48":1872096.3822708561,"49":1922567.6354396662,"50":1974400.7243539453,"51":2027632.4175565289,"52":2082300.476773221,"53":2138443.6837496338},"trauma":{"0":130498.5,"1":133964.66020375,"2":137523.3014161109,"3":141176.8996179732,"4":144927.9972513366,"5":148779.2050067572,"6":152733.2036589379,"7":156792.7459517587,"8":160960.6585340817,"9":165239.8439476989,"10":169633.2826688292,"11":174144.0352046084,"12":178775.244246055,"13":183530.1368790351,"14":188412.0268547904,"15":193424.3169216354,"16":198570.5012194732,"17":203854.1677388247,"18":209279.0008461108,"19":214848.7838769735,"20":220567.4017994731,"21":226438.8439490432,"22":232467.2068371417,"23":238656.697035584,"24":245011.6341385988,"25":251536.4538047063,"26":258235.7108805678,"27":265114.0826090202,"28":272176.3719235661,"29":279427.5108316507,"30":286872.5638891215,"31":294516.7317683291,"32":302365.354922398,"33":310423.9173482579,"34":318698.0504511031,"35":327193.5370130149,"36":335916.3152685568,"37":344872.483090229,"38":354068.3022867469,"39":363510.2030171852,"40":373204.7883241168,"41":383158.8387889543,"42":393379.3173127921,"43":403873.3740261375,"44":414648.3513310034,"45":425711.7890789406,"46":437071.4298886714,"47":448735.2246070958,"48":460711.337917537,"49":473008.1540992,"50":485634.2829419232,"51":498598.5658204146,"52":511910.0819322743,"53":525578.1547042262}}'
  // );

  // const expenseData = JSON.parse(
  //   `{"life":{"0":103875.0,"1":108791.25,"2":113962.9875,"3":119404.357125,"4":125130.31663875,"5":131156.6846659125,"6":137500.1912455699,"7":144178.5313849978,"8":151210.4217927322,"9":158615.6609806697,"10":166415.1929362946,"11":174631.1745781606,"12":183287.0472205092,"13":192407.6122864285,"14":202019.1115232836,"15":212149.3119893401,"16":222827.5960965997,"17":234085.0570119319,"18":245954.5997366701,"19":76935.0780787578,"20":79243.1304211206,"21":81620.4243337542,"22":84069.0370637668,"23":86591.1081756798,"24":89188.8414209502,"25":91864.5066635787,"26":94620.4418634861,"27":97459.0551193907,"28":100382.8267729724,"29":82715.4492609293,"30":85196.9127387571,"31":87752.8201209199,"32":90385.4047245475,"33":93096.9668662839,"34":95889.8758722724,"35":98766.5721484406,"36":101729.5693128938,"37":104781.4563922806,"38":107924.900084049,"39":111162.6470865705,"40":114497.5264991676,"41":117932.4522941427,"42":121470.4258629669,"43":125114.538638856,"44":128867.9747980216,"45":132734.0140419623,"46":136716.0344632212,"47":140817.5154971178,"48":145042.0409620313,"49":149393.3021908923,"50":153875.101256619,"51":158491.3542943176,"52":163246.0949231472,"53":168143.4777708416},"tpd":{"0":133875.0,"1":139691.25,"2":145789.9875,"3":152186.167125,"4":158895.58093875,"5":165934.9068949125,"6":173321.7601414399,"7":181074.7473477439,"8":189213.5242343607,"9":197758.856495547,"10":206732.6843166183,"11":216158.190699894,"12":226059.8738258946,"13":236463.6236899755,"14":247396.8032689369,"15":258888.334487363,"16":270968.7892695634,"17":283670.4859800845,"18":297027.5915738672,"19":129540.2596710709,"20":133426.467461203,"21":137429.2614850391,"22":141552.1393295903,"23":145798.703509478,"24":150172.6646147623,"25":154677.8445532052,"26":159318.1798898014,"27":164097.7252864954,"28":169020.6570450903,"29":153412.4144412107,"30":158014.786874447,"31":162755.2304806804,"32":167637.8873951008,"33":172667.0240169539,"34":177847.0347374625,"35":183182.4457795864,"36":188677.919152974,"37":194338.2567275632,"38":200168.4044293901,"39":206173.4565622718,"40":212358.66025914,"41":218729.4200669142,"42":225291.3026689216,"43":232050.0417489893,"44":239011.543001459,"45":246181.8892915027,"46":253567.3459702478,"47":261174.3663493553,"48":269009.5973398359,"49":277079.885260031,"50":285392.2818178319,"51":293954.050272367,"52":302772.6717805379,"53":311855.8519339541},"trauma":{"0":60000.0,"1":63600.0,"2":67416.0,"3":71460.96,"4":75748.6176,"5":80293.534656,"6":85111.14673536,"7":90217.8155394816,"8":95630.8844718505,"9":101368.7375401616,"10":107450.8617925713,"11":113897.9135001256,"12":120731.7883101331,"13":127975.6956087411,"14":135654.2373452656,"15":143793.4915859815,"16":152421.1010811404,"17":161566.3671460088,"18":171260.3491747694,"19":0.0,"20":0.0,"21":0.0,"22":0.0,"23":0.0,"24":0.0,"25":0.0,"26":0.0,"27":0.0,"28":0.0,"29":0.0,"30":0.0,"31":0.0,"32":0.0,"33":0.0,"34":0.0,"35":0.0,"36":0.0,"37":0.0,"38":0.0,"39":0.0,"40":0.0,"41":0.0,"42":0.0,"43":0.0,"44":0.0,"45":0.0,"46":0.0,"47":0.0,"48":0.0,"49":0.0,"50":0.0,"51":0.0,"52":0.0,"53":0.0}}`
  // );

  // const netRequirementsData = JSON.parse(
  //   '{"life":{"0":497239.7650000001,"1":510024.9245900876,"2":523000.5790203005,"3":536163.5120400399,"4":549509.9385709582,"5":563035.4608555579,"6":576735.0217217975,"7":590602.8547840541,"8":604632.4313898507,"9":618816.4041101353,"10":633146.5465585892,"11":647613.6893123806,"12":662207.6516929335,"13":676917.1691506024,"14":691729.8159815678,"15":706631.9230887671,"16":721608.4904811666,"17":736643.0941871227,"18":751717.7872378983,"19":966502.5614943223,"20":993578.3411312455,"21":1021349.026736498,"22":1049832.5902958605,"23":1079047.4711739379,"24":1109012.5883137542,"25":1139747.3527554593,"26":1171271.68048249,"27":1203606.0056037698,"28":1236771.2938807348,"29":1052287.3039780699,"30":1083037.0446611568,"31":1114607.9490064401,"32":1147021.9360473661,"33":1180301.509426869,"34":1214469.7729721577,"35":1249550.4466838269,"36":1285567.8831503135,"37":1322547.0843989763,"38":1360513.719195408,"39":1399494.1408028691,"40":1439515.4052140664,"41":1480605.2898678111,"42":1522792.3128634354,"43":1566105.7526861737,"44":1610575.668457072,"45":1656232.9207213575,"46":1703109.1927895437,"47":1751237.0126459529,"48":1800649.7754397073,"49":1851381.7665736517,"50":1903468.1854070593,"51":1956945.1695884326,"52":2011849.8200350814,"53":2068220.2265766715},"tpd":{"0":182089.765,"1":196601.9245900876,"2":211329.2190203005,"3":226268.62784004,"4":241416.5567769582,"5":256768.7935183779,"6":272320.460593355,"7":288065.965175188,"8":303998.9456132171,"9":320112.2144911112,"10":336397.697996521,"11":352846.3713738875,"12":369448.1902183315,"13":386192.017353849,"14":403065.5450234403,"15":420055.2121022749,"16":437146.1160274661,"17":454321.9191194456,"18":471564.7489502184,"19":688544.6595306793,"20":717842.6241308142,"21":747862.5786886172,"22":778622.5160783579,"23":810140.8813471614,"24":842436.5831417706,"25":875529.0054249036,"26":909438.0194885372,"27":944183.9962716488,"28":979787.8189901331,"29":556520.6422797603,"30":584937.383111898,"31":614105.2976107034,"32":644044.2051097571,"33":674774.4465611319,"34":706316.8982204485,"35":738692.9856895664,"36":771924.6983262253,"37":806034.6040301652,"38":841045.8644155329,"39":876982.2503795977,"40":913868.1580780967,"41":951728.6253177623,"42":990589.3483768853,"43":1030476.699265027,"44":1071417.7434332909,"45":1113440.2579468631,"46":1156572.7501318143,"47":1200844.4767084916,"48":1246285.4634241222,"49":1292926.5251975989,"50":1340799.2867897248,"51":1389936.2040125784,"52":1440370.5854919516,"53":1492136.6149972479},"trauma":{"0":-172184.65,"1":-172331.873775875,"2":-172614.968442278,"3":-173045.4664202295,"4":-173635.6823835298,"5":-174398.7626141671,"6":-175348.7373840643,"7":-176500.5765464952,"8":-177870.2485315457,"9":-179474.782951709,"10":-181332.3370361163,"11":-183462.2661250689,"12":-185885.1984704859,"13":-188623.1146026766,"14":-191699.4315395227,"15":-195139.0921307807,"16":-198968.659847834,"17":-203216.4193479026,"18":-207912.4831615245,"19":-13399.3377353292,"20":-7108.8580205796,"21":-650.2716560525,"22":5980.9275208559,"23":12789.3667391424,"24":19779.7975524587,"25":26957.099185177,"26":34326.2819686246,"27":41892.4908699223,"28":49661.0091159227,"29":57637.2619148158,"30":65826.8202780336,"31":74235.404945162,"32":82868.8904146378,"33":91733.3090830837,"34":100834.8554962134,"35":110179.8907143164,"36":119774.9467954125,"37":129626.731399252,"38":139742.1325154216,"39":150128.2233189037,"40":160792.2671565285,"41":171741.7226678497,"42":182984.2490440714,"43":194527.7114287512,"44":206380.1864641038,"45":218549.9679868347,"46":231045.5728775386,"47":243875.7470678054,"48":257049.4717092907,"49":270575.96950912,"50":284464.7112361156,"51":298725.4224024561,"52":313368.0901255017,"53":328402.9701746488}}'
  // );

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

  const calculateInsurance = (e) => {
    e?.preventDefault();
    performCalculations(
      philosophies,
      assumptions,
      clientData,
      setCalculatedData,
      setCalculating,
      setCalculated
    );
  };

  const [offsetsData, setOffsetsData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [netRequirementsData, setNetRequirementsData] = useState({});
  const [netRequirementsPerYearData, setNetRequirementsPerYearData] = useState(
    {}
  );
  const [initialLiabilities, setInitialLiabilities] = useState({});
  const [expensesSumNpv, setExpensesSumNpv] = useState({});
  const [offsetsSumNpv, setOffsetsSumNpv] = useState({});
  const [minimumRequirements, setMinimumRequirements] = useState({});
  const [totalRequirements, setTotalRequirements] = useState({});

  const [expensesByCategorySumNpv, setexpensesByCategorySumNpv] = useState({});
  const [assetsByCategorySumNpv, setassetsByCategorySumNpv] = useState({});
  const [incomesByCategorySumNpv, setincomesByCategorySumNpv] = useState({});
  const [liabilitiesByCategory, setLiabilitiesByCategory] = useState({});
  const [steppedVsLevelData, setSteppedVsLevelData] = useState({});
  useEffect(() => {
    // console.log("---- CALCULATED DATA AS OBJECTS STORED IN STATE ----");
    // console.log(calculatedData);
    // console.log(offsetsData);
    // console.log(expenseData);
    // console.log(netRequirementsData);
    // console.log(initialLiabilities);
    // console.log(expensesSumNpv);
    // console.log(offsetsSumNpv);
    // console.log(minimumRequirements);
    // console.log(totalRequirements);
    // console.log(expensesByCategorySumNpv);
    // console.log(assetsByCategorySumNpv);
    // console.log(incomesByCategorySumNpv);
  }, [calculatedData]);

  const setCurrentData = (data, target) => {
    if (data.error !== undefined) return;
    if (data === undefined) return;

    // Get initial liabilities:
    const initialLiabilities = JSON.parse(data[target]?.initialLiabilities);
    setInitialLiabilities(initialLiabilities);

    // Get offsets sum per year for all categories:
    const offsetsPerYearData = { ...data[target]?.offsetsSumPerYear };
    offsetsPerYearData["life"] = JSON.parse(offsetsPerYearData.life);
    offsetsPerYearData["tpd"] = JSON.parse(offsetsPerYearData.tpd);
    offsetsPerYearData["trauma"] = JSON.parse(offsetsPerYearData.trauma);
    setOffsetsData(offsetsPerYearData);

    // TODO: aggLiabilitiesByCategory:
    // - requires reshaping, use idx then delete it
    //"{"index":{"0":13.0,"1":15.0,"2":0.0,"3":16.0,"taxPaid":null},"life":{"0":false,"1":false,"2":500000,"3":100000,"taxPaid":0.0},"tpd":{"0":200000,"1":180000,"2":500000,"3":0,"taxPaid":171740.1943390235},"trauma":{"0":200000,"1":false,"2":150000.0,"3":0,"taxPaid":0.0},"ip":{"0":false,"1":false,"2":0,"3":0,"taxPaid":"0"},"name":{"0":"medicalExpenses","1":"changeHousingOrCar","2":"Male","3":"Male","taxPaid":"Estimated Tax on Insurance"},"type":{"0":"medicalExpenses","1":"changeHousingOrCar","2":"residentialMortgage","3":"lumpSumLegacy","taxPaid":"estimatedTaxOnInsurancePayout"}}"

    // Get expenses sum per year for all categories:
    const expensesPerYearData = JSON.parse(data[target]?.expensesPerYear);
    delete expensesPerYearData["ip"];
    setExpenseData(expensesPerYearData);

    // Get net requirements total per year for everything:
    // TODO: fix backend so this is working:
    //setNetRequirementsData(JSON.parse(data[target].netPerYear));

    // TODO: this is wrong:
    // Expenses + Lump Sum - Offsets:
    // const netRequirementsPerYearData = transformAggLiabilities(
    //   data[target]?.netPerYear
    // );

    const netRequirementsPerYearData = calculateNetRequirements({
      expenses: expensesPerYearData,
      offsets: offsetsPerYearData,
      initialLiabilities: initialLiabilities,
    });
    setNetRequirementsPerYearData(netRequirementsPerYearData);

    // console.log("--- NET REQUIREMENTS FROM BACKEND ---");
    // console.log(data[target]?.netPerYear);
    const netRequirementsNowData = extractNetRequirements(
      JSON.parse(data[target]?.netPerYear)
    );
    setNetRequirementsData(netRequirementsNowData);
    // console.log("--- PARSED NET REQUIREMENTS NOW ---");
    // console.log(netRequirementsNowData);

    // GET  const [expensesSumNpv, setExpensesSumNpv] = useState(0);
    const expensesSumNpvPerYear = JSON.parse(
      data[target]?.expensesSumNpvPerYear
    );
    setExpensesSumNpv({
      life: expensesSumNpvPerYear["life"]["0"],
      tpd: expensesSumNpvPerYear["tpd"]["0"],
      trauma: expensesSumNpvPerYear["trauma"]["0"],
    });

    // GET  const [offsetsSumNpv, setOffsetsSumNpv] = useState(0);
    // - Offsets is NPV of Assets + NPV of Incomes:
    const assetsSumNpvPerYear = sumCategories(
      data[target]?.assetsByCategorySumNpv
    );
    const incomesSumNpvPerYear = sumCategories(
      data[target]?.incomesByCategorySumNpv
    );

    const lifeOffsetsSumNpv =
      assetsSumNpvPerYear["life"] + incomesSumNpvPerYear["life"];
    const tpdOffsetsSumNpv =
      assetsSumNpvPerYear["tpd"] + incomesSumNpvPerYear["tpd"];
    const traumaOffsetsSumNpv =
      assetsSumNpvPerYear["trauma"] + incomesSumNpvPerYear["trauma"];

    setOffsetsSumNpv({
      life: lifeOffsetsSumNpv,
      tpd: tpdOffsetsSumNpv,
      trauma: traumaOffsetsSumNpv,
    });

    // GET  const [minimumRequirements, setMinimumRequirements] = useState(0);
    // - minimumCoverageAssumption * NPV of sum of expenses +
    //   minimumCoverageAssumption * Sum of agg liabilities
    console.log("--- MIN REQUIREMENTS FROM BACKEND ---");
    console.log(data[target]?.minimumCoverageRequirements);
    console.log("--- PARSED MIN REQUIREMENTS ---");
    const mr = JSON.parse(data[target]?.minimumCoverageRequirements);
    console.log(mr);
    const reshapedMr = {};
    for (let [k, v] of Object.entries(mr)) {
      console.log(k);
      console.log(v);
      console.log(Object.values(v));
      console.log(typeof v);
      console.log(Object.values(v)[0]);
      console.log(reshapedMr[k]);
      console.log(reshapedMr);
      reshapedMr[k] = Object.values(v)[0];
    }
    // const minRequirements = extractMinimumRequirements(mr);
    console.log("--- EXTRACTED MIN REQUIREMENTS---");
    console.log(reshapedMr);
    setMinimumRequirements(reshapedMr);

    // GET  const [totalRequirements, setTotalRequirements] = useState(0);
    // - expenses + liabilities - offsets
    const totalRequirementsLife =
      expensesSumNpvPerYear["life"]["0"] +
      initialLiabilities["life"] -
      lifeOffsetsSumNpv;
    const totalRequirementsTpd =
      expensesSumNpvPerYear["tpd"]["0"] +
      initialLiabilities["tpd"] -
      tpdOffsetsSumNpv;
    const totalRequirementsTrauma =
      expensesSumNpvPerYear["trauma"]["0"] +
      initialLiabilities["trauma"] -
      traumaOffsetsSumNpv;

    // console.log("--------- OFFSETS SUMS NPVS -------");
    // console.log(lifeOffsetsSumNpv); // => 3100478.468899521
    // console.log(tpdOffsetsSumNpv);
    // console.log(traumaOffsetsSumNpv);

    // console.log("----- EXPENSES and LIABILITIES -----");
    // console.log(expensesSumNpvPerYear["life"]["0"]); // => 804805.573189495
    // console.log(initialLiabilities["life"]); // => 600000

    // console.log("--- TOTAL REQUIREMENTS ---");
    // console.log(totalRequirementsLife); // => 804805.573189495 + 600000 - 3100478.468899521
    // console.log(totalRequirementsTrauma);
    // console.log(totalRequirementsTpd);

    setTotalRequirements({
      life: totalRequirementsLife,
      tpd: totalRequirementsTpd,
      trauma: totalRequirementsTrauma,
    });

    // assetsByCategorySumNpv
    // console.log("--- ASSETS BY CATEGORY SUM NPV ---");
    // console.log(data[target]?.assetsByCategorySumNpv);
    const assetsByCategorySumNpv = data[target]?.assetsByCategorySumNpv;
    const transformedAssets = transformsByCategorySumNpv(
      assetsByCategorySumNpv,
      "offsets"
    );
    setassetsByCategorySumNpv(transformedAssets);
    // expensesByCategorySumNpv
    // console.log("--- EXPENSES BY CATEGORY SUM NPV ---");
    // console.log(data[target]?.expensesByCategorySumNpv);
    const expensesByCategorySumNpv = data[target]?.expensesByCategorySumNpv;
    const transformedExpenses = transformsByCategorySumNpv(
      expensesByCategorySumNpv
    );
    setexpensesByCategorySumNpv(transformedExpenses);

    // incomesByCategorySumNpv
    // console.log("--- INCOMES BY CATEGORY SUM NPV ---");
    // console.log(data[target]?.incomesByCategorySumNpv);
    const incomesByCategorySumNpv = data[target]?.incomesByCategorySumNpv;
    const transformedIncomes = incomesByCategorySumNpv;
    setincomesByCategorySumNpv(transformedIncomes);

    // aggLiabilitiesByCategory:
    // console.log("--- Liabilities BY CATEGORY SUM NPV ---");
    const aggLiabilitiesByCategory = transformAggLiabilities(
      data[target]?.aggLiabilitiesByCategory
    );

    setLiabilitiesByCategory(aggLiabilitiesByCategory);

    setSteppedVsLevelData(data[target]?.steppedVsLevel);
    // TODO:
    // expensesSumNpvPerYear
    // liabilitiesPerYear
    // netAmountRequiredAfterTax
    // taxPaid

    /* ALL KEYS
      assetsByCategorySumNpv: 
      expensesByCategorySumNpv: 
      expensesPerYear: 
      expensesSumNpvPerYear: 
      incomeRequirementsPerYear: TODO: GET rid of this on the backend...
      initialLiabilities:
      liabilitiesPerYear: 
      minimumCoverageRequirements: 
      netAmountRequiredAfterTax: 
      netPerYear: 
      offsetsSumPerYear: 
      taxPaid: 
    */
  };

  useEffect(() => {
    // console.log(calculatedData);
    if (calculatedData !== undefined) {
      setCurrentData(calculatedData, "primary");
    }
  }, [calculatedData]);

  useEffect(() => {
    if (
      activeClient?.activeMember === primaryName &&
      calculatedData !== undefined
    ) {
      setCurrentData(calculatedData, "primary");
    } else if (
      activeClient?.activeMember === partnerName &&
      calculatedData !== undefined
    ) {
      setCurrentData(calculatedData, "partner");
    }
  }, [activeClient?.activeMember]);

  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <ActiveClientRequired
        activeClient={activeClient}
        feature={"Insurance Calculator"}
      />
      <Card>
        <CalculatingButton
          computedData={calculatedData !== undefined}
          calculating={calculating}
          calculated={calculated}
          topic={"Insurance"}
          boundOnClickFunction={performCalculations.bind(
            null,
            philosophies,
            assumptions,
            portfolios,
            clientData,
            setCalculatedData,
            setCalculating,
            setCalculated,
            "full"
          )}
        />
        <div>
          <TotalRequirementsSummary
            shapedData={shapeTotalRequirementsSummary(
              expensesSumNpv,
              initialLiabilities,
              offsetsSumNpv,
              netRequirementsData,
              minimumRequirements
            )}
          />
        </div>
        <br />

        {calculatedData !== undefined && (
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            style={{ minWidth: "1650px" }}
          >
            <TabPanel header="Summary">
              <SummaryTable />
            </TabPanel>
            <TabPanel header="Life Insurance">
              <NeedsGraph
                type="Life Insurance Needs"
                incomeRequirements={expensesByCategorySumNpv?.life}
                offsets={{
                  ...assetsByCategorySumNpv?.life,
                  ...incomesByCategorySumNpv?.life,
                }}
                lumpSumRequirements={liabilitiesByCategory?.life}
                netPerYear={netRequirementsData?.life}
                // incomeRequirements={incomeData}
                // lumpSumRequirements={lumpSumdata}
                // offsets={pieData}
              />
            </TabPanel>
            <TabPanel header="TPD">
              <NeedsGraph
                type="Total Permanent Disability Needs"
                // incomeRequirements={incomeData_tpd}
                // lumpSumRequirements={lumpSumdata}
                // offsets={pieData_tpd}
                incomeRequirements={expensesByCategorySumNpv?.tpd}
                offsets={{
                  ...assetsByCategorySumNpv?.tpd,
                  ...incomesByCategorySumNpv?.tpd,
                }}
                lumpSumRequirements={liabilitiesByCategory?.tpd}
                netPerYear={netRequirementsData?.tpd}
                netPerYear={netRequirementsData?.tpd}
              />
            </TabPanel>
            <TabPanel header="Trauma">
              <NeedsGraph
                type="Trauma"
                // incomeRequirements={incomeData}
                // lumpSumRequirements={lumpSumdata}
                // offsets={pieData}
                incomeRequirements={expensesByCategorySumNpv?.trauma}
                offsets={{
                  ...assetsByCategorySumNpv?.trauma,
                  ...incomesByCategorySumNpv?.trauma,
                }}
                lumpSumRequirements={liabilitiesByCategory?.trauma}
                netPerYear={netRequirementsData?.trauma}
              />
            </TabPanel>
            <TabPanel header="Income Protection">
              {buildIpGraph(clientData, assumptions)}
            </TabPanel>
            <TabPanel header="Coverage">
              <div style={{ marginLeft: "2rem", zIndex: 3000 }}>
                {/* <h2>Life Coverage</h2> */}
                <TotalCoverageGraph
                  expenseData={expenseData?.life || {}}
                  lumpSumData={initialLiabilities?.life || 0}
                  offsetData={offsetsData?.life || {}}
                  netNeedsData={netRequirementsPerYearData?.life || {}}
                  yearsUntilMortality={
                    Object.keys(expenseData?.life || {}).length
                  }
                  title={"Life Coverage"}
                />
                <br />
                <br />
                {/* <h2>TPD Coverage</h2> */}
                <TotalCoverageGraph
                  expenseData={expenseData?.tpd || {}}
                  lumpSumData={initialLiabilities?.tpd || 0}
                  offsetData={offsetsData?.tpd || {}}
                  netNeedsData={netRequirementsPerYearData?.tpd || {}}
                  yearsUntilMortality={
                    Object.keys(expenseData?.tpd || {}).length
                  }
                  title={"TPD Coverage"}
                />
                <br />
                <br />
                <TotalCoverageGraph
                  expenseData={expenseData?.trauma || {}}
                  lumpSumData={initialLiabilities?.trauma || 0}
                  offsetData={offsetsData?.trauma || {}}
                  netNeedsData={netRequirementsPerYearData?.trauma || {}}
                  yearsUntilMortality={
                    Object.keys(expenseData?.trauma || {}).length
                  }
                  title={"Trauma Coverage"}
                />
              </div>
            </TabPanel>
            <TabPanel header="Total Requirements">
              {/* USAGE: 
                buildRequirementsGraph(title, incomeRequirementsNpv, liabilities, offsetsNpv, totalRequirement,
              minimumRequirement) */}
              {buildRequirementsGraph(
                "Life",
                expensesSumNpv?.life || 0,
                initialLiabilities?.life || 0,
                offsetsSumNpv?.life || 0,
                totalRequirements?.life || 0,
                minimumRequirements?.life || 0
              )}
              <br />
              <br />
              {buildRequirementsGraph(
                "TPD",
                expensesSumNpv?.tpd || 0,
                initialLiabilities?.tpd || 0,
                offsetsSumNpv?.tpd || 0,
                totalRequirements?.tpd || 0,
                minimumRequirements?.tpd || 0
              )}
              <br />
              <br />
              {buildRequirementsGraph(
                "Trauma",
                expensesSumNpv?.trauma || {},
                initialLiabilities?.trauma || 0,
                offsetsSumNpv?.trauma || {},
                totalRequirements?.trauma || 0,
                minimumRequirements?.trauma || 0
              )}
            </TabPanel>
            <TabPanel header="Level vs. Stepped">
              <LevelVsStepped steppedVsLevelData={steppedVsLevelData} />
            </TabPanel>
          </TabView>
        )}
      </Card>
    </div>
  );
};

export default InsuranceCalc;
