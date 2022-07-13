import { useState } from "react";
import { useSelector } from "react-redux";
import { Card } from "primereact/card";
import classes from "../authorities/authorities.module.css";
import ChecklistGroup from "./checklist-group";
import AnimatedStepButton from "../../ui/animated-step-button";
import { faFileExcel } from "@fortawesome/free-regular-svg-icons";

const _questions = {
  keyInformation: {
    label: "Key Information",
    options: [
      {
        question: "Photo ID",
        selected: false,
        value: "photoID",
        files: [],
      },
      {
        question: "Payslips",
        selected: false,
        value: "payslips",
        files: [],
      },
      {
        question: "Tax File Number (TFN)",
        selected: false,
        value: "tfn",
        files: [],
      },
      {
        question: "A copy of your most recent tax return",
        selected: false,
        value: "taxReturns",
        files: [],
      },
      {
        question:
          "A Centrelink statement of Income and Assets.(Available on request from Centrelink where applicable)",
        selected: false,
        value: "govtStatements",
        files: [],
      },
    ],
  },
  investments: {
    label: "Investments",
    options: [
      {
        question: "Bank Statements",
        selected: false,
        value: "bankStatements",
        files: [],
      },
      {
        question: "Term deposit",
        selected: false,
        value: "termDeposits",
        files: [],
      },
      {
        question: "Shares",
        selected: false,
        value: "shares",
        files: [],
      },
      {
        question: "Superannuation/Pension account(s)",
        selected: false,
        value: "pensionAccounts",
        files: [],
      },
      {
        question: "Managed fund(s)",
        selected: false,
        value: "managedFunds",
        files: [],
      },
      {
        question: "Investment properties",
        selected: false,
        value: "investmentProperties",
        files: [],
      },
      {
        question: "Other holdings",
        selected: false,
        value: "otherHoldings",
        files: [],
      },
    ],
  },
  debts: {
    label: "Debts",
    options: [
      {
        question: "Home loans",
        selected: false,
        value: "homeLoans",
        files: [],
      },
      {
        question: "Credit cards",
        selected: false,
        value: "creditCards",
        files: [],
      },
      {
        question: "Personal loans",
        selected: false,
        value: "personalLoans",
        files: [],
      },
      {
        question: "Car loans",
        selected: false,
        value: "carLoans",
        files: [],
      },
      {
        question: "Investment loans",
        selected: false,
        value: "investmentLoans",
        files: [],
      },
      {
        question: "Personal guarantees",
        selected: false,
        value: "personalGuarantees",
        files: [],
      },
      {
        question: "Other debts",
        selected: false,
        value: "otherDebts",
        files: [],
      },
    ],
  },
  insurance: {
    label: "Insurance",
    options: [
      {
        question:
          "Details of any risk insurance you have e.g. Life insurance, Income protection, Trauma insurance",
        selected: false,
        value: "insuranceDetails",
        files: [],
      },
      {
        question: "Medical Information",
        selected: false,
        value: "medicalInformation",
        files: [],
      },
    ],
  },
};

const checklistGroupStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  width: "100%",
  // alignItems: "space-between",
  justifyContent: "space-around",
};

const Checklist = () => {
  const [questions, setQuestions] = useState(_questions);

  const [activeIndex, setActiveIndex] = useState(0);

  const header = (
    <div className={classes.header_container}>
      <img
        src="/assets/images/my-financial-mentors.jpg"
        style={{ maxHeight: "100px", maxWidth: "150px" }}
      />
    </div>
  );

  const checklistGroups = Object.entries(questions).map(
    ([section, { label, options }], idx) => (
      <ChecklistGroup
        section={section}
        sectionLabel={label}
        options={options}
      />
    )
  );
  const handleNextClicked = (e) => {
    e.preventDefault();
    console.log("NEXT CLICKED");
  };

  return (
    <Card
      title={"Checklist"}
      header={header}
      className={`${classes.container} p-shadow-24`}
    >
      <div style={checklistGroupStyles}>{checklistGroups}</div>
      <div className={classes.step_button}>
        <AnimatedStepButton
          direction="right"
          text="Submit to complete!"
          onClick={handleNextClicked}
        />
      </div>
    </Card>
  );
};

export default Checklist;
