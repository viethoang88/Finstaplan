import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authSliceActions } from "../../store/auth";
import { Checkbox } from "primereact/checkbox";

// className="p-datatable-sm"
const Philosophies = ({ data, header, authSlice, segment }) => {
  const dispatch = useDispatch();

  const assumptions = useSelector((state) => state.auth.philosophies[segment]);
  const [_assumptions, _setAssumptions] = useState(
    assumptions !== undefined ? assumptions : data
  );
  const [editingCellRows, setEditingCellRows] = useState([]);

  const dispatchUpdates = (latestState) => {
    dispatch(
      authSliceActions.updateClientDataNested({
        action: "UPDATE",
        newValue: latestState,
        path: authSlice,
      })
    );
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
      case "boolean":
        return checkboxBodyTemplate(rowData, otherData);
      case "price":
        return priceBodyTemplate(rowData, otherData);
    }
  };

  const assignBodyEditor = (props, field) => {
    const type = props.rowData.valueType;
    switch (type) {
      case "percent":
      case "number":
      case "price":
        return numberEditor(props, field);
      case "boolean":
        return checkboxEditor(props, field);
    }
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

  const checkboxBodyTemplate = (rowData, { field }) => {
    const checkedStatus = rowData[field];
    return (
      <div>
        <Checkbox checked={checkedStatus} />
      </div>
    );
  };

  const checkboxEditor = (props, field) => {
    return (
      <div>
        <Checkbox
          onChange={(e) => onEditorValueChange(props, e.checked)}
          checked={props.rowData[field]}
        />
      </div>
    );
  };

  const onEditorValueChange = (props, value) => {
    if (value !== undefined) {
      _setAssumptions((prevState) => {
        let updatedItems = [...prevState];
        let updatedItem = { ...prevState[props.rowIndex] };
        updatedItem[props.field] = value;
        updatedItems[props.rowIndex] = updatedItem;
        dispatchUpdates(updatedItems);
        return updatedItems;
      });
    }
  };

  const numberEditor = (props, field) => {
    const type = props.rowData.valueType;
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
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
  };

  console.log("--- PHILOSOPHIES ---");
  console.log(_assumptions);

  return (
    <DataTable header={header} value={_assumptions} className="p-datatable-sm">
      <Column field="fieldname" header=""></Column>
      <Column field="field" header=""></Column>
      <Column
        field="life"
        header="Life"
        body={assignBodyTemplate}
        editor={(props) => assignBodyEditor(props, "life")}
        onEditorInit={onEditorInit}
        onEditorCancel={onEditorCancel}
        onEditorSubmit={onEditorSubmit}
      ></Column>
      <Column
        field="tpd"
        header="TPD"
        body={assignBodyTemplate}
        editor={(props) => assignBodyEditor(props, "tpd")}
        onEditorInit={onEditorInit}
        onEditorCancel={onEditorCancel}
        onEditorSubmit={onEditorSubmit}
      ></Column>
      <Column
        field="trauma"
        header="Trauma"
        body={assignBodyTemplate}
        editor={(props) => assignBodyEditor(props, "trauma")}
        onEditorInit={onEditorInit}
        onEditorCancel={onEditorCancel}
        onEditorSubmit={onEditorSubmit}
      ></Column>
      <Column
        field="ip"
        header="Income Protection"
        body={assignBodyTemplate}
        editor={(props) => assignBodyEditor(props, "ip")}
        onEditorInit={onEditorInit}
        onEditorCancel={onEditorCancel}
        onEditorSubmit={onEditorSubmit}
      ></Column>
    </DataTable>
  );
};

export default Philosophies;
