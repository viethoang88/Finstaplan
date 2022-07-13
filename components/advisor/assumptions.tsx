import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authSliceActions, fetchData } from "../../store/auth";
import { propStyle } from "aws-amplify-react";

const findIndexById = (id, state) => {
  return state.findIndex((item) => item.id === id);
};

// className="p-datatable-sm"
const Assumptions = ({ data }) => {
  const [portfolioNames, setPortfolioNames] = useState([]);
  const dispatch = useDispatch();
  const portfolios = useSelector((state) => state.auth.portfolios);
  const assumptions = useSelector((state) => state.auth.assumptions);

  useEffect(() => {
    if (portfolios === undefined) {
      dispatch(fetchData());
    }
    if (portfolios !== undefined) {
      const pfNames = portfolios.map((pf) => ({
        label: pf.portfolioName,
        value: pf.portfolioName,
      }));
      setPortfolioNames(pfNames);
      console.log(pfNames);
    }
  }, [portfolios]);

  const [_assumptions, _setAssumptions] = useState(
    assumptions !== undefined && assumptions.length > 0 ? assumptions : data
  );

  const [editingCellRows, setEditingCellRows] = useState([]);

  const dispatchUpdates = (latestState) => {
    console.log("dispatching updates");
    console.log(latestState);
    dispatch(
      authSliceActions.updateClientData({
        action: "SET",
        newVal: latestState,
        key: "assumptions",
      })
    );
  };

  const onEditorValueChange = (props, value) => {
    if (value) {
      _setAssumptions((prevState) => {
        let updatedItems = [...prevState];
        const rowIndex = findIndexById(props.rowData.id, updatedItems);
        let updatedItem = { ...prevState[rowIndex] };
        updatedItem[props.field] = value;
        updatedItems[rowIndex] = updatedItem;
        dispatchUpdates(updatedItems);
        return updatedItems;
      });
    }
  };

  const numberEditor = (props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        mode="decimal"
        minFractionDigits={1}
        maxFractionDigits={2}
        onValueChange={(e) => onEditorValueChange(props, e.value)}
      />
    );
  };

  const percentEditor = (props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(props, e.value)}
        // suffix="%"
        mode="decimal"
        minFractionDigits={2}
      />
    );
  };

  const onEditorInit = (e) => {
    const { rowIndex: index, field, rowData } = e.columnProps;
    let _editingCellRows = [...editingCellRows];
    if (!editingCellRows[index]) {
      _editingCellRows[index] = { ...rowData };
    }
    _editingCellRows[index][field] = _assumptions[index][field];
    setEditingCellRows(_editingCellRows);
  };

  const onEditorCancel = (e) => {
    const { rowIndex: index, field } = e.columnProps;
    let _items = [..._assumptions];
    let _editingCellRows = [...editingCellRows];
    _items[index][field] = _editingCellRows[index][field];
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
    _setAssumptions(_items);
  };

  const onEditorSubmit = (e) => {
    const { rowIndex: index, field } = e.columnProps;
    let _editingCellRows = [...editingCellRows];
    // console.log(id, index, field, items[index][field]);
    // dispatch(
    //   updateClientDataNested({
    //     action: "UPDATE",
    //     path: [id, index, field],
    //     newValue: items[index][field],
    //   })
    // );
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
  };

  const selectEditor = (props, field) => {
    const currValue = props.rowData[field];
    return (
      <div
        style={{
          position: "relative",
          width: "auto",
        }}
      >
        {/* {currValue} */}
        {/* <Dropdown value={currValue} /> */}
        <Dropdown
          value={currValue}
          options={portfolioNames}
          optionLabel="label"
          optionValue="value"
          style={{ width: "41%" }}
          placeholder={`Select portfolio`}
          itemTemplate={(option) => {
            return <span>{option.label}</span>;
          }}
          onChange={(e) => onEditorValueChange(props, e.value)}
        />
      </div>
    );
  };

  const selectBodyTemplate = (rowData, field) => {
    const currValue = rowData[field.field];
    return (
      <div
        style={{
          position: "relative",
          width: "auto",
        }}
      >
        {/* {currValue} */}
        {/* <Dropdown value={currValue} /> */}
        <Dropdown
          value={currValue}
          options={portfolioNames}
          optionLabel="label"
          optionValue="value"
          style={{ width: "41%" }}
          placeholder={`Select portfolio`}
          itemTemplate={(option) => {
            return <span>{option.label}</span>;
          }}
          disabled
          // onChange={(e) => onEditorValueChange(id, props, e.value)}
        />
      </div>
    );
  };

  const numberBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat().format(rowData[field]);
  };

  const percentBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumSignificantDigits: 6,
    }).format(rowData[field] / 100);
  };

  const priceBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 2,
    }).format(rowData[field]);
  };

  const assignBodyEditor = (props, field) => {
    const type = props.rowData.valueType;
    switch (type) {
      case "percent":
      case "number":
      case "price":
        return numberEditor(props, field);
      case "select":
        return selectEditor(props, field);
      // case "boolean":
      //   return checkboxEditor(props, field);
    }
  };

  const assignBodyTemplate = (rowData, otherData) => {
    if (rowData[otherData.field] === undefined) {
      return "";
    }
    switch (rowData.valueType) {
      case "percent":
        return percentBodyTemplate(rowData, otherData);
      case "number":
        return numberBodyTemplate(rowData, otherData);
      // case "boolean":
      //   return checkboxBodyTemplate(rowData, otherData);
      case "price":
        return priceBodyTemplate(rowData, otherData);
      case "select":
        return selectBodyTemplate(rowData, otherData);
    }
  };

  return (
    <DataTable
      value={_assumptions}
      rowGroupMode="rowspan"
      // rowGroupMode="subheader"
      groupField="fieldname"
      sortMode="single"
      sortField="fieldname"
      sortOrder={1}
      className="p-datatable-sm"
    >
      <Column field="fieldname" header=""></Column>
      <Column field="field" header=""></Column>
      <Column
        field="value"
        header=""
        body={assignBodyTemplate}
        editor={(props) => assignBodyEditor(props, "value")}
        onEditorInit={onEditorInit}
        onEditorCancel={onEditorCancel}
        onEditorSubmit={onEditorSubmit}
      ></Column>
    </DataTable>
  );
};

export default Assumptions;
