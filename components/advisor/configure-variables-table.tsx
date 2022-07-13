import { useEffect } from "react";
import SimpleCrudTable from "../ui/simple-crud-table";
import { useSelector } from "react-redux";

const ConfigureVariablesTable = (props) => {
  return <div></div>;
  // return (
  //   <SimpleCrudTable
  //     data={testData}
  //     type="Dependents"
  //     hasPartner={hasPartner}
  //     empty={emptyDependent}
  //     cols={columns}
  //   />
  // );
};

export default ConfigureVariablesTable;

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const healthOptions = [
  { label: "Great", value: "Great" },
  { label: "Good", value: "Good" },
  { label: "Poor", value: "Poor" },
];

const cols = [
  { field: "firstNames", header: "First names", type: "text" },
  { field: "lastName", header: "Family name", type: "text" },
  { field: "legacyNominee", header: "Legacy Nominee?", type: "checkbox" },
  {
    field: "gender",
    header: "Gender",
    type: "select",
    options: genderOptions,
  },
  {
    field: "health",
    header: "Health",
    type: "select",
    options: healthOptions,
  },
  { field: "dateOfBirth", header: "Date of Birth", type: "date" },
];

const emptyDependent = {
  legacyNominee: false,
  firstNames: "",
  lastName: "",
  gender: "",
  health: "",
  dateOfBirth: "",
};

const testData = [
  {
    id: 1,
    legacyNominee: true,
    firstNames: "Sean Lawrence",
    lastName: "Turkeysack",
    gender: "Male",
    health: "Good",
    dateOfBirth: "22/07/1987", //new Date().toDateString(),
    relationship: "SACK",
  },
  {
    id: 2,
    legacyNominee: false,
    firstNames: "Lynn Van",
    lastName: "Sucksballs",
    gender: "Female",
    health: "Great",
    dateOfBirth: "16/10/1989", //new Date().toDateString()
    relationship: "Both",
  },
];

const Dependents = () => {
  // const dependentsData = useSelector((state) => state.factFind.dependents);

  // real data:
  // const hasPartner = useSelector((state) => state.factFind.hasPartner);
  // const clientName = useSelector((state) => state.factFind.client.firstName);
  // let partnerName;

  // testData:
  const hasPartner = true;
  const clientName = "Timmy";
  const partnerName = "Tammy";

  // get clientName and partnerName for this:
  let relationshipCol;
  let relationshipOptions;
  const columns = [...cols];

  if (hasPartner) {
    // partnerName = useSelector((state) => state.factFind.partner.firstName);
    relationshipOptions = [
      { label: "Both", value: "Both" },
      { label: clientName, value: clientName },
      { label: partnerName, value: partnerName },
    ];
    relationshipCol = {
      header: "Related to",
      field: "relationship",
      type: "select",
      options: relationshipOptions,
    };
    columns.push(relationshipCol);

    // emptyDependent.relationship = null;
    testData[0].relationship = "";
    testData[1].relationship = "";
  }

  // useEffect(() => {
  //   console.log(dependentsData);
  // }, [dependentsData]);

  return (
    <SimpleCrudTable
      data={testData}
      type="Dependents"
      hasPartner={hasPartner}
      empty={emptyDependent}
      cols={columns}
    />
  );
};
