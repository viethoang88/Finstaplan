import { Button } from "semantic-ui-react";

const CalculatingButton = ({
  computedData,
  calculating,
  calculated,
  topic,
  boundOnClickFunction,
}) => {
  return (
    <Button
      style={{ width: "100%" }}
      content={
        calculating
          ? `Calculating ${topic}`
          : computedData
          ? `Recalculate ${topic}`
          : `Calculate ${topic}`
      }
      icon="calculator"
      labelPosition="left"
      // disabled={calculatedData !== undefined}
      onClick={(e) => {
        boundOnClickFunction();
      }}
      loading={calculating}
      positive={calculated}
    />
  );
};

export default CalculatingButton;
