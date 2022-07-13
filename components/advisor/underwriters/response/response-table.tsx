/*
# Underwriters:
- General results: Results by client and by benefit type with max cover offered, possible exclusions, possible loadings, notes as columns.
	- one row for each benefit type from each underwriter response.
- Comparison results: Results by client and by benefit type with columns as different underwriter responses for that benefit type.

type PreassessmentResponse
  @model
  @key(fields: ["id"])
  #@key(name: "id", fields: ["id"])
  @key(name: "byAdvisor", fields: ["advisorID"])
  @key(name: "byUnderwriter", fields: ["underwriterID"])
  @key(
    name: "byPreassessmentResponse"
    fields: ["preassessmentID", "underwriterID"]
  )
  @key(
    name: "byClientAndAdvisor"
    fields: ["clientID", "preassessmentID", "advisorID"]
  ) {
  id: ID!
  underwriterID: ID!
  clientID: ID!
  advisorID: ID!
  preassessmentID: ID!
  underwriter: Underwriter! @connection(fields: ["underwriterID"])
  response: AWSJSON
  # This is only for a many-many connection:
  #underwriter: PreassessmentResponseUnderwriterAdvisor!
  #  @connection(keyName: "byUnderwriter", fields: ["id"])
}

response shape: {
    referenceNumber: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    coverRequired: {
      life: activeClient?.coverRequired?.life,
      tpd: activeClient?.coverRequired?.tpd,
      monthlyIP: activeClient?.coverRequired?.ip,
      trauma: activeClient?.coverRequired?.trauma,
    },
    maxCoverOffered: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    possibleExclusions: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    possibleLoadings: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    notes: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    generalNotes: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
}

desired response row: {
    clientFullName: "",
    coverRequired: 0,
    maxCoverOffered: "",
    underwriterFullName: "",
    underwriterCompany: "",
    referenceNumber: "",        // HIDDEN but display on hover? or on click?
    possibleExclusions: "",
    possibleLoadings: "",
    notes: "",                  // MAYBE HIDDEN but display on hover? or on click?
    generalNotes: "",           // HIDDEN but display on hover? or on click?
}

*/
import { getPreassessments } from "../../../../store/auth/get-preassessments";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { valueFormatter } from "../../../../helpers/util";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

// const columns = [
//   { field: "clientFullName", header: "Client" },
//   //   { field: "referenceNumber", headerName: "Ref Number", width: 150 }
//   {
//     field: "coverRequired",
//     header: "Cover Required",
//     type: "number",
//     valueFormatter: ({ value }) => valueFormatter(Number(value)),
//   },
//   {
//     field: "maxCoverOffered",
//     header: "Max Cover Offered",

//     type: "number",
//     valueFormatter: ({ value }) => valueFormatter(Number(value)),
//   },
//   {
//     field: "underwriterFullName",
//     header: "Underwriter",
//   },
//   {
//     field: "underwriterCompany",
//     header: "Company",
//   },
// ];

export const priceBodyTemplate = (key, rowData) => {
  console.log(rowData);
  console.log(key);
  return valueFormatter(rowData?.[key]);
};

export const maxCoverBody = (rowData, { field }) => {
  if (rowData[field] >= rowData["coverRequired"]) {
    return (
      <span
        style={{
          fontWeight: "bold",
          color: "green",
          backgroundColor: "lightgreen",
          borderRadius: "5px",
          padding: "1rem",
        }}
      >
        {valueFormatter(rowData[field])}
      </span>
    );
  } else {
    return (
      <span
        style={{
          color: "darkred",
          backgroundColor: "lightsalmon",
          borderRadius: "5px",
          padding: "1rem",
        }}
      >
        {valueFormatter(rowData[field])}
      </span>
    );
  }
};

const ResponseTable = ({
  setActiveTable,
  setActiveId,
  clientsData,
  setActiveClientName,
}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  useEffect(() => {
    initFilters1();
    getPreassessments();
  }, []);

  const [filters1, setFilters1] = useState(null);
  const filterClearTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-times"
        onClick={options.filterClearCallback}
        className="p-button-secondary"
      ></Button>
    );
  };

  const filterApplyTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-check"
        onClick={options.filterApplyCallback}
        className="p-button-success"
      ></Button>
    );
  };

  const filterFooterTemplate = () => {
    return (
      <div className="p-px-3 p-pt-0 p-pb-3 p-text-center p-text-bold">
        Customized Buttons
      </div>
    );
  };
  const balanceFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const renderHeader1 = () => {
    return (
      <div className="p-d-flex p-jc-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search..."
          />
        </span>
      </div>
    );
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      clientFullName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      underwriterFullName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      underwriterCompany: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      coverType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      coverRequired: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },

      maxCoverOffered: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      //   representative: { value: null, matchMode: FilterMatchMode.IN },
      //   date: {
      //     operator: FilterOperator.AND,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      //   },
      //   status: {
      //     operator: FilterOperator.OR,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      //   },
      //   activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
    });
    setGlobalFilterValue1("");
  };

  const clearFilter1 = () => {
    initFilters1();
  };
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  //   const statusOrderBodyTemplate = (rowData) => {
  //     return (
  //       <span className={`order-badge order-${rowData.status.toLowerCase()}`}>
  //         {rowData.status}
  //       </span>
  //     );
  //   };

  //   const searchBodyTemplate = () => {
  //     return <Button icon="pi pi-search" />;
  //   };

  //   const imageBodyTemplate = (rowData) => {
  //     return (
  //       <img
  //         src={`showcase/demo/images/product/${rowData.image}`}
  //         onError={(e) =>
  //           (e.target.src =
  //             "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
  //         }
  //         alt={rowData.image}
  //         className="product-image"
  //       />
  //     );
  //   };

  //   const ratingBodyTemplate = (rowData) => {
  //     return <Rating value={rowData.rating} readOnly cancel={false} />;
  //   };

  //   const statusBodyTemplate = (rowData) => {
  //     return (
  //       <span
  //         className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
  //       >
  //         {rowData.inventoryStatus}
  //       </span>
  //     );
  //   };

  const rowExpansionTemplate = (row) => {
    return (
      <div>
        <h5>Details</h5>
        <tr>
          <td>
            <TableContainer component={Paper}>
              <Table style={{ minWidth: "650" }} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align={"left"}
                      component="th"
                      scope="row"
                    >
                      Reference Number
                    </TableCell>
                    <TableCell style={{ width: "92%" }} align={"left"}>
                      {row.referenceNumber}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align={"left"}
                      component="th"
                      scope="row"
                    >
                      Possible Exclusions
                    </TableCell>
                    <TableCell style={{ width: "92%" }} align={"left"}>
                      {row.possibleExclusions}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align={"left"}
                      component="th"
                      scope="row"
                    >
                      Possible Loadings
                    </TableCell>
                    <TableCell style={{ width: "92%" }} align={"left"}>
                      {row.possibleLoadings}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align={"left"}
                      component="th"
                      scope="row"
                    >
                      Notes
                    </TableCell>
                    <TableCell style={{ width: "92%" }} align={"left"}>
                      {row.notes}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align={"left"}
                      component="th"
                      scope="row"
                    >
                      General Notes
                    </TableCell>
                    <TableCell style={{ width: "92%" }} align={"left"}>
                      {row.generalNotes}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </td>
        </tr>
      </div>
    );
  };

  //   const header = (
  //     <div className="table-header-container">
  //       <Button
  //         icon="pi pi-plus"
  //         label="Expand All"
  //         onClick={expandAll}
  //         className="p-mr-2"
  //       />
  //       <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
  //     </div>
  //   );

  const clientBody = (rowData, { field }) => {
    return (
      <>
        {rowData[field]}
        <Button
          icon="pi pi-ellipsis-v" // pi-table, pi-eye
          tooltip={"Compare quotes for this client"}
          className="p-button-rounded p-button-primary"
          style={{ marginRight: "0.25rem", float: "right" }}
          onClick={() => {
            setActiveTable("byClientComparison");
            setActiveId(rowData["clientId"]);
            setActiveClientName(rowData["clientFullName"]);
            // dispatch(getClientSetActive(rowData["id"]));
            // dispatch(setActiveClient(clientData));
          }}
        />
      </>
    );
  };

  const header = renderHeader1();
  return (
    <div>
      <div className="card">
        <DataTable
          header={header}
          dataKey="id"
          paginator
          rows={15}
          value={clientsData}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          filters={filters1}
          filterDisplay="menu"
          // filterDisplay="row"
          // loading={loading1}
          responsiveLayout="scroll"
          globalFilterFields={[
            "clientFullName",
            "coverType",
            "coverRequired",
            "maxCoverOffered",
            "underwriterFullName",
            "underwriterCompany",
          ]}
          emptyMessage="No results found."
          //   dataKey="id"
          //   header={header}
        >
          <Column expander style={{ width: "3em" }} />
          <Column
            field="clientFullName"
            header="Client"
            sortable
            filter
            filterPlaceholder={"Client Name..."}
            filterField={"clientFullName"}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            body={clientBody}
            // filterFooter={filterFooterTemplate}
          />
          <Column
            field="coverType"
            header="Cover"
            sortable
            filterPlaceholder={"Cover Type..."}
            filterField={"coverType"}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            filter // filterFooter={filterFooterTemplate}
          />
          <Column
            field="coverRequired"
            header="Cover Required"
            dataType="numeric"
            body={priceBodyTemplate.bind(null, "coverRequired")}
            sortable
            filter
            filterPlaceholder={"Cover Required..."}
            filterField={"coverRequired"}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            // filterFooter={filterFooterTemplate}
            filterElement={balanceFilterTemplate}
          />
          <Column
            field="maxCoverOffered"
            header="Max Cover Offered"
            dataType="numeric"
            // body={priceBodyTemplate.bind(null, "maxCoverOffered")}
            body={maxCoverBody}
            sortable
            filter
            filterPlaceholder={"Max Cover Offered..."}
            filterField={"maxCoverOffered"}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            // filterFooter={filterFooterTemplate}
            filterElement={balanceFilterTemplate}
          />
          <Column
            field="underwriterFullName"
            header="Underwriter"
            sortable
            filter
            filterPlaceholder={"Underwriter name..."}
            filterField={"underwriterFullName"}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            // filterFooter={filterFooterTemplate}
          />
          <Column
            field="underwriterCompany"
            header="Company"
            sortable
            filter
            filterPlaceholder={"Underwriter Company..."}
            filterField={"underwriterCompany"}
            filterClear={filterClearTemplate}
            filterApply={filterApplyTemplate}
            // filterFooter={filterFooterTemplate}
          />
          {/* <Column
            field="rating"
            header="Reviews"
            sortable
            body={ratingBodyTemplate}
          />
          <Column
            field="inventoryStatus"
            header="Status"
            sortable
            body={statusBodyTemplate}
          /> */}
        </DataTable>
      </div>
    </div>
  );
};

export default ResponseTable;
