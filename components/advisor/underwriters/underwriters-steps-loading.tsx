import { Spin, Alert } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const UnderwritersStepsLoading = ({
  stepMessage,
  // stepStatus,
  successMessage,
}) => {
  const preassessmentStep = useSelector((state) => state.ui.preassessmentStep);
  const initialMessage = useMemo(() => stepMessage, []);
  const [previousMessages, setPreviousMessages] = useState([initialMessage]);
  const [_stepMessage, setStepMessage] = useState("");
  const [stepStatus, setStepStatus] = useState("info");

  useEffect(() => {
    setStepStatus(preassessmentStep.step);
    // setStepMessage(preassessmentStep.message);
  }, [preassessmentStep]);

  useEffect(() => {
    console.log("---- STEP MESSAGE ----");
    console.log(preassessmentStep.message);
    setPreviousMessages((prevState) => [
      ...prevState,
      preassessmentStep.message,
    ]);
  }, [preassessmentStep.message]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (previousMessages.length > 1) {
        const newMsg = previousMessages[0];
        console.log(previousMessages);
        setPreviousMessages((prevState) => prevState.slice(1));
        setStepMessage(newMsg);
      } else {
        setPreviousMessages(["Request has completed"]);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Spin
        tip={previousMessages[0]}
        //   delay={3000}
        size={"large"}
        spinning={stepStatus !== "success" && stepStatus !== "error"}
      >
        <Alert
          message={
            stepStatus !== "success" && stepStatus !== "error"
              ? "Processing your Pre-Assessment Request."
              : "Completed"
          }
          // description={stepMessage}
          style={{ height: "25rem" }}
          type={stepStatus}
          icon={
            stepStatus !== "success" &&
            stepStatus !== "error" && <CloudUploadOutlined />
          }
          showIcon={true}
        />
      </Spin>
    </div>
  );
};

export default UnderwritersStepsLoading;
