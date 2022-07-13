import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SimpleCrudTable from "../../ui/simple-crud-table";

const options = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const emptyAdvisor = {
  name: "",
  role: "",
  happy: "",
  canContact: "",
  email: "",
  telephone: "",
};

const cols = [
  { field: "name", header: "Name", type: "text" },
  { field: "role", header: "Role", type: "text" },
  {
    field: "happy",
    header: "Happy with them?",
    type: "select",
    options: options,
  },
  {
    field: "canContact",
    header: "Permission to Contact?",
    type: "select",
    options: options,
  },
  { field: "email", header: "Email", type: "email" },
  { field: "telephone", header: "Phone Number", type: "phone" },
];

const Advisors = (props) => {
  const advisorsData = useSelector((state) => state.factFind.advisors);

  useEffect(() => {
    console.log(advisorsData);
  }, [advisorsData]);

  return (
    <SimpleCrudTable
      data={advisorsData}
      type="Advisors"
      empty={emptyAdvisor}
      id={"advisors"}
      cols={cols}
      addClasses={"p-datatable-striped p-datatable-sm"}
    />
  );
};

export default Advisors;
