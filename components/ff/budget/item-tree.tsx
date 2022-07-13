import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Box } from "grommet";
import classes from "./item-tree.module.css";
import RenderBudgetItem from "./render-budget-item";

import { valueFormatter } from "../../../helpers/util";

const getBox = (childComponent, idx, color) => {
  return (
    <Box
      key={idx}
      align="center"
      alignContent="center"
      justifyContent="flex-end"
      alignSelf="center"
      basis="auto"
      margin="small"
      pad="medium"
      gap="xsmall"
      round="small"
      border={true}
      background={color}
      elevation="xlarge"
      // flex="grow"
      animation={{
        type: "zoomIn",
        delay: 0,
        duration: 1000,
        size: "xlarge",
      }}
      height={{
        min: "5.5rem",
        max: "5.5rem",
      }}
      width={{
        min: "26rem",
        max: "26rem",
      }}
      style={{ zIndex: "250" }}
    >
      {childComponent}
    </Box>
  );
};

const frequencyToNumberMap = {
  annually: 1,
  biAnnually: 2,
  quarterly: 4,
  monthly: 12,
  weekly: 52,
  fortnightly: 26,
};

const frequencyToNum = (frequency) => {
  const freq = frequencyToNumberMap[frequency];
  return freq === undefined ? 1 : freq;
};

const sumItems = (items) => {
  if (items === undefined) return 0;
  return items?.reduce(
    (acc, next) => acc + next.value * frequencyToNum(next.frequency),
    0
  );
};

const ItemTree = ({
  position,
  relevantData,
  borderPosition,
  paddingPosition,
  distance = 0,
  topOffset = 0,
  taxableIncome = 6900,
  extraStyles = {},
}) => {
  const [target, incoming, outgoing] = relevantData;
  const _incData = useSelector((state) => state.factFind[target][incoming]);
  const _outData = useSelector((state) => state.factFind[target][outgoing]);

  if (_incData === undefined && _outData === undefined) {
    return <></>;
  }

  const [incomingSum, setIncomingSum] = useState(0);
  const [outgoingSum, setOutgoingSum] = useState(0);

  const updateSums = (target) => {
    if (target === "inc") {
      setIncomingSum(sumItems(_incData));
    }
    if (target == "out") {
      setOutgoingSum(sumItems(_outData));
    }
  };

  useEffect(() => {
    updateSums("inc");
  }, [_incData]);

  useEffect(() => {
    updateSums("out");
  }, [_outData]);

  console.log(_incData);
  console.log(_outData);

  console.log("--- this should have the types ---");
  console.log(incoming);
  console.log(outgoing);

  if (position === "bottom") {
    return (
      <div
        className={classes.bottom_container}
        style={{
          position: "relative",
          [position]: distance,
          padding: "1rem",
          paddingTop: "5rem",
        }}
      >
        {_incData && _incData?.length > 0 && (
          <div className={classes.data_container_bottom}>
            <div className={classes.sum_bottom}>
              {valueFormatter(incomingSum)}
              &nbsp;{incoming !== "assets" && "/ Year"}
            </div>
            <div
              className={classes.incoming_bottom}
              style={{
                [paddingPosition]: "7rem",
                [borderPosition]: "lightgreen 8px solid",
              }}
            >
              {_incData.map((income, idx) => {
                const childComponent = <RenderBudgetItem {...income} />;
                return getBox(childComponent, idx, "neutral-2");
              })}
            </div>
          </div>
        )}

        <br />
        <br />
        {_outData && _outData?.length > 0 && (
          <div className={classes.data_container_bottom}>
            <div className={classes.sum_bottom}>
              ({valueFormatter(outgoingSum)}
              )&nbsp;{incoming !== "assets" && "/ Year"}
            </div>

            <div
              className={classes.outgoing_bottom}
              style={{
                [paddingPosition]: "7rem",
                [borderPosition]: "lightsalmon 8px solid",
              }}
            >
              {_outData.map((outgo, idx) => {
                const childComponent = <RenderBudgetItem {...outgo} />;
                return getBox(childComponent, idx, "neutral-4");
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        [position]: distance,
        top: topOffset,
        padding: "1rem",
        paddingTop: "5rem",
        ...extraStyles,
      }}
    >
      {_incData?.length > 0 && (
        <div className={classes.data_container}>
          {position === "right" && (
            <div className={classes.sum_right}>
              {valueFormatter(incomingSum)}
              &nbsp;{incoming !== "assets" && "/ Year"}
            </div>
          )}
          <div
            className={
              position === "right" ? classes.incoming_right : classes.incoming
            }
            style={{
              [paddingPosition]: "7rem",
              [borderPosition]: "lightgreen 8px solid",
            }}
          >
            {_incData.map((income, idx) => {
              const childComponent = <RenderBudgetItem {...income} />;
              return getBox(childComponent, idx, "neutral-2");
            })}
          </div>

          {position === "left" && (
            <div className={classes.sum}>
              {valueFormatter(incomingSum)}&nbsp;
              {incoming !== "assets" && "/ Year"}
            </div>
          )}
        </div>
      )}

      <br />
      <br />
      {_outData?.length > 0 && (
        <div className={classes.data_container}>
          {position === "right" && (
            <div className={classes.sum_right}>
              ({valueFormatter(outgoingSum)}
              )&nbsp;{incoming !== "assets" && "/ Year"}
            </div>
          )}
          <div
            className={
              position === "right" ? classes.outgoing_right : classes.outgoing
            }
            style={{
              [paddingPosition]: "7rem",
              [borderPosition]: "lightsalmon 8px solid",
            }}
          >
            {_outData.map((outgo, idx) => {
              const childComponent = <RenderBudgetItem {...outgo} />;
              return getBox(childComponent, idx, "neutral-4");
            })}
          </div>
          {position === "left" && (
            <div className={classes.sum}>
              ({valueFormatter(outgoingSum)}){" "}
              {incoming !== "assets" && "/ Year"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemTree;
