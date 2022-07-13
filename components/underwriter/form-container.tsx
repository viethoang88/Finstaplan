import HealthForm from "./health-form";
import PreassessmentForm from "./pre-assessment-form";
import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";
import Paper from "@mui/material/Paper";

const FormContainer = ({ activeClient, underwriter }) => {
  const [activeIndex, setActiveIndex] = useState();
  const dob =
    typeof activeClient?.dob === "string"
      ? new Date(activeClient?.dob).toDateString()
      : activeClient?.dob?.toDateString();
  return (
    <div>
      <Paper elevation={3} style={{ padding: "1.5rem" }}>
        <div>Regarding: {activeClient?.clientName}</div>
        <div>DOB: {dob}</div>
        <div>Gender: {activeClient?.gender}</div>
      </Paper>
      <br />
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Health Preassessment">
          <HealthForm />
        </TabPanel>
        <TabPanel header="Request Form">
          <PreassessmentForm
            activeClient={activeClient}
            underwriter={underwriter}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default FormContainer;
