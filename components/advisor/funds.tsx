import SimpleCrudTable from "../ui/simple-crud-table";
import WeightingSums from "./benchmarking/benchmarking-configure/weighting-sums";
import { authSliceActions, fetchData } from "../../store/auth";
import { funds as DUMMY_FUNDS } from "../../dummy_data/funds";
import { useState, useEffect } from "react";
import { allocationSumTemplate } from "./licensee-allocation";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const emptyFund = {
  fund: "",
  apir: "",
  Cash: 0,
  Conservative: 0,
  "Mod Conservative": 0,
  "Mod Growth": 0,
  Growth: 0,
  "High Growth": 0,
};

const fundCols = [
  { field: "fund", header: "Fund Name", type: "text" },
  {
    field: "apir",
    header: "APIR",
    type: "text",
  },
  {
    field: "Cash",
    header: "Cash",
    type: "percent",
  },
  {
    field: "Conservative",
    header: "Conservative",
    type: "percent",
  },
  {
    field: "Mod Conservative",
    header: "Mod Conservative",
    type: "percent",
  },
  {
    field: "Mod Growth",
    header: "Mod Growth",
    type: "percent",
  },
  {
    field: "Growth",
    header: "Growth",
    type: "percent",
  },
  {
    field: "High Growth",
    header: "High Growth",
    type: "percent",
  },
];

const summedCols = [
  ...fundCols,
  {
    field: "delete",
    header: "",
    type: "uneditable",
  },
];

const sumFields = [
  "Cash",
  "Conservative",
  "Mod Conservative",
  "Mod Growth",
  "Growth",
  "High Growth",
];

const canSave = (summedCols) => {};

const regenerateCols = (portfolios) => {
  return [
    { field: "fund", header: "Fund Name", type: "text" },
    {
      field: "apir",
      header: "APIR",
      type: "text",
    },
  ].concat(
    portfolios.map((pf) => ({
      field: pf.portfolioName,
      header: pf.portfolioName,
      type: "percent",
    }))
  );
};

const dispatchUpdates = (updatedData, dispatcher) => {
  dispatcher(
    authSliceActions.updateClientData({
      action: "SET",
      key: updatedData.key,
      newVal: updatedData.newVal,
    })
  );
};

const _forceRefresh = (setForceRefresh) => {
  setForceRefresh(true);
  setTimeout(() => {
    setForceRefresh(false);
  }, 500);
};

const calcSums = (data, fields) => {
  if (data.reduce === undefined) return {};
  return data?.reduce(
    (acc, next) => {
      for (let sumField of fields) {
        if (acc[sumField]) {
          acc[sumField] += next[sumField];
        } else {
          acc[sumField] = next[sumField];
        }
      }
      return acc;
    },
    {
      fund: "",
      apir: "",
    }
  );
};

const Funds = ({ portfolios }) => {
  const [summedColumns, setSummedColumns] = useState({
    fund: "",
    apir: "",
    Cash: 0,
    Conservative: 0,
    "Mod Conservative": 0,
    "Mod Growth": 0,
    Growth: 0,
    "High Growth": 0,
  });
  const funds = useSelector((state) => state.auth.funds);
  const [pfNames, setPfNames] = useState();
  const [_funds, setFunds] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [cols, setCols] = useState(fundCols);
  const [tempFunds, setTempFunds] = useState([]);
  const [canSave, setCanSave] = useState(false);
  const dispatch = useDispatch();

  console.log("I HAVE THESE FUNDS");
  console.log(funds);

  useEffect(() => {
    if (funds !== undefined) {
      setFunds(funds);
      const newCols = regenerateCols(portfolios);
      setCols(newCols);
      _forceRefresh(setForceRefresh);
    }
  }, [funds]);

  useEffect(() => {
    const pfNames = portfolios.map((pf) => pf.portfolioName);
    setPfNames(pfNames);
  }, [portfolios]);

  useEffect(() => {
    if (portfolios === undefined) {
      dispatch(fetchData());
    }
    if (funds === undefined) {
      setFunds(DUMMY_FUNDS);
      setCols(regenerateCols(portfolios));
      _forceRefresh(setForceRefresh);
    }
  }, []);

  useEffect(() => {
    if (_funds === undefined) return;
    const accSums = calcSums(_funds, pfNames);
    setSummedColumns(accSums);
    const cantSave = Object.values(accSums)
      .filter((n) => Number.isFinite(n))
      .some((v) => v !== 100);

    setCanSave(!cantSave);
  }, [_funds, tempFunds]);

  useEffect(() => {
    if (tempFunds === undefined) return;
    const accSums = calcSums(tempFunds, pfNames);
    setSummedColumns(accSums);
    const cantSave = Object.values(accSums)
      .filter((n) => Number.isFinite(n))
      .some((v) => v !== 100);
    setCanSave(!cantSave);
  }, [tempFunds]);

  console.log("ABOUT TO RENDER FUNDS");
  console.log(_funds);
  console.log(cols);

  return (
    <>
      {_funds !== undefined && !forceRefresh && (
        <div>
          <SimpleCrudTable
            data={_funds}
            type="Funds"
            id="funds"
            empty={emptyFund}
            cols={cols}
            addClasses="p-datatable-sm p-datatable-striped"
            storeSlice="auth"
            actionsToUse={authSliceActions}
            useSaveRevert={true}
            usingStore={false}
            dataSubmitFn={(data) => {
              dispatchUpdates(data, dispatch);
            }}
            canSave={canSave}
            // canCreate={true}
            // canDelete={true}
            canImport={true}
            selectionMode={"checkbox"}
            setParentTempStore={(updatedItems) => setTempFunds(updatedItems)}
            handleRevertClicked={() => {}}
          />
          <div>
            <div className="card">
              <DataTable
                className={`editable-cells-table p-datatable-sm p-datatable-striped`}
                value={[summedColumns]}
              >
                <Column field="fund"></Column>
                <Column field="apir"></Column>
                {[...portfolios].map((p) => (
                  <Column
                    key={p.portfolioName}
                    body={allocationSumTemplate}
                    field={p.portfolioName}
                  ></Column>
                ))}
                <Column field="returnPercent"></Column>
              </DataTable>
              <br />
            </div>
            {/* <WeightingSums
                  allocationSumTemplate={allocationSumTemplate}
                  summedColumns={[summedColumns]}
                  // summedColumns={summedColumns}
                  cols={summedCols}
                  sumFields={sumFields}
                /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;

{
  /* <SimpleCrudTable
  setParentTempStore={setTempAllocations}
  handleRevertClicked={handleRevertClicked}
/> */
}
