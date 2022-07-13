import InputsCashflow from "./inputs-cashflow";
import InputsInvestment from "./inputs-investment";
import InputsContingency from "./inputs-contingency";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { useState } from "react";
import { tagRender } from "../../../ff/user-info-form/controlled-input";
import { Select } from "antd";

const combinationOptions = [
  { key: "cf", label: "Cash Flow", value: "cf" },
  { key: "cn", label: "Contingency Planning & Insurance", value: "cn" },
  { key: "in", label: "Investment", value: "in" },
];

const _maxWidth = "50rem";

const mapKeyToType = new Map([
  ["cf", "Cash Flow"],
  ["cn", "Contingency"],
  ["in", "Investment"],
]);

const BenchmarkingClientSpecificInputs = ({ setActiveCombination }) => {
  // { cashFlow, investment, contingency }:
  const benchmarking = useSelector((state) => state?.factFind?.benchmarking);
  const hasPartner = useSelector((state) => state.factFind.hasPartner);
  const [validInputs, setValidInputs] = useState({
    cashFlow: false,
    contingency: false,
    investment: false,
  });

  const handleSetValidInputs = (property, bool) => {
    setValidInputs((prevState) => ({ ...prevState, [property]: bool }));
  };

  const [benchmarkCombination, setBenchmarkCombination] = useState([
    "cf",
    "cn",
    "in",
  ]);

  const handleChange = (value) => {
    setBenchmarkCombination(value);
    setActiveCombination(value);
  };

  const validCf = !benchmarkCombination.includes("cf") || validInputs.cashFlow;
  const validCn =
    !benchmarkCombination.includes("cn") || validInputs.contingency;
  const validIn =
    !benchmarkCombination.includes("in") || validInputs.investment;
  const _validInputs = validCf && validCn && validIn;

  return (
    <>
      <Accordion
        expandIcon={"pi pi-cog"}
        collapseIcon={"pi pi-times"}
        // activeIndex={activeIndex}
        // onTabChange={(e) => setActiveIndex(e.index)}
      >
        <AccordionTab
          key={6969}
          headerStyle={{ borderColor: _validInputs ? "green" : "red" }}
          header={
            <span>
              Configure Client Benchmark&nbsp;&nbsp; (
              {benchmarkCombination
                .map((sym) => mapKeyToType.get(sym))
                .join(" / ")}
              )
            </span>
          }
        >
          <div>
            Select Combination of Applicable Benchmarks:
            <br />
            <Select
              onChange={handleChange}
              value={benchmarkCombination}
              mode="multiple"
              showArrow
              tagRender={tagRender}
              placeholder="None"
              style={{
                width: "35rem",
                minWidth: "10rem",
                // padding: "1rem",
                // paddingTop: "1rem",
                // paddingBottom: "1rem",
                marginTop: ".25rem",
                marginBottom: "1.2rem",
              }}
              options={combinationOptions}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "space-around",
              justifyContent: "space-around",
              alignContent: "space-around",
              justifyItems: "space-around",
            }}
          >
            {(benchmarkCombination.includes("cf") ||
              benchmarkCombination.includes("in")) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "2.5rem",
                  alignItems: "space-around",
                  justifyContent: "space-around",
                  alignContent: "space-around",
                  justifyItems: "space-around",
                }}
              >
                {benchmarkCombination.includes("cf") && (
                  <Card>
                    <InputsCashflow
                      hasPartner={hasPartner}
                      maxWidth={_maxWidth}
                      handleSetValidInputs={handleSetValidInputs.bind(
                        null,
                        "cashFlow"
                      )}
                    />
                  </Card>
                )}
                {benchmarkCombination.includes("in") && (
                  <div>
                    <Card>
                      <InputsInvestment
                        hasPartner={hasPartner}
                        maxWidth={_maxWidth}
                        handleSetValidInputs={handleSetValidInputs.bind(
                          null,
                          "investment"
                        )}
                      />
                    </Card>
                  </div>
                )}
              </div>
            )}
            {benchmarkCombination.includes("cn") && (
              <Card>
                <InputsContingency
                  hasPartner={hasPartner}
                  maxWidth={_maxWidth}
                  handleSetValidInputs={handleSetValidInputs.bind(
                    null,
                    "contingency"
                  )}
                />
              </Card>
            )}
          </div>
        </AccordionTab>
      </Accordion>
    </>
  );
};

export default BenchmarkingClientSpecificInputs;
