import { listUnderwriters } from "../../../src/graphql/queries";

import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, "firstName") || ""} ${
        params.getValue(params.id, "lastName") || ""
      }`,
  },
];

/*
    type Underwriter @model {
        id: ID!  
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        employerName: String!
        businessNumber: String!
        mobile: String
        phone: String
        }
*/

const rows = [
  {
    id: 1,
    email: "info@underwriters.com.au",
    lastName: "Snow",
    firstName: "Jon",
    employerName: "Underwriters AU",
    status: "Active",
  },
  {
    id: 2,
    email: "cersei@aami.com.au",
    lastName: "Lannister",
    firstName: "Cersei",
    employerName: "AAMI",
    status: "Active",
  },
  {
    id: 3,
    email: "jaime@comsec.com.au",
    lastName: "Lannister",
    firstName: "Jaime",
    employerName: "Commonwealth Securities",
    status: "Active",
  },
  {
    id: 4,
    email: "info@underwriters.com.au",
    lastName: "Stark",
    firstName: "Arya",
    employerName: "Underwriters AU",
    status: "Active",
  },
  {
    id: 5,
    email: "info@underwriters.com.au",
    lastName: "Targaryen",
    firstName: "Daenerys",
    employerName: "Underwriters AU",
    status: "Pending",
  },
  {
    id: 6,
    email: "info@underwriters.com.au",
    lastName: "Melisandre",
    firstName: "Missy",
    employerName: "Underwriters AU",
    status: "Pending",
  },
  {
    id: 7,
    email: "info@underwriters.com.au",
    lastName: "Clifford",
    firstName: "Ferrara",
    employerName: "Underwriters AU",
    status: "Pending",
  },
  {
    id: 8,
    email: "info@underwriters.com.au",
    lastName: "Frances",
    firstName: "Rossini",
    employerName: "Underwriters AU",
    status: "Active",
  },
  {
    id: 9,
    email: "info@underwriters.com.au",
    lastName: "Roxie",
    firstName: "Harvey",
    employerName: "Underwriters AU",
    status: "Active",
  },
];

const cols = [
  // {
  //   field: "dateCreated",
  //   headerName: "Date Created",
  //   type: "date",
  //   width: 155,
  // },
  { field: "status", headerName: "Status", width: 125 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, "firstName") || ""} ${
        params.getValue(params.id, "lastName") || ""
      }`,
  },
  {
    field: "company",
    headerName: "Company",
    width: 225,
  },
];

const useStyles = makeStyles({
  root: {
    "& .completed": {
      backgroundColor: "rgba(144, 238, 144, .25)",
      color: "darkgreen",
    },
    "& .pending": {
      backgroundColor: "rgba(235, 232, 52, .25)",
      color: "orange",
    },
    "& .new": {
      backgroundColor: "rgba(64, 50, 168, .25)",
      color: "darkblue",
    },
  },
});

export default function UnderwritersTable({ setSelectedClientId, clientData }) {
  const classes = useStyles();
  const [selectionModel, setSelectionModel] = useState([]);

  return (
    <div style={{ height: 400, width: "100%" }} className={classes.root}>
      <DataGrid
        rows={rows}
        columns={cols}
        pageSize={15}
        rowsPerPageOptions={[5]}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectedClientId(newSelectionModel);
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        getCellClassName={(params) => {
          if (params.field !== "status") {
            return "";
          } else {
            if (params.value === "Active") {
              return "completed";
            } else if (params.value === "Pending") {
              return "pending";
            } else {
              return "new";
            }
          }
        }}
      />
    </div>
  );
}
