import ReactDOMServer from "react-dom/server";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  position: relative;
  // top: -45px;
  // left: 60px;
  display: flex;
  align-self: center;
`;

const Outer = styled.table`
  min-width: 1590px;
  width: 1590px;
  // width: 795px;
  // min-width: 795px;
  // height: 950px;
  // min-height: 950px;
  border: 1px solid black;
  background-color: rgba(233, 230, 230, 0.904);
`;

const Th = styled.th`
  border: 1px solid black;
`;
const Td = styled.td`
  border: 1px solid black;
`;

const Row_1 = styled.tr`
  height: 64;
  font-size: 16;
`;

const Row_2 = styled.tr`
  height: 64;
  width: 64;
  font-size: 14;
`;

const Row = styled.tr`
  // height: 475px;
  // min-height: 475px;
  height: 425px;
`;

const Td_0 = styled.td`
  max-width: 8;
  width: 4;
  min-width: 4;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
`;
const Td_1 = styled.td`
  font-size: 14;
  font-weight: bold;
  text-align: center;
  position: relative;
  width: 64;
  height: 64;
  border: 1px solid black;
`;
const Td_1_2 = Td_1;
const Td_2 = Td_1;
const Td_3 = Td_1;

const Td_4 = styled.td`
  position: relative;
  width: 15rem;
`;

const GoalBin = styled.div`
  // position: relative;
  // top: -900px;
  // left: 50px;
  position: absolute;
  top: 0;
  left: 0;
  // left: 0;
  // width: 100%;
  // min-width: 100%;
  // height: 100%;
  // width: 100%;
  // min-height: 100%;
  // min-width: 95vw;
  // min-height: 70vh;
  background-color: transparent;
  // width: "auto",
  // height: "61.25vh",
`;

const GoalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  align-content: center;
  // max-width: 36px;
  width: 36px;
  height: 90px;
  // border-radius: 5;
  background-color: transparent;
  width: "auto",
  height: "61.25vh",
  marginLeft: "4.8vw",
`;

const GoalButton = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  width: 17.2;
  height: 17.2;
  border-radius: 50;
  // background-color: rgba(255, 255, 255, 0.8);
  background-color: transparent;
  // border: black solid 0.5px;
`;

const GoalText = styled.p`
  text-align: center;
  width: auto;
  font-weight: 500;
  font-size: 12;
  color: black;
`;

const GoalBinTwo = styled.div`
  width: 100%;
  min-width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const GoalContainerTwo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  align-content: center;
  // max-width: 36px;
  width: 44px;
  height: 95px;
  border-radius: 5;
`;

const GoalButtonTwo = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  width: 17.2;
  height: 17.2;
  border-radius: 50;
  background-color: rgba(255, 255, 255, 0.8);
  border: black solid 0.5px;
`;

const GoalTextTwo = styled.p`
  text-align: center;
  width: auto;
  font-weight: 500;
  font-size: 12;
  color: black;
`;

const goalMap2 = (goals) => {
  return (
    <GoalBinTwo className="goal_bin">
      {goals &&
        goals?.map((goalData) => {
          const { left, top, goal, arrIdx, idx, ...rest } = goalData;
          return (
            <GoalContainerTwo className="goalContainer">
              <GoalButtonTwo
                className="goal_button"
                style={{ backgroundColor: "white" }}
              >
                <GoalTextTwo className="goal_text">{goal}</GoalTextTwo>
              </GoalButtonTwo>
            </GoalContainerTwo>
          );
        })}
    </GoalBinTwo>
  );
};

const goalMap = (goals) => {
  // console.log("-------- BUILDING GOAL MAP WITh GOALS ---------");
  // console.log(goals);

  return (
    <Wrapper className="wrapper">
      <Outer className="outer">
        <thead>
          <Row_1 className="row_1">
            <Th className="Th_0" colSpan="1"></Th>
            <Th className="Th_1" colSpan="2">
              Short term
            </Th>
            <Th className="Th_3">Medium term</Th>
            <Th className="Th_4">Long term</Th>
          </Row_1>
          <Row_2 className="row_2">
            <Th className="Th_0"></Th>
            <Th className="Th_1 shortterm">0-2 years</Th>
            <Th className="Th_1_2">2-4 years</Th>
            <Th className="Th_3">4-7 years</Th>
            <Th className="Th_4">7+ years</Th>
          </Row_2>
        </thead>
        <GoalBin className="goal_bin">
          {goals &&
            goals?.map((goalData) => {
              const { left, top, goal, arrIdx, idx, ...rest } = goalData;
              console.log(goal);
              console.log(left);
              console.log(top);
              return (
                <GoalContainer
                  className="goalContainer"
                  style={{
                    // left: (Math.abs(left) + 50) * 1.15 + 50,
                    // top: ((Math.abs(top) + 100) * 1.75 + 65) / 2.8,
                    left: Math.abs(left),
                    top: Math.abs(top),
                  }}
                >
                  <GoalButton
                    className="goal_button"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <GoalText className="goal_text">{goal}</GoalText>
                  </GoalButton>
                </GoalContainer>
              );
            })}
        </GoalBin>
        <tbody>
          <Row className="row">
            <Td_0 className="td_0 need">Need</Td_0>
            <Td_1 className="td_1"></Td_1>
            <Td_1_2 className="td_1_2"></Td_1_2>
            <Td_2 className="td_2"></Td_2>
            <Td_3 className="td_3"></Td_3>
          </Row>
          <Row className="row">
            <Td_0 className="td_0 want">Want</Td_0>
            <Td_1 className="td_1"></Td_1>
            <Td_1_2 className="td_1_2"></Td_1_2>
            <Td_2 className="td_2"></Td_2>
            <Td_3 className="td_3"></Td_3>
          </Row>
        </tbody>
      </Outer>
    </Wrapper>
  );
};

export const renderGoals = (goals) => {
  const goalsMarkup = goalMap(goals);
  return goalsMarkup;
};
