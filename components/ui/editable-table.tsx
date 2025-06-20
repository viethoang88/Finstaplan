import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import "./editable-table.module.css";
// import classes from './editable-table.module.css';

const EditableTable = () => {
  const [data, setData] = useState(null);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // for import/export
  const [importedData, setImportedData] = useState([]);
  const [selectedImportedData, setSelectedImportedData] = useState([]);
  const [importedCols, setImportedCols] = useState([
    { field: "", header: "Header" },
  ]);

  const [editingRows, setEditingRows] = useState({});
  const [editingCellRows, setEditingCellRows] = useState([]);

  const dt = useRef(null);
  const toast = useRef(null);

  const representatives = [
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ];

  // USED TO ITERATIVELY map to <Columns>:
  const columns = [
    { field: "name", header: "Name" },
    { field: "country", header: "Country" },
    { field: "representative", header: "Representative" },
    { field: "date", header: "Date" },
    { field: "status", header: "Status" },
    { field: "activity", header: "Activity" },
  ];

  // Used in the options for the status column:
  const statuses = [
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
    "proposal",
  ];

  let originalRows = {};

  // CHANGE THIS WHEN GOING LIVE:
  useEffect(() => {
    //setCustomers(testData);
    setData(testData);
  }, [testData]);

  const filterDate = (value, filter) => {
    if (
      filter === undefined ||
      filter === null ||
      (typeof filter === "string" && filter.trim() === "")
    ) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    return value === formatDate(filter);
  };

  const formatDate = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return date.getFullYear() + "-" + month + "-" + day;
  };

  const onRepresentativesChange = (e) => {
    dt.current.filter(e.value, "representative.name", "in");
    setSelectedRepresentative(e.value);
  };

  const onDateChange = (e) => {
    dt.current.filter(e.value, "date", "custom");
    setSelectedDate(e.value);
  };

  const onStatusChange = (e) => {
    dt.current.filter(e.value, "status", "equals");
    setSelectedStatus(e.value);
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Name</span> */}
        {rowData.name}
      </React.Fragment>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Country</span> */}
        {/* <img
          alt="flag"
          src="showcase/demo/images/flag_placeholder.png"
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          className={`flag flag-${rowData.country.code}`}
          width={30}
        /> */}
        <span className="image-text">{rowData.country.name}</span>
      </React.Fragment>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Representative</span> */}
        {/* <img
          alt={rowData.representative.name}
          src={`showcase/demo/images/avatar/${rowData.representative.image}`}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width={32}
          style={{ verticalAlign: "middle" }}
        /> */}
        <span className="image-text">{rowData.representative.name}</span>
      </React.Fragment>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Date</span> */}
        <span>{rowData.date}</span>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Status</span> */}
        <span className={`customer-badge status-${rowData.status}`}>
          {rowData.status}
        </span>
      </React.Fragment>
    );
  };

  const activityBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Activity</span> */}
        <ProgressBar value={rowData.activity} showValue={false} />
      </React.Fragment>
    );
  };

  const representativesItemTemplate = (option) => {
    return (
      <div className="p-multiselect-representative-option">
        {/* <img
          alt={option.name}
          src={`showcase/demo/images/avatar/${option.image}`}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width={32}
          style={{ verticalAlign: "middle" }}
        /> */}
        <span className="image-text">{option.name}</span>
      </div>
    );
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const reset = () => {
    setSelectedRepresentative(null);
    setSelectedDate(null);
    setSelectedStatus(null);
    setGlobalFilter("");
    dt.current.reset();
  };

  const representativeFilter = (
    <MultiSelect
      value={selectedRepresentative}
      options={representatives}
      itemTemplate={representativesItemTemplate}
      onChange={onRepresentativesChange}
      optionLabel="name"
      optionValue="name"
      placeholder="All"
      className="p-column-filter"
    />
  );
  const dateFilter = (
    <Calendar
      value={selectedDate}
      onChange={onDateChange}
      dateFormat="yy-mm-dd"
      className="p-column-filter"
      placeholder="Registration Date"
    />
  );
  const statusFilter = (
    <Dropdown
      value={selectedStatus}
      options={statuses}
      onChange={onStatusChange}
      itemTemplate={statusItemTemplate}
      placeholder="Select a Status"
      className="p-column-filter"
      showClear
    />
  );

  // ##** EDITING LOGIC:

  const positiveIntegerValidator = (e) => {
    const { rowData, field } = e.columnProps;
    return isPositiveInteger(rowData[field]);
  };

  const emptyValueValidator = (e) => {
    const { rowData, field } = e.columnProps;
    return rowData[field].trim().length > 0;
  };

  const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  };

  // FOR CELL EDITING:
  // const onEditorInit = (e) => {
  //   const { rowIndex: index, field, rowData } = e.columnProps;
  //   let _editingCellRows = [...editingCellRows];
  //   if (!editingCellRows[index]) {
  //     _editingCellRows[index] = { ...rowData };
  //   }
  //   _editingCellRows[index][field] = data[index][field];
  //   setEditingCellRows(_editingCellRows);
  // };

  // const onEditorCancel = (e) => {
  //   const { rowIndex: index, field } = e.columnProps;
  //   let myData = [...data];
  //   let _editingCellRows = [...editingCellRows];
  //   myData[index][field] = _editingCellRows[index][field];
  //   delete _editingCellRows[index][field];
  //   setEditingCellRows(_editingCellRows);

  //   setData(data);
  // };

  const onEditorSubmit = (e) => {
    const { rowIndex: index, field } = e.columnProps;
    let _editingCellRows = [...editingCellRows];
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
  };

  const onRowEditInit = (event) => {
    originalRows[event.index] = { ...data[event.index] };
  };

  const onRowEditCancel = (event) => {
    let newData = [...data];
    newData[event.index] = originalRows[event.index];
    delete originalRows[event.index];
    setData(newData);
  };

  const onRowEditChange = (event) => {
    setEditingRows(event.data);
  };

  const setActiveRowIndex = (index) => {
    let myData = [...data];
    originalRows[index] = { ...myData[index] };
    let _editingRows = {
      ...editingRows,
      ...{ [`${data[index].id}`]: true },
    };
    setEditingRows(_editingRows);
  };

  // const getStatusLabel = (status) => {
  //   switch (status) {
  //     case "INSTOCK":
  //       return "In Stock";

  //     case "LOWSTOCK":
  //       return "Low Stock";

  //     case "OUTOFSTOCK":
  //       return "Out of Stock";

  //     default:
  //       return "NA";
  //   }
  // };

  const onEditorValueChange = (id, props, value) => {
    let updatedData = [...props.value];
    updatedData[props.rowIndex][props.field] = value;
    setData(updatedData);
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

  const codeEditor = (id, props) => {
    return inputTextEditor(id, props, "code");
  };

  const nameEditor = (id, props) => {
    return inputTextEditor(id, props, "name");
  };

  const priceEditor = (id, props) => {
    return (
      <InputNumber
        value={props.rowData["price"]}
        onValueChange={(e) => onEditorValueChange(id, props, e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const statusEditor = (id, props) => {
    return (
      <Dropdown
        value={props.rowData["inventoryStatus"]}
        options={statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => onEditorValueChange(id, props, e.value)}
        style={{ width: "100%" }}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  // const statusBodyTemplate = (rowData) => {
  //   return getStatusLabel(rowData.inventoryStatus);
  // };

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.price);
  };

  // FOR CRUD OPS:
  const toCapitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const clear = () => {
    setImportedData([]);
    setSelectedImportedData([]);
    setImportedCols([{ field: "", header: "Header" }]);
  };

  const onImportSelectionChange = (e) => {
    setSelectedImportedData(e.value);
    const detail = e.value.map((d) => Object.values(d)[0]).join(", ");
    toast.current.show({
      severity: "info",
      summary: "Data Selected",
      detail,
      life: 3000,
    });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, data);
        doc.save("products.pdf");
      });
    });
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "data");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  };

  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");

      // Prepare DataTable
      const cols = data[0].split(",");
      data.shift();

      let _importedCols = cols.map((col) => ({
        field: col,
        header: toCapitalize(col.replace(/['"]+/g, "")),
      }));
      let _importedData = data.map((d) => {
        d = d.split(",");
        return cols.reduce((obj, c, i) => {
          obj[c] = d[i].replace(/['"]+/g, "");
          return obj;
        }, {});
      });

      setImportedCols(_importedCols);
      setImportedData(_importedData);
    };

    reader.readAsText(file, "UTF-8");
  };

  const importExcel = (e) => {
    const file = e.files[0];

    import("xlsx").then((xlsx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = xlsx.read(e.target.result, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        // Prepare DataTable
        const cols = data[0];
        data.shift();

        let _importedCols = columns.map((col) => ({
          field: col,
          header: toCapitalize(col),
        }));
        let _importedData = data.map((d) => {
          return columns.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });

        setImportedCols(_importedCols);
        setImportedData(_importedData);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const header = (
    <div
      className="table-header p-ai-center export-buttons"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Button
          type="button"
          label="Clear"
          className="p-button-outlined"
          icon="pi pi-filter-slash"
          onClick={reset}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Global Search"
          />
        </span>
      </div>
      <div>
        <Button
          type="button"
          icon="pi pi-file-o"
          onClick={() => exportCSV(false)}
          className="p-mr-2"
          data-pr-tooltip="CSV"
        />
        <Button
          type="button"
          icon="pi pi-file-excel"
          onClick={exportExcel}
          className="p-button-success p-mr-2"
          data-pr-tooltip="XLS"
        />
        <Button
          type="button"
          icon="pi pi-file-pdf"
          onClick={exportPdf}
          className="p-button-warning p-mr-2"
          data-pr-tooltip="PDF"
        />
      </div>
    </div>
  );
  // const actionBodyTemplate = (rowData) => {
  //   return (
  //     <React.Fragment>
  //       <Button
  //         icon="pi pi-pencil"
  //         className="p-button-rounded p-button-success p-mr-2"
  //         onClick={() => editProduct(rowData)}
  //       />
  //       <Button
  //         icon="pi pi-trash"
  //         className="p-button-rounded p-button-warning"
  //         onClick={() => confirmDeleteProduct(rowData)}
  //       />
  //     </React.Fragment>
  //   );
  // };

  // DATA IS PASSED TO DataTable as JSON, can be iterated over:
  /*
    <DataTable value={jsonData}
    {
        columns.map(col => {
            const { field, header } = col;
            const validator = (field === 'quantity' || field === 'price') ? positiveIntegerValidator : emptyValueValidator;
            return <Column key={field}
                           field={field} 
                           header={header} 
                           body={field === 'price' && priceBodyTemplate}
                           editor={(props) => inputTextEditor('products2', props, field)} editorValidator={validator}
                           onEditorInit={onEditorInit}
                           onEditorCancel={onEditorCancel}
                           onEditorSubmit={onEditorSubmit} />
         })
    }
    </DataTable>
  */

  // editable (for Datatable):
  // editMode="cell" || editMode="row"
  // row mode requires: dataKey="id"
  // => <DataTable value={products4} editMode="row" dataKey="id" editingRows={editingRows} onRowEditChange={onRowEditChange} onRowEditInit={onRowEditInit2} onRowEditCancel={onRowEditCancel2}>
  // => <DataTable value={jsonData} editMode="row" dataKey="id" onRowEditInit={onRowEditInit} onRowEditCancel={onRowEditCancel}>
  //      ...
  //      <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
  //    </DataTable>

  // can navigate to editable row programmatically:
  // => <Button onClick={() => setActiveRowIndex(0)} className="p-button-text" label="Activate 1st" />

  // editors (for columns):
  // editor={(props) => nameEditor('products1', props)
  // editor={(props) => codeEditor('products1', props)}
  // editor={(props) => statusEditor('products1', props)
  // editor={(props) => priceEditor('products1', props)

  // validators:
  // const validator = (field === 'quantity' || field === 'price') ? positiveIntegerValidator : emptyValueValidator;
  // editorValidator={validator}

  // CUSTOM SORTING FUNCTION:
  //<Column field="name" header="Name" sortable sortFunction={mysort}></Column>
  // Filtering is enabled by setting the filter property as true
  // on a column. Default match mode is "startsWith" and this
  // can be configured using filterMatchMode property that
  // also accepts "contains", "endsWith", "equals", "notEquals",
  // "in", "lt", "lte", "gt", "gte" and "custom" as available modes.

  // CUSTOM FILTERING:
  //<Column field="code" header="Code" filter filterMatchMode="custom" filterFunction={codeFilter}></Column>

  // EXPANSION OF ROWS:
  // https://primefaces.org/primereact/showcase/#/datatable/rowexpand

  // EXPORT and IMPORT:
  return (
    <div className="datatable-filter-demo">
      <Toast ref={toast} />
      <div className="card">
        {/* <Toolbar
          className="p-mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        /> */}

        {/* <div className="p-d-flex p-ai-center p-py-2">
          <FileUpload
            chooseOptions={{ label: "CSV", icon: "pi pi-file-o" }}
            mode="basic"
            name="demo[]"
            auto
            url="https://primefaces.org/primereact/showcase/upload.php"
            accept=".csv"
            className="p-mr-2"
            onUpload={importCSV}
          />
          <FileUpload
            chooseOptions={{
              label: "Excel",
              icon: "pi pi-file-excel",
              className: "p-button-success",
            }}
            mode="basic"
            name="demo[]"
            auto
            url="https://primefaces.org/primereact/showcase/upload.php"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="p-mr-2"
            onUpload={importExcel}
          />
          <Button
            type="button"
            label="Clear"
            icon="pi pi-times"
            onClick={clear}
            className="p-button-info p-ml-auto"
          />
        </div> */}

        <h5>Export</h5>

        <Tooltip target=".export-buttons>button" position="bottom" />
        <DataTable
          ref={dt}
          value={data} // <- input data as JSON
          paginator
          // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          rows={10}
          header={header}
          className="p-datatable-customers p-datatable-striped"
          globalFilter={globalFilter}
          emptyMessage={`No ${"data"} found.`}
          // for editing:""
          editMode="row"
          dataKey="id"
          editingRows={editingRows}
          onRowEditChange={onRowEditChange}
          onRowEditInit={onRowEditInit}
          onRowEditCancel={onRowEditCancel}
        >
          {/*columns.map(col => {
            const { field, header } = col;
            const validator = props.validators[field];
            // body requires a template function:
            const body = "";  // {field === 'price' && priceBodyTemplate}
            return (<Column key={field}
                            field={field}
                            header={header} 
                            body={body} 
                            // for editing:
                            editor={(props) => inputTextEditor('data', props, field)} 
                            editorValidator={validator}
                            onEditorInit={onEditorInit} 
                            onEditorCancel={onEditorCancel} 
                            onEditorSubmit={onEditorSubmit} 
                            // for filter:
                            filter
                            filterPlaceholder="Search by name"
                            />
          })  */}
          <Column
            field="name"
            header="Name"
            body={nameBodyTemplate}
            filter
            filterPlaceholder="Search by name"
            editor={(props) => nameEditor("data", props)}
            sortable
          />
          <Column
            field="country"
            filterField="country.name"
            header="Country"
            body={countryBodyTemplate}
            filter
            filterPlaceholder="Search by country"
            filterMatchMode="contains"
            sortable
          />
          <Column
            field="representative.name"
            header="Representative"
            body={representativeBodyTemplate}
            filter
            filterElement={representativeFilter}
            sortable
          />
          <Column
            field="date"
            header="Date"
            body={dateBodyTemplate}
            filter
            filterElement={dateFilter}
            filterFunction={filterDate}
            sortable
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            filter
            filterElement={statusFilter}
            sortable
          />
          <Column
            field="activity"
            header="Activity"
            body={activityBodyTemplate}
            filter
            filterPlaceholder="Minimum"
            filterMatchMode="gte"
            sortable
          />
          <Column
            rowEditor
            headerStyle={{ width: "7rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default EditableTable;

const testData = [
  {
    id: 1000,
    name: "James Butt",
    country: {
      name: "Algeria",
      code: "dz",
    },
    company: "Benton, John B Jr",
    date: "2015-09-13",
    status: "unqualified",
    activity: 17,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1001,
    name: "Josephine Darakjy",
    country: {
      name: "Egypt",
      code: "eg",
    },
    company: "Chanay, Jeffrey A Esq",
    date: "2019-02-09",
    status: "proposal",
    activity: 0,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1002,
    name: "Art Venere",
    country: {
      name: "Panama",
      code: "pa",
    },
    company: "Chemel, James L Cpa",
    date: "2017-05-13",
    status: "qualified",
    activity: 63,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1003,
    name: "Lenna Paprocki",
    country: {
      name: "Slovenia",
      code: "si",
    },
    company: "Feltz Printing Service",
    date: "2020-09-15",
    status: "new",
    activity: 37,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1004,
    name: "Donette Foller",
    country: {
      name: "South Africa",
      code: "za",
    },
    company: "Printing Dimensions",
    date: "2016-05-20",
    status: "proposal",
    activity: 33,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1005,
    name: "Simona Morasca",
    country: {
      name: "Egypt",
      code: "eg",
    },
    company: "Chapman, Ross E Esq",
    date: "2018-02-16",
    status: "qualified",
    activity: 68,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1006,
    name: "Mitsue Tollner",
    country: {
      name: "Paraguay",
      code: "py",
    },
    company: "Morlong Associates",
    date: "2018-02-19",
    status: "renewal",
    activity: 54,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1007,
    name: "Leota Dilliard",
    country: {
      name: "Serbia",
      code: "rs",
    },
    company: "Commercial Press",
    date: "2019-08-13",
    status: "renewal",
    activity: 69,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1008,
    name: "Sage Wieser",
    country: {
      name: "Egypt",
      code: "eg",
    },
    company: "Truhlar And Truhlar Attys",
    date: "2018-11-21",
    status: "unqualified",
    activity: 76,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1009,
    name: "Kris Marrier",
    country: {
      name: "Mexico",
      code: "mx",
    },
    company: "King, Christopher A Esq",
    date: "2015-07-07",
    status: "proposal",
    activity: 3,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1010,
    name: "Minna Amigon",
    country: {
      name: "Romania",
      code: "ro",
    },
    company: "Dorl, James J Esq",
    date: "2018-11-07",
    status: "qualified",
    activity: 38,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1011,
    name: "Abel Maclead",
    country: {
      name: "Singapore",
      code: "sg",
    },
    company: "Rangoni Of Florence",
    date: "2017-03-11",
    status: "qualified",
    activity: 87,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1012,
    name: "Kiley Caldarera",
    country: {
      name: "Serbia",
      code: "rs",
    },
    company: "Feiner Bros",
    date: "2015-10-20",
    status: "unqualified",
    activity: 80,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1013,
    name: "Graciela Ruta",
    country: {
      name: "Chile",
      code: "cl",
    },
    company: "Buckley Miller & Wright",
    date: "2016-07-25",
    status: "negotiation",
    activity: 59,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1014,
    name: "Cammy Albares",
    country: {
      name: "Philippines",
      code: "ph",
    },
    company: "Rousseaux, Michael Esq",
    date: "2019-06-25",
    status: "new",
    activity: 90,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1015,
    name: "Mattie Poquette",
    country: {
      name: "Venezuela",
      code: "ve",
    },
    company: "Century Communications",
    date: "2017-12-12",
    status: "negotiation",
    activity: 52,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1016,
    name: "Meaghan Garufi",
    country: {
      name: "Malaysia",
      code: "my",
    },
    company: "Bolton, Wilbur Esq",
    date: "2018-07-04",
    status: "unqualified",
    activity: 31,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1017,
    name: "Gladys Rim",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "T M Byxbee Company Pc",
    date: "2020-02-27",
    status: "renewal",
    activity: 48,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1018,
    name: "Yuki Whobrey",
    country: {
      name: "Israel",
      code: "il",
    },
    company: "Farmers Insurance Group",
    date: "2017-12-21",
    status: "negotiation",
    activity: 16,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1019,
    name: "Fletcher Flosi",
    country: {
      name: "Argentina",
      code: "ar",
    },
    company: "Post Box Services Plus",
    date: "2016-01-04",
    status: "renewal",
    activity: 19,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1020,
    name: "Bette Nicka",
    country: {
      name: "Paraguay",
      code: "py",
    },
    company: "Sport En Art",
    date: "2016-10-21",
    status: "renewal",
    activity: 100,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1021,
    name: "Veronika Inouye",
    country: {
      name: "Ecuador",
      code: "ec",
    },
    company: "C 4 Network Inc",
    date: "2017-03-24",
    status: "renewal",
    activity: 72,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1022,
    name: "Willard Kolmetz",
    country: {
      name: "Tunisia",
      code: "tn",
    },
    company: "Ingalls, Donald R Esq",
    date: "2017-04-15",
    status: "renewal",
    activity: 94,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1023,
    name: "Maryann Royster",
    country: {
      name: "Belarus",
      code: "by",
    },
    company: "Franklin, Peter L Esq",
    date: "2017-03-11",
    status: "qualified",
    activity: 56,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1024,
    name: "Alisha Slusarski",
    country: {
      name: "Iceland",
      code: "is",
    },
    company: "Wtlz Power 107 Fm",
    date: "2018-03-27",
    status: "qualified",
    activity: 7,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1025,
    name: "Allene Iturbide",
    country: {
      name: "Italy",
      code: "it",
    },
    company: "Ledecky, David Esq",
    date: "2016-02-20",
    status: "qualified",
    activity: 1,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1026,
    name: "Chanel Caudy",
    country: {
      name: "Argentina",
      code: "ar",
    },
    company: "Professional Image Inc",
    date: "2018-06-24",
    status: "new",
    activity: 26,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1027,
    name: "Ezekiel Chui",
    country: {
      name: "Ireland",
      code: "ie",
    },
    company: "Sider, Donald C Esq",
    date: "2016-09-24",
    status: "new",
    activity: 76,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1028,
    name: "Willow Kusko",
    country: {
      name: "Romania",
      code: "ro",
    },
    company: "U Pull It",
    date: "2020-04-11",
    status: "qualified",
    activity: 7,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1029,
    name: "Bernardo Figeroa",
    country: {
      name: "Israel",
      code: "il",
    },
    company: "Clark, Richard Cpa",
    date: "2018-04-11",
    status: "renewal",
    activity: 81,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1030,
    name: "Ammie Corrio",
    country: {
      name: "Hungary",
      code: "hu",
    },
    company: "Moskowitz, Barry S",
    date: "2016-06-11",
    status: "negotiation",
    activity: 56,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1031,
    name: "Francine Vocelka",
    country: {
      name: "Honduras",
      code: "hn",
    },
    company: "Cascade Realty Advisors Inc",
    date: "2017-08-02",
    status: "qualified",
    activity: 94,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1032,
    name: "Ernie Stenseth",
    country: {
      name: "Australia",
      code: "au",
    },
    company: "Knwz Newsradio",
    date: "2018-06-06",
    status: "renewal",
    activity: 68,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1033,
    name: "Albina Glick",
    country: {
      name: "Ukraine",
      code: "ua",
    },
    company: "Giampetro, Anthony D",
    date: "2019-08-08",
    status: "proposal",
    activity: 85,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1034,
    name: "Alishia Sergi",
    country: {
      name: "Qatar",
      code: "qa",
    },
    company: "Milford Enterprises Inc",
    date: "2018-05-19",
    status: "negotiation",
    activity: 46,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1035,
    name: "Solange Shinko",
    country: {
      name: "Cameroon",
      code: "cm",
    },
    company: "Mosocco, Ronald A",
    date: "2015-02-12",
    status: "qualified",
    activity: 32,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1036,
    name: "Jose Stockham",
    country: {
      name: "Italy",
      code: "it",
    },
    company: "Tri State Refueler Co",
    date: "2018-04-25",
    status: "qualified",
    activity: 77,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1037,
    name: "Rozella Ostrosky",
    country: {
      name: "Venezuela",
      code: "ve",
    },
    company: "Parkway Company",
    date: "2016-02-27",
    status: "unqualified",
    activity: 66,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1038,
    name: "Valentine Gillian",
    country: {
      name: "Paraguay",
      code: "py",
    },
    company: "Fbs Business Finance",
    date: "2019-09-17",
    status: "qualified",
    activity: 25,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1039,
    name: "Kati Rulapaugh",
    country: {
      name: "Puerto Rico",
      code: "pr",
    },
    company: "Eder Assocs Consltng Engrs Pc",
    date: "2016-12-03",
    status: "renewal",
    activity: 51,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1040,
    name: "Youlanda Schemmer",
    country: {
      name: "Bolivia",
      code: "bo",
    },
    company: "Tri M Tool Inc",
    date: "2017-12-15",
    status: "negotiation",
    activity: 49,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1041,
    name: "Dyan Oldroyd",
    country: {
      name: "Argentina",
      code: "ar",
    },
    company: "International Eyelets Inc",
    date: "2017-02-02",
    status: "qualified",
    activity: 5,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1042,
    name: "Roxane Campain",
    country: {
      name: "France",
      code: "fr",
    },
    company: "Rapid Trading Intl",
    date: "2018-12-25",
    status: "unqualified",
    activity: 100,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1043,
    name: "Lavera Perin",
    country: {
      name: "Vietnam",
      code: "vn",
    },
    company: "Abc Enterprises Inc",
    date: "2018-04-10",
    status: "qualified",
    activity: 71,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1044,
    name: "Erick Ferencz",
    country: {
      name: "Belgium",
      code: "be",
    },
    company: "Cindy Turner Associates",
    date: "2018-05-06",
    status: "unqualified",
    activity: 54,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1045,
    name: "Fatima Saylors",
    country: {
      name: "Canada",
      code: "ca",
    },
    company: "Stanton, James D Esq",
    date: "2019-07-10",
    status: "renewal",
    activity: 93,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1046,
    name: "Jina Briddick",
    country: {
      name: "Mexico",
      code: "mx",
    },
    company: "Grace Pastries Inc",
    date: "2018-02-19",
    status: "unqualified",
    activity: 97,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1047,
    name: "Kanisha Waycott",
    country: {
      name: "Ecuador",
      code: "ec",
    },
    company: "Schroer, Gene E Esq",
    date: "2019-11-27",
    status: "new",
    activity: 80,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1048,
    name: "Emerson Bowley",
    country: {
      name: "Finland",
      code: "fi",
    },
    company: "Knights Inn",
    date: "2018-11-24",
    status: "new",
    activity: 63,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1049,
    name: "Blair Malet",
    country: {
      name: "Finland",
      code: "fi",
    },
    company: "Bollinger Mach Shp & Shipyard",
    date: "2018-04-19",
    status: "new",
    activity: 92,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1050,
    name: "Brock Bolognia",
    country: {
      name: "Bolivia",
      code: "bo",
    },
    company: "Orinda News",
    date: "2019-09-06",
    status: "renewal",
    activity: 72,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1051,
    name: "Lorrie Nestle",
    country: {
      name: "Germany",
      code: "de",
    },
    company: "Ballard Spahr Andrews",
    date: "2018-04-26",
    status: "renewal",
    activity: 36,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1052,
    name: "Sabra Uyetake",
    country: {
      name: "Peru",
      code: "pe",
    },
    company: "Lowy Limousine Service",
    date: "2018-04-12",
    status: "new",
    activity: 31,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1053,
    name: "Marjory Mastella",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Vicon Corporation",
    date: "2018-01-24",
    status: "negotiation",
    activity: 89,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1054,
    name: "Karl Klonowski",
    country: {
      name: "Saudi Arabia",
      code: "sa",
    },
    company: "Rossi, Michael M",
    date: "2017-04-17",
    status: "unqualified",
    activity: 27,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1055,
    name: "Tonette Wenner",
    country: {
      name: "Australia",
      code: "au",
    },
    company: "Northwest Publishing",
    date: "2019-04-14",
    status: "qualified",
    activity: 27,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1056,
    name: "Amber Monarrez",
    country: {
      name: "Sweden",
      code: "se",
    },
    company: "Branford Wire & Mfg Co",
    date: "2019-09-09",
    status: "new",
    activity: 79,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1057,
    name: "Shenika Seewald",
    country: {
      name: "Australia",
      code: "au",
    },
    company: "East Coast Marketing",
    date: "2017-02-18",
    status: "renewal",
    activity: 39,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1058,
    name: "Delmy Ahle",
    country: {
      name: "Belgium",
      code: "be",
    },
    company: "Wye Technologies Inc",
    date: "2020-10-05",
    status: "unqualified",
    activity: 55,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1059,
    name: "Deeanna Juhas",
    country: {
      name: "Sweden",
      code: "se",
    },
    company: "Healy, George W Iv",
    date: "2018-09-28",
    status: "negotiation",
    activity: 79,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1060,
    name: "Blondell Pugh",
    country: {
      name: "Ireland",
      code: "ie",
    },
    company: "Alpenlite Inc",
    date: "2016-06-16",
    status: "renewal",
    activity: 49,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1061,
    name: "Jamal Vanausdal",
    country: {
      name: "Morocco",
      code: "ma",
    },
    company: "Hubbard, Bruce Esq",
    date: "2017-05-25",
    status: "proposal",
    activity: 87,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1062,
    name: "Cecily Hollack",
    country: {
      name: "Bolivia",
      code: "bo",
    },
    company: "Arthur A Oliver & Son Inc",
    date: "2020-05-09",
    status: "negotiation",
    activity: 5,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1063,
    name: "Carmelina Lindall",
    country: {
      name: "Puerto Rico",
      code: "pr",
    },
    company: "George Jessop Carter Jewelers",
    date: "2019-09-07",
    status: "qualified",
    activity: 77,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1064,
    name: "Maurine Yglesias",
    country: {
      name: "Taiwan",
      code: "tw",
    },
    company: "Schultz, Thomas C Md",
    date: "2015-08-10",
    status: "renewal",
    activity: 94,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1065,
    name: "Tawna Buvens",
    country: {
      name: "Indonesia",
      code: "id",
    },
    company: "H H H Enterprises Inc",
    date: "2018-03-20",
    status: "new",
    activity: 25,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1066,
    name: "Penney Weight",
    country: {
      name: "South Africa",
      code: "za",
    },
    company: "Hawaiian King Hotel",
    date: "2020-03-03",
    status: "qualified",
    activity: 96,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1067,
    name: "Elly Morocco",
    country: {
      name: "Thailand",
      code: "th",
    },
    company: "Killion Industries",
    date: "2018-09-18",
    status: "qualified",
    activity: 38,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1068,
    name: "Ilene Eroman",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Robinson, William J Esq",
    date: "2019-06-08",
    status: "new",
    activity: 49,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1069,
    name: "Vallie Mondella",
    country: {
      name: "Latvia",
      code: "lv",
    },
    company: "Private Properties",
    date: "2018-12-06",
    status: "new",
    activity: 16,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1070,
    name: "Kallie Blackwood",
    country: {
      name: "Iceland",
      code: "is",
    },
    company: "Rowley Schlimgen Inc",
    date: "2017-04-05",
    status: "unqualified",
    activity: 25,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1071,
    name: "Johnetta Abdallah",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Forging Specialties",
    date: "2015-02-02",
    status: "new",
    activity: 16,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1072,
    name: "Bobbye Rhym",
    country: {
      name: "Ukraine",
      code: "ua",
    },
    company: "Smits, Patricia Garity",
    date: "2018-08-17",
    status: "qualified",
    activity: 85,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1073,
    name: "Micaela Rhymes",
    country: {
      name: "France",
      code: "fr",
    },
    company: "H Lee Leonard Attorney At Law",
    date: "2018-09-08",
    status: "renewal",
    activity: 92,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1074,
    name: "Tamar Hoogland",
    country: {
      name: "Guatemala",
      code: "gt",
    },
    company: "A K Construction Co",
    date: "2018-11-13",
    status: "proposal",
    activity: 22,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1075,
    name: "Moon Parlato",
    country: {
      name: "Czech Republic",
      code: "cz",
    },
    company: "Ambelang, Jessica M Md",
    date: "2019-08-18",
    status: "renewal",
    activity: 64,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1076,
    name: "Laurel Reitler",
    country: {
      name: "United Kingdom",
      code: "gb",
    },
    company: "Q A Service",
    date: "2015-04-02",
    status: "negotiation",
    activity: 80,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1077,
    name: "Delisa Crupi",
    country: {
      name: "Taiwan",
      code: "tw",
    },
    company: "Wood & Whitacre Contractors",
    date: "2017-09-15",
    status: "unqualified",
    activity: 70,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1078,
    name: "Viva Toelkes",
    country: {
      name: "United States",
      code: "us",
    },
    company: "Mark Iv Press Ltd",
    date: "2017-03-27",
    status: "qualified",
    activity: 16,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1079,
    name: "Elza Lipke",
    country: {
      name: "Ireland",
      code: "ie",
    },
    company: "Museum Of Science & Industry",
    date: "2017-06-01",
    status: "proposal",
    activity: 90,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1080,
    name: "Devorah Chickering",
    country: {
      name: "Spain",
      code: "es",
    },
    company: "Garrison Ind",
    date: "2017-03-14",
    status: "proposal",
    activity: 96,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1081,
    name: "Timothy Mulqueen",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Saronix Nymph Products",
    date: "2018-07-09",
    status: "renewal",
    activity: 77,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1082,
    name: "Arlette Honeywell",
    country: {
      name: "Panama",
      code: "pa",
    },
    company: "Smc Inc",
    date: "2018-09-11",
    status: "proposal",
    activity: 46,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1083,
    name: "Dominque Dickerson",
    country: {
      name: "Argentina",
      code: "ar",
    },
    company: "E A I Electronic Assocs Inc",
    date: "2017-11-12",
    status: "qualified",
    activity: 83,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1084,
    name: "Lettie Isenhower",
    country: {
      name: "Canada",
      code: "ca",
    },
    company: "Conte, Christopher A Esq",
    date: "2016-03-01",
    status: "qualified",
    activity: 83,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1085,
    name: "Myra Munns",
    country: {
      name: "Lithuania",
      code: "lt",
    },
    company: "Anker Law Office",
    date: "2016-05-21",
    status: "unqualified",
    activity: 49,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1086,
    name: "Stephaine Barfield",
    country: {
      name: "Belgium",
      code: "be",
    },
    company: "Beutelschies & Company",
    date: "2016-01-22",
    status: "new",
    activity: 34,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1087,
    name: "Lai Gato",
    country: {
      name: "Nigeria",
      code: "ng",
    },
    company: "Fligg, Kenneth I Jr",
    date: "2016-07-26",
    status: "unqualified",
    activity: 64,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1088,
    name: "Stephen Emigh",
    country: {
      name: "Cuba",
      code: "cu",
    },
    company: "Sharp, J Daniel Esq",
    date: "2020-07-24",
    status: "renewal",
    activity: 51,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1089,
    name: "Tyra Shields",
    country: {
      name: "Honduras",
      code: "hn",
    },
    company: "Assink, Anne H Esq",
    date: "2019-11-10",
    status: "negotiation",
    activity: 11,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1090,
    name: "Tammara Wardrip",
    country: {
      name: "Saudi Arabia",
      code: "sa",
    },
    company: "Jewel My Shop Inc",
    date: "2016-06-05",
    status: "renewal",
    activity: 64,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1091,
    name: "Cory Gibes",
    country: {
      name: "Malaysia",
      code: "my",
    },
    company: "Chinese Translation Resources",
    date: "2016-02-28",
    status: "new",
    activity: 44,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1092,
    name: "Danica Bruschke",
    country: {
      name: "Taiwan",
      code: "tw",
    },
    company: "Stevens, Charles T",
    date: "2018-12-13",
    status: "unqualified",
    activity: 62,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1093,
    name: "Wilda Giguere",
    country: {
      name: "Iceland",
      code: "is",
    },
    company: "Mclaughlin, Luther W Cpa",
    date: "2017-06-16",
    status: "new",
    activity: 79,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1094,
    name: "Elvera Benimadho",
    country: {
      name: "Malaysia",
      code: "my",
    },
    company: "Tree Musketeers",
    date: "2019-02-17",
    status: "proposal",
    activity: 50,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1095,
    name: "Carma Vanheusen",
    country: {
      name: "Turkey",
      code: "tr",
    },
    company: "Springfield Div Oh Edison Co",
    date: "2019-11-26",
    status: "renewal",
    activity: 84,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1096,
    name: "Malinda Hochard",
    country: {
      name: "Serbia",
      code: "rs",
    },
    company: "Logan Memorial Hospital",
    date: "2016-07-06",
    status: "new",
    activity: 88,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1097,
    name: "Natalie Fern",
    country: {
      name: "Canada",
      code: "ca",
    },
    company: "Kelly, Charles G Esq",
    date: "2019-10-02",
    status: "proposal",
    activity: 44,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1098,
    name: "Lisha Centini",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Industrial Paper Shredders Inc",
    date: "2018-07-05",
    status: "new",
    activity: 7,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1099,
    name: "Arlene Klusman",
    country: {
      name: "Jamaica",
      code: "jm",
    },
    company: "Beck Horizon Builders",
    date: "2018-05-14",
    status: "proposal",
    activity: 99,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1100,
    name: "Alease Buemi",
    country: {
      name: "Costa Rica",
      code: "cr",
    },
    company: "Porto Cayo At Hawks Cay",
    date: "2018-03-14",
    status: "unqualified",
    activity: 0,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1101,
    name: "Louisa Cronauer",
    country: {
      name: "Costa Rica",
      code: "cr",
    },
    company: "Pacific Grove Museum Ntrl Hist",
    date: "2018-09-23",
    status: "qualified",
    activity: 3,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1102,
    name: "Angella Cetta",
    country: {
      name: "Vietnam",
      code: "vn",
    },
    company: "Bender & Hatley Pc",
    date: "2018-04-10",
    status: "qualified",
    activity: 88,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1103,
    name: "Cyndy Goldammer",
    country: {
      name: "Burkina Faso",
      code: "bf",
    },
    company: "Di Cristina J & Son",
    date: "2017-09-18",
    status: "unqualified",
    activity: 92,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1104,
    name: "Rosio Cork",
    country: {
      name: "Singapore",
      code: "sg",
    },
    company: "Green Goddess",
    date: "2017-08-19",
    status: "negotiation",
    activity: 19,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1105,
    name: "Celeste Korando",
    country: {
      name: "Costa Rica",
      code: "cr",
    },
    company: "American Arts & Graphics",
    date: "2020-06-18",
    status: "proposal",
    activity: 21,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1106,
    name: "Twana Felger",
    country: {
      name: "Croatia",
      code: "hr",
    },
    company: "Opryland Hotel",
    date: "2016-11-18",
    status: "negotiation",
    activity: 97,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1107,
    name: "Estrella Samu",
    country: {
      name: "Vietnam",
      code: "vn",
    },
    company: "Marking Devices Pubg Co",
    date: "2017-06-25",
    status: "unqualified",
    activity: 27,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1108,
    name: "Donte Kines",
    country: {
      name: "Slovakia",
      code: "sk",
    },
    company: "W Tc Industries Inc",
    date: "2019-02-16",
    status: "new",
    activity: 35,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1109,
    name: "Tiffiny Steffensmeier",
    country: {
      name: "Pakistan",
      code: "pk",
    },
    company: "Whitehall Robbins Labs Divsn",
    date: "2018-03-11",
    status: "new",
    activity: 81,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1110,
    name: "Edna Miceli",
    country: {
      name: "France",
      code: "fr",
    },
    company: "Sampler",
    date: "2017-10-15",
    status: "renewal",
    activity: 54,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1111,
    name: "Sue Kownacki",
    country: {
      name: "Jamaica",
      code: "jm",
    },
    company: "Juno Chefs Incorporated",
    date: "2017-03-17",
    status: "proposal",
    activity: 31,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1112,
    name: "Jesusa Shin",
    country: {
      name: "Ukraine",
      code: "ua",
    },
    company: "Carroccio, A Thomas Esq",
    date: "2017-04-06",
    status: "renewal",
    activity: 28,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1113,
    name: "Rolland Francescon",
    country: {
      name: "United Kingdom",
      code: "gb",
    },
    company: "Stanley, Richard L Esq",
    date: "2019-02-03",
    status: "qualified",
    activity: 45,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1114,
    name: "Pamella Schmierer",
    country: {
      name: "Belgium",
      code: "be",
    },
    company: "K Cs Cstm Mouldings Windows",
    date: "2016-09-22",
    status: "unqualified",
    activity: 34,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1115,
    name: "Glory Kulzer",
    country: {
      name: "Croatia",
      code: "hr",
    },
    company: "Comfort Inn",
    date: "2017-09-27",
    status: "unqualified",
    activity: 36,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1116,
    name: "Shawna Palaspas",
    country: {
      name: "Estonia",
      code: "ee",
    },
    company: "Windsor, James L Esq",
    date: "2017-06-25",
    status: "unqualified",
    activity: 69,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1117,
    name: "Brandon Callaro",
    country: {
      name: "Romania",
      code: "ro",
    },
    company: "Jackson Shields Yeiser",
    date: "2016-07-13",
    status: "proposal",
    activity: 55,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1118,
    name: "Scarlet Cartan",
    country: {
      name: "Panama",
      code: "pa",
    },
    company: "Box, J Calvin Esq",
    date: "2018-09-13",
    status: "renewal",
    activity: 1,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1119,
    name: "Oretha Menter",
    country: {
      name: "Panama",
      code: "pa",
    },
    company: "Custom Engineering Inc",
    date: "2017-09-11",
    status: "renewal",
    activity: 8,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1120,
    name: "Ty Smith",
    country: {
      name: "United States",
      code: "us",
    },
    company: "Bresler Eitel Framg Gllry Ltd",
    date: "2019-07-06",
    status: "unqualified",
    activity: 50,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1121,
    name: "Xuan Rochin",
    country: {
      name: "Colombia",
      code: "co",
    },
    company: "Carol, Drake Sparks Esq",
    date: "2018-05-22",
    status: "proposal",
    activity: 77,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1122,
    name: "Lindsey Dilello",
    country: {
      name: "Austria",
      code: "at",
    },
    company: "Biltmore Investors Bank",
    date: "2017-07-18",
    status: "renewal",
    activity: 65,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1123,
    name: "Devora Perez",
    country: {
      name: "Uruguay",
      code: "uy",
    },
    company: "Desco Equipment Corp",
    date: "2017-10-09",
    status: "unqualified",
    activity: 30,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1124,
    name: "Herman Demesa",
    country: {
      name: "Paraguay",
      code: "py",
    },
    company: "Merlin Electric Co",
    date: "2019-05-23",
    status: "proposal",
    activity: 10,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1125,
    name: "Rory Papasergi",
    country: {
      name: "Egypt",
      code: "eg",
    },
    company: "Bailey Cntl Co Div Babcock",
    date: "2019-03-02",
    status: "qualified",
    activity: 22,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1126,
    name: "Talia Riopelle",
    country: {
      name: "Guatemala",
      code: "gt",
    },
    company: "Ford Brothers Wholesale Inc",
    date: "2017-02-18",
    status: "new",
    activity: 69,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1127,
    name: "Van Shire",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Cambridge Inn",
    date: "2020-05-12",
    status: "new",
    activity: 4,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1128,
    name: "Lucina Lary",
    country: {
      name: "Switzerland",
      code: "ch",
    },
    company: "Matricciani, Albert J Jr",
    date: "2019-11-20",
    status: "negotiation",
    activity: 11,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1129,
    name: "Bok Isaacs",
    country: {
      name: "Chile",
      code: "cl",
    },
    company: "Nelson Hawaiian Ltd",
    date: "2016-11-10",
    status: "proposal",
    activity: 41,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1130,
    name: "Rolande Spickerman",
    country: {
      name: "Panama",
      code: "pa",
    },
    company: "Neland Travel Agency",
    date: "2016-07-11",
    status: "renewal",
    activity: 84,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1131,
    name: "Howard Paulas",
    country: {
      name: "Indonesia",
      code: "id",
    },
    company: "Asendorf, J Alan Esq",
    date: "2017-07-17",
    status: "negotiation",
    activity: 22,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1132,
    name: "Kimbery Madarang",
    country: {
      name: "Senegal",
      code: "sn",
    },
    company: "Silberman, Arthur L Esq",
    date: "2018-08-19",
    status: "negotiation",
    activity: 63,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1133,
    name: "Thurman Manno",
    country: {
      name: "Colombia",
      code: "co",
    },
    company: "Honey Bee Breeding Genetics &",
    date: "2016-05-02",
    status: "qualified",
    activity: 47,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1134,
    name: "Becky Mirafuentes",
    country: {
      name: "Serbia",
      code: "rs",
    },
    company: "Wells Kravitz Schnitzer",
    date: "2018-04-13",
    status: "unqualified",
    activity: 62,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1135,
    name: "Beatriz Corrington",
    country: {
      name: "South Africa",
      code: "za",
    },
    company: "Prohab Rehabilitation Servs",
    date: "2020-01-04",
    status: "renewal",
    activity: 55,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1136,
    name: "Marti Maybury",
    country: {
      name: "Thailand",
      code: "th",
    },
    company: "Eldridge, Kristin K Esq",
    date: "2016-02-05",
    status: "unqualified",
    activity: 3,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1137,
    name: "Nieves Gotter",
    country: {
      name: "Latvia",
      code: "lv",
    },
    company: "Vlahos, John J Esq",
    date: "2017-03-12",
    status: "proposal",
    activity: 3,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1138,
    name: "Leatha Hagele",
    country: {
      name: "Ukraine",
      code: "ua",
    },
    company: "Ninas Indian Grs & Videos",
    date: "2019-03-27",
    status: "unqualified",
    activity: 67,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1139,
    name: "Valentin Klimek",
    country: {
      name: "Ivory Coast",
      code: "ci",
    },
    company: "Schmid, Gayanne K Esq",
    date: "2019-08-06",
    status: "unqualified",
    activity: 14,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1140,
    name: "Melissa Wiklund",
    country: {
      name: "Japan",
      code: "jp",
    },
    company: "Moapa Valley Federal Credit Un",
    date: "2018-03-20",
    status: "qualified",
    activity: 8,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1141,
    name: "Sheridan Zane",
    country: {
      name: "Croatia",
      code: "hr",
    },
    company: "Kentucky Tennessee Clay Co",
    date: "2016-02-15",
    status: "qualified",
    activity: 17,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1142,
    name: "Bulah Padilla",
    country: {
      name: "Philippines",
      code: "ph",
    },
    company: "Admiral Party Rentals & Sales",
    date: "2016-02-10",
    status: "proposal",
    activity: 58,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1143,
    name: "Audra Kohnert",
    country: {
      name: "Netherlands",
      code: "nl",
    },
    company: "Nelson, Karolyn King Esq",
    date: "2019-07-16",
    status: "unqualified",
    activity: 82,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1144,
    name: "Daren Weirather",
    country: {
      name: "Israel",
      code: "il",
    },
    company: "Panasystems",
    date: "2015-07-23",
    status: "negotiation",
    activity: 96,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1145,
    name: "Fernanda Jillson",
    country: {
      name: "Mexico",
      code: "mx",
    },
    company: "Shank, Edward L Esq",
    date: "2017-07-02",
    status: "unqualified",
    activity: 92,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1146,
    name: "Gearldine Gellinger",
    country: {
      name: "Egypt",
      code: "eg",
    },
    company: "Megibow & Edwards",
    date: "2019-08-17",
    status: "proposal",
    activity: 18,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1147,
    name: "Chau Kitzman",
    country: {
      name: "Paraguay",
      code: "py",
    },
    company: "Benoff, Edward Esq",
    date: "2019-07-04",
    status: "new",
    activity: 9,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1148,
    name: "Theola Frey",
    country: {
      name: "Vietnam",
      code: "vn",
    },
    company: "Woodbridge Free Public Library",
    date: "2020-03-14",
    status: "unqualified",
    activity: 44,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1149,
    name: "Cheryl Haroldson",
    country: {
      name: "France",
      code: "fr",
    },
    company: "New York Life John Thune",
    date: "2018-04-03",
    status: "new",
    activity: 55,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1150,
    name: "Laticia Merced",
    country: {
      name: "Burkina Faso",
      code: "bf",
    },
    company: "Alinabal Inc",
    date: "2017-03-04",
    status: "unqualified",
    activity: 21,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1151,
    name: "Carissa Batman",
    country: {
      name: "Greece",
      code: "gr",
    },
    company: "Poletto, Kim David Esq",
    date: "2016-05-05",
    status: "negotiation",
    activity: 91,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1152,
    name: "Lezlie Craghead",
    country: {
      name: "Panama",
      code: "pa",
    },
    company: "Chang, Carolyn Esq",
    date: "2019-05-28",
    status: "renewal",
    activity: 30,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1153,
    name: "Ozell Shealy",
    country: {
      name: "Pakistan",
      code: "pk",
    },
    company: "Silver Bros Inc",
    date: "2016-08-19",
    status: "proposal",
    activity: 14,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1154,
    name: "Arminda Parvis",
    country: {
      name: "Indonesia",
      code: "id",
    },
    company: "Newtec Inc",
    date: "2020-02-09",
    status: "proposal",
    activity: 77,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1155,
    name: "Reita Leto",
    country: {
      name: "Belgium",
      code: "be",
    },
    company: "Creative Business Systems",
    date: "2020-04-03",
    status: "unqualified",
    activity: 58,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1156,
    name: "Yolando Luczki",
    country: {
      name: "France",
      code: "fr",
    },
    company: "Dal Tile Corporation",
    date: "2015-01-27",
    status: "renewal",
    activity: 78,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1157,
    name: "Lizette Stem",
    country: {
      name: "Slovakia",
      code: "sk",
    },
    company: "Edward S Katz",
    date: "2018-08-06",
    status: "new",
    activity: 67,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1158,
    name: "Gregoria Pawlowicz",
    country: {
      name: "Egypt",
      code: "eg",
    },
    company: "Oh My Goodknits Inc",
    date: "2020-02-20",
    status: "renewal",
    activity: 29,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1159,
    name: "Carin Deleo",
    country: {
      name: "China",
      code: "cn",
    },
    company: "Redeker, Debbie",
    date: "2015-05-28",
    status: "qualified",
    activity: 13,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1160,
    name: "Chantell Maynerich",
    country: {
      name: "Estonia",
      code: "ee",
    },
    company: "Desert Sands Motel",
    date: "2016-09-05",
    status: "unqualified",
    activity: 75,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1161,
    name: "Dierdre Yum",
    country: {
      name: "Czech Republic",
      code: "cz",
    },
    company: "Cummins Southern Plains Inc",
    date: "2016-12-20",
    status: "negotiation",
    activity: 1,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1162,
    name: "Larae Gudroe",
    country: {
      name: "Slovenia",
      code: "si",
    },
    company: "Lehigh Furn Divsn Lehigh",
    date: "2015-11-28",
    status: "unqualified",
    activity: 13,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1163,
    name: "Latrice Tolfree",
    country: {
      name: "Jamaica",
      code: "jm",
    },
    company: "United Van Lines Agent",
    date: "2018-11-11",
    status: "renewal",
    activity: 73,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1164,
    name: "Kerry Theodorov",
    country: {
      name: "Romania",
      code: "ro",
    },
    company: "Capitol Reporters",
    date: "2016-11-05",
    status: "unqualified",
    activity: 76,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1165,
    name: "Dorthy Hidvegi",
    country: {
      name: "Poland",
      code: "pl",
    },
    company: "Kwik Kopy Printing",
    date: "2020-08-13",
    status: "qualified",
    activity: 60,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1166,
    name: "Fannie Lungren",
    country: {
      name: "Belarus",
      code: "by",
    },
    company: "Centro Inc",
    date: "2015-07-06",
    status: "negotiation",
    activity: 24,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1167,
    name: "Evangelina Radde",
    country: {
      name: "Ivory Coast",
      code: "ci",
    },
    company: "Campbell, Jan Esq",
    date: "2020-02-25",
    status: "unqualified",
    activity: 93,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1168,
    name: "Novella Degroot",
    country: {
      name: "Slovenia",
      code: "si",
    },
    company: "Evans, C Kelly Esq",
    date: "2017-12-19",
    status: "unqualified",
    activity: 30,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1169,
    name: "Clay Hoa",
    country: {
      name: "Paraguay",
      code: "py",
    },
    company: "Scat Enterprises",
    date: "2016-02-22",
    status: "negotiation",
    activity: 93,
    representative: {
      name: "Amy Elsner",
      image: "amyelsner.png",
    },
  },
  {
    id: 1170,
    name: "Jennifer Fallick",
    country: {
      name: "Australia",
      code: "au",
    },
    company: "Nagle, Daniel J Esq",
    date: "2016-12-24",
    status: "unqualified",
    activity: 88,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1171,
    name: "Irma Wolfgramm",
    country: {
      name: "Belgium",
      code: "be",
    },
    company: "Serendiquity Bed & Breakfast",
    date: "2020-10-18",
    status: "negotiation",
    activity: 70,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1172,
    name: "Eun Coody",
    country: {
      name: "Taiwan",
      code: "tw",
    },
    company: "Ray Carolyne Realty",
    date: "2018-02-12",
    status: "qualified",
    activity: 61,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1173,
    name: "Sylvia Cousey",
    country: {
      name: "Ireland",
      code: "ie",
    },
    company: "Berg, Charles E",
    date: "2018-06-10",
    status: "unqualified",
    activity: 91,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1174,
    name: "Nana Wrinkles",
    country: {
      name: "Austria",
      code: "at",
    },
    company: "Ray, Milbern D",
    date: "2017-04-11",
    status: "renewal",
    activity: 98,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1175,
    name: "Layla Springe",
    country: {
      name: "South Africa",
      code: "za",
    },
    company: "Chadds Ford Winery",
    date: "2019-07-27",
    status: "unqualified",
    activity: 97,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
  },
  {
    id: 1176,
    name: "Joesph Degonia",
    country: {
      name: "Serbia",
      code: "rs",
    },
    company: "A R Packaging",
    date: "2020-04-23",
    status: "renewal",
    activity: 56,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1177,
    name: "Annabelle Boord",
    country: {
      name: "Guatemala",
      code: "gt",
    },
    company: "Corn Popper",
    date: "2020-09-16",
    status: "proposal",
    activity: 76,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1178,
    name: "Stephaine Vinning",
    country: {
      name: "Australia",
      code: "au",
    },
    company: "Birite Foodservice Distr",
    date: "2016-05-14",
    status: "negotiation",
    activity: 43,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1179,
    name: "Nelida Sawchuk",
    country: {
      name: "South Africa",
      code: "za",
    },
    company: "Anchorage Museum Of Hist & Art",
    date: "2018-06-22",
    status: "qualified",
    activity: 58,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1180,
    name: "Marguerita Hiatt",
    country: {
      name: "United Kingdom",
      code: "gb",
    },
    company: "Haber, George D Md",
    date: "2018-10-25",
    status: "qualified",
    activity: 72,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1181,
    name: "Carmela Cookey",
    country: {
      name: "France",
      code: "fr",
    },
    company: "Royal Pontiac Olds Inc",
    date: "2018-07-19",
    status: "proposal",
    activity: 24,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1182,
    name: "Junita Brideau",
    country: {
      name: "Indonesia",
      code: "id",
    },
    company: "Leonards Antiques Inc",
    date: "2015-03-15",
    status: "proposal",
    activity: 86,
    representative: {
      name: "Anna Fali",
      image: "annafali.png",
    },
  },
  {
    id: 1183,
    name: "Claribel Varriano",
    country: {
      name: "Ecuador",
      code: "ec",
    },
    company: "Meca",
    date: "2017-04-14",
    status: "unqualified",
    activity: 15,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1184,
    name: "Benton Skursky",
    country: {
      name: "Iceland",
      code: "is",
    },
    company: "Nercon Engineering & Mfg Inc",
    date: "2015-02-19",
    status: "proposal",
    activity: 9,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1185,
    name: "Hillary Skulski",
    country: {
      name: "France",
      code: "fr",
    },
    company: "Replica I",
    date: "2016-03-25",
    status: "unqualified",
    activity: 82,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1186,
    name: "Merilyn Bayless",
    country: {
      name: "Jamaica",
      code: "jm",
    },
    company: "20 20 Printing Inc",
    date: "2020-10-13",
    status: "unqualified",
    activity: 13,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1187,
    name: "Teri Ennaco",
    country: {
      name: "Pakistan",
      code: "pk",
    },
    company: "Publishers Group West",
    date: "2019-12-21",
    status: "unqualified",
    activity: 57,
    representative: {
      name: "Bernardo Dominic",
      image: "bernardodominic.png",
    },
  },
  {
    id: 1188,
    name: "Merlyn Lawler",
    country: {
      name: "Germany",
      code: "de",
    },
    company: "Nischwitz, Jeffrey L Esq",
    date: "2016-02-26",
    status: "renewal",
    activity: 45,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1189,
    name: "Georgene Montezuma",
    country: {
      name: "Senegal",
      code: "sn",
    },
    company: "Payne Blades & Wellborn Pa",
    date: "2018-10-11",
    status: "new",
    activity: 64,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1190,
    name: "Jettie Mconnell",
    country: {
      name: "Denmark",
      code: "dk",
    },
    company: "Coldwell Bnkr Wright Real Est",
    date: "2015-10-18",
    status: "negotiation",
    activity: 74,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
  {
    id: 1191,
    name: "Lemuel Latzke",
    country: {
      name: "Colombia",
      code: "co",
    },
    company: "Computer Repair Service",
    date: "2016-02-13",
    status: "proposal",
    activity: 79,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1192,
    name: "Melodie Knipp",
    country: {
      name: "Finland",
      code: "fi",
    },
    company: "Fleetwood Building Block Inc",
    date: "2018-03-08",
    status: "negotiation",
    activity: 19,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1193,
    name: "Candida Corbley",
    country: {
      name: "Poland",
      code: "pl",
    },
    company: "Colts Neck Medical Assocs Inc",
    date: "2017-12-02",
    status: "negotiation",
    activity: 11,
    representative: {
      name: "Onyama Limba",
      image: "onyamalimba.png",
    },
  },
  {
    id: 1194,
    name: "Karan Karpin",
    country: {
      name: "Estonia",
      code: "ee",
    },
    company: "New England Taxidermy",
    date: "2019-01-07",
    status: "proposal",
    activity: 4,
    representative: {
      name: "Stephen Shaw",
      image: "stephenshaw.png",
    },
  },
  {
    id: 1195,
    name: "Andra Scheyer",
    country: {
      name: "Romania",
      code: "ro",
    },
    company: "Ludcke, George O Esq",
    date: "2016-08-14",
    status: "qualified",
    activity: 62,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1196,
    name: "Felicidad Poullion",
    country: {
      name: "Greece",
      code: "gr",
    },
    company: "Mccorkle, Tom S Esq",
    date: "2016-03-05",
    status: "renewal",
    activity: 64,
    representative: {
      name: "Elwin Sharvill",
      image: "elwinsharvill.png",
    },
  },
  {
    id: 1197,
    name: "Belen Strassner",
    country: {
      name: "Ivory Coast",
      code: "ci",
    },
    company: "Eagle Software Inc",
    date: "2015-12-14",
    status: "qualified",
    activity: 91,
    representative: {
      name: "Xuxue Feng",
      image: "xuxuefeng.png",
    },
  },
  {
    id: 1198,
    name: "Gracia Melnyk",
    country: {
      name: "Costa Rica",
      code: "cr",
    },
    company: "Juvenile & Adult Super",
    date: "2019-06-01",
    status: "unqualified",
    activity: 40,
    representative: {
      name: "Asiya Javayant",
      image: "asiyajavayant.png",
    },
  },
  {
    id: 1199,
    name: "Jolanda Hanafan",
    country: {
      name: "Cameroon",
      code: "cm",
    },
    company: "Perez, Joseph J Esq",
    date: "2015-12-09",
    status: "qualified",
    activity: 27,
    representative: {
      name: "Ivan Magalhaes",
      image: "ivanmagalhaes.png",
    },
  },
];
