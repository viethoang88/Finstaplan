import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";
import ComparisonTable from "./comparison-table";

const cols = [
  {
    field: "underwriterCompany",
    header: "Company",
  },
  {
    field: "underwriterFullName",
    header: "Underwriter",
  },
  {
    field: "coverRequired",
    header: "Cover Required",
  },
  {
    field: "maxCoverOffered",
    header: "Max Cover Offered",
  },
  {
    field: "possibleExclusions",
    header: "Possible Exclusions",
  },
  {
    field: "possibleLoadings",
    header: "Possible Loadings",
  },
  {
    field: "notes",
    header: "Notes",
  },
  {
    field: "generalNotes",
    header: "General Notes",
  },
];

const reshapeDataForComparison = () => {};

const ResponseComparison = ({ activeClient, clientName, setActiveTable }) => {
  if (activeClient === undefined || activeClient?.length === 0) return null;
  const [activeIndex, setActiveIndex] = useState();
  const lifeData = activeClient.filter((ac) => ac.coverType === "Life");
  const tpdData = activeClient.filter((ac) => ac.coverType === "TPD");
  const traumaData = activeClient.filter((ac) => ac.coverType === "Trauma");
  const ipData = activeClient.filter((ac) => ac.coverType === "IP");
  console.log(lifeData);
  console.log(tpdData);
  console.log(traumaData);
  console.log(ipData);
  return (
    <>
      <button onClick={() => setActiveTable("allResponses")}>Back</button>
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Life" disabled={lifeData?.length === 0}>
          <ComparisonTable
            data={lifeData}
            clientName={clientName}
            cols={cols}
          />
        </TabPanel>
        <TabPanel header="TPD" disabled={tpdData?.length === 0}>
          <ComparisonTable data={tpdData} clientName={clientName} cols={cols} />
        </TabPanel>
        <TabPanel header="Trauma" disabled={traumaData?.length === 0}>
          <ComparisonTable
            data={traumaData}
            clientName={clientName}
            cols={cols}
          />
        </TabPanel>
        <TabPanel header="IP" disabled={ipData?.length === 0}>
          <ComparisonTable data={ipData} clientName={clientName} cols={cols} />
        </TabPanel>
      </TabView>
    </>
  );
};

export default ResponseComparison;
