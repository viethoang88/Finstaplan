const frequencyToTextMap = {
  weekly: "/ Week",
  fortnightly: "/ Fortnight",
  monthly: "/ Month",
  quarterly: "/ Quarter",
  biAnnually: "/ 6 Months",
  annually: "/ Year",
};

const topStyles = {
  textAlign: "center",
  //   fontWeight: "bold",
  position: "relative",
  top: "-1rem",
};
const bottomStyles = {
  fontWeight: "bold",
  fontSize: "120%",
  position: "relative",
  top: "-2.25rem",
  textAlign: "center",
};

const RenderBudgetItem = ({ frequency, id, label, type, value }) => {
  return (
    <div style={{ display: "inline-block" }}>
      <div style={topStyles}>
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumSignificantDigits: 2,
        }).format(value)}{" "}
        {frequencyToTextMap[frequency]}
      </div>
      <br />
      <div style={bottomStyles}>{label}</div>
    </div>
  );
};

export default RenderBudgetItem;
