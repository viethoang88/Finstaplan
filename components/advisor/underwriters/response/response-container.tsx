import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ResponseTable from "./response-table";
import ActiveClientRequired from "../../active-client-required";
import ResponseComparison from "./response-comparison";

const dummy_rows = [
  {
    id: 1,
    clientId: "666",
    referenceNumber: "123456ABC",
    clientFullName: "Tom Testerson",
    coverType: "Life",
    coverRequired: 150000,
    maxCoverOffered: 100000,
    underwriterFullName: "Timmy McTest",
    underwriterCompany: "AIH",
    possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
    possibleLoadings: "Some loading, other loading, another loading",
    notes:
      "These are some notes about demo test written by underwriter Timmy McTest",
    generalNotes:
      "Here are more general notes about that client and they will be longer to see how this looks when written, Here are more general notes about that client and they will be longer to see how this looks when written, Here are more general notes about that client and they will be longer to see how this looks when written",
  },
  {
    id: 2,
    clientId: "666",
    referenceNumber: "123456ABC",
    clientFullName: "Tom Testerson",
    coverType: "TPD",
    coverRequired: 220000,
    maxCoverOffered: 220000,
    underwriterFullName: "Timmy McTest",
    underwriterCompany: "AIH",
    possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
    possibleLoadings: "Some loading, other loading, another loading",
    notes:
      "These are some notes about demo test written by underwriter Timmy McTest",
    generalNotes:
      "Here are more general notes about that client and they will be longer to see how this looks when written",
  },
  {
    id: 3,
    clientId: "666",
    referenceNumber: "123456ABC",
    clientFullName: "Tom Testerson",
    coverType: "Trauma",
    coverRequired: 76500,
    maxCoverOffered: 50000,
    underwriterFullName: "Timmy McTest",
    underwriterCompany: "AIH",
    possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
    possibleLoadings: "Some loading, other loading, another loading",
    notes:
      "These are some notes about demo test written by underwriter Timmy McTest",
    generalNotes:
      "Here are more general notes about that client and they will be longer to see how this looks when written",
  },
  {
    id: 4,
    clientId: "555",
    referenceNumber: "123456ABC",
    clientFullName: "Tammy Test",
    coverType: "Life",
    coverRequired: 76500,
    maxCoverOffered: 50000,
    underwriterFullName: "Uri Underwriter",
    underwriterCompany: "AAMI",
    possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
    possibleLoadings: "Some loading, other loading, another loading",
    notes:
      "These are some notes about demo test written by underwriter Timmy McTest",
    generalNotes:
      "Here are more general notes about that client and they will be longer to see how this looks when written",
  },
  {
    id: 5,
    clientId: "555",
    referenceNumber: "123456ABC",
    clientFullName: "Tammy Test",
    coverType: "Life",
    coverRequired: 76500,
    maxCoverOffered: 76500,
    underwriterFullName: "Sam Suncorp",
    underwriterCompany: "Suncorp",
    possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
    possibleLoadings: "Some loading, other loading, another loading",
    notes:
      "These are some notes about demo test written by underwriter Timmy McTest",
    generalNotes:
      "Here are more general notes about that client and they will be longer to see how this looks when written",
  },
  {
    id: 6,
    clientId: "555",
    referenceNumber: "123456ABC",
    clientFullName: "Tammy Test",
    coverType: "Life",
    coverRequired: 76500,
    maxCoverOffered: 75000,
    underwriterFullName: "Adam Testman",
    underwriterCompany: "AIH",
    possibleExclusions: "Pancreatic Cancer, Multiple Scluerosis",
    possibleLoadings: "Some loading, other loading, another loading",
    notes:
      "These are some notes about demo test written by underwriter Timmy McTest",
    generalNotes:
      "Here are more general notes about that client and they will be longer to see how this looks when written",
  },
];

const ResponseContainer = () => {
  // tableType in: ["allResponses", "byClientComparison"]
  const [activeTable, setActiveTable] = useState("allResponses");
  const [activeId, setActiveId] = useState(undefined);
  const activeClient = useSelector((state) => state.auth.activeClient);
  const clientData = useSelector((state) => state.auth.clients);
  const [activeComparisonData, setActiveComparisonData] = useState([]);
  const [activeClientName, setActiveClientName] = useState("");
  const [clientsData, setClientsData] = useState(dummy_rows);

  useEffect(() => {
    const currClient = clientsData.filter(
      (client) => client.clientId === activeId
    );
    console.log("--- SETTING ACTIVE CLIENT ---");
    console.log(activeId);
    console.log(currClient);
    setActiveComparisonData(currClient);
  }, [activeId]);

  return (
    <>
      {activeTable === "allResponses" && (
        <ResponseTable
          setActiveTable={setActiveTable}
          setActiveId={setActiveId}
          clientsData={clientsData}
          setActiveClientName={setActiveClientName}
        />
      )}
      {activeTable === "byClientComparison" && (
        <>
          {/* <ActiveClientRequired
            activeClient={activeClient}
            feature={"Client Pre-Assessment Response Comparison"}
          /> */}
          <ResponseComparison
            activeClient={activeComparisonData}
            clientName={activeClientName}
            setActiveTable={setActiveTable}
          />
        </>
      )}
    </>
  );
};

export default ResponseContainer;
