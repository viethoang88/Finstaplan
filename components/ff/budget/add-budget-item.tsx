import classes from "./add-budget-item.module.css";
// import { TreeSelect } from "primereact/treeselect";
import { income, expense, assets, liabilities } from "./budget-options/index";
import { useState } from "react";
// type => "income", "assets", "liabilities", "expenses"
import { Box } from "grommet";
import DynamicForm from "../dynamic-form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { factFindActions } from "../../../store/fact-find";
import BudgetItemInputs from "./budget-item-inputs";
const updateNestedClientDataArray = factFindActions.updateNestedClientDataArray;

const reshapeFormData = (formData) => {
  const reshapedData = [];
  for (let data of formData) {
    if (data?.belongsTo_0) {
      reshapedData.push({
        belongsTo: data.belongsTo_0,
        frequency: data.frequency_0,
        fieldKey: data.fieldKey,
        value: data.value_0,
      });
    }
    if (data?.belongsTo_1) {
      reshapedData.push({
        belongsTo: data.belongsTo_1,
        frequency: data.frequency_1,
        fieldKey: data.fieldKey,
        value: data.value_1,
      });
    }
    if (data?.belongsTo_2) {
      reshapedData.push({
        belongsTo: data.belongsTo_2,
        frequency: data.frequency_2,
        fieldKey: data.fieldKey,
        value: data.value_2,
      });
    }
  }

  return reshapedData;
};

// type: income, expense, assets, liabilities:
// shape:
// type Expense implements BudgetItem {
//   parentType: String
//   class: String
//   type: String
//   label: String
//   value: Float
//   frequency: Int
//   division: [Float]
//   notes: String
// }
// usage by reducer:
// const newItem = {
//   frequency,
//   icon,
//   label,
//   type,
//   value,
//   id: `${belongsTo}-${type}-${value}-${frequency}`,
// };

/*
  class: String
  type: String
  parentType: String
  label: String
  value: Float
  frequency: Int
  division: [Float]
  notes: String
  icon: String
  bucket: String
  id: String
  */

const dispatchDataShaper = (_type, formData, selectedNodesData) => {
  const reshapedFormData = reshapeFormData(formData);

  const action = {
    action: "PUSH_MULTIPLE_BY_INDEX",
    arrayKeyIndex: _type,
    data: [],
  };
  for (let { belongsTo, fieldKey, frequency, value } of reshapedFormData) {
    const [stateIndexKey, idx] = belongsTo.split("-");
    action.data.push({
      belongsTo: stateIndexKey,
      idx,
      frequency,
      value,
      type: selectedNodesData[fieldKey].data,
      label: selectedNodesData[fieldKey].label,
      icon: selectedNodesData[fieldKey].icon,
      nodeValue: selectedNodesData[fieldKey].value,
      parentType: selectedNodesData[fieldKey].parentType,
      bucket: selectedNodesData[fieldKey].bucket,
    });
  }
  return action;
};

const typeToNodesMap = {
  incomes: income,
  expenses: expense,
  assets: assets,
  liabilities: liabilities,
};

const AddBudgetItem = ({ type, defaults, renderWithDefaults }) => {
  const [nodes, setNodes] = useState(typeToNodesMap[type]);
  const [selectedNodeKey, setSelectedNodeKey] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodesData, setSelectedNodesData] = useState({});
  const dispatch = useDispatch();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [forceRefreshTimer, setForceRefreshTimer] = useState(null);
  const [_renderWithDefaults, _setRenderWithDefaults] = useState(false);

  useEffect(() => {
    console.log("--- SELECTED NODES CHANGED ---");
    console.log(selectedNodesData);
  }, [selectedNodesData]);

  const submitData = (data) => {
    // console.log("--- SUBMIT DATA ---");
    // console.log(data);
    if (data && Array.isArray(data["data"])) {
      const action = dispatchDataShaper(type, data["data"], selectedNodesData);
      _setRenderWithDefaults(false);
      setSelectedNodesData({});
      setSelectedNodeKey({});
      dispatch(updateNestedClientDataArray(action));
      setForceRefresh(true);
      const refreshTimer = setTimeout(() => {
        setForceRefresh(false);
      }, 1000);
      setForceRefreshTimer(refreshTimer);
    }
  };

  useEffect(() => {
    if (renderWithDefaults) {
      setSelectedNodesData(defaults.selectedNodeData);
      setSelectedNodeKey(defaults.selectedNodeKey);
      _setRenderWithDefaults(true);
      setForceRefresh(true);
      const refreshTimer = setTimeout(() => {
        setForceRefresh(false);
      }, 1);
      setForceRefreshTimer(refreshTimer);
    } else {
      setSelectedNodesData({});
      setSelectedNodeKey({});
      setForceRefresh(true);
      const refreshTimer = setTimeout(() => {
        setForceRefresh(false);
      }, 500);
      setForceRefreshTimer(refreshTimer);
      _setRenderWithDefaults(false);
    }
  }, [renderWithDefaults]);

  useEffect(() => {
    return () => clearTimeout(forceRefreshTimer);
  }, []);

  return (
    <>
      <div className={`${classes.container} card p-shadow-24`}>
        {!forceRefresh && (
          <Box direction="column" background-color={"#a07aaa"}>
            <DynamicForm
              submitData={submitData}
              nodes={nodes}
              selectedNodeKey={selectedNodeKey}
              setSelectedNodeKey={setSelectedNodeKey}
              setSelectedNode={setSelectedNode}
              setSelectedNodesData={setSelectedNodesData}
              selectedNodesData={selectedNodesData}
              type={type}
              defaultData={_renderWithDefaults ? defaults.initialValues : []}
              renderWithDefaults={_renderWithDefaults}
              FormInputsComponent={BudgetItemInputs}
            />
          </Box>
        )}
      </div>
    </>
  );
};

export default AddBudgetItem;
