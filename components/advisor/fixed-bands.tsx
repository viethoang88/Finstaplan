import { useSelector } from "react-redux";
import SimpleCrudTable from "../ui/simple-crud-table";
import { authSliceActions } from "../../store/auth";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";

const defaultCols = [
  { field: "portfolio", header: "Portfolio", type: "uneditable" },
  {
    field: "low",
    header: "Low",
    type: "percent",
  },
  {
    field: "high",
    header: "High",
    type: "percent",
  },
];

const FixedBands = (props) => {
  const [_portfolios, _setPortfolios] = useState([
    "highGrowth",
    "growth",
    "modGrowth",
    "modConservative",
    "conservative",
    "cash",
  ]);

  const [summedColumns, setSummedColumns] = useState([]);
  const [summedGrowthColumns, setSummedGrowthColumns] = useState([]);
  const [cols, setCols] = useState(defaultCols);

  const authState = useSelector((state) => state.auth);
  const portfolios = useSelector((state) => state.auth.portfolios);
  const fixedBands = useSelector((state) => state.auth.fixedBands);

  const [_allocations, _setAllocations] = useState(
    fixedBands !== undefined ? fixedBands : []
  );

  useEffect(() => {
    if (fixedBands !== undefined) {
      // console.log("IN HERE YO");
      // console.log(fixedBands);
      _setAllocations(fixedBands);
    }
  }, []);

  useEffect(() => {
    // console.log("allocations changed");
    // console.log(_allocations);
    if (fixedBands !== undefined) {
      // console.log(fixedBands);
      _setAllocations(fixedBands);
    }
  }, [fixedBands]);

  return (
    <>
      <SimpleCrudTable
        data={_allocations}
        type="Fixed Bands"
        empty={{}}
        cols={cols}
        addClasses="p-datatable-sm p-datatable-striped"
        actionsToUse={authSliceActions}
        storeSlice={"auth"}
        id={"fixedBands"}
        canCreate={false}
        canDelete={false}
        selectionMode={"single"}
      />
    </>
  );
};

export default FixedBands;
