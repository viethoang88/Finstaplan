// import FFNavFooter from "../ff/ff-footer-nav";
import FFHeaderNav from "../ff/ff-header-nav";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserInfoCanvas from "../ff/user-info-canvas";
import UserValues from "../ff/user-values-2";
import UserGoals from "../ff/user-goals";
import Budget from "../ff/budget/budget";
import MiniMenu from "./mini-menu";
import InsuranceForm from "../ff/insurance-form/insurance-form";
import RiskProfileForm from "../ff/user-info-form/risk-profile-form";
import Authorities from "../ff/authorities/authorities";
import Checklist from "../ff/checklist/checklist";
import UserInfoBackground from "../ff/user-info-background";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EnoughCalculator from "../enough-calc/enough-calc";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { authSliceActions, getClientSetActive } from "../../store/auth";

import InsuranceCalc from "../advisor/insurance-calc/insurance-calc";
import FFDataManager from "./ff-data-manager";

// import classes from "./ff-layout.module.css";

// const ffStepMap = {
//   0: "Family Portrait & Personal Information",
//   1: "Balance Sheet & Budget",
//   2: "Why is money important to you?",
//   3: "Values",
//   4: "Values",
//   5: "Goals",
//   6: "Goals",
//   7: "Contingency & Insurance Information",
//   8: "Authorities",
// };

// const ffStepMapExtra = {
//   3: "What do you value?",
//   4: "What do you value most? (Select 5 options)",
//   5: "Tell us about your short and long term goals",
//   6: "Place your goals onto the grid",
// };

// const ffStepMap = {
//   0: "Family Portrait & Personal Information",
//   1: "Values",
//   2: "Values",
//   3: "Values",
//   4: "Goals",
//   5: "Goals",
// };

// const ffStepMapExtra = {
//   0: "Build a full image of your life and family",
//   1: "What do you value?",
//   2: "What do you value most? (Select 5 options)",
//   3: "Why do you value these things?",
//   4: "Tell us about your short and long term goals",
//   5: "Place your goals onto the grid",
// };

// const steps = [
//   "Family",
//   "Budget",
//   "Balance Sheet",
//   "Values",
//   "Goals",
//   "Risk Profile",
//   "Contingency",
//   "Authorities",
//   "Checklist",
// ];

// const generateStepsMap = (formSteps) => {
//   let offset = 0;
//   return steps.map((step) => {
//     const result = [];
//     const currIndex = formSteps.findIndex((el) => el.text === step);
//     result.push(currIndex + offset);
//     for (let i = 1; i < formSteps[currIndex].numSteps; i++) {
//       offset += 1;
//       result.push(currIndex + offset);
//     }
//     return result;
//   });
// };

// name, active (boolean), onClick
// Personal Information form: formStep 0:
// Why Money: formStep 1:
// BALANCE SHEET AND BUDGET: formStep 2:
// Values: formStep 3-5:
// Goals: formStep 6-7:
// Contingency: formStep 8:
// Authorities: formStep 9:
const FactFindLayout: React.FC<{}> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clientId } = router.query;
  console.log(clientId);
  useEffect(() => {
    if (clientId !== null) {
      dispatch(getClientSetActive(clientId));
    }
  }, [clientId]);

  // const showInsuranceCalc = useSelector(
  //   (state) => state.factFind.showInsuranceCalc
  // );

  const [showForm, setShowForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(true);
  const [showEnoughCalculator, setShowEnoughCalculator] = useState(false);
  const toggleShowForm = () => setShowForm((prevState) => !prevState);

  const formStep = useSelector((state) => state.factFind.formStep);
  const formSteps = useSelector((state) => state.factFind.formSteps);
  // const stepsMapper = generateStepsMap(formSteps);
  // dispatch(factFindActions.updateState({ formStepMapper: stepsMapper }));
  const stepsMapper = useSelector((state) => state.factFind.formStepMapper);

  const valuesName = "What's Important?";

  // const [_showInsuranceCalc, _setShowInsuranceCalc] = useState(false);
  // useEffect(() => {
  //   console.log(showInsuranceCalc);
  //   _setShowInsuranceCalc(showInsuranceCalc);
  // }, [showInsuranceCalc]);
  // useEffect(() => {
  //   console.log("---- I CHANGED ----");
  // }, [_showInsuranceCalc]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
      }}
    >
      <FFDataManager clientId={clientId} />
      <DndProvider backend={HTML5Backend}>
        <FFHeaderNav
          showToggleButton={showToggleButton}
          toggleShowForm={toggleShowForm}
          showForm={showForm}
          setShowBackground={setShowBackground}
          showBackground={showBackground}
          setShowCharts={setShowCharts}
          showCharts={showCharts}
          formStep={formStep}
          showEnoughCalculator={showEnoughCalculator}
          setShowEnoughCalculator={setShowEnoughCalculator}
        />

        {showEnoughCalculator && <EnoughCalculator />}

        {/* {_showInsuranceCalc && (
          <div style={{ position: "relative", top: "5rem" }}>
            <InsuranceCalc renderFromFactFind={true} />
          </div>
        )} */}

        {showBackground && <UserInfoBackground />}
        {/* {showCharts && <ChartsContainer />} */}
        {/* // TODO: */}
        {stepsMapper &&
          stepsMapper["Family"] &&
          stepsMapper["Family"].includes(formStep) && (
            <>
              <UserInfoCanvas />
            </>
          )}
        {stepsMapper &&
          stepsMapper["Budget"] &&
          stepsMapper["Budget"].includes(formStep) && (
            <Budget type={"budget"} />
          )}
        {stepsMapper &&
          stepsMapper["Balance Sheet"] &&
          stepsMapper["Balance Sheet"].includes(formStep) && (
            <Budget type={"balanceSheet"} />
          )}
        {/* // TODO:  */}
        {stepsMapper &&
          stepsMapper[valuesName] &&
          stepsMapper[valuesName].includes(formStep) && (
            <>
              <UserValues
                stepOne={stepsMapper[valuesName][0]}
                stepTwo={stepsMapper[valuesName][1]}
                stepThree={stepsMapper[valuesName][2]}
              />
            </>
          )}
        {/* // TODO:  */}
        {stepsMapper &&
          stepsMapper["Goals"] &&
          stepsMapper["Goals"].includes(formStep) && (
            <>
              <UserGoals
                formStep={formStep}
                stepOne={stepsMapper["Goals"][0]}
                stepTwo={stepsMapper["Goals"][1]}
              />
            </>
          )}
        {stepsMapper &&
          stepsMapper["Risk Profile"] &&
          stepsMapper["Risk Profile"].includes(formStep) && <RiskProfileForm />}
        {stepsMapper &&
          stepsMapper["Contingency"] &&
          stepsMapper["Contingency"].includes(formStep) && <InsuranceForm />}
        {stepsMapper &&
          stepsMapper["Authorities"] &&
          stepsMapper["Authorities"].includes(formStep) && <Authorities />}
        {stepsMapper &&
          stepsMapper["Checklist"] &&
          stepsMapper["Checklist"].includes(formStep) && <Checklist />}
        {props.children}
        {/* <FFNavFooter /> */}
        <MiniMenu />
      </DndProvider>
    </div>
  );
};

export default FactFindLayout;
