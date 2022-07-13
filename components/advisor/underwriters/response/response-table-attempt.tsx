// /*
// # Underwriters:
// - General results: Results by client and by benefit type with max cover offered, possible exclusions, possible loadings, notes as columns.
// 	- one row for each benefit type from each underwriter response.
// - Comparison results: Results by client and by benefit type with columns as different underwriter responses for that benefit type.

// type PreassessmentResponse
//   @model
//   @key(fields: ["id"])
//   #@key(name: "id", fields: ["id"])
//   @key(name: "byAdvisor", fields: ["advisorID"])
//   @key(name: "byUnderwriter", fields: ["underwriterID"])
//   @key(
//     name: "byPreassessmentResponse"
//     fields: ["preassessmentID", "underwriterID"]
//   )
//   @key(
//     name: "byClientAndAdvisor"
//     fields: ["clientID", "preassessmentID", "advisorID"]
//   ) {
//   id: ID!
//   underwriterID: ID!
//   clientID: ID!
//   advisorID: ID!
//   preassessmentID: ID!
//   underwriter: Underwriter! @connection(fields: ["underwriterID"])
//   response: AWSJSON
//   # This is only for a many-many connection:
//   #underwriter: PreassessmentResponseUnderwriterAdvisor!
//   #  @connection(keyName: "byUnderwriter", fields: ["id"])
// }

// response shape: {
//     referenceNumber: {
//       life: "",
//       tpd: "",
//       monthlyIP: "",
//       trauma: "",
//     },
//     coverRequired: {
//       life: activeClient?.coverRequired?.life,
//       tpd: activeClient?.coverRequired?.tpd,
//       monthlyIP: activeClient?.coverRequired?.ip,
//       trauma: activeClient?.coverRequired?.trauma,
//     },
//     maxCoverOffered: {
//       life: "",
//       tpd: "",
//       monthlyIP: "",
//       trauma: "",
//     },
//     possibleExclusions: {
//       life: "",
//       tpd: "",
//       monthlyIP: "",
//       trauma: "",
//     },
//     possibleLoadings: {
//       life: "",
//       tpd: "",
//       monthlyIP: "",
//       trauma: "",
//     },
//     notes: {
//       life: "",
//       tpd: "",
//       monthlyIP: "",
//       trauma: "",
//     },
//     generalNotes: {
//       life: "",
//       tpd: "",
//       monthlyIP: "",
//       trauma: "",
//     },
// }

// desired response row: {
//     clientFullName: "",
//     coverRequired: 0,
//     maxCoverOffered: "",
//     underwriterFullName: "",
//     underwriterCompany: "",
//     referenceNumber: "",        // HIDDEN but display on hover? or on click?
//     possibleExclusions: "",
//     possibleLoadings: "",
//     notes: "",                  // MAYBE HIDDEN but display on hover? or on click?
//     generalNotes: "",           // HIDDEN but display on hover? or on click?
// }

// */

// import { DataGrid } from "@mui/x-data-grid";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// // import MUIDataTable from "mui-datatables";
// // import Table from "@material-ui/core/Table";
// // import TableBody from "@material-ui/core/TableBody";
// // import TableCell from "@material-ui/core/TableCell";
// // import TableContainer from "@material-ui/core/TableContainer";
// // import TableHead from "@material-ui/core/TableHead";
// // import TableRow from "@material-ui/core/TableRow";
// // import Paper from "@material-ui/core/Paper";
// import { makeStyles } from "@mui/styles";
// import { useState } from "react";
// import { valueFormatter } from "../../../../helpers/util";

// const columns = [
//   { field: "clientFullName", headerName: "Client", width: 150 },
//   //   { field: "referenceNumber", headerName: "Ref Number", width: 150 }
//   {
//     field: "coverRequired",
//     headerName: "Cover Required",
//     width: 150,
//     type: "number",
//     valueFormatter: ({ value }) => valueFormatter(Number(value)),
//   },
//   {
//     field: "maxCoverOffered",
//     headerName: "Max Cover Offered",
//     width: 150,
//     type: "number",
//     valueFormatter: ({ value }) => valueFormatter(Number(value)),
//   },
//   {
//     field: "underwriterFullName",
//     headerName: "Underwriter",
//     width: 150,
//   },
//   {
//     field: "underwriterCompany",
//     headerName: "Company",
//     width: 150,
//   },
//   //   {
//   //     field: "possibleExclusions",
//   //     headerName: "Exclusions",
//   //     width: 150,
//   //   },
//   //   {
//   //     field: "possibleLoadings",
//   //     headerName: "Loadings",
//   //     width: 150,
//   //   },
//   //     {
//   //         field: "notes",
//   //         headerName: "Notes",
//   //         width: 150,
//   //     },
//   //     {
//   //         field: "generalNotes",
//   //         headerName: "General Notes",
//   //         width: 150,
//   //     }
// ];

// const rows = [
//   {
//     id: 1,
//     referenceNumber: "123456ABC",
//     clientFullName: "Demo Test",
//     coverRequired: 150000,
//     maxCoverOffered: 100000,
//     underwriterFullName: "Timmy McTest",
//     underwriterCompany: "AIH",
//     possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
//     possibleLoadings: "Some loading, other loading, another loading",
//     notes:
//       "These are some notes about demo test written by underwriter Timmy McTest",
//     generalNotes:
//       "Here are more general notes about that client and they will be longer to see how this looks when written",
//   },
// ];

// const useStyles = makeStyles({
//   root: {
//     "& .completed": {
//       backgroundColor: "rgba(144, 238, 144, .25)",
//       color: "darkgreen",
//     },
//     "& .pending": {
//       backgroundColor: "rgba(235, 232, 52, .25)",
//       color: "orange",
//     },
//     "& .new": {
//       backgroundColor: "rgba(64, 50, 168, .25)",
//       color: "darkblue",
//     },
//   },
// });
// /*
// - General results: Results by client and by benefit type with max cover offered, possible exclusions, possible loadings, notes as columns.
// 	- one row for each benefit type from each underwriter response.
// */
// export default function ResponseTable() {
//   const classes = useStyles();
//   const [selectionModel, setSelectionModel] = useState([]);

//   const options = {
//     filter: true,
//     onFilterChange: (changedColumn, filterList) => {
//       console.log(changedColumn, filterList);
//     },
//     selectableRows: "single",
//     filterType: "dropdown",
//     responsive: "scrollMaxHeight",
//     rowsPerPage: 10,
//     expandableRows: true,
//     renderExpandableRow: (rowData, rowMeta) => {
//       console.log(rowData, rowMeta);
//       return (
//         <>
//           <tr>
//             <td colSpan={6}>
//               <TableContainer component={Paper}>
//                 <Table style={{ minWidth: "650" }} aria-label="simple table">
//                   <TableBody>
//                     {rows.map((row) => (
//                       <>
//                         <TableRow key={row.id}>
//                           <TableCell component="th" scope="row">
//                             Reference Number
//                           </TableCell>
//                           <TableCell align="right">
//                             {row.referenceNumber}
//                           </TableCell>
//                         </TableRow>
//                         <TableRow key={row.id}>
//                           <TableCell component="th" scope="row">
//                             Possible Exclusions
//                           </TableCell>
//                           <TableCell align="right">
//                             {row.possibleExclusions}
//                           </TableCell>
//                         </TableRow>
//                         <TableRow key={row.id}>
//                           <TableCell component="th" scope="row">
//                             Possible Loadings
//                           </TableCell>
//                           <TableCell align="right">
//                             {row.possibleLoadings}
//                           </TableCell>
//                         </TableRow>
//                         <TableRow key={row.id}>
//                           <TableCell component="th" scope="row">
//                             Notes
//                           </TableCell>
//                           <TableCell align="right">{row.notes}</TableCell>
//                         </TableRow>
//                         <TableRow key={row.id}>
//                           <TableCell component="th" scope="row">
//                             General Notes
//                           </TableCell>
//                           <TableCell align="right">
//                             {row.generalNotes}
//                           </TableCell>
//                         </TableRow>
//                       </>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </td>
//           </tr>
//         </>
//       );
//     },
//     page: 1,
//   };

//   return (
//     <div style={{ height: 400, width: "100%" }} className={classes.root}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={15}
//         rowsPerPageOptions={[5]}
//         onSelectionModelChange={(newSelectionModel) => {
//           setSelectionModel(newSelectionModel);
//         }}
//         selectionModel={selectionModel}
//         options={options}
//         getCellClassName={(params) => {
//           if (params.field !== "status") {
//             return "";
//           } else {
//             if (params.value === "Completed") {
//               return "completed";
//             } else if (params.value === "Pending") {
//               return "pending";
//             } else {
//               return "new";
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }
