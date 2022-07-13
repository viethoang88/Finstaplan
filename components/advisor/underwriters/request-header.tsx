import Paper from "@mui/material/Paper";

const detailsStyle = {
  position: "absolute",
  left: "12rem",
};

export const createFromLineFromAvailableData = (
  advisorName,
  advisorSurname,
  advisorCompany,
  advisorDealerGroup
) => {
  let string = "";
  if (advisorName !== undefined) string += advisorName;
  if (advisorSurname !== undefined) string += " " + advisorSurname;
  if (advisorCompany !== undefined) string += ", " + advisorCompany;
  if (advisorDealerGroup !== undefined) string += ` (${advisorDealerGroup})`;
  return string;
};

const RequestHeader = ({
  advisorName,
  advisorSurname,
  advisorCompany,
  advisorDealerGroup,
  clientName,
  clientLastName,
  clientGender,
  clientDob,
}) => {
  console.log("--- IN REQUEST HEADER WITH ---");
  console.log({
    advisorName,
    advisorCompany,
    advisorDealerGroup,
    clientName,
    clientLastName,
    clientGender,
    clientDob,
  });

  const capitalizedGender =
    clientGender?.slice !== undefined &&
    `${clientGender.slice(0, 1).toUpperCase()}${clientGender.slice(1)}`;

  const fromLine = createFromLineFromAvailableData(
    advisorName,
    advisorSurname,
    advisorCompany,
    advisorDealerGroup
  );
  let dateString = "";
  try {
    const dateStringElements = clientDob.toString().split(" ");
    console.log("--- MAKING DATE STRING ----");
    console.log(dateStringElements);
    dateString = dateStringElements.slice(0, 3).join(" ");
  } catch (e) {
    console.log("--- error processing date ---");
    console.log(e);
  }

  return (
    <Paper
      elevation={3}
      style={{
        position: "relative",
        fontSize: "1.4rem",
        padding: "3.25rem",
        marginBottom: "1.25rem",
        marginTop: "0.25rem",
        // fontWeight: "bold",
      }}
    >
      <div>
        To:
        <span style={detailsStyle}>
          Underwriter name, Underwriting company,
        </span>
      </div>
      <div>
        From:
        <span style={detailsStyle}>{fromLine}</span>
      </div>
      <div>
        Regarding:
        <span style={detailsStyle}>
          {clientName}&nbsp;{clientLastName}
        </span>
      </div>
      <div>
        DOB:<span style={detailsStyle}>{dateString}</span>
      </div>
      <div>
        Gender:<span style={detailsStyle}>{capitalizedGender}</span>
      </div>
    </Paper>
  );
};

export default RequestHeader;
