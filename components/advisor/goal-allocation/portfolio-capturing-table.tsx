import SimpleCrudTable from "../../ui/simple-crud-table";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../store/auth";
import { factFindActions } from "../../../store/fact-find";
import { InputNumber } from "antd";
import { Toast } from "primereact/toast";
import { cols, emptyPlan } from "../../ff/authorities/authorities";

/* SHAPE:
planType(pin):"policy"
company(pin):"AAMI"
referenceNumber(pin):"12345"
id(pin):"FmAgy"
authorityGranted(pin):"toInvestigate"
*/

const revertHandler = (setter, data) => {
  console.log("--- REVERTING WITH DATA ---");
  setter(data);
};

const storeSubmitFunction = (dispatcher, data) => {
  console.log(data);
  const newData = data.newVal;
  const primaryPfs = newData.filter((data) => data.owner === "primary");
  const partnerPfs = newData.filter((data) => data.owner === "partner");
  console.log(primaryPfs);
  console.log(partnerPfs);
  dispatcher(
    factFindActions.updateClientDataNested({
      newValue: primaryPfs,
      action: "UPDATE",
      path: ["primary", "authorities"],
    })
  );
  dispatcher(
    factFindActions.updateClientDataNested({
      newValue: partnerPfs,
      action: "UPDATE",
      path: ["partner", "authorities"],
    })
  );
};

const canSave = (tableData) => {
  const priorities = tableData.map((row) => row.priority);
  console.log("--- PRIORITIES ---");
  console.log(priorities);
  for (let i = 1; i <= priorities.length; i++) {
    if (!priorities.includes(i)) {
      return false;
    }
  }
  return true;
};

const onColReorder = (toast, e) => {
  console.log("--- COL REORDERED ---");
  if (toast?.current) {
    toast.current.show({
      severity: "success",
      summary: "Column Reordered",
      life: 3000,
    });
  }
};

const onRowReorder = (toast, setter, e) => {
  setter(e.value);
  if (toast?.current) {
    toast.current.show({
      severity: "success",
      summary: "Row Reordered",
      life: 3000,
    });
  }
};

const PortfolioCapturingTable = ({
  authorisedPortfolios,
  primary,
  partner,
}) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [tableData, setTableData] = useState(undefined);
  const [resetTable, setResetTable] = useState(undefined);

  console.log("---- AUTHORISED PORTFOLIOS ---");
  console.log(authorisedPortfolios);

  const ownerOpts = [{ label: primary, value: "primary" }];
  if (partner !== undefined) {
    ownerOpts.push({ label: partner, value: "partner" });
  }

  const ownerCol = {
    field: "owner",
    header: "Owner",
    type: "select",
    options: ownerOpts,
  };

  useEffect(() => {
    if (authorisedPortfolios !== undefined && authorisedPortfolios.length > 0) {
      setTableData(authorisedPortfolios);
      setResetTable(true);
      setTimeout(() => {
        setResetTable(false);
      }, 500);
    }
  }, [authorisedPortfolios]);

  return (
    <>
      {!resetTable && (
        <SimpleCrudTable
          data={tableData}
          type={"Client Portfolios"}
          empty={emptyPlan}
          cols={[ownerCol, ...cols]}
          addClasses="p-datatable-sm p-datatable-striped"
          dataSubmitFn={storeSubmitFunction.bind(null, dispatch)}
          usingStore={false}
          id={"Client Portfolios"}
          canCreate={true}
          canDelete={true}
          selectionMode={"checkbox"}
          useSaveRevert={true}
          setParentTempStore={setTableData}
          handleRevertClicked={revertHandler.bind(null, setTableData)}
          canSave={true}
          //   reOrderProps={{
          //     reorderableColumns: true,
          //     onColReorder: onColReorder.bind(null, toast),
          //     onRowReorder: onRowReorder.bind(null, toast, setTableData),
          //   }}
        />
      )}
    </>
  );
};

export default PortfolioCapturingTable;
