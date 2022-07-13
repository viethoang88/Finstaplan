import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../../../store/auth";
import BenchmarkingClientSpecificInputs from "./benchmarking-configure/benchmarking-client-specific-inputs";
import BenchmarkingResults from "./benchmarking-results/benchmarking-results";
import { Card, Divider } from "antd";
import { Button } from "semantic-ui-react";

const downloadScopingDocument = async (clientData) => {
  if (clientData === undefined) return;
  const url = `/api/documents/scoping-document`;
  const data = {
    client: clientData,
  };

  const res = await fetch(url, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  console.log(res);
  console.log(res.json());

  // .then((res) => res.json()) // parses JSON response into native JavaScript objects)
  // .then((data) => {
  //   console.log(data.body);
  //   window.URL.createObjectURL(
  //     new Blob([data.body], {
  //       type: "vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     })
  //   );
  // console.log(data);
  // data.body.blob();
  // })
  // .then((blob) => {
  //   window.URL.createObjectURL(new Blob([data], {type: ""}))
  // })
  // .then((href) => {
  //   const a = document.createElement("a");
  //   a.style = "display: none";
  //   a.href = href;
  //   a.download = "scoping_document.docx";
  //   document.body.appendChild(a);

  //   a.click();
  // })
};

const validBenchmarkInputs = (benchmarkInputs) => {
  return benchmarkInputs.filter((bm) => bm.checked);
};

const canBenchmark = (benchmarkCombination, benchmarkingProfile) => {
  const { cashFlow, contingency, investment } = benchmarkingProfile;
};

const performCalculations = (
  philosophies,
  assumptions,
  clientData,
  benchmarkingProfile,
  setter
) => {
  if (
    philosophies === undefined ||
    assumptions === undefined ||
    clientData === undefined ||
    benchmarkingProfile === undefined
  )
    return;
  //const url = `${process.env.ROOT_URL}/api/calculations/insurance`;
  const url = `/api/calculations/benchmarking`;
  const data = {
    philosophies,
    assumptions,
    client: clientData,
    benchmarkingProfile: JSON.stringify(benchmarkingProfile),
  };

  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((res) => res.json()) // parses JSON response into native JavaScript objects)
    .then((data) => setter(data))
    .catch((err) => console.error(err));
};

const BenchmarkCalc = () => {
  const dispatch = useDispatch();
  const activeClient = useSelector((state) => state.auth.activeClient);
  const [activeCombination, setActiveCombination] = useState([]);
  const benchmarkingProfile = useSelector(
    (state) => state.auth.benchmarkingProfile
  );
  const benchmarkingWeightings = useSelector(
    (state) => state.auth.benchmarkingWeightings
  );

  const philosophies = useSelector((state) => state.auth.philosophies);
  const assumptions = useSelector((state) => state.auth.assumptions);
  const clientData = useSelector((state) => state.factFind);
  const [calculatedData, setCalculatedData] = useState(undefined);
  const [weightedScores, setWeightedScores] = useState({
    cashFlow: 0,
    investment: 0,
    contingency: 0,
  });
  useEffect(() => {
    if (
      calculatedData === undefined ||
      Object.keys(calculatedData).length === 0
    )
      return;
    console.log(calculatedData);
    const [_cf, _cn, _in] = calculatedData;
    const _cfWeightedSum = Object.entries(_cf).reduce((acc, [idx, next]) => {
      return (
        acc + (Number.isFinite(next?.weightedScore) ? next.weightedScore : 0)
      );
    }, 0);
    const _cnWeightedSum = Object.entries(_cn).reduce((acc, [idx, next]) => {
      return (
        acc + (Number.isFinite(next?.weightedScore) ? next.weightedScore : 0)
      );
    }, 0);
    const _inWeightedSum = Object.entries(_in).reduce((acc, [idx, next]) => {
      return (
        acc + (Number.isFinite(next?.weightedScore) ? next.weightedScore : 0)
      );
    }, 0);
    const weightedSums = {
      cashFlow: _cfWeightedSum,
      investment: _inWeightedSum,
      contingency: _cnWeightedSum,
    };
    console.log("------ WEIGHTED SUMS-----");
    console.log(calculatedData);
    console.log(weightedSums);
    setWeightedScores(weightedSums);
  }, [calculatedData]);

  useEffect(() => {
    if (benchmarkingProfile === undefined) return;
    performCalculations(
      philosophies,
      assumptions,
      clientData,
      benchmarkingProfile,
      setCalculatedData
    );
  }, [benchmarkingProfile]);

  useEffect(() => {
    // downloadScopingDocument(clientData);

    if (
      assumptions === undefined ||
      philosophies === undefined ||
      assumptions?.length === 0 ||
      Object.keys(philosophies)?.length === 0 ||
      benchmarkingProfile === undefined
    ) {
      dispatch(fetchData());
    } else {
      performCalculations(
        philosophies,
        assumptions,
        clientData,
        benchmarkingProfile,
        setCalculatedData
      );
    }
  }, []);

  // useEffect(() => {
  //   performCalculations(
  //     philosophies,
  //     assumptions,
  //     clientData,
  //     benchmarkingProfile,
  //     setCalculatedData
  //   );
  // }, [benchmarkingProfile]);

  return (
    <div>
      <Card>
        {/* <button onClick={() => downloadScopingDocument(clientData)}>
          TEEEEEEEEEST
        </button> */}

        <BenchmarkingClientSpecificInputs
          setActiveCombination={setActiveCombination}
        />
        <Button
          style={{ width: "100%" }}
          content="Calculate Benchmarks"
          icon="calculator"
          labelPosition="left"
          disabled
        />
        <br />
        <Divider />
        <br />
        <BenchmarkingResults
          weightedScores={weightedScores}
          calculatedData={calculatedData}
          benchmarkingWeightings={benchmarkingWeightings}
          benchmarkingProfile={benchmarkingProfile}
        />
      </Card>
    </div>
  );
};

export default BenchmarkCalc;
// ReadOutlined, DollarOutlined, SafetyOutlined, FundOutlined;
