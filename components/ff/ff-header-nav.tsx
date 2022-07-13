import { Menu, Breadcrumb } from "semantic-ui-react";
import { useState } from "react";
import { ToggleButton } from "primereact/togglebutton";
import AnimatedStepButton from "../ui/animated-step-button";
import { useDispatch, useSelector } from "react-redux";
import factFind, { factFindActions } from "../../store/fact-find";
// import { uiSliceActions } from "../../store/ui";
// import { faFileExport } from "@fortawesome/free-solid-svg-icons";
// import { button } from "@aws-amplify/ui";
import FFHeaderItem from "./ff-header-item";
import { LAST_FORM_STEP } from "../../store/fact-find";
import Notes from "./notes";

const toggleButtonStyles = {
  fontSize: "1rem",
  fontWeight: "700",
  padding: ".5rem",
  marginRight: ".35rem",
  zIndex: 50000,
  // marginLeft: "2rem",
  // marginRight: "2rem",
  // alignSelf: "flex-end",
  // justifySelf: "flex-end",
  // position: "absolute",
  // float: "right",
};

const buttonStyles = {
  position: "relative",
  fontSize: "1.3rem",
  fontWeight: "bold",
  minHeight: ".7rem",
  minWidth: "1.5rem",
  marginRight: ".35rem",
  zIndex: 1010,
};

const buttonContainerDiv = {
  width: "100vw",
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const buttonContainer = {
  position: "relative",
  top: "6rem",
  display: "flex",
  // width: "100vw",
  alignItems: "center",
  justifyContent: "center",
};

const ffHeaderNav = (props) => {
  const {
    showToggleButton,
    showForm,
    toggleShowForm,
    stepDescription,
    setShowBackground,
    showBackground,
    stepDescriptionExtra = false,
    showCharts,
    setShowCharts,
    formStep,
    showEnoughCalculator,
    setShowEnoughCalculator,
  } = props;
  // const [ checked, setChecked ] = useState(showForm);
  const [showNotes, setShowNotes] = useState(false);
  const dispatch = useDispatch();

  const sections = [
    {
      key: "Consultation",
      content: "Consultation",
      link: false,
    },
    {
      key: formStep,
      content: stepDescription,
      link: false,
    },
  ];

  if (stepDescriptionExtra) {
    sections.push({
      key: "curr",
      content: stepDescriptionExtra,
      link: false,
    });
  }

  const buttons = (
    <div style={buttonContainerDiv}>
      <span style={buttonContainer}>
        {formStep !== 0 && (
          <AnimatedStepButton
            onClick={(e) => dispatch(factFindActions.prevStep())} //setFormStep((prevStep) => prevStep - 1)}
            direction="left"
            text="previous"
            styling={buttonStyles}
          />
        )}
        {formStep < LAST_FORM_STEP && (
          <AnimatedStepButton
            onClick={(e) => dispatch(factFindActions.nextStep())} //setFormStep((prevStep) => prevStep + 1)}
            direction="right"
            text="next"
            styling={buttonStyles}
          />
        )}
      </span>
    </div>
  );

  return (
    <Menu
      style={{
        backgroundColor: "rgb(251,251,251)", //"#a07aaa", //"rgb(96, 160, 96, .65)",
        borderTop: ".75rem solid #3d0264",
        borderBottom: ".55rem solid rgba(127, 131, 127, 0.527)",
        width: "100%",
        padding: ".5rem",
        paddingLeft: "1.66rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "space-between",
        justifyContent: "space-between",
        fontWeight: "700",
        position: "relative",
      }}
    >
      {/* <div>
        <Breadcrumb
          style={{ fontSize: "2rem", padding: "0.5rem" }}
          icon="right angle"
          sections={sections}
        />
      </div> */}
      <FFHeaderItem />

      <div>{buttons}</div>

      {showToggleButton && (
        <div style={{ position: "absolute", right: "1rem" }}>
          {/* <ToggleButton
            onLabel="Show Charts"
            offLabel="Charts Hidden"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            checked={showCharts}
            onChange={(e) => {
              setShowCharts((prevState) => !prevState);
            }}
            style={toggleButtonStyles}
          /> */}
          <ToggleButton
            onLabel="Enough"
            offLabel="Enough"
            onIcon="pi pi-calendar-plus"
            offIcon="pi pi-times"
            checked={!showEnoughCalculator}
            onChange={(e) => {
              setShowEnoughCalculator((prevState) => !prevState);
            }}
            style={toggleButtonStyles}
          />
          <ToggleButton
            onLabel="Notes"
            offLabel="Notes"
            onIcon="pi pi-file-o"
            offIcon="pi pi-times"
            id="show-notes-toggle"
            checked={!showNotes}
            onChange={(e) => {
              setShowNotes((prevState) => !prevState);
            }}
            style={toggleButtonStyles}
          />
          <Notes
            showNotesCallout={showNotes}
            targetElement={"show-notes-toggle"}
            setShowNotes={setShowNotes}
          />
          <ToggleButton
            onLabel="Show Background"
            offLabel="Background Hidden"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            checked={showBackground}
            onChange={(e) => {
              setShowBackground((prevState) => !prevState);
            }}
            style={toggleButtonStyles}
          />
          {/* <ToggleButton
            onLabel="Show Form"
            offLabel="Form Hidden"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            checked={showForm}
            onChange={(e) => {
              toggleShowForm(e.value);
            }}
            style={toggleButtonStyles}
          /> */}
        </div>
      )}
    </Menu>
  );
};

export default ffHeaderNav;
