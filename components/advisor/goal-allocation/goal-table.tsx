import { valueFormatter } from "../../../helpers/util";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const styleAmount = (amount) => {
  if (amount < 0) {
    return (
      <span style={{ color: "darkred", fontWeight: "bold" }}>
        ({valueFormatter(amount * -1)})
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

const COLS = [
  "Start Date",
  "End Date",
  "Years to Start Date",
  "Rate",
  "Allocation Now",
  "Portfolio",
  "Portfolio Amount",
  "Portfolio Amount Remaining",
  "Funded",
  "Funded Amount",
  "Monthly Savings Required",
];

const GoalTable = ({ shapedData }) => {
  console.log("--- GOAL TABLE SHAPED DATA ---");
  console.log(shapedData);

  return (
    <>
      {shapedData && shapedData.map && (
        <TableContainer component={Paper}>
          {console.log(" HI THERE LOL ")}
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
                  key={row.rate}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.startDate}
                  </TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.yearsToStartDate.toFixed(2)}</TableCell>
                  <TableCell>{percentFormatter(row.rate)}</TableCell>
                  <TableCell>{valueFormatter(row.allocationNow)}</TableCell>
                  <TableCell>{row.portfolio}</TableCell>
                  <TableCell>{styleAmount(row.portfolioAmount)}</TableCell>
                  <TableCell>
                    {styleAmount(row.portfolioAmountRemaining)}
                  </TableCell>
                  <TableCell
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
                  </TableCell>
                  <TableCell>
                    {valueFormatter(row.monthlySavingsRequired)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default GoalTable;
