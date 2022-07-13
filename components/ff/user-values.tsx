import React, { useState, useMemo, useEffect } from "react";
import UserValue from "./user-value";
import classes from "./user-values-2.module.css";
import { Box } from "grommet";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import { InputTextarea } from "primereact/inputtextarea";

const colors = [
  "#f8f7fc",
  "#e7e3f6",
  "#d0c8ed",
  "#b8ace3",
  "#a191da",
  "#8975d1",
  "#745dc9",
  "#5f44c1",
  "#5239ab",
  "#463193",
  // "#3a297a",
  "#f0f7f8",
  "#cde6e7",
  "#9bccd0",
  "#69b3b8",
  "#458e93",
  "#2e5e61",
  "#295457",
];
const colorsLength = colors.length;

const possibleValues = [
  "Self-Esteem",
  "Security",
  "Purpose",
  "Lifestyle",
  "Stability",
  "Health",
  "Growth",
  "Generosity",
  "Fame",
  "Tradition",
  "Rationality",
  "Family",
  "Achievement",
  "Freedom",
  "Independence",
  "Comfort",
  "Simplicity",
  "Education",
  "Sustainability",
  "Helping",
];

// Values that resonate with me:
const UserValues: React.FC<{}> = ({
  stateKey,
  vals = possibleValues,
  prevSelected = [],
  maxSelectable = false,
  stepOne,
  stepTwo,
  stepThree,
}) => {
  const dispatch = useDispatch();
  const { formStep } = useSelector((state) => state.factFind);
  const currSelectedInStore = useSelector(
    (state) => state.factFind.values[stateKey]
  );
  const [selectedValues, setSelectedValues] = useState([...prevSelected]);
  const [textInputValue, setTextInputValue] = useState({});

  const updateStore = (selectedValues) => {
    dispatch(
      factFindActions.updateClientDataNested({
        action: "UPDATE",
        newValue: selectedValues,
        path: ["values", stateKey],
      })
    );
  };

  useEffect(() => {
    if (formStep === stepTwo) {
      const legalSelectedInStore = selectedValues.filter((val) =>
        vals.includes(val)
      );
      if (legalSelectedInStore.length !== currSelectedInStore) {
        setSelectedValues(legalSelectedInStore);
      }
    }
  }, [vals]);

  useEffect(() => {
    if (formStep !== stepThree) updateStore(selectedValues);

    return () => {
      updateStore(selectedValues);
    };
  }, [formStep, selectedValues]);

  useEffect(() => {
    if (
      formStep === stepThree &&
      currSelectedInStore &&
      stateKey === "topValsWhy"
    ) {
      const newTextInputValues = {};
      for (let [k, { value, text }] of Object.entries(currSelectedInStore)) {
        newTextInputValues[value] = text;
      }
      console.log(newTextInputValues);
      setTextInputValue(newTextInputValues);
    }
  }, []);
  // useEffect(() => {
  //   dispatch(
  //     factFindActions.updateClientDataNested({
  //       action: "UPDATE",
  //       newValue: textInputValue,
  //       path: ["values", "topValsWhyData"],
  //     })
  //   );
  // }, [textInputValue]);

  const onValueClicked = (value) => {
    if (selectedValues && !selectedValues.includes(value)) {
      if (maxSelectable !== false && selectedValues.length === maxSelectable) {
        return;
      } else {
        setSelectedValues((prevState) => [...prevState, value]);
      }
    } else if (selectedValues && selectedValues.includes(value)) {
      setSelectedValues((prevState) =>
        prevState.filter((val) => val !== value)
      );
    } else {
      setSelectedValues([value]);
    }
  };

  let valuesItems;

  if (formStep !== stepThree) {
    valuesItems = vals.map((value, idx) => {
      return (
        <UserValue
          key={idx}
          clickable={
            (selectedValues && selectedValues.includes(value)) ||
            maxSelectable === false ||
            selectedValues.length < maxSelectable
          }
          color={colors[idx % colorsLength]}
          onValueClicked={onValueClicked}
          value={value}
          width={14}
          height={14}
          _clicked={selectedValues && selectedValues.includes(value)}
        />
      );
    });
  } else {
    valuesItems = vals.map((value, idx) => {
      return (
        <Box
          direction="column"
          style={{ marginBottom: "2rem", marginRight: "2rem" }}
        >
          <UserValue
            key={idx}
            clickable={false}
            color={colors[idx % colorsLength]}
            //onValueClicked={onValueClicked}
            value={value}
            width={14}
            height={14}
            _clicked={true}
            style={{ marginRight: "2rem" }}
          />
          <InputTextarea
            tooltip={`Tell us why ${value} matters to you`}
            rows={4}
            cols={45}
            value={textInputValue[value]}
            onChange={(e) => {
              console.log(formStep);
              console.log(textInputValue);
              console.log(selectedValues);
              setTextInputValue((prevState) => ({
                ...prevState,
                [value]: event.target.value,
              }));
              setSelectedValues((prevState) => {
                const newState = [...prevState];
                const idxToUpdate = newState.findIndex(
                  (el) => el.value === value
                );
                console.log(idxToUpdate);
                if (idxToUpdate !== -1) {
                  newState[idxToUpdate] = {
                    value: value,
                    text: event.target.value,
                  };
                  return newState;
                } else {
                  newState.push({ value: value, text: event.target.value });
                  return newState;
                }
              });
            }}
          />
        </Box>
      );
    });
  }

  return (
    <div className={classes.wrapper}>
      {formStep === stepThree && (
        <Box
          wrap={true}
          direction="row"
          align="center"
          alignContent="center"
          alignSelf="center"
        >
          {valuesItems && valuesItems}
          {!(valuesItems.length > 0) && (
            <div className={classes.error_text}>
              You did not select any values, please return to the previous step.
            </div>
          )}
        </Box>
      )}
      {formStep !== stepThree && (
        <Box
          wrap={true}
          direction="row"
          align="center"
          alignContent="center"
          alignSelf="center"
        >
          {valuesItems && valuesItems}
          {!(valuesItems.length > 0) && (
            <div className={classes.error_text}>
              You did not select any values, please return to the previous step.
            </div>
          )}
        </Box>
      )}
    </div>
  );
};

export default UserValues;

/** ATTEMPT 2 REFACTOR FAIL
 * 
 * import React, { useState, useMemo, useEffect } from "react";
import UserValue from "./user-value";
import classes from "./user-values-2.module.css";
import { Box } from "grommet";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import { InputTextarea } from "primereact/inputtextarea";

const colors = [
  "#f8f7fc",
  "#e7e3f6",
  "#d0c8ed",
  "#b8ace3",
  "#a191da",
  "#8975d1",
  "#745dc9",
  "#5f44c1",
  "#5239ab",
  "#463193",
  // "#3a297a",
  "#f0f7f8",
  "#cde6e7",
  "#9bccd0",
  "#69b3b8",
  "#458e93",
  "#2e5e61",
  "#295457",
];
const colorsLength = colors.length;

const possibleValues = [
  "Self-Esteem",
  "Security",
  "Purpose",
  "Lifestyle",
  "Stability",
  "Health",
  "Growth",
  "Generosity",
  "Fame",
  "Tradition",
  "Rationality",
  "Family",
  "Achievement",
  "Freedom",
  "Independence",
  "Comfort",
  "Simplicity",
  "Education",
  "Sustainability",
  "Helping",
];

// Values that resonate with me:
const UserValues = ({
  // stateKey,
  // vals = possibleValues,
  // prevSelected = [],
  // maxSelectable = false,
  stepOne,
  stepTwo,
  stepThree,
}) => {
  const [vals, setVals] = useState(possibleValues);
  const [maxSelectable, setMaxSelectable] = useState(vals.length);

  const dispatch = useDispatch();
  const { formStep } = useSelector((state) => state.factFind);
  const hasPartner = useSelector((state) => state.hasPartner);

  const { topVals, selectedVals, topValsWhy } = useSelector(
    (state) => state.factFind.values
  );

  const [selectedValues, setSelectedValues] = useState([]);
  const [textInputValue, setTextInputValue] = useState({});

  const updateStore = (target, latestValues) => {
    dispatch(
      factFindActions.updateClientDataNested({
        action: "UPDATE",
        newValue: latestValues,
        path: ["values", target],
      })
    );
  };

   const useEffectLoader = () => {
    if (formStep === stepThree && topValsWhy) {
      const newTextInputValues = {};
      for (let [k, { value, text }] of Object.entries(topValsWhy)) {
        newTextInputValues[value] = text;
      }
      setTextInputValue(newTextInputValues);
      setMaxSelectable(0);
      setVals(topVals !== undefined ? topVals : []);
    } else if (formStep === stepTwo) {
      setVals(selectedVals !== undefined ? selectedVals : []);
      setSelectedValues(topVals !== undefined ? selectedVals : []);
      setMaxSelectable(5);
    } else if (formStep === stepOne) {
      setVals(possibleValues);
      setSelectedValues(selectedVals !== undefined ? selectedVals : []);
      setMaxSelectable(possibleValues.length);
    }
  };

  useEffect(() => {
    useEffectLoader();
  }, []);
  useEffect(() => {
    useEffectLoader();
  }, [formStep]);
  useEffect(() => {
    useEffectLoader();
  }, [selectedVals, topVals]);

  const doAction = (value, target) => {
    console.log(selectedValues);
    console.log(selectedValues?.includes);
    if (selectedValues?.includes && selectedValues.includes(value)) {
      console.log("REMOVING ITEM");
      setSelectedValues((prevState) => {
        const latestState = prevState.filter((val) => val !== value);
        updateStore(target, latestState);
        return latestState;
      });
    } else if (selectedValues?.length < maxSelectable) {
      console.log("ADDING ITEM");
      setSelectedValues((prevState) => {
        const latestState = [...prevState, value];
        updateStore(target, latestState);
        return latestState;
      });
    }
  };

  const onValueClicked = (value) => {
    if (formStep === stepOne) {
      doAction(value, "selectedVals");
    } else if (formStep === stepTwo) {
      doAction(value, "topVals");
    }
  };

  let valuesItems = [];

  if (formStep !== stepThree && vals?.map) {
    valuesItems = vals.map((value, idx) => {
      return (
        <UserValue
          key={idx}
          clickable={
            (selectedValues &&
              selectedValues?.includes &&
              selectedValues.includes(value)) ||
            selectedValues.length < maxSelectable
          }
          color={colors[idx % colorsLength]}
          onValueClicked={onValueClicked}
          value={value}
          width={14}
          height={14}
          _clicked={
            selectedValues &&
            selectedValues?.includes &&
            selectedValues.includes(value)
          }
        />
      );
    });
  } else if (vals?.map) {
    valuesItems = vals.map((value, idx) => {
      console.log(value);
      console.log(textInputValue[value]);
      return (
        <Box
          direction="column"
          style={{ marginBottom: "2rem", marginRight: "2rem" }}
        >
          <UserValue
            key={idx}
            clickable={false}
            color={colors[idx % colorsLength]}
            //onValueClicked={onValueClicked}
            value={value}
            width={14}
            height={14}
            _clicked={true}
            style={{ marginRight: "2rem" }}
          />
          <InputTextarea
            tooltip={`Tell us why ${value} matters to ${
              hasPartner ? "us" : "me"
            }`}
            rows={5}
            cols={30}
            placeholder={`Why ${value} matters to ${
              hasPartner ? "us" : "me"
            }...`}
            value={textInputValue[value]}
            onChange={(e) => {
              console.log(formStep);
              console.log(textInputValue);
              console.log(selectedValues);
              setTextInputValue((prevState) => ({
                ...prevState,
                [value]: e.target.value,
              }));
              setSelectedValues((prevState) => {
                const newState = [...prevState];
                const idxToUpdate = newState.findIndex(
                  (el) => el.value === value
                );
                console.log(idxToUpdate);
                if (idxToUpdate !== -1) {
                  newState[idxToUpdate] = {
                    value: value,
                    text: e.target.value,
                  };
                  return newState;
                } else {
                  newState.push({ value: value, text: e.target.value });
                  return newState;
                }
              });
            }}
            style={{
              fontSize: "2.3rem",
              fontFamily: "'Cedarville Cursive', cursive",
            }}
          />
        </Box>
      );
    });
  }

  return (
    <div className={classes.container}>
      {formStep === stepOne && (
        <div className={classes.header}>
          <div className={classes.header_text}>
            Values that are <br />
            important to {hasPartner ? "us" : "me"}...
          </div>
        </div>
      )}
      {formStep === stepTwo && valuesItems.length > 0 && (
        <div className={classes.header}>
          <div className={classes.header_text}>
            5 values that are <br />
            most important to {hasPartner ? "us" : "me"}...
          </div>
        </div>
      )}
      {formStep === stepThree && valuesItems.length > 0 && (
        <div className={classes.header}>
          <div className={classes.header_text}>
            Why these values are
            <br /> important to {hasPartner ? "us" : "me"}...
          </div>
        </div>
      )}

      <div className={classes.wrapper}>
        {formStep === stepThree && (
          <Box
            wrap={true}
            direction="row"
            align="center"
            alignContent="center"
            alignSelf="center"
          >
            {valuesItems && valuesItems}
            {!(valuesItems.length > 0) && (
              <div className={classes.error_text}>
                You did not select any values, please return to the previous
                step.
              </div>
            )}
          </Box>
        )}
        {formStep !== stepThree && (
          <Box
            wrap={true}
            direction="row"
            align="center"
            alignContent="center"
            alignSelf="center"
          >
            {valuesItems && valuesItems}
            {!(valuesItems.length > 0) && (
              <div className={classes.error_text}>
                You did not select any values, please return to the previous
                step.
              </div>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default UserValues;

 * 
 */
