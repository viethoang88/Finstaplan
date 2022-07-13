import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
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

const CrudTableRowGroup = (props) => {
  const {
    data,
    cols,
    type,
    hasPartner,
    empty: emptyRow,
    rowGroupMode = "",
    groupField = "",
    canCreate = true,
    canDelete = true,
  } = props;

  const [editingCellRows, setEditingCellRows] = useState([]);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState(data);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

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

  // Editing stuff:
  const onEditorValueChange = (id, props, value) => {
    if (value) {
      let updatedItems = [...props.value];
      updatedItems[props.rowIndex][props.field] = value;
      setItems(updatedItems);
    } else {
      let updatedItems = [...props.value];
      updatedItems[props.rowIndex][props.field] = emptyRow[props.field];
      setItems(updatedItems);
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

  const priceBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData[field]);
  };

  const numberBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat().format(rowData[field]);
  };

  const percentBodyTemplate = (rowData, { field }) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
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
    console.log(rowData[field]);
    const currValue = rowData[field];
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {/* {currValue} */}
        {/* <Dropdown value={currValue} /> */}
        <Dropdown
          value={currValue}
          options={optionsForDropdowns[field]}
          optionLabel="label"
          optionValue="value"
          style={{ width: "80%" }}
          placeholder={`Select ${field}`}
          itemTemplate={(option) => {
            return <span>{option.label}</span>;
          }}
          disabled
          // onChange={(e) => onEditorValueChange(id, props, e.value)}
        />
      </div>
    );
  };

  const inputTextEditor = (id, props, field) => {
    return (
      <InputText
        type="text"
        value={props.rowData[field]}
        onChange={(e) => onEditorValueChange(id, props, e.target.value)}
      />
    );
  };
  const nameEditor = (id, props, field) => {
    return inputTextEditor(id, props, field);
  };

  const priceEditor = (id, props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const numberEditor = (id, props, field) => {
    return (
      <InputNumber
        id="percent"
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
      />
    );
  };

  const percentEditor = (id, props, field) => {
    return (
      <InputNumber
        value={props.rowData[field]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        suffix="%"
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
        style={{ width: "80%" }}
        placeholder={`Select a ${field}`}
        itemTemplate={(option) => {
          return <span>{option.label}</span>;
        }}
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
    console.log(props.rowData[field]);
    return (
      <InputMask
        value={props.rowData[field]}
        mask="99/99/9999"
        placeholder="Enter birthdate"
        onChange={(e) => onEditorValueChange(id, props, e.target.value)}
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

  const confirmDeleteItem = (item) => {
    setItem(item);
    setDeleteItemDialog(true);
  };

  const deleteItem = () => {
    let _items = items.filter((val) => val.id !== item.id);
    setItems(_items);
    setDeleteItemDialog(false);
    setItem(null);
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

  const confirmDeleteSelected = () => {
    setDeleteItemsDialog(true);
  };

  const deleteSelectedItems = () => {
    let _items = items.filter((val) => !selectedItems.includes(val));
    setItems(_items);
    setDeleteItemsDialog(false);
    setSelectedItems(null);
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

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        {canCreate && (
          <Button
            label="New"
            icon={`pi pi-plus ${classes.toolbar_button_icon}`}
            className={`p-button-raised p-button-outlined p-button-success p-mr-2 ${classes.toolbar_button}`}
            onClick={() => {
              setItems((prevState) => [
                ...prevState,
                { ...emptyRow, id: createId() },
              ]);
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
          onClick={() => confirmDeleteItem(rowData)}
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
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
  };

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <ContextMenu
        model={menuModel}
        ref={cm}
        onHide={() => setSelectedItem(null)}
      />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={items}
          selection={selectedItems}
          onSelectionChange={(e) => setSelectedItems(e.value)}
          selectionMode="checkbox"
          dataKey="id"
          //   paginator
          //   rows={10}
          header={header}
          editMode="cell"
          className="editable-cells-table" // p-datatable-striped"
          reorderableColumns
          rowGroupMode={rowGroupMode}
          groupField={groupField}
        >
          {/* <Column
            rowReorderIcon="pi pi-sort-alt"
            rowReorder
            style={{ width: "3em" }}
          /> */}

          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

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
                case "text":
                  editor = nameEditor;
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
              }

              return (
                <Column
                  key={field}
                  field={field}
                  header={header}
                  body={body}
                  editor={(props) => editor("items", props, field, opts)}
                  onEditorInit={onEditorInit}
                  onEditorCancel={onEditorCancel}
                  onEditorSubmit={onEditorSubmit}
                />
              );
            })}

          <Column body={actionBodyTemplate}></Column>
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
