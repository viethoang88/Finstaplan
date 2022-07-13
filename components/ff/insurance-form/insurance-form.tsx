import { useDispatch, useSelector } from "react-redux";
import { Accordion, AccordionTab } from "primereact/accordion";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";
import { Form } from "antd";

import ExistingCover from "./existing-cover";
import HealthInfo from "./health-info";
import EstatePlanning from "./estate-planning";

const InsuranceForm = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  //   const updateQuestionValue = (idx, value) => {
  //     const newQuestions = [...questions];
  //     newQuestions[idx].selected = value;
  //     setQuestions(newQuestions);
  //   };

  return (
    <div
      style={{
        zIndex: 20,
        padding: "7rem",
        maxWidth: "97vw",
        background: "white !important",
        position: "relative",
      }}
    >
      <Form style={{ background: "white !important" }}>
        <Accordion
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          // style={{ background: "white !important" }}
        >
          <AccordionTab key={0} header={`Existing Cover`}>
            <ExistingCover />
          </AccordionTab>
          <AccordionTab key={1} header={`Health Information`}>
            <HealthInfo />
          </AccordionTab>
          <AccordionTab key={2} header={`Estate Planning`}>
            <EstatePlanning />
          </AccordionTab>
        </Accordion>
      </Form>
    </div>
  );
};

export default InsuranceForm;
