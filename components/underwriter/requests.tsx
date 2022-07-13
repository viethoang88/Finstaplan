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

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const cols = [
  {
    field: "dateCreated",
    headerName: "Date Created",
    type: "date",
    width: 155,
  },
  { field: "status", headerName: "Status", width: 125 },
  { field: "advisorName", headerName: "Referrer", width: 225 },
  {
    field: "dealerGroup",
    headerName: "Dealer Group",
    width: 225,
  },
  {
    field: "clientName",
    headerName: "Client",
    width: 225,
  },
  {
    field: "dob",
    headerName: "DOB",
    type: "date",
    width: 125,
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 125,
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

export default function Requests({ setSelectedClientId, clientData }) {
  const classes = useStyles();
  const [selectionModel, setSelectionModel] = useState([]);

  return (
    <div style={{ height: 1200, width: "100%" }} className={classes.root}>
      <DataGrid
        rows={clientData}
        columns={cols}
        pageSize={15}
        rowsPerPageOptions={[15]}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectedClientId(newSelectionModel);
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        getCellClassName={(params) => {
          if (params.field !== "status") {
            return "";
          } else {
            if (params.value === "Completed") {
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
