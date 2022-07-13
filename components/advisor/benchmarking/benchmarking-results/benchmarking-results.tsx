import { useState } from "react";
import BenchmarkSummary from "./benchmark-summary";
import { Card, Tabs } from "antd";
import { useSelector } from "react-redux";
const { TabPane } = Tabs;
import {
  ProfileOutlined,
  UserOutlined,
  ReadOutlined,
  DollarOutlined,
  SafetyOutlined,
  FundOutlined,
} from "@ant-design/icons";
import BenchmarkResults from "./benchmark-results";
import { useEffect } from "react";

const BenchmarkingResults = ({
  weightedScores,
  calculatedData,
  benchmarkingProfile,
  benchmarkingWeightings,
}) => {
  // cashFlow, investment, contingency:
  const benchmarkSettings = useSelector(
    (state) => state?.factFind?.benchmarking
  );
  const [activeTab, setActiveTab] = useState("0");

  if (benchmarkSettings === undefined) return <></>;
  if (benchmarkingProfile === undefined || calculatedData === undefined)
    return <></>;

  console.log("----- RESULTS DATA-----");
  console.log(calculatedData);
  console.log(benchmarkingProfile);
  console.log(benchmarkingWeightings);
  const [cashFlowResults, contingencyResults, investmentResults] =
    calculatedData;
  const { cashFlow, contingency, investment } = benchmarkingProfile;

  return (
    <Tabs defaultActiveKey="0" activeKey={activeTab} onChange={setActiveTab}>
      <TabPane
        tab={
          <span>
            <ReadOutlined />
            High Level Summary
          </span>
        }
        key="0"
      >
        {/* <BenchmarkSummary /> */}
      </TabPane>
      <TabPane
        tab={
          <span>
            <DollarOutlined />
            Cash Flow
          </span>
        }
        key="1"
      >
        <BenchmarkResults
          resultsData={cashFlowResults}
          profileData={cashFlow}
          benchmarkSettings={benchmarkSettings.cashFlow}
          type={"Cash Flow Benchmarks"}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <FundOutlined />
            Investments
          </span>
        }
        key="2"
      >
        <BenchmarkResults
          resultsData={investmentResults}
          profileData={investment}
          benchmarkSettings={benchmarkSettings.investment}
          type={"Investment Benchmarks"}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <SafetyOutlined />
            Contingency
          </span>
        }
        key="3"
      >
        <BenchmarkResults
          resultsData={contingencyResults}
          profileData={contingency}
          benchmarkSettings={benchmarkSettings.contingency}
          type={"Contingency Benchmarks"}
        />
      </TabPane>
    </Tabs>
  );
};

export default BenchmarkingResults;
