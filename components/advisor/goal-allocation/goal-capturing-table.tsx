import SimpleCrudTable from "../../ui/simple-crud-table";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../store/auth";
import { InputNumber } from "antd";
import { Toast } from "primereact/toast";
import { factFindActions } from "../../../store/fact-find";
import { mergeAuthorisedPortfolios } from "./goal-calc";

const empty = {
  portfolio: "",
  priority: undefined,
  goal: "",
  description: "",
  age: undefined,
};

export const customNumberEditor = (
  max,
  area,
  fieldType,
  onEditorValueChange,
  id,
  props,
  field
) => {
  return <InputNumber min={1} max={max} value={props.rowData[field]} />;
};

const customNumberBody = (rowData, { field }) => {
  console.log("------ shit from body handler ---- ");
  console.log(rowData);
  console.log(field);
  return rowData[field];
};

const whenOpts = [
  { label: "Age", value: "age" },
  { label: "Date", value: "date" },
  { label: "Date Range", value: "dateRange" },
];

const cols = [
  // {
  //   field: "portfolio",
  //   header: "Portfolio",
  //   type: "select",
  // },
  // {
  //   field: "priority",
  //   header: "Priority",
  //   type: "number",
  // },
  {
    field: "goal",
    header: "Goal",
    type: "text",
  },
  {
    field: "description",
    header: "Description",
    type: "text",
  },
  {
    field: "when",
    header: "When to achieve goal",
    type: "select",
    options: whenOpts,
  },
  {
    field: "age",
    header: "Age to obtain goal",
    type: "number",
  },
  {
    field: "date",
    header: "Start Date",
    type: "date",
  },
  {
    field: "endDate",
    header: "End Date",
    type: "date",
  },
  {
    field: "estimatedCost",
    header: "Amount Required",
    type: "price",
  },
  {
    field: "goalFrequency",
    header: "Frequency",
    type: "select",
    options: [
      { label: "Once Off", value: "onceOff" },
      { label: "Weekly", value: "weekly" },
      { label: "Fortnightly", value: "fortnightly" },
      { label: "Quarterly", value: "quarterly" },
      { label: "Bi-Annually", value: "biAnnually" },
      { label: "Yearly", value: "yearly" },
    ],
  },
  {
    field: "estimateType",
    header: "PV/FV",
    type: "select",
    options: [
      { label: "PV", value: "PV" },
      { label: "FV", value: "FV" },
    ],
  },
];

const revertHandler = (setter, data) => {
  console.log("--- REVERTING WITH DATA ---");
  console.log(data);
  setter(data);
};

const storeSubmitFunction = (dispatcher, data) => {
  console.log("--- HELLO FROM STORE SUBMIT FUNCTION ---");
  console.log(data);
  dispatcher(
    factFindActions.updateClientData({
      key: "goals",
      newVal: data["newVal"],
      action: "SET",
    })
  );
};

const DUMMY_GOALS = [
  {
    id: "1",
    goal: "Retirement Income",
    goalFrequency: "yearly",
    when: "date",
    date: "2022-05-1T05:24:55.824Z",
    dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
    age: 65,
    estimateType: "PV",
    estimatedCost: 120000,
    goalType: "monetary",
    priority: 2,
    numTimes: 29,
  },
  {
    id: "2",
    goal: "Buy a Racehorse",
    goalFrequency: "onceOff",
    when: "date",
    date: "2030-05-1T05:24:55.824Z",
    dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
    age: 65,
    estimateType: "PV",
    estimatedCost: 120000,
    goalType: "monetary",
    priority: 1,
  },
  {
    id: "3",
    goal: "Buy New Car",
    goalFrequency: "onceOff",
    when: "date",
    date: "2030-05-1T05:24:55.824Z",
    dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
    age: 65,
    estimateType: "PV",
    estimatedCost: 120000,
    goalType: "monetary",
  },
];

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

const GoalCapturingTable = ({ goals, authorisedPortfolios }) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  // const portfolios = useSelector((state) => state.auth.portfolios);
  // const goals = useSelector((state) => state.factFind.goals);
  const [tableData, setTableData] = useState(undefined);
  const [tempTableData, setTempTableData] = useState(undefined);
  const [resetTable, setResetTable] = useState(false);

  // useEffect(() => {
  //   if (portfolios === undefined) {
  //     dispatch(fetchData());
  //     // setTableData(DUMMY_GOALS);
  //     //dispatch()
  //   }
  // }, []);

  useEffect(() => {
    if (goals && typeof goals === "object" && Object.keys(goals).length > 0) {
      setTableData(goals);
      setResetTable(true);
      setTimeout(() => {
        setResetTable(false);
      }, 500);
    }
  }, [goals]);

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  // if (portfolios === undefined) {
  //   return <></>;
  // }

  // cols[0]["options"] = portfolios.map((pf) => ({
  //   label: pf.portfolioName,
  //   value: pf.portfolioName,
  // }));

  const mergedPfLabels = authorisedPortfolios.map((pf) => ({
    label: pf.referenceNumber,
    value: pf.referenceNumber,
  }));

  cols[0]["options"] = mergedPfLabels;

  console.log(mergedPfLabels);

  return (
    <>
      {!resetTable && (
        <SimpleCrudTable
          data={tableData}
          type={"Capture Goals"}
          empty={empty}
          cols={cols}
          addClasses="p-datatable-sm p-datatable-striped"
          dataSubmitFn={storeSubmitFunction.bind(null, dispatch)}
          usingStore={false}
          id={"Capture Goals"}
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

export default GoalCapturingTable;
