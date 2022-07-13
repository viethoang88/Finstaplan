import { Card } from "primereact/card";
import { Divider, Select } from "antd";
const { Option } = Select;
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { Slider } from "primereact/slider";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useMemo } from "react";
import { Button } from "semantic-ui-react";

const inputWidth = "14rem";
const dividerStyle = {
  margin: "10px",
  position: "relative",
  left: "-15px",
};
const leversStyle = {
  backgroundColor: "rgb(249,249,249)",
  textAlign: "center",
  padding: "1.5rem",
  fontWeight: "bold",
  fontSize: "1.7rem",
  minHeight: "4rem",
};
const sectionHeaderStyle = {
  fontWeight: "bold",
  marginBottom: ".25rem",
};

const currencyConfig = { mode: "currency", currency: "USD", locale: "en-US" };

const Levers = ({
  portfolios,
  enoughAge,
  setEnoughAge,
  monthlyExpenses,
  setMonthlyExpenses,
  monthlyContributions,
  setMonthlyContributions,
  selectedPre,
  setSelectedPre,
  selectedRetirement,
  setSelectedRetirement,
  residentialProperty,
  setResidentialProperty,
  rent,
  setRent,
  handleRecomputeGraph,
  maxNumYears,
  initConfig,
  isRenter,
  isHomeOwner,
}) => {
  const options = useMemo(
    () =>
      portfolios?.map((pf) => ({
        label: pf.portfolioName,
        value: pf.portfolioName,
      })),
    [portfolios]
  );

  const { maxRp, minRp, maxRent, minRent, meMax } = initConfig;

  const showRental = isRenter || (isHomeOwner && residentialProperty === 0);
  const showHome = isHomeOwner || (isRenter && rent === 0);

  // (initConfig.startingRent !== undefined &&
  //   !Number.isNaN(Number(initConfig.startingRent)) &&
  //   !(rent === 0)) ||
  // (residentialProperty === 0 && initConfig.startingRent === 0) ||
  // !Number.isNaN(Number(residentialProperty));

  return (
    <Card
      header={<div style={leversStyle}>Levers</div>}
      style={{
        display: "flex",
        flexDirection: "column",
        // maxHeight: "46.5rem",
      }}
    >
      <div style={{ position: "relative", top: "-3.5rem" }}>
        <Divider style={dividerStyle} />
        <div>
          <div style={sectionHeaderStyle}>Enough years</div>
          <InputNumber
            value={enoughAge}
            onChange={(e) => setEnoughAge(e.value)}
            style={{ maxWidth: inputWidth, minWidth: inputWidth }}
            min={0}
            max={maxNumYears}
          />
          <Slider
            value={enoughAge}
            onChange={(e) => setEnoughAge(e.value)}
            style={{ maxWidth: inputWidth, minWidth: inputWidth }}
            step={1}
            min={0}
            max={maxNumYears}
          />
        </div>
        {showHome && (
          <>
            <Divider style={dividerStyle} />
            <div>
              <div style={sectionHeaderStyle}>Up/Downscale Home</div>
              <InputNumber
                value={residentialProperty || 0}
                onChange={(e) => setResidentialProperty(e.value)}
                style={{ maxWidth: inputWidth, minWidth: inputWidth }}
                min={minRp}
                max={maxRp}
                {...currencyConfig}
              />
              <Slider
                value={residentialProperty || 0}
                onChange={(e) => setResidentialProperty(e.value)}
                style={{ maxWidth: inputWidth, minWidth: inputWidth }}
                step={1000}
                min={minRp}
                max={maxRp}
              />
            </div>
          </>
        )}
        {showRental && (
          <>
            <Divider style={dividerStyle} />
            <div>
              <div style={sectionHeaderStyle}>Up/Downscale Rent</div>
              <InputNumber
                value={rent || 0}
                onChange={(e) => setRent(e.value)}
                style={{ maxWidth: inputWidth, minWidth: inputWidth }}
                min={minRent}
                max={maxRent}
                {...currencyConfig}
              />
              <Slider
                value={rent || 0}
                onChange={(e) => setRent(e.value)}
                style={{ maxWidth: inputWidth, minWidth: inputWidth }}
                step={250}
                min={minRent}
                max={maxRent}
              />
            </div>
          </>
        )}
        <Divider style={dividerStyle} />
        <div>
          <div style={sectionHeaderStyle}>Monthly Portfolio Contribution</div>
          <InputNumber
            value={monthlyContributions}
            onChange={(e) => setMonthlyContributions(e.value)}
            style={{ maxWidth: inputWidth, minWidth: inputWidth }}
            min={0}
            max={10000}
            {...currencyConfig}
          />
          <Slider
            value={monthlyContributions}
            onChange={(e) => setMonthlyContributions(e.value)}
            step={250}
            min={0}
            max={10000}
            style={{ maxWidth: inputWidth, minWidth: inputWidth }}
          />
        </div>
        <Divider style={dividerStyle} />
        <div>
          <div style={sectionHeaderStyle}>Reduce Monthly Expenses</div>
          <InputNumber
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.value)}
            min={0}
            max={meMax}
            style={{ maxWidth: inputWidth, minWidth: inputWidth }}
            {...currencyConfig}
          />
          <Slider
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.value)}
            step={100}
            min={0}
            max={meMax}
            style={{ maxWidth: inputWidth, minWidth: inputWidth }}
          />
        </div>
        <Divider style={dividerStyle} />
        <div style={sectionHeaderStyle}>Pre-retirement Portfolio</div>
        <Dropdown
          value={selectedPre}
          options={options}
          onChange={(e) => setSelectedPre(e.value)}
          style={{ maxWidth: inputWidth, minWidth: inputWidth }}
        />
        {/* <Select value={selectedPre} onChange={(value) => setSelectedPre(value)}>
        {portfolios.map((pf) => (
          <Option value={pf.portfolioName}>{pf.portfolioName}</Option>
        ))}
      </Select> */}
        <Divider style={dividerStyle} />
        <div style={sectionHeaderStyle}>Post-retirement Portfolio</div>
        <Dropdown
          value={selectedRetirement}
          options={options}
          onChange={(e) => setSelectedRetirement(e.value)}
          style={{ maxWidth: inputWidth, minWidth: inputWidth }}
        />
        {/* <Select
        value={selectedRetirement}
        onChange={(value) => setSelectedRetirement(value)}
      >
        {portfolios.map((pf) => (
          <Option value={pf.portfolioName}>{pf.portfolioName}</Option>
        ))}
      </Select> */}
        <Divider style={dividerStyle} />
        <Button
          content="Calculate"
          labelPosition="right"
          icon="calculator"
          onClick={() => handleRecomputeGraph()}
          basic
          color="green"
          // positive
          style={{
            width: "100%",
            marginTop: "0.25rem",
            marginLeft: "0.2rem",
            // marginBottom: "0.2rem",
          }}
        />
        {/* <div
          style={{ ...leversStyle, marginTop: "1.5rem", width: "100%" }}
        ></div> */}
      </div>
    </Card>
  );
};

export default Levers;
