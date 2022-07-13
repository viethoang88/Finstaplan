import ActiveClientRequired from "../active-client-required";
import { useSelector, useDispatch } from "react-redux";
import { Card, Divider } from "antd";
import HealthForm from "../../underwriter/health-form";
// import InsuranceUnderwriters from "../insurance-underwriters";
import InsuranceUnderwriters from "./insurance-underwriters2";
import RequestHeader from "./request-header";
import { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import AdvisorForm from "./advisor-form";
import CalculatingButton from "../../ui/calculating-button";
import { performCalculations } from "../insurance-calc/insurance-calc";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getClientSetActive, authSliceActions } from "../../../store/auth";
import UnderwriterStepsLoading from "./underwriters-steps-loading";
import { v4 as uuidv4 } from "uuid";
import createPreassessment from "../../../store/auth/create-preassessment";
import DisplayAttachments from "./display-attachments";
import Paper from "@mui/material/Paper";
import { uiSliceActions } from "../../../store/ui";

const selectUnderwriterStyles = {
  fontWeight: "bold",
  fontSize: "1.45rem",
  marginTop: "2.5rem",
  padding: "0.25rem",
  width: "100%",
  textAlign: "center",
};

/* EXPECTED SHAPE OF API
    const { underwriters, advisorProfile } = JSON.parse(
      req.body
    );
*/
const attachIdsIfTheyDontExist = (underwriters) => {
  return underwriters.map((uw) => {
    const newUw = { ...uw };
    delete newUw["useUnderwriter"];
    if (uw["id"] === undefined) {
      newUw["id"] = uuidv4();
    }
    return newUw;
  });
};

const doUnderwritersExistAndCreateEmailNewUnderwriters = async (
  advisorProfile,
  underwriters,
  setStepOneRequest
) => {
  const url = "/api/underwriter/createrequest";
  const uwWithIds = attachIdsIfTheyDontExist(underwriters);
  const data = {
    advisorProfile,
    underwriters: uwWithIds,
  };

  console.log(advisorProfile);
  console.log(underwriters);
  console.log("--- CHECK & CREATE UNDERWRITERS POSTING WITH DATA ---");
  console.log(data);

  return (
    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((res) => {
        // console.log("--------MY  RES--------");
        // const resText = res.text();
        // console.log(resText);
        // return resText;
        return res.json();
        // return JSON.parse(res.body);
      })
      // .then((res) => JSON.parse(res?.body)) // parses JSON response into native JavaScript objects)
      .then((data) => {
        console.log("--- Received response data from createUnderwriters ---");
        console.log(data);
        setStepOneRequest(data);
        return data;

        // setLoading(false);
        // setComputedData(data);
      })
      .catch((err) => {
        console.log("--- THERE WAS AN ERROR ---");
        console.log(err);
        return false;
      })
  );
};

const validateAdvisorProfile = (advisorProfile) => {
  return (
    advisorProfile && advisorProfile?.firstName && advisorProfile?.lastName
  );
};

/*
type Preassessment @model {
    id: ID!
    advisorName: String!
    dealerGroup: String!
    clientName: String!
    dob: String!
    gender: String!
    preassessmentData: AWSJSON!
    healthInfo: AWSJSON!                                            -> object, completed health form answers for <HealthForm> component
    attachments: String                                             -> s3 path name to relevant attachments for this preassessment
    underwriters: [Underwriter!] @connection(fields: ["id"])
}*/
// "The variables input contains a field name 'underwriters' that is not defined for input object type 'CreatePreassessmentInput' "
const shapeAndcreatePreassessment = async (
  underwriters,
  healthInfo,
  advisorProfile,
  activeClient,
  activeClientInfo,
  formData,
  id,
  dispatcher
) => {
  const shapedData = {
    id: id,
    advisorName: advisorProfile?.firstName + " " + advisorProfile?.lastName,
    dealerGroup: advisorProfile?.dealerGroup,
    clientName: activeClientInfo?.firstName + " " + activeClientInfo?.lastName,
    dob: activeClientInfo?.dateOfBirth?.toString(),
    gender: activeClientInfo?.gender,
    preassessmentData: JSON.stringify(formData),
    healthInfo: JSON.stringify(healthInfo),
    underwriterIDs: underwriters.map((uw) => uw.id),
  };

  console.log("--- CREATING A NEW PREASSESSMENT WITH ----");
  console.log(shapedData);
  updatePreassessmentStep(
    "info",
    "Creating Pre-Assessment...",
    undefined,
    dispatcher
  );
  const response = await dispatcher(
    createPreassessment(shapedData, underwriters)
  );
  console.log("RESPOONSE AFTER CREATING PREASSESSMENT");
  console.log(response);
  return response;
};

const advisorFormSubmit = async (
  advisorProfile,
  underwriters,
  setStepOneRequest,
  setStepmessage,
  setLoading,
  setStepStatus,
  showStepsLoading,
  id,
  dispatcher,
  activeClient,
  activeClientInfo,
  healthInfo,
  updatePreassessmentStep,
  formData
) => {
  console.log(formData);

  setStepmessage("Preparing your request");
  setLoading(true);
  updatePreassessmentStep(
    "info",
    "Preparing your Pre-AssessmentRequest",
    undefined,
    dispatcher
  );

  const validatedAdvisorProfile = validateAdvisorProfile(advisorProfile);
  if (!validatedAdvisorProfile) {
    setStepmessage(
      "Information is missing from your profile. Please set it and try again"
    );
    setStepStatus("error");
    updatePreassessmentStep(
      "error",
      "Information is missing from your profile. Please set it and try again",
      undefined,
      dispatcher
    );
    setLoading(false);
    return;
  }

  const useUnderwriters = underwriters.filter((uw) => uw.useUnderwriter);
  if (useUnderwriters.length === 0) {
    setStepmessage(
      "You must select underwriters for this Pre-Assessment request"
    );
    setStepStatus("error");
    setLoading(false);
    updatePreassessmentStep(
      "error",
      "Preparing your Pre-Assessment Request",
      undefined,
      dispatcher
    );
    return;
  }
  const unusedUnderwriters = underwriters.filter((uw) => !uw.useUnderwriter);

  console.log("--- SUBMITTING FORM WITH ---");
  console.log(formData);
  console.log(underwriters);
  console.log(useUnderwriters);
  console.log(validatedAdvisorProfile);

  updatePreassessmentStep(
    "info",
    "Processing Underwriters",
    undefined,
    dispatcher
  );
  // STEP 1: CHECK IF UNDERWRITERS EXIST, EMAIL THOSE THAT DONT AND CREATE THEIR ACCOUNTS:
  const response = await doUnderwritersExistAndCreateEmailNewUnderwriters(
    advisorProfile,
    useUnderwriters,
    setStepOneRequest
  );

  console.log("--- RESPONSE ---");
  console.log(response);
  const { message, error, _underwriters } = response;
  const updatedUnderwriters = [..._underwriters, ...unusedUnderwriters];
  // MAKE SURE THAT THE NEWLY GENERATED IDS ARE STORED IN DATABASE:
  dispatcher(
    authSliceActions.updateClientData({
      action: "SET",
      key: "underwriters",
      newVal: updatedUnderwriters,
    })
  );

  if (error) {
    updatePreassessmentStep(
      "error",
      "There was an error processing your request",
      undefined,
      dispatcher
    );
    console.log(error);
  } else {
    setStepmessage(message);
    updatePreassessmentStep("info", "message", undefined, dispatcher);
    // STEP 2: Create the links between the preassessment and the underwriters being used:
    const result = await shapeAndcreatePreassessment(
      _underwriters,
      healthInfo,
      advisorProfile,
      activeClient,
      activeClientInfo,
      formData,
      id,
      dispatcher
    );
    console.log("--- CREATING PREASSESSMENT RESULT --");
    setStepStatus("success");
    setStepmessage("Successfully submitted your Pre-Assessment Request");
    updatePreassessmentStep(
      "success",
      "Successfully submitted your Pre-Assessment Request",
      undefined,
      dispatcher
    );
    setLoading(false);
    console.log(result);
  }
};

// Steps: "info", "success", "error",
const updatePreassessmentStep = (
  step,
  message,
  preassessmentObject,
  dispatcher
) => {
  dispatcher(
    uiSliceActions.setAttribute({
      attribute: "preassessmentStep",
      newVal: {
        step: step,
        message: message,
        preassessment: preassessmentObject,
      },
    })
  );
};

const RequestPreassessment = () => {
  const activeClient = useSelector((state) => state.auth.activeClient);
  const clientData = useSelector((state) => state.factFind);
  const primary = clientData?.primary;
  const partner = clientData?.partner;
  const preassessmentStep = useSelector((state) => state.ui.preassessmentStep);
  const healthInfo = useSelector((state) => state.factFind.healthInfo);
  const underwriters = useSelector((state) => state.auth.underwriters);
  const philosophies = useSelector((state) => state.auth.philosophies);
  const assumptions = useSelector((state) => state.auth.assumptions);
  const advisorProfile = useSelector((state) => state.auth.advisorProfile);
  const [hasUseUnderwriters, setHasUseUnderwriters] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [calculatedData, setCalculatedData] = useState();
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [activeClientInfo, setActiveClientInfo] = useState({});
  const [preassessmentId, setPreassessmentId] = useState(uuidv4());
  const [stepOneRequest, setStepOneRequest] = useState(undefined);
  const [stepMessage, setStepmessage] = useState(
    "Preparing your Pre-Assessment Request"
  );
  const [stepStatus, setStepStatus] = useState("info");
  const [loading, setLoading] = useState(false);
  const [showStepsLoading, setShowStepsLoading] = useState(true);
  const [refreshUnderwriters, setRefreshUnderwriters] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const clientId = activeClient?.id;
    console.log("--- GOT THEIR ID LOL ---");
    console.log(clientId);
    if (clientId && clientData.Id !== clientId) {
      dispatch(getClientSetActive(clientId));
    }
  }, [activeClient]);

  useEffect(() => {
    console.log(underwriters);
    if (underwriters !== undefined) {
      const someUwSelected = underwriters.some((uw) => uw.useUnderwriter);
      setHasUseUnderwriters(someUwSelected);
      setRefreshUnderwriters(true);
      setTimeout(() => {
        setRefreshUnderwriters(false);
      }, 500);
    }
  }, [underwriters]);

  useEffect(() => {
    if (activeClient?.activeMember !== undefined) {
      setPreassessmentId(uuidv4());
      if (activeClient?.activeMember === primary.firstName)
        setActiveClientInfo(primary);
      else if (activeClient?.activeMember === partner.firstName)
        setActiveClientInfo(partner);
    }
  }, [activeClient?.activeMember]);

  console.log("---- IN REQUEST PREASSESSMENT WITH ---");
  console.log(activeClient);
  console.log(activeClient?.activeMember);
  console.log(activeClient?.lastName);
  console.log(
    activeClient?.activeMember !== `${activeClient?.lastName} Family` &&
      activeClient?.activeMember !== activeClient?.lastName
  );
  console.log(
    activeClient &&
      underwriters !== undefined &&
      hasUseUnderwriters &&
      activeClient?.activeMember !== `${activeClient?.lastName} Family` &&
      activeClient?.activeMember !== activeClient?.lastName
  );

  // TESTING CODE FOR LOADING THING:
  // useEffect(() => {
  //   // USAGE: updatePreassessmentStep(step, message, {}, dispatch)
  //   updatePreassessmentStep(
  //     "info",
  //     "Preparing your Pre-Assessment Request",
  //     {},
  //     dispatch
  //   );
  //   let i = 0;
  //   let steps = ["info", "info", "success"];
  //   let messages = [
  //     "Preparing Your Pre-Assessment Request",
  //     "Checking Underwriters Exist",
  //     "Successfully Created The Pre-Assessment Request",
  //   ];
  //   const interval = setInterval(() => {
  //     console.log("--- UPDATING PREASSSESSMENT STEP ---");
  //     if (i < messages.length) {
  //       console.log(steps[i]);
  //       console.log(messages[i]);
  //       updatePreassessmentStep(steps[i], messages[i], {}, dispatch);
  //     }
  //     if (i === messages.length) clearInterval(interval);
  //     i++;
  //   }, 2000);
  // }, []);

  return (
    <div>
      <ActiveClientRequired
        activeClient={activeClient}
        feature={"Insurance Preassessment"}
      />
      <Paper elevation={3} style={{ padding: "3rem" }}>
        {/* {!showStepsLoading && } */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Select Underwriters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InsuranceUnderwriters
              message={
                "Select or Add Underwriters to Include with this request"
              }
            />
          </AccordionDetails>
        </Accordion>

        {underwriters === undefined && (
          <h3 style={selectUnderwriterStyles}>
            Please add some underwriters to submit pre-assessment requests
          </h3>
        )}
        {underwriters !== undefined && !hasUseUnderwriters && (
          <h3 style={selectUnderwriterStyles}>
            Please select the underwriters you wish to use for your request
          </h3>
        )}
        {activeClient !== undefined &&
          (activeClient?.activeMember === `${activeClient?.lastName} Family` ||
            activeClient?.activeMember === activeClient?.lastName) && (
            <h3 style={selectUnderwriterStyles}>
              {activeClient !== undefined &&
                `Please select a family member for this pre-assessment request`}
            </h3>
          )}
        {showStepsLoading && (
          <UnderwriterStepsLoading
            stepMessage={preassessmentStep?.message}
            stepStatus={preassessmentStep?.status}
            successMessage={
              "Successfully submitted your Pre-Assessment Request"
            }
          />
        )}
        {activeClient !== undefined &&
          underwriters !== undefined &&
          hasUseUnderwriters &&
          activeClient?.activeMember !== `${activeClient?.lastName} Family` &&
          activeClient?.activeMember !== activeClient?.lastName && (
            <div>
              <h3 style={selectUnderwriterStyles}>
                Create Your Pre-Assessment Request for{" "}
                {activeClient?.activeMember} {activeClient?.lastName}
              </h3>
              <Divider />
              <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              >
                <TabPanel header="Cover Required">
                  {Object.keys(activeClientInfo).length > 0 && (
                    <RequestHeader
                      advisorName={advisorProfile?.firstName}
                      advisorSurname={advisorProfile?.lastName}
                      advisorCompany={advisorProfile?.employerName}
                      advisorDealerGroup={advisorProfile?.dealerGroup}
                      clientName={activeClient?.activeMember}
                      clientLastName={activeClient?.lastName}
                      clientDob={activeClientInfo?.dateOfBirth}
                      clientGender={activeClientInfo?.gender}
                    />
                  )}
                  <CalculatingButton
                    computedData={calculatedData !== undefined}
                    calculating={calculating}
                    calculated={calculated}
                    topic={"Insurance Cover Required"}
                    boundOnClickFunction={performCalculations.bind(
                      null,
                      philosophies,
                      assumptions,
                      clientData,
                      setCalculatedData,
                      setCalculating,
                      setCalculated
                    )}
                  />

                  <AdvisorForm
                    activeClient={activeClient}
                    advisorProfile={advisorProfile}
                    activeClientInfo={activeClientInfo}
                    healthInfo={healthInfo}
                    coverRequiredLife={1200000}
                    coverRequiredTpd={1500000}
                    coverRequiredTrauma={75000}
                    coverRequiredIP={67000}
                    handleSubmitForm={advisorFormSubmit.bind(
                      null,
                      advisorProfile,
                      underwriters,
                      setStepOneRequest,
                      setStepmessage,
                      setLoading,
                      setStepStatus,
                      showStepsLoading,
                      preassessmentId,
                      dispatch,
                      activeClient,
                      activeClientInfo,
                      healthInfo,
                      updatePreassessmentStep
                    )}
                  />
                </TabPanel>
                <TabPanel header="Health Form">
                  <HealthForm clientAnswers={healthInfo} />
                </TabPanel>
                <TabPanel header="Attachments">
                  <DisplayAttachments
                    // clientId={clientData.id}
                    clientId={"05b4f99f-9852-4bd4-b455-840e440cdc72"}
                    // paths={["/insurance/insuranceDetails", "/insurance/medicalDetails"]}
                    paths={[
                      "insurance-insuranceDetails",
                      "insurance-medicalDetails",
                    ]}
                  />
                </TabPanel>
              </TabView>
            </div>
          )}
      </Paper>
    </div>
  );
};

export default RequestPreassessment;
