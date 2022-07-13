import SimpleCrudTable from "../../ui/simple-crud-table";
import { useSelector } from "react-redux";
import DataManager from "../../../classes/DataManager";
/* USAGE:
const SimpleCrudTable = (props) => {
  const {
    data,
    cols,
    type,
    hasPartner,
    empty: emptyRow,
    rowGroupMode = "",
    groupField = "",
    canCreate = true,
    canDelete = true,
    id,
  } = props;
*/

// TODO: Add frequency choice for Premium (per month, year)
const testPeopleOptions = [
  { label: "Return to Family and input members", value: "" },
];

const cols = [
  { field: "company", header: "Company", type: "text" },
  { field: "policyNumber", header: "Policy Number", type: "text" },
  {
    field: "insuredPerson",
    header: "Insured",
    type: "select",
    options: testPeopleOptions,
  },
  { field: "premium", header: "Premium", type: "price" },
  {
    field: "coverType",
    header: "Cover Type",
    type: "select",
    options: [
      { label: "Life", value: "life" },
      { label: "TPD", value: "tpd" },
      { label: "Trauma", value: "trauma" },
      { label: "Income Protection", value: "ip" },
      { label: "Child Trauma", value: "childTrauma" },
      { label: "Accidental Death", value: "accidentalDeath" },
      { label: "Other", value: "other" },
    ],
  },
  { field: "coverAmount", header: "Cover Amount", type: "price" },
  { field: "otherDetails", header: "Other Details", type: "text" },
];

const emptyCover = {
  company: "",
  policyNumber: "",
  insuredPerson: "",
  premium: null,
  coverType: "",
  coverAmount: null,
  otherDetails: "",
};

const testData = [
  {
    id: "xoxo",
    company: "Turd inc",
    policyNumber: "5378583",
    insuredPerson: "Timmy Doucheface",
    premium: 5000,
    coverType: "Life",
    coverAmount: 100000,
    otherDetails: "I eat a lot of meat",
  },
  {
    id: "xyxy",
    company: "Poo limited",
    policyNumber: "k2305943dx",
    insuredPerson: "Tammy Doucheface",
    premium: 10000,
    coverType: "Employment",
    coverAmount: 50000,
    otherDetails: "I work like a donkey soldier",
  },
];

const nameFromRef = (ref) => {
  return `${ref.firstName} ${ref.lastName}`;
};

/* @arg: fact find state 
   @ret: array of { label: "Timmy Doucheface", value: "Timmy Doucheface" },

*/
const extractOptionsFromState = (state) => {
  // check if any:
  //   dependents: [],
  //   children: [],
  //   partnerDependents: [],
  //   jointDependents: []
  const dm = new DataManager(state);
  try {
    return dm.getPeople().map((person) => {
      const fullName = nameFromRef(person);
      return { label: fullName, value: fullName };
    });
  } catch (e) {
    return testPeopleOptions;
  }
};

const ExistingCover = () => {
  const state = useSelector((state) => state.factFind);
  // console.log(state);
  const ecData = useSelector(
    (state) => state.factFind.insuranceInfo.existingCover
  );
  // const dataToUse = ecData !== undefined ? ecData : [];
  // const dataToUse = [];
  const options = extractOptionsFromState(state);
  cols[2].options = options;

  return (
    <div>
      <SimpleCrudTable
        type={"Policy Details"}
        id={"existingPolicies"}
        //data={dataToUse}
        cols={cols}
        empty={emptyCover}
        canCreate
        canDelete
        stripedRows={true}
        storeNestedPath={["insuranceInfo", "existingCover"]}
        addClasses={"p-datatable-sm"}
      />
    </div>
  );
};

export default ExistingCover;
