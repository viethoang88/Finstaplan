import { useSelector } from "react-redux";
import SimpleCrudTable from "../ui/simple-crud-table";
import {
  authSliceActions,
  updateLaChanged,
  updatePortfolioGrowth,
  updateLaAndPortfolioGrowth,
  setLaAndUpdatePortfolios,
} from "../../store/auth";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";

const percentageStyles = {
  fontWeight: "bold",
  fontSize: "1.1rem",
};

export const getMaxId = (arr) =>
  arr.reduce((acc, next) => Math.max(acc, Number(next["id"])), 0);

export const addTwoObjectsByKeys = (obj1, obj2, keys, addKeys = undefined) => {
  const newObj = { ...obj1 };
  for (let key of keys) {
    newObj[key] += obj2[key];
    newObj[key] = Number(Number(newObj[key]).toFixed(4));
  }
  if (addKeys) {
    return { ...addKeys, ...newObj };
  }
  return newObj;
};

const sumColumns = (arr, emptyAcc, portfolios) => {
  const pfNames = portfolios.map((pf) => pf.portfolioName);
  return arr.reduce((acc, next) => {
    return addTwoObjectsByKeys(acc, next, pfNames, {
      assetClass: "",
    });
  }, emptyAcc);
};

const getEmptyAcc = (_maxId, portfolios) => {
  const empty = { id: String(_maxId + 1), returnPercent: "" };
  const pfNames = portfolios.map((pf) => pf.portfolioName);
  pfNames.forEach((pf) => (empty[pf] = 0));
  return empty;
};

const getEmptyGrowthAcc = () => ({
  id: "",
  assetClass: "",
  "High Growth": 0,
  Growth: 0,
  "Mod Growth": 0,
  "Mod Conservative": 0,
  Conservative: 0,
  Cash: 0,
});

const defaultCols = [
  { field: "assetClass", header: "Asset Class", type: "uneditable" },
  {
    field: "High Growth",
    header: "High Growth",
    type: "percent",
  },
  {
    field: "Growth",
    header: "Growth",
    type: "percent",
  },
  {
    field: "Mod Growth",
    header: "Mod Growth",
    type: "percent",
  },
  {
    field: "Mod Conservative",
    header: "Mod Conservative",
    type: "percent",
  },
  {
    field: "Conservative",
    header: "Conservative",
    type: "percent",
  },
  {
    field: "Cash",
    header: "Cash",
    type: "percent",
  },
  {
    field: "returnPercent",
    header: "Return %",
    type: "percent",
  },
];

export const extractAllocationsByType = (_portfolios, returnPercents = {}) => {
  const allocations = [
    {
      id: "0",
      assetClass: "Cash",
      returnPercent: returnPercents["Cash"],
    },
    {
      id: "1",
      assetClass: "Domestic Fixed Interest",
      returnPercent: returnPercents["Domestic Fixed Interest"],
    },
    {
      id: "2",
      assetClass: "International Fixed Interest",
      returnPercent: returnPercents["International Fixed Interest"],
    },
    {
      id: "3",
      assetClass: "Domestic Property",
      returnPercent: returnPercents["Domestic Property"],
    },
    {
      id: "4",
      assetClass: "International Property",
      returnPercent: returnPercents["International Property"],
    },
    {
      id: "5",
      assetClass: "Alternative",
      returnPercent: returnPercents["Alternative"],
    },
    {
      id: "6",
      assetClass: "Domestic Equity",
      returnPercent: returnPercents["Domestic Equity"],
    },
    {
      id: "7",
      assetClass: "International Equity",
      returnPercent: returnPercents["International Equity"],
    },
  ];
  _portfolios.map((pf, idx) => {
    for (let i = 0; i < allocations.length; i++) {
      allocations[i][pf.portfolioName] =
        pf.allocations[allocations[i].assetClass];
    }
  });
  return allocations;
};
const regenerateCols = (portfolios) => {
  return [{ field: "assetClass", header: "Asset Class", type: "uneditable" }]
    .concat(
      portfolios.map((pf) => ({
        field: pf.portfolioName,
        header: pf.portfolioName,
        type: "percent",
      }))
    )
    .concat([
      {
        field: "returnPercent",
        header: "Return %",
        type: "percent",
      },
    ]);
};

export const allocationSumTemplate = (rowData, { field }) => {
  const percentage = rowData[field] ? rowData[field] : rowData;
  // console.log("------- DOING ALLOCATION FOR ------");
  // console.log(rowData);
  // console.log(field);
  // console.log(percentage);
  if (percentage === 100) {
    return (
      <Button
        style={percentageStyles}
        basic
        color="green"
        content={`${percentage}%`}
        disabled
      />
    );
  } else if (percentage > 110) {
    return (
      <Button
        style={percentageStyles}
        basic
        color="red"
        content={`${percentage}%`}
        disabled
      />
    );
  } else if (percentage > 100) {
    return (
      <Button
        style={percentageStyles}
        basic
        color="orange"
        content={`${percentage}%`}
        disabled
      />
    );
  } else if (percentage > 90) {
    return (
      <Button
        style={percentageStyles}
        basic
        color="orange"
        content={`${percentage}%`}
        disabled
      />
    );
  } else {
    return (
      <Button
        style={percentageStyles}
        basic
        color="red"
        content={`${percentage}%`}
        disabled
      />
    );
  }
};

const LicenseeAllocation = (props) => {
  // const authState = useSelector((state) => state.auth);
  const portfolios = useSelector((state) => state.auth.portfolios);

  if (portfolios === undefined) {
    return <div></div>;
  }

  const dispatch = useDispatch();
  // const [_portfolios, _setPortfolios] = useState(defaultPfs);
  const [summedColumns, setSummedColumns] = useState([]);
  const [summedGrowthColumns, setSummedGrowthColumns] = useState([]);
  const [cols, setCols] = useState(defaultCols);

  const [canSave, setCanSave] = useState(false);

  const licenseeAllocations = useSelector(
    (state) => state.auth.licenseeAllocations
  );
  const [tempAllocations, setTempAllocations] = useState(licenseeAllocations);

  // const licenseeAllocations = extractAllocationsByType(portfolios);

  if (licenseeAllocations === undefined) return;

  const growthVsDefensive = useSelector(
    (state) => state.auth.growthVsDefensive
  );

  if (growthVsDefensive === undefined) return;

  const [_allocations, _setAllocations] = useState(licenseeAllocations);

  const [_defensiveVsGrowth, _setDefensiveVsGrowth] =
    useState(growthVsDefensive);

  const _setSummedColumns = (allocations, emptyAcc, portfolios) => {
    const summedColumns = sumColumns(allocations, emptyAcc, portfolios);
    console.log("SUMMED COLUMNS");
    console.log(summedColumns);

    const cantSave = Object.values(summedColumns)
      .filter((n) => Number.isFinite(n))
      .some((v) => v !== 100);

    setCanSave(!cantSave);
    console.log("--------CANT SAVE -------");
    console.log(cantSave);

    // console.log(summedColumns);
    // console.log(portfolios);
    summedColumns["summary"] = "";
    setSummedColumns(summedColumns);
  };
  const _setSummedGrowthColumns = (allocations, emptyAcc, portfolios) => {
    const summedColumns = sumColumns(allocations, emptyAcc, portfolios);
    summedColumns["summary"] = "";
    setSummedGrowthColumns(summedColumns);
  };

  const updateSums = (allocations) => {
    const _maxId = getMaxId(allocations);
    const emptyAcc = getEmptyAcc(_maxId, portfolios);
    _setSummedColumns(allocations, emptyAcc, portfolios);
  };

  useEffect(() => {
    if (licenseeAllocations !== undefined) {
      _setAllocations(licenseeAllocations);
      const newCols = regenerateCols(portfolios);
      setCols(newCols);
    }
  }, [licenseeAllocations]);

  useEffect(() => {
    updateSums(_allocations);
  }, [_allocations]);

  useEffect(() => {
    console.log(tempAllocations);
    updateSums(tempAllocations);
  }, [tempAllocations]);

  const handleRevertClicked = (_data) => {
    updateSums(_data);
  };

  const growthVsDefensiveFrontCol = {
    field: "assetClass",
    header: "",
    type: "uneditable",
  };

  const handleAllocationChange = ({
    newVal,
    key,
    updatedField,
    updatedValue,
    rowIndex,
    action,
    deleted,
  }) => {
    if (action === "update" && updatedField === "returnPercent") {
      dispatch(
        authSliceActions.updateClientDataNested({
          action: "UPDATE",
          newValue: updatedValue,
          path: ["returnPercents", newVal[rowIndex].assetClass],
        })
      );
      dispatch(
        updatePortfolioGrowth(newVal[rowIndex].assetClass, updatedValue)
      );
    } else if (key === "licenseeAllocations" && updatedField !== undefined) {
      const assetClassToUpdate = licenseeAllocations[rowIndex].assetClass;

      const indexToUpdate = portfolios.findIndex(
        (pf) => pf.portfolioName === updatedField
      );

      dispatch(
        authSliceActions.updateClientDataNested({
          action: "UPDATE",
          newValue: updatedValue,
          path: [
            "portfolios",
            indexToUpdate,
            "allocations",
            assetClassToUpdate,
          ],
        })
      );

      dispatch(updateLaAndPortfolioGrowth());
    } else if (key === "licenseeAllocations" && updatedField === undefined) {
      dispatch(setLaAndUpdatePortfolios(tempAllocations));
    }
  };
  const getGrowthVsDefensiveCols = () => {
    const percentCols = cols
      .slice(1, -1)
      .map((col) => ({ ...col, type: "uneditable_percent" }));
    return [growthVsDefensiveFrontCol].concat(percentCols);
  };

  console.log("xxxxxxxxxxxxxx");
  console.log(summedColumns);
  return (
    <>
      <SimpleCrudTable
        data={_allocations}
        type="Licensee Standardised Asset Allocation"
        empty={getEmptyAcc(getMaxId(tempAllocations), portfolios)}
        cols={cols}
        addClasses="p-datatable-sm p-datatable-striped"
        actionsToUse={authSliceActions}
        dataSubmitFn={handleAllocationChange}
        // storeSlice={"auth"}
        // storeNestedPath={[]}
        usingStore={false}
        id={"licenseeAllocations"}
        canCreate={false}
        canDelete={false}
        selectionMode={"single"}
        useSaveRevert={true}
        setParentTempStore={setTempAllocations}
        handleRevertClicked={handleRevertClicked}
        canSave={canSave}
        fixedWidth={true}
        fixedWidthWidth={"30rem"}
      />

      <div className="card">
        <DataTable
          className={`editable-cells-table p-datatable-sm p-datatable-striped`}
          resizableColumns
          columnResizeMode="fit"
          responsiveLayout="scroll"
          value={[summedColumns]}
        >
          <Column style={{ width: "17%" }} field="assetClass"></Column>
          {[...portfolios].map((p) => (
            <Column
              key={p.portfolioName}
              body={allocationSumTemplate}
              field={p.portfolioName}
              style={{ width: "30rem" }}
            ></Column>
          ))}
          <Column style={{ width: "30rem" }} field="returnPercent"></Column>
        </DataTable>
        <br />
      </div>

      <SimpleCrudTable
        data={growthVsDefensive}
        type=""
        empty={{}}
        cols={getGrowthVsDefensiveCols()}
        addClasses="p-datatable-sm p-datatable-striped"
        actionsToUse={authSliceActions}
        storeSlice={"auth"}
        id={"growthVsDefensive"}
        canCreate={false}
        canDelete={false}
        selectionMode={"single"}
        usingStore={false}
      />
    </>
  );
};

export default LicenseeAllocation;
