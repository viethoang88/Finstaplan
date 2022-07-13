import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "primereact/row";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DatePicker } from "antd";
import { Checkbox } from "primereact/checkbox";
// import { InputMask } from "primereact/inputmask";
import InputMask from "react-input-mask";
import { ContextMenu } from "primereact/contextmenu";

import "./simple-crud-table.module.css";
import classes from "./simple-crud-table.module.css";

import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import { Input } from "antd";

const SimpleCrudTable = (props) => {
  const {
    data = [],
    cols,
    type,
    hasPartner = false,
    empty: emptyRow = [],
    stripedRows = false,
    rowGroupMode = "",
    groupField = "",
    canCreate = true,
    canDelete = true,
    useSaveRevert = false,
    canSave = true,
    setParentTempStore = () => {},
    handleRevertClicked = () => {},
    id,

    usingStore = true,
    storeNestedPath = [],
    dataSubmitFn = () => {},
    handleSelectClicked = () => {},
    addClasses = "",
    storeSlice = "factFind",
    actionsToUse = factFindActions,
    sumColumns = false,
    sumFunction = null,
    selectionMode = "checkbox",
    showGridlines = false,
    sortMode = null,
    sortField = null,
    sortOrder = null,
    maxWidth = null,
    displayHeader = true,
    reOrderProps = {},
    fixedWidth = true,
    fixedWidthWidth = "35rem",
  } = props;

  // console.log("------ SIMPLE CRUD TABLE", id, "--------");
  // console.log(canSave);

  const { updateClientData, updateClientDataNested } = actionsToUse;
  const dispatch = useDispatch();
  let _data = [];
  if (usingStore) {
    if (storeNestedPath.length > 0) {
      if (storeNestedPath.length === 1) {
        _data =
          useSelector((state) => state[storeSlice][storeNestedPath[0]]) || [];
      } else if (storeNestedPath.length === 2) {
        _data =
          useSelector(
            (state) => state[storeSlice][storeNestedPath[0]][storeNestedPath[1]]
          ) || [];
      } else if (storeNestedPath.length === 3) {
        _data =
          useSelector(
            (state) =>
              state[storeSlice][storeNestedPath[0]][storeNestedPath[1]][
                storeNestedPath[2]
              ]
          ) || [];
      }
    } else {
      _data = useSelector((state) => state[storeSlice][id]) || [];
    }
  }

  useEffect(() => {
    if (usingStore && _data !== undefined && data.length > 0) {
      setItems(_data);
    }
  }, [_data]);
  // FOR TESTING:
  // const store = useSelector((state) => state[storeSlice]);
  // console.log("STORE DATA", _data);
  // console.log(store);

  let _inputData = [...data];

  // let _data;
  // console.log(data);
  if (_data && _data.length > 0) {
    _data = _data.map((obj, idx) => {
      let newRow = { ...obj, id: idx };
      // Object.entries(obj).forEach(([k, v]) => {
      //   newRow[k] = v;
      // });
      return newRow;
    });
  }
  if (_inputData && _inputData.length > 0) {
    _inputData = _inputData.map((obj, idx) => {
      let newRow = { ...obj, id: idx };
      // Object.entries(obj).forEach(([k, v]) => {
      //   newRow[k] = v;
      // });
      return newRow;
    });
  }
  // console.log(_data);
  // console.log(_data === data);
  const [editingCellRows, setEditingCellRows] = useState([]);
  const [item, setItem] = useState(null);

  // const [items, setItems] = useState(_data.length > 0 ? _data : []);
  // const [items, setItems] = useState(_data.concat(_inputData));
  const [items, setItems] = useState(
    _data && _data.length > 0 ? _data : _inputData
  );

  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  // const [currentAction, setCurrentAction] = useState("");

  const toast = useRef(null);
  const dt = useRef(null);

  let idx = 0;

  // Context menu stuff:
  const cm = useRef(null);
  const menuModel = [
    {
      label: "View",
      icon: "pi pi-fw pi-search",
      command: () => console.log(selectedItem),
    },
    {
      label: "Delete",
      icon: "pi pi-fw pi-times",
      command: () => console.log("delete ", selectedItem),
    },
  ];

  // useEffect(() => {
  //   // setItems(_data);

  //   return () => {
  //     console.log("unmounting", idx);
  //     console.log(items);
  //     idx += 1;
  //     if (usingStore) {
  //       if (storeNestedPath.length > 0) {
  //         dispatch(
  //           updateClientDataNested({
  //             action: "UPDATE",
  //             newVal: items,
  //             path: storeNestedPath,
  //           })
  //         );
  //       } else {
  //         dispatch(updateClientData({ action: "SET", newVal: items, key: id }));
  //       }
  //     } else dataSubmitFn({ newVal: items, key: id });
  //   };
  // }, [items]);

  const dispatchUpdates = (
    latestState,
    deleted = undefined,
    action = undefined,
    rowIndex = undefined,
    updatedField = undefined,
    updatedValue = undefined
  ) => {
    if (usingStore) {
      if (storeNestedPath.length > 0) {
        dispatch(
          updateClientDataNested({
            action: "UPDATE",
            newValue: latestState,
            path: storeNestedPath,
            deleted,
            rowIndex,
            updatedField,
            updatedValue,
            update_action: action,
          })
        );
      } else {
        dispatch(
          updateClientData({
            action: "SET",
            newVal: latestState,
            key: id,
            deleted,
            rowIndex,
            updatedField,
            updatedValue,
            update_action: action,
          })
        );
      }
    } else
      dataSubmitFn({
        newVal: latestState,
        key: id,
        updatedField,
        updatedValue,
        rowIndex,
        action,
        deleted,
      });
  };

  const onSaveClicked = () => {
    if (canSave) dispatchUpdates(items);
  };

  const onRevertClicked = () => {
    if (usingStore) {
      setItems(_data);
    } else {
      console.log("REVERTING TO");
      console.log(_inputData);
      setItems(_inputData);
      handleRevertClicked(_inputData);
    }
  };

  // Editing stuff:
  const onEditorValueChange = (id, props, value) => {
    console.log("-----EDITOR VALUE CHANGED ----");
    console.log(id);
    console.log(value);
    console.log(props.value);
    console.log(props.field);
    console.log(props.rowIndex);
    console.log(props);

    if (value) {
      console.log("-- THERE IS A VALUE ---");
      setItems((prevState) => {
        let updatedItems = [...prevState];
        let updatedItem = { ...prevState[props.rowIndex] };
        updatedItem[props.field] = value;
        updatedItems[props.rowIndex] = updatedItem;
        console.log("--- updated items ---");
        console.log(updatedItems);
        if (useSaveRevert) {
          setParentTempStore(updatedItems);
          return updatedItems;
        }

        dispatchUpdates(
          updatedItems,
          undefined,
          "update",
          props.rowIndex,
          props.field,
          value
        );
        return updatedItems;
      });
    } else {
      setItems((prevState) => {
        let updatedItems = [...prevState];
        let updatedItem = { ...prevState[props.rowIndex] };
        updatedItem[props.field] = emptyRow[props.field];
        updatedItems[props.rowIndex] = updatedItem;

        if (useSaveRevert) {
          setParentTempStore(updatedItems);
          return updatedItems;
        }

        dispatchUpdates(
          updatedItems,
          undefined,
          "update",
          props.rowIndex,
          props.field,
          value
        );
        return updatedItems;
      });
    }
  };

  const optionsForDropdowns = {};
  //       const getOptionLabel = (status) => {
  //         switch (status) {
  //           case "INSTOCK":
  //             return "In Stock";

  //           case "LOWSTOCK":
  //             return "Low Stock";

  //           case "OUTOFSTOCK":
  //             return "Out of Stock";

  //           default:
  //             return "NA";
  //         }
  //       };
  //   const optionBodyBodyTemplate = (rowData) => {
  //     return getOptionLabel(rowData.inventoryStatus);
  //   };
  const boldBodyTemplate = (rowData, { field }) => {
    return (
      <span style={{ fontWeight: 700, fontSize: "110%" }}>
        {rowData[field]}
      </span>
    );
  };

  const textBodyTemplate = (rowData, { field }, next) => {
    return rowData[field];
    // <InputText
    //   type="text"
    //   value={rowData[field]}
    //   style={{ maxWidth: "95%" }}
    //   // onChange={(e) => onEditorValueChange(id, props, e.target.value)}
    // />
  };

  const priceBodyTemplate = (rowData, { field }) => {
    if (rowData[field] === undefined) return "";

    const msd = String(rowData[field]).length + 2;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: msd,
    }).format(rowData[field]);
  };

  const numberBodyTemplate = (rowData, { field }) => {
    if (rowData[field] === undefined) return "";
    return new Intl.NumberFormat().format(rowData[field]);
  };

  const percentBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumSignificantDigits: 6,
    }).format(rowData[field] / 100);
  };

  const dateBodyTemplate = (rowData, { field }) => {
    // return new Date(rowData[field]).toDateString();
    return rowData[field];
  };

  const checkboxBodyTemplate = (rowData, { field }) => {
    const checkedStatus = rowData[field];
    return (
      <div
        style={{
          position: "relative",
          left: "2.5rem",
          width: "100%",
        }}
      >
        <Checkbox checked={checkedStatus} />
      </div>
    );
  };

  const optionsBodyTemplate = (rowData, { field }) => {
    const currValue = rowData[field];
    // console.log(rowData);
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
          options={optionsForDropdowns[field]}
          optionLabel="label"
          optionValue="value"
          style={{ width: "95%" }}
          placeholder={`Select`}
          itemTemplate={(option) => {
            return <span>{option.label}</span>;
          }}
          disabled
          // onChange={(e) => onEditorValueChange(id, props, e.value)}
        />
      </div>
    );
  };

  const textEditor = (id, props, field, opts, options) => {
    return (
      <Input
        onChange={(e) => {
          options.editorCallback(e.target.value);
          onEditorValueChange(id, props, e.target.value);
        }}
        value={options.value}
        allowClear={true}
        bordered={false}
      />
    );
  };

  const inputTextEditor = (id, props, field, next) => {
    console.log("-- editor ---");
    console.log(id);
    console.log(props);
    console.log(field);
    console.log("-----");
    return (
      <Input
        onChange={(e) => onEditorValueChange(id, props, e.target.value)}
        value={props.rowData[field]}
        allowClear={true}
        bordered={false}
      />
      // <InputText
      //   type="text"
      //   value={props.rowData[field]}
      //   onChange={(e) => onEditorValueChange(id, props, e.target.value)}
      //   style={{ maxWidth: "95%" }}
      // />
    );
  };

  const uneditable = (id, props, field) => {
    return props.rowData[field];
  };
  const uneditable_percent = (id, props, field) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumSignificantDigits: 5,
    }).format(props.rowData[field] / 100);
  };

  // const nameEditor = (id, props, field, options) => {
  //   return inputTextEditor(id, props, field, options);
  // };

  const priceEditor = (id, props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
        minFractionDigits={2}
        style={{ maxWidth: "95%" }}
      />
    );
  };

  const numberEditor = (id, props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        mode="decimal"
        minFractionDigits={1}
        maxFractionDigits={2}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        style={{ maxWidth: "3rem" }}
      />
    );
  };

  const percentEditor = (id, props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        // suffix="%"
        mode="decimal"
        minFractionDigits={2}
        style={{ maxWidth: "95%", width: "5rem" }}
      />
    );
  };

  const optionsEditor = (id, props, field, options) => {
    return (
      <Dropdown
        value={props.rowData[field]}
        options={options}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => onEditorValueChange(id, props, e.value)}
        style={{ width: "95%", zIndex: 25000 }}
        placeholder={`Select`}
        itemTemplate={(option) => {
          return <span>{option.label}</span>;
        }}
      />
    );
  };

  // const phoneEditor = (id, props, field) => {
  //   return (
  //     <InputMask
  //       value={props.rowData[field]}
  //       mask="99/99/9999"
  //       placeholder="Enter birthdate"
  //       onChange={(e) => onEditorValueChange(id, props, e.target.value)}
  //     />
  //   );
  // };

  const emailEditor = (id, props, field) => {
    return (
      <InputText
        value={props.rowData[field]}
        keyfilter={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}
        validateOnly
        onChange={(e) => onEditorValueChange(id, props, e.target.value)}
      />
    );
  };

  const checkboxEditor = (id, props, field) => {
    return (
      <div
        style={{
          position: "relative",
          left: "2.5rem",
          width: "100%",
        }}
      >
        <Checkbox
          onChange={(e) => onEditorValueChange(id, props, e.checked)}
          checked={props.rowData[field]}
        />
      </div>
    );
  };

  const dateEditor = (id, props, field) => {
    // console.log(props.rowData[field]);
    return (
      <InputMask
        value={props.rowData[field]}
        mask="99/99/9999"
        tooltip={"MM/DD/YYYY"}
        // maskPlaceholder="MM/DD/YYYY"
        // placeholder="Enter date"
        onChange={(e) => onEditorValueChange(id, props, e.target.value)}
        style={{ maxWidth: "95%" }}
      />
      //   <DatePicker
      //     value={props.rowData[field]}
      //     // onChange={(e) => onEditorValueChange(id, props, new Date(e.toString()))}
      //     onChange={(e) => onEditorValueChange(id, props, "testes")}
      //   />
    );
  };

  //   const editItem = (item) => {
  //     setItem({ ...item });
  //   };

  const confirmDeleteItem = (item, e) => {
    e.preventDefault();
    setItem(item);
    setDeleteItemDialog(true);
  };

  const deleteItem = () => {
    let _items = items.filter((val) => val.id !== item.id);
    let deleted = items.filter((val) => val.id === item.id);
    // dispatch(updateClientData({ [id]: _items, action: "DELETE_ONE" }));
    setItems(_items);
    setDeleteItemDialog(false);
    setItem(null);
    dispatchUpdates(_items, deleted, "delete_one");
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: `${type.slice(0, -1)} Deleted`,
      life: 3000,
    });
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const confirmDeleteSelected = (e) => {
    e.preventDefault();
    setDeleteItemsDialog(true);
  };

  const deleteSelectedItems = () => {
    let _items = items.filter((val) => {
      const matchingIndex = selectedItems.findIndex((si) => si.id === val.id);
      const isSelected = matchingIndex !== -1;
      return !isSelected; // filter out items that were selected for deletion
    });
    let deletedItems = items.filter((val) => {
      const matchingIndex = selectedItems.findIndex((si) => si.id === val.id);
      const isSelected = matchingIndex !== -1;
      return isSelected; // filter out items that were selected for deletion
    });
    setItems(_items);
    // dispatch(updateClientData({ [id]: _items, action: "DELETE_ALL" }));
    setDeleteItemsDialog(false);
    setSelectedItems(null);

    // ##** TODO: Decide if this is the desired behaviour (ask martin):
    // if (!useSaveRevert) {
    //   dispatchUpdates(_items, deletedItems, "delete_multiple");
    // }

    dispatchUpdates(_items, deletedItems, "delete_multiple");

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: `${type} Deleted`,
      life: 3000,
    });
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };
  const hideDeleteItemsDialog = () => {
    setDeleteItemsDialog(false);
  };

  const rightToolbarTemplate = () => {
    if (useSaveRevert) {
      return (
        <>
          <Button
            label="Save"
            icon={`pi pi-save ${classes.toolbar_button_icon}`}
            className={`p-button-raised p-button-outlined p-button-primary p-mr-2 ${classes.toolbar_button}`}
            onClick={(e) => {
              e.preventDefault();
              onSaveClicked();
            }}
            disabled={!canSave}
          />
          <Button
            label="Revert"
            icon={`pi pi-refresh ${classes.toolbar_button_icon}`}
            className={`p-button-raised p-button-outlined p-button-warning p-mr-2 ${classes.toolbar_button}`}
            onClick={(e) => {
              e.preventDefault();
              onRevertClicked();
            }}
          />
        </>
      );
    }
    return (
      <React.Fragment>
        {useSaveRevert && (
          <Button
            label="New"
            icon={`pi pi-plus ${classes.toolbar_button_icon}`}
            className={`p-button-raised p-button-outlined p-button-success p-mr-2 ${classes.toolbar_button}`}
            onClick={(e) => {
              e.preventDefault();
              setItems((prevState) => [
                ...prevState,
                { ...emptyRow, id: createId() },
              ]);
              // dispatch(
              //   updateClientDataNested({
              //     action: "PUSH",
              //     newValue: emptyRow,
              //     path: [id],
              //   })
              // );
            }}
          />
        )}
        {canDelete && (
          <Button
            label="Delete"
            icon={`pi pi-trash ${classes.toolbar_button_icon}`}
            className={`p-button-danger p-button-outlined p-button-raised ${classes.toolbar_button}`}
            onClick={confirmDeleteSelected}
            disabled={!selectedItems || !selectedItems.length}
          />
        )}
      </React.Fragment>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        {canCreate && (
          <Button
            label="New"
            icon={`pi pi-plus ${classes.toolbar_button_icon}`}
            className={`p-button-raised p-button-outlined p-button-success p-mr-2 ${classes.toolbar_button}`}
            onClick={(e) => {
              e.preventDefault();
              setItems((prevState) => [
                ...prevState,
                { ...emptyRow, id: createId() },
              ]);
              // dispatch(
              //   updateClientDataNested({
              //     action: "PUSH",
              //     newValue: emptyRow,
              //     path: [id],
              //   })
              // );
            }}
          />
        )}
        {canDelete && (
          <Button
            label="Delete"
            icon={`pi pi-trash ${classes.toolbar_button_icon}`}
            className={`p-button-danger p-button-outlined p-button-raised ${classes.toolbar_button}`}
            onClick={confirmDeleteSelected}
            disabled={!selectedItems || !selectedItems.length}
          />
        )}
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editItem(rowData)}
        /> */}
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={(e) => confirmDeleteItem(rowData, e)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">{type}</h5>
      {/* <Column header={type} sortable /> */}
    </div>
  );
  const itemDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemDialog}
      />
      {/* <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveItem}
      /> */}
    </React.Fragment>
  );

  const deleteItemDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteItem}
      />
    </React.Fragment>
  );
  const deleteItemsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteItemsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedItems}
      />
    </React.Fragment>
  );

  const onEditorInit = (e) => {
    const { rowIndex: index, field, rowData } = e.columnProps;
    let _editingCellRows = [...editingCellRows];
    if (!editingCellRows[index]) {
      _editingCellRows[index] = { ...rowData };
    }
    _editingCellRows[index][field] = items[index][field];
    setEditingCellRows(_editingCellRows);
  };

  const onEditorCancel = (e) => {
    const { rowIndex: index, field } = e.columnProps;
    let _items = [...items];
    let _editingCellRows = [...editingCellRows];
    _items[index][field] = _editingCellRows[index][field];
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
    setItems(_items);
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

  return (
    <div>
      <Toast ref={toast} />
      <ContextMenu
        model={menuModel}
        ref={cm}
        onHide={() => setSelectedItem(null)}
      />
      <div className="card">
        {displayHeader && (
          <Toolbar
            className="p-mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
        )}
        <DataTable
          // showGridlines={showGridlines}
          ref={dt}
          value={items}
          selection={selectedItems}
          onSelectionChange={(e) => setSelectedItems(e.value)}
          selectionMode={selectionMode}
          dataKey="id"
          //   paginator
          //   rows={10}
          header={header}
          editMode="cell"
          className={`editable-cells-table ${addClasses}`} // p-datatable-striped"
          style={{ maxWidth: maxWidth }}
          reorderableColumns
          rowGroupMode={rowGroupMode}
          groupField={groupField}
          sortMode={sortMode}
          sortField={sortField}
          sortOrder={sortOrder}
          {...reOrderProps}
          resizableColumns
          columnResizeMode="fit"
          showGridlines
          responsiveLayout="scroll"
          // autoLayout
        >
          {/* <Column
            rowReorderIcon="pi pi-sort-alt"
            rowReorder
            style={{ width: "3em" }}
          /> */}

          {Object.keys(reOrderProps).length > 0 &&
            reOrderProps["reorderableColumns"] && (
              <Column rowReorder style={{ width: "3rem" }} />
            )}

          {selectionMode === "multiple" && (
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          )}
          {selectionMode === "checkbox" && (
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          )}

          {/* {rowGroupMode === "rowspan" &&
            cols.map((obj) => {
              for (let [field, val] of Object.entries(obj)) {
                return (
                  <>
                    <Column field={field} header={field} />
                    {Object.entries(val).map(([_name, _number]) => {
                      <Column
                        key={_name}
                        field={_name}
                        header={field}
                        // body={body}
                        // editor={(props) => editor("items", props, field, opts)}
                        onEditorInit={onEditorInit}
                        onEditorCancel={onEditorCancel}
                        onEditorSubmit={onEditorSubmit}
                      />;
                    })}
                  </>
                );
              }
            })} */}

          {rowGroupMode === "" &&
            cols.map(({ field, header, type, options }) => {
              let body;
              let editor;
              let opts = null;

              switch (type) {
                case "custom":
                  editor = options.editor.bind(null, onEditorValueChange);
                  body = options.body;
                  break;
                case "custom_editable":
                  editor = options.editor.bind(null, onEditorValueChange);
                  body = options.body.bind(null, onEditorValueChange);
                  break;
                case "text":
                  editor = textEditor;
                  // body = nameEditor;
                  body = textBodyTemplate;
                  break;
                case "bold_text":
                  editor = textEditor;
                  body = boldBodyTemplate;
                  break;
                case "uneditable":
                  editor = uneditable;
                  break;
                case "uneditable_percent":
                  body = percentBodyTemplate;
                  editor = uneditable_percent;
                  break;
                case "select":
                  optionsForDropdowns[field] = options;
                  opts = options;
                  editor = optionsEditor;
                  body = optionsBodyTemplate;
                  break;
                case "checkbox":
                  editor = checkboxEditor;
                  body = checkboxBodyTemplate;
                  break;
                case "date":
                  editor = dateEditor;
                  body = dateBodyTemplate;
                  break;
                case "price":
                  editor = priceEditor;
                  body = priceBodyTemplate;
                  break;
                case "number":
                  editor = numberEditor;
                  body = numberBodyTemplate;
                  break;
                case "percent":
                  editor = percentEditor;
                  body = percentBodyTemplate;
                  break;
                case "phone":
                  editor = textEditor;
                  // body = phoneBodyTemplate;
                  break;
                case "email":
                  editor = emailEditor;
                  // body = emailBodyTemplate;
                  break;
              }

              return (
                <Column
                  key={field}
                  field={field}
                  header={header}
                  body={body}
                  editor={(options) =>
                    editor("items", options, field, opts, options)
                  }
                  onEditorInit={onEditorInit}
                  onEditorCancel={onEditorCancel}
                  onEditorSubmit={onEditorSubmit}
                  style={fixedWidth && { width: fixedWidthWidth }}
                />
              );
            })}

          {selectionMode === "multiple" && (
            <Column body={actionBodyTemplate}></Column>
          )}
          {selectionMode === "checkbox" && (
            <Column body={actionBodyTemplate}></Column>
          )}
        </DataTable>
      </div>

      <Dialog
        visible={deleteItemDialog}
        header="Confirm"
        modal
        footer={deleteItemDialogFooter}
        onHide={hideDeleteItemDialog}
        className={classes.deletemodal}
      >
        <div className={`confirmation-content ${classes.delete_modal_content}`}>
          <i
            className={`pi pi-exclamation-triangle p-mr-3 ${classes.modalicon}`}
          />
          {item && (
            <div className={classes.modalparagraph}>
              Are you sure you want to delete this <b>{type.slice(0, -1)}</b>?
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteItemsDialog}
        header="Confirm"
        modal
        footer={deleteItemsDialogFooter}
        onHide={hideDeleteItemsDialog}
        className={classes.deletemodal}
      >
        <div className={`confirmation-content ${classes.delete_modal_content}`}>
          <i
            className={`pi pi-exclamation-triangle p-mr-3 ${classes.modalicon}`}
          />
          {items && (
            <div className={classes.modalparagraph}>
              Are you sure you want to delete the selected {type}?
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default SimpleCrudTable;
