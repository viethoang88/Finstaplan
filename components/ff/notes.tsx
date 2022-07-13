import { useSelector, useDispatch } from "react-redux";
import { Callout, DirectionalHint } from "@fluentui/react";
import { factFindActions } from "../../store/fact-find";
import { useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "semantic-ui-react";
const updateClientDataNested = factFindActions.updateClientDataNested;
import classes from "./notes.module.css";

/* USAGE 
      const { newValue, path } = _action.payload;
      const [key, index, property] = path;
    */
const dispatchUpdate = (notes, dispatch, target) => {
  dispatch(
    updateClientDataNested({
      action: "UPDATE",
      path: ["notes", target],
      newValue: notes,
    })
  );
};

const getCurrentFormStep = (stepsMapper, formStep, numTimes = 0) => {
  try {
    for (let [key, valuesArray] of Object.entries(stepsMapper)) {
      if (valuesArray.includes(formStep)) return key;
    }
  } catch (e) {
    // setTimeout(() => {
    //   return getCurrentFormStep(stepsMapper, formStep, numTimes++);
    // }, 1000);
    return "ErrorNotes";
  }
  return "ErrorNotes";
};

const Notes = ({ showNotesCallout, targetElement, setShowNotes }) => {
  if (!showNotesCallout) return <></>;

  const [notes, setNotes] = useState("");
  const [currentFormStep, setCurrentFormStep] = useState("");
  const dispatch = useDispatch();
  const notesFromStore = useSelector((state) => state.factFind.notes);
  const stepsMapper = useSelector((state) => state.factFind.formStepMapper);
  const formStep = useSelector((state) => state.factFind.formStep);

  useEffect(() => {
    // console.log(formStep);
    // console.log(stepsMapper);
    // console.log(getCurrentFormStep(stepsMapper, formStep));
    const currentStep = getCurrentFormStep(stepsMapper, formStep);
    setCurrentFormStep(currentStep);
    const currentNotes = notesFromStore?.[currentStep];
    if (currentNotes) {
      setNotes(currentNotes);
    } else {
      setNotes("");
    }
  }, [formStep]);

  useEffect(() => {
    const currentNotes =
      notesFromStore?.[getCurrentFormStep(stepsMapper, formStep)];
    if (currentNotes) {
      setNotes(currentNotes);
    }
  }, []);

  return (
    <>
      <Callout
        target={`#${targetElement}`}
        directionalHint={DirectionalHint.bottomAutoEdge}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <InputTextarea
            tooltip={`Notes`}
            rows={6}
            cols={42}
            placeholder={`Enter notes...`}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            style={{
              fontSize: "1.5rem",
              marginTop: "0.25rem",
              // fontFamily: "'Cedarville Cursive', cursive",
              // fontFamily: "'Just Another Hand', cursive",
            }}
            className={classes.notes_input}
          />
          <Button
            htmlType="submit"
            content="Save"
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
              dispatchUpdate(notes, dispatch, currentFormStep);
              setShowNotes(false);
            }}
            positive
            style={{
              marginTop: "0.25rem",
              marginLeft: "0.2rem",
              marginBottom: "0.2rem",
            }}
          />
        </div>
      </Callout>
    </>
  );
};

export default Notes;
