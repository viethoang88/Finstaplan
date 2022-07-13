import React, { useState, useEffect, EffectCallback } from "react";
import UserValue from "./user-value";
import classes from "./user-values-2.module.css";
import { Box } from "grommet";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../store/fact-find";
import { InputTextarea } from "primereact/inputtextarea";
import { useLazyEffect } from "./user-info-form/risk-profile-results/confirm-accept-profile";
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

const differenceFound = (obj1 = {}, obj2 = {}) => {
  if (obj1 === undefined && Object.entries(obj2).length > 0) return true;
  const objOneKeys = Object.keys(obj1);
  for (let [k, v] of Object.entries(obj2)) {
    if (!objOneKeys.includes(k)) return true;
    if (v !== obj1[k]) return true;
  }
  return false;
};

// Values that resonate with me:
const UserValues = ({ stepOne, stepTwo, stepThree }) => {
  const dispatch = useDispatch();
  const { formStep } = useSelector((state) => state.factFind);
  const hasPartner = useSelector((state) => state.hasPartner);

  const { topVals, selectedVals, topValsWhy } = useSelector(
    (state) => state.factFind.values
  );

  const [vals, setVals] = useState(possibleValues);
  const [maxSelectable, setMaxSelectable] = useState(vals.length);
  const [selectedValues, setSelectedValues] = useState([]);
  const [topValues, setTopValues] = useState([]);
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

  const lazyEffect: EffectCallback = () => {
    if (differenceFound(topValsWhy, textInputValue)) {
      updateStore("topValsWhy", textInputValue);
    }
  };

  useLazyEffect(lazyEffect, [textInputValue], 2000);

  const loadTopValsWhy = () => {
    if (topValsWhy === undefined || Object.entries(topValsWhy).length === 0)
      return;
    const _textInputValues = {};
    for (let [value, text] of Object.entries(topValsWhy)) {
      _textInputValues[value] = text;
    }
    setTextInputValue(_textInputValues);
  };

  const doAction = (value, target, updaterFn, targetList) => {
    if (targetList?.includes(value)) {
      console.log("REMOVING ITEM");
      updaterFn((prevState) => {
        const latestState = prevState.filter((val) => val !== value);
        updateStore(target, latestState);
        console.log("ITEM REMOVED");
        console.log(latestState);
        return latestState;
      });
    } else if (targetList?.length < maxSelectable) {
      console.log("ADDING ITEM TO ", target);
      updaterFn((prevState) => {
        const latestState = [...prevState, value];
        updateStore(target, latestState);
        console.log("ITEM ADDED TO ", target);
        console.log(latestState);
        return latestState;
      });
    }
  };

  const doFilterUnselected = () => {
    const newTopVals = topValues.filter((val) => selectedValues.includes(val));
    if (
      newTopVals.length !== topValues.length ||
      newTopVals.length !== topVals.length
    ) {
      setTopValues(newTopVals);
      updateStore("topVals", newTopVals);
    }
  };

  useEffect(() => {
    if (formStep === stepOne) {
      setMaxSelectable(vals.length);
      doFilterUnselected();
    } else if (formStep === stepTwo) {
      setMaxSelectable(5);
      doFilterUnselected();
    }
  }, [formStep]);

  useEffect(() => {
    setSelectedValues(selectedVals ? selectedVals : []);
    setTopValues(topVals ? topVals : []);
    loadTopValsWhy();
  }, []);

  const onValueClicked = (value) => {
    if (formStep === stepOne) {
      doAction(value, "selectedVals", setSelectedValues, selectedValues);
    } else if (formStep === stepTwo) {
      doAction(value, "topVals", setTopValues, topValues);
    }
  };

  let valuesItems = [];

  if (formStep === stepOne && vals?.map) {
    valuesItems = vals.map((value, idx) => {
      return (
        <UserValue
          key={idx}
          clickable={true}
          color={colors[idx % colorsLength]}
          onValueClicked={onValueClicked}
          value={value}
          width={14}
          height={14}
          _clicked={
            (selectedValues &&
              selectedValues?.includes &&
              selectedValues.includes(value)) ||
            selectedVals?.includes(value)
          }
        />
      );
    });
  } else if (formStep === stepTwo && selectedValues?.map) {
    valuesItems = selectedValues.map((value, idx) => {
      return (
        <UserValue
          key={`${idx}_selected`}
          clickable={
            topValues?.includes(value) || topValues.length < maxSelectable
          }
          color={colors[idx % colorsLength]}
          onValueClicked={onValueClicked}
          value={value}
          width={14}
          height={14}
          _clicked={topValues?.includes(value)}
        />
      );
    });
  } else if (formStep === stepThree && topValues?.map) {
    valuesItems = topValues.map((value, idx) => {
      return (
        <Box
          direction="column"
          style={{ marginBottom: "2rem", marginRight: "2rem" }}
        >
          <UserValue
            key={`${idx}_top`}
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
            key={`${idx}_txt`}
            rows={5}
            cols={30}
            placeholder={`Why ${value} matters to ${
              hasPartner ? "us" : "me"
            }...`}
            value={textInputValue[value]}
            onChange={(e) => {
              setTextInputValue((prevState) => ({
                ...prevState,
                [value]: e.target.value,
              }));
            }}
            style={{
              fontSize: "2.3rem",
              // fontFamily: "'Cedarville Cursive', cursive",
              fontFamily: "'Just Another Hand', cursive",
            }}
          />
        </Box>
      );
    });
  }

  const pronoun = hasPartner ? "us" : "me";
  // const vw = document.documentElement.clientWidth
  // const vww = window.innerWidth
  return (
    <div className={classes.container}>
      {formStep === stepOne && (
        <div className={classes.header}>
          <div className={classes.header_text}>
            Values that are important to {pronoun}...
          </div>
        </div>
      )}
      {formStep === stepTwo && valuesItems.length > 0 && (
        <div className={classes.header}>
          <div className={classes.header_text}>
            5 values that are most important to {pronoun}...
          </div>
        </div>
      )}
      {formStep === stepThree && valuesItems.length > 0 && (
        <div className={classes.header}>
          <div className={classes.header_text}>
            Why these values are important to {pronoun}...
          </div>
        </div>
      )}

      <div className={classes.wrapper}>
        <Box
          wrap={true}
          direction="row"
          align="center"
          alignContent="center"
          alignSelf="center"
          justify="center"
          className={window.innerWidth <= 1570 ? classes.box_wrapper : ""}
        >
          {valuesItems && valuesItems}

          {formStep !== stepOne && !(valuesItems.length > 0) && (
            <div className={classes.error_text}>
              You did not select any values, please return to the previous step.
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default UserValues;
