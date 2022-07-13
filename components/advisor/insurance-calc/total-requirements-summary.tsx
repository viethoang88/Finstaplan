import { valueFormatter } from "../../../helpers/util";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";

const styleAmount = (amount, category) => {
  if (category === amount && category === "Total Requirement") {
    return (
      <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
        {amount}
      </span>
    );
  } else if (category === amount) {
    return <span>{amount}</span>;
  } else if (category === "Total Requirement" && amount > 0) {
    return (
      <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
        {valueFormatter(amount)}
      </span>
    );
  } else if (
    (category === "Income Requirements" && amount > 0) ||
    (category === "Offsets" && amount < 0) ||
    (category === "Liabilities & Other Lump Sums" && amount > 0)
  ) {
    return (
      <span style={{ color: "darkred", fontWeight: "bold" }}>
        ({valueFormatter(amount)})
      </span>
    );
  }
  if (amount < 0) {
    return (
      <span style={{ color: "darkgreen", fontWeight: "bold" }}>
        ({valueFormatter(amount)})
      </span>
    );
  } else {
    return valueFormatter(amount);
  }
};

const percentFormatter = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumSignificantDigits: 3,
  }).format(number);
};

const styleFundedAmount = (amount, fundedPercent) => {
  if (fundedPercent === 0) {
    return (
      <span style={{ color: "darkred", fontWeight: "bold" }}>{amount}</span>
    );
  } else if (fundedPercent === 1) {
    return (
      <span
        style={{
          color: "green",
          fontWeight: "bold",
        }}
      >
        {amount}
      </span>
    );
  } else {
    return (
      <span
        style={{
          color: "rgb(168, 86, 50)",
          fontWeight: "bold",
        }}
      >
        {amount}
      </span>
    );
  }
};

const COLS = ["", "Life", "TPD", "Trauma", "IP"];

const TotalRequirementsSummary = ({ shapedData }) => {
  const activeClient = useSelector((state) => state.auth.activeClient);
  const activePerson =
    activeClient?.activeMember === activeClient?.lastName
      ? activeClient?.lastName
      : `${activeClient?.activeMember} ${activeClient?.lastName}`;
  console.log("--- IN TOTAL REQUIREMENTS SUMMARY WITH --- ");
  console.log(shapedData);
  if (shapedData === undefined) return null;

  return (
    <div
      style={{
        padding: "2rem",
        margin: "2rem",
        position: "relative",
        top: "-1.5rem",
      }}
    >
      <h2>Summary Insurance Requirements for {activePerson}</h2>
      {shapedData && shapedData.map && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ borderBottom: "3 px solid rgb(70, 70, 70)" }}>
                {COLS.map((col) => (
                  <TableCell
                    sx={{
                      borderBottom: "2.5px solid rgb(70, 70, 70) !important",
                      fontWeight: 700,
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shapedData?.map((row) => (
                <TableRow
                  key={row?.category}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {styleAmount(row?.category, row?.category)}
                  </TableCell>
                  <TableCell>{styleAmount(row?.life, row?.category)}</TableCell>
                  <TableCell>{styleAmount(row?.tpd, row?.category)}</TableCell>
                  <TableCell>
                    {styleAmount(row?.trauma, row?.category)}
                  </TableCell>
                  <TableCell>{styleAmount(row?.ip, row?.category)}</TableCell>
                  {/* <TableCell
                    sx={{
                      backgroundColor:
                        row.funded === 0
                          ? "rgb(139, 0, 0, .45)" //"rgba(255,0,0, .35)"
                          : row.funded === 1
                          ? "rgba(144, 238, 144, .25)"
                          : "rgba(255, 160, 122, .25)",
                      fontWeight: 700,
                    }}
                  >
                    {styleFundedAmount(
                      percentFormatter(row.funded),
                      row.funded
                    )}
                  </TableCell>
                  <TableCell>
                    {styleFundedAmount(
                      valueFormatter(row.fundedAmt),
                      row.funded
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default TotalRequirementsSummary;
