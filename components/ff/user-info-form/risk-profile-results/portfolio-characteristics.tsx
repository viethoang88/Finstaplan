import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchData } from "../../../../store/auth";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "primereact/row";
import SectionHeader from "./section-header";

/* USAGE */
const getCols = (portfolios) => {
  return [
    {
      field: "label",
      header: "",
      type: "uneditable",
    },
  ].concat(
    portfolios
      .map((pf) => pf.portfolioName)
      .map((pfName) => ({
        field: pfName,
        header: pfName,
        type: "uneditable",
      }))
  );
};

// const cols = [{ field: "label", header: ""}, {}];

const data = [
  {
    id: "1000",
    label: "Recommended Time Frame",
    Cash: "0-1 Year",
    Conservative: "1-2.5 Years",
    "Mod Conservative": "2.5-4 Years",
    "Mod Growth": "4-5.5 Years",
    Growth: "5.5-7 Years",
    "High Growth": "7 Years+",
  },
  {
    id: "1000",
    label: "Growth Assets",
    Cash: "0%",
    Conservative: "35%",
    "Mod Conservative": "52%",
    "Mod Growth": "70%",
    Growth: "85%",
    "High Growth": "100%",
  },
  {
    id: "1000",
    label: "Probability of Negative Returns in 1 Year",
    Cash: "0%",
    Conservative: "6.7%",
    "Mod Conservative": "13%",
    "Mod Growth": "17%",
    Growth: "19.6%",
    "High Growth": "22.2%",
  },
  {
    id: "1000",
    label: "Expected Growth Rate",
    Cash: "0.8%",
    Conservative: "3.75%",
    "Mod Conservative": "4.75%",
    "Mod Growth": "5.75%",
    Growth: "6.75%",
    "High Growth": "7.75%",
  },
];

const pfcCols = [
  ["Recommended Time Frame", "investmentTerm"],
  ["Growth Assets", ""],
  ["Probability of Negative Returns in 1 Year", "probabilityNegativeReturn"],
  ["Expected Growth Rate Over the Next 10 Years", "expectedGrowth"],
];
const reshapeDataForTable = (growthVsDefensive, portfolios) => {
  return pfcCols.map(([label, property], idx) => {
    if (label === "Growth Assets") {
      const data = portfolios.reduce((acc, next) => {
        return {
          ...acc,
          [next.portfolioName]: `${String(
            growthVsDefensive[1][next.portfolioName]
          )}%`,
        };
      }, {});

      return {
        id: idx,
        label: label,
        ...data,
      };
    } else if (label === "Recommended Time Frame") {
      const data = portfolios.reduce((acc, next) => {
        return {
          ...acc,
          [next.portfolioName]: `${String(next[property])} Years`,
        };
      }, {});
      return {
        id: idx,
        label: label,
        ...data,
      };
    } else {
      const data = portfolios.reduce((acc, next) => {
        return { ...acc, [next.portfolioName]: `${String(next[property])}%` };
      }, {});
      return {
        id: idx,
        label: label,
        ...data,
      };
    }
  });
};

const PortfolioCharacteristics = () => {
  const portfolios = useSelector((state) => state.auth.portfolios);
  const growthVsDefensive = useSelector(
    (state) => state.auth.growthVsDefensive
  );
  const dispatch = useDispatch();
  //   const [defensive, growth] = useSelector(
  //     (state) => state.auth.growthVsDefensive
  //   );

  useEffect(() => {
    if (portfolios === undefined) {
      dispatch(fetchData());
    }
  }, []);

  useEffect(() => {
    console.log(portfolios);
    console.log(growthVsDefensive);
  }, [portfolios]);

  if (portfolios === undefined) return <></>;
  if (growthVsDefensive === undefined) return <></>;

  console.log(reshapeDataForTable(growthVsDefensive, portfolios));

  return (
    <>
      <SectionHeader text={"Portfolio Characteristics"} />
      <div className="card p-shadow-24">
        <DataTable
          showGridlines={true}
          value={reshapeDataForTable(growthVsDefensive, portfolios)}
          className={`p-datatable-striped p-datatable-sm`} // p-datatable-striped"
        >
          <Column key={6969} field="label" header=" "></Column>
          {portfolios.map((pf, idx) => (
            <Column
              key={idx}
              field={`${pf.portfolioName}`}
              header={`${pf.portfolioName}`}
            ></Column>
          ))}
        </DataTable>
      </div>
    </>
  );
};

export default PortfolioCharacteristics;
