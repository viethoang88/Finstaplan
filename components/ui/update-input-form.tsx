import React, { useState, useMemo, useCallback } from "react";
import { Input, Label, Button, Transition, Grid } from "semantic-ui-react";

const UpdateInputForm = (props) => {
  const { currentValue, minAllowed, maxAllowed } = useMemo(
    () => props,
    [props.currentValue, props.minAllowed, props.maxAllowed]
  );
  const [focused, onFocus] = useState(false);
  const [localCurrent, onLocalCurrentChange] = useState(currentValue);
  const [changed, onChanged] = useState(false);
  const [validInput, onValidInputChange] = useState(true);
  const [saving, onSavingChange] = useState(true);

  let timer;

  const focusedHandler = useCallback((e) => {
    onFocus((prevState) => true);
    if (timer) clearTimeout(timer);
  }, []);

  const onBlurHandler = useCallback(
    (e) => {
      timer = setTimeout(() => onFocus((prevState) => false), 500);
      onLocalCurrentChange(currentValue);
    },
    [localCurrent]
  );

  const onChangeHandler = useCallback((e) => {
    if (e.target.value !== currentValue) {
      onChanged(true);
    } else {
      onChanged(false);
    }
    const validInput =
      (minAllowed ? Number(e.target.value).toFixed(4) >= minAllowed : true) &&
      (maxAllowed ? Number(e.target.value).toFixed(4) <= maxAllowed : true);
    onValidInputChange(validInput);
    onLocalCurrentChange(e.target.value);
  }, []);

  const onSaveHandler = useCallback((e) => {
    console.log("save clicked");
    // post changes to db for this advisor/dealer group/enterprise admin
  }, []);

  const onCancelHandler = useCallback(
    (e) => {
      onLocalCurrentChange(currentValue);
    },
    [currentValue]
  );

  // "slide right", "browse right"

  return (
    <Grid
      style={{
        margin: "2rem",
      }}
    >
      {saving && (
        <Button loading basic>
          Loading
        </Button>
      )}

      <Input
        value={localCurrent}
        labelPosition="right"
        type="text"
        placeholder="Enter percentage"
        style={{
          maxWidth: "10rem",
          padding: "1rem !important",
          margin: "1rem !important",
        }}
        error={validInput}
        loading={false}
      >
        <input
          onFocus={focusedHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
        />
        <Label basic>%</Label>
      </Input>
      <Transition visible={focused} animation="fly right" duration={800}>
        <Input>
          <Label
            style={{
              border: "1px solid black",
              marginRight: ".2rem",
              marginLeft: "1.2rem",
            }}
          >
            {minAllowed}
            &nbsp;&nbsp;&#8805;
          </Label>

          <Label style={{ border: "1px solid black", marginRight: ".2rem" }}>
            {currentValue}
          </Label>

          <Label style={{ border: "1px solid black", marginRight: ".5rem" }}>
            &le;&nbsp;&nbsp;{maxAllowed}
          </Label>

          <Button.Group>
            <Button onClick={onCancelHandler}>Cancel</Button>
            <Button.Or />
            <Button
              positive={validInput}
              disabled={!validInput || currentValue === localCurrent}
              negative={!validInput}
              onClick={onSaveHandler}
            >
              Save
            </Button>
          </Button.Group>
        </Input>
      </Transition>
    </Grid>
  );
};

export default UpdateInputForm;

// {
//   focused && minAllowed && (
//     <Label
//       style={{
//         border: "1px solid black",
//         marginRight: ".2rem",
//         marginLeft: ".2rem",
//       }}
//     >
//       {minAllowed}
//       &nbsp;&nbsp;&#8805;
//     </Label>
//   );
// }
// {
//   focused && (
//     <Label style={{ border: "1px solid black", marginRight: ".2rem" }}>
//       {currentValue}
//     </Label>
//   );
// }
// {
//   focused && maxAllowed && (
//     <Label style={{ border: "1px solid black", marginRight: ".5rem" }}>
//       &le;&nbsp;&nbsp;{maxAllowed}
//     </Label>
//   );
// }
// {
//   focused && (
//     <Button.Group>
//       <Button onClick={onCancelHandler}>Cancel</Button>
//       <Button.Or />
//       <Button
//         positive={validInput}
//         disabled={!validInput || currentValue === localCurrent}
//         negative={!validInput}
//         onClick={onSaveHandler}
//       >
//         Save
//       </Button>
//     </Button.Group>
//   );
// }
