import classes from "./user-info-canvas.module.css";
import ReactDOMServer from "react-dom";

import { FC, memo, useState, useCallback, useEffect } from "react";

import update from "immutability-helper";
import Image from "next/image";

// import { Canvas } from "@react-three/fiber";
// import { Nodes, Node } from "./family-tree/graph-node";

import PeopleBin from "./user-info-menus/people-bin";
import { MenuItemTypes } from "./user-info-menus/menu-item-types";

import { Box, Diagram, Stack } from "grommet";
import { useSelector } from "react-redux";

// import UserInfoButtons from "./user-info-menus/user-info-menu";
import PeopleMenu from "./user-info-menus/people";
import AddBudgetItem from "./budget/add-budget-item";

const ItemTypes = MenuItemTypes;

interface DustbinState {
  accepts: string[];
  lastDroppedItem: any;
  binFor: string;
  binStateIndex: string;
  binColor: string;
}

interface BoxState {
  name: string;
  type: string;
}

export interface DustbinSpec {
  accepts: string[];
  lastDroppedItem: any;
}
export interface BoxSpec {
  name: string;
  type: string;
}

export interface ContainerState {
  droppedBoxNames: string[];
  dustbins: DustbinSpec[];
  boxes: BoxSpec[];
}

const Node = ({ id, shouldFlex = false, children, ...rest }) => (
  <Box
    id={id}
    flex={shouldFlex}
    align="center"
    alignContent="center"
    alignSelf="center"
    basis="auto"
    margin="small"
    pad="medium"
    gap="xsmall"
    round="small"
    border={true}
    background="neutral-1"
    elevation="xlarge"
    // flex="grow"
    animation={{
      type: "zoomIn",
      delay: 0,
      duration: 1000,
      size: "xlarge",
    }}
    height={{
      min: "32rem",
    }}
    width={{
      min: "27rem",
    }}
    style={{ position: "relative" }}
    {...rest}
  >
    {children}
  </Box>
);

const connection = (fromTarget, toTarget, { color, ...rest } = {}) => ({
  fromTarget,
  toTarget,
  color: color || "accent-1",
  thickness: "xsmall",
  round: true,
  type: "rectilinear",
  ...rest,
});

const binHeight = { min: "23rem", max: "23rem" };
const binAnimation = {
  type: "zoomIn",
  delay: 0,
  duration: 1000,
  size: "xlarge",
};

export const UserInfoCanvas: FC = memo(function UserInfoCanvas() {
  const clientData = useSelector((state) => state.factFind);
  const [activeUserMenu, setActiveUserMenu] = useState("people");
  const {
    primary,
    partner,
    dependents,
    children,
    jointDependents,
    partnerDependents,
    hasPartner,
    hasDependents,
    hasChildren,
    hasJointDependents,
    hasPartnerDependents,
  } = clientData;

  const boolArr = [
    hasPartner,
    hasChildren,
    hasJointDependents,
    hasDependents,
    hasPartnerDependents,
  ];

  const boolArrForBins = [
    hasDependents,
    hasChildren,
    hasJointDependents,
    hasPartnerDependents,
  ];

  const dataArr = [dependents, children, jointDependents, partnerDependents];

  // const hasDependents = dependents.length > 0;
  // const hasChildren = children.length > 0;
  // const hasJointDependents = jointDependents.length > 0;
  // const hasPartnerDependents = hasPartner && (partnerDependents.length > 0);

  const [dustbins, setDustbins] = useState<DustbinState[]>([
    {
      accepts: [ItemTypes.PRIMARY, ItemTypes.GRANDPARENT],
      lastDroppedItem: null,
      binFor: "You",
      binStateIndex: "primary",
      binColor: "neutral-1",
    },
    {
      accepts: [ItemTypes.PARTNER, ItemTypes.GRANDPARENT],
      lastDroppedItem: null,
      binFor: "Partner",
      binStateIndex: "partner",
      binColor: "neutral-4",
    },
    {
      accepts: [
        ItemTypes.GRANDPARENT,
        ItemTypes.ADULT,
        ItemTypes.CHILD,
        ItemTypes.PET,
      ],
      lastDroppedItem: null,
      binFor: "Your Dependents",
      binStateIndex: "dependents",
      binColor: "neutral-1",
    },
    {
      accepts: [ItemTypes.CHILD],
      lastDroppedItem: null,
      binFor: hasPartner ? "Our Children" : "Children",
      binStateIndex: "children",
      binColor: "neutral-2",
    },
    {
      accepts: [
        ItemTypes.GRANDPARENT,
        ItemTypes.ADULT,
        ItemTypes.CHILD,
        ItemTypes.PET,
      ],
      lastDroppedItem: null,
      binFor: "Joint Dependents",
      binStateIndex: "jointDependents",
      binColor: "neutral-2",
    },
    {
      accepts: [
        ItemTypes.GRANDPARENT,
        ItemTypes.ADULT,
        ItemTypes.CHILD,
        ItemTypes.PET,
      ],
      lastDroppedItem: null,
      binFor: "Partners Dependents",
      binStateIndex: "partnerDependents",
      binColor: "neutral-4",
    },
  ]);

  useEffect(() => {
    if (hasPartner) {
      const newDustbins = [...dustbins];
      newDustbins[3].binFor = "Our Children";
      setDustbins(newDustbins);
    } else if (!hasPartner) {
      const newDustbins = [...dustbins];
      newDustbins[3].binFor = "Children";
      setDustbins(newDustbins);
    }
  }, [hasPartner]);

  useEffect(() => {
    if (primary.firstName !== "" && primary.firstName !== undefined) {
      const newDustbins = [...dustbins];
      newDustbins[2].binFor = `${primary.firstName}'s Dependents`;
      newDustbins[0].binFor = `You: ${primary.firstName}`;
      setDustbins(newDustbins);
    } else {
      const newDustbins = [...dustbins];
      newDustbins[2].binFor = `Your Dependents`;
      newDustbins[0].binFor = `You`;
      setDustbins(newDustbins);
    }
  }, [primary.firstName]);

  useEffect(() => {
    if (partner.firstName !== "" && partner.firstName !== undefined) {
      const newDustbins = [...dustbins];
      newDustbins[5].binFor = `${partner.firstName}'s Dependents`;
      newDustbins[1].binFor = `Partner: ${partner.firstName}`;
      setDustbins(newDustbins);
    } else {
      const newDustbins = [...dustbins];
      newDustbins[5].binFor = `Partners Dependents`;
      newDustbins[1].binFor = `Partner`;
      setDustbins(newDustbins);
    }
  }, [partner.firstName]);

  const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([]);

  // const [nodeRefs] = useState(() => [...Array(dustbins.length)].map(createRef));

  function isDropped(boxName: string) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item;
      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name] } : { $push: [] })
      );
      setDustbins(
        update(dustbins, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedBoxNames, dustbins]
  );

  const _primary = dustbins[0];
  const _partner = dustbins[1];

  /*
     @params = activeMenu ["people", "assets", "liabilities", "expenses"]
  */
  const handleSetActiveMenu = (activeMenu) => {
    setActiveUserMenu(activeMenu);
  };
 
  // ## TODO: create a custom react hook that will render all pages using available data:
  // ReactDOMServer.renderToStaticMarkup(<Family />)
  // ReactDOMServer.renderToString<Hello />)

  const Family = (
    <div className={classes.tree_boxes} style={{ zIndex: 150 }}>
      <Stack>
        <Box style={{ zIndex: 100, position: "relative" }}>
          <Box direction="row" width={{ min: "85vw" }}>
            <Node
              key={"primary"}
              id={"primary"}
              background="neutral-1"
              animation={binAnimation}
              height={binHeight}
            >
              <PeopleBin
                personFromStore={JSON.stringify(primary)}
                accepts={_primary.accepts}
                lastDroppedItem={_primary.lastDroppedItem}
                onDrop={(item) => handleDrop(0, item)}
                idx={0}
                binFor={_primary.binFor}
                binStateIndex={"primary"}
                dataFromStore={primary}
                binContains="primary"
              />
            </Node>
            {hasPartner && (
              <Node
                key={"partner"}
                id={"partner"}
                background="neutral-4"
                animation={binAnimation}
                height={binHeight}
              >
                <PeopleBin
                  personFromStore={JSON.stringify(partner)}
                  accepts={_partner.accepts}
                  lastDroppedItem={_partner.lastDroppedItem}
                  onDrop={(item) => handleDrop(1, item)}
                  idx={1}
                  binFor={_partner.binFor}
                  binStateIndex={"partner"}
                  dataFromStore={partner}
                  binContains="partner"
                />
              </Node>
            )}
          </Box>
          <Box
            direction="row"
            wrap={true}
            flex={true}
            width={{ min: "95vw", max: "100vw" }}
          >
            {dustbins
              .slice(2)
              .map(
                (
                  { accepts, lastDroppedItem, binFor, binStateIndex, binColor },
                  index
                ) => (
                  <>
                    {boolArrForBins[index] && (
                      <Node
                        key={binStateIndex}
                        id={binStateIndex}
                        background={binColor}
                        shouldFlex={true}
                        animation={binAnimation}
                        height={binHeight}
                      >
                        <PeopleBin
                          accepts={accepts}
                          lastDroppedItem={lastDroppedItem}
                          onDrop={(item) => handleDrop(index + 2, item)}
                          idx={index + 2}
                          binFor={binFor}
                          binStateIndex={binStateIndex}
                          dataFromStore={dataArr[index]}
                          binContains="dependents"
                        />
                      </Node>
                    )}
                  </>
                )
              )}
          </Box>
        </Box>
        <Diagram
          style={{ position: "relative", zIndex: -99 }}
          connections={[
            connection("primary", "partner", { color: "accent-1" }),
            connection("primary", "children", { color: "accent-2" }),
            connection("partner", "children", { color: "accent-2" }),
            connection("primary", "dependents", { color: "accent-3" }),
            connection("primary", "jointDependents", { color: "accent-2" }),
            connection("partner", "jointDependents", { color: "accent-2" }),
            connection("partner", "partnerDependents", { color: "accent-4" }),
          ]}
        />
      </Stack>
    </div>
  );

  return (
    <div className={classes.container}>
      {/* <div className={classes.user_info_button}>
        <UserInfoButtons setActiveMenu={handleSetActiveMenu} />
      </div> */}
      <div className={classes.active_user_info_menu}>
        {activeUserMenu === "people" && (
          <PeopleMenu
            defaultActiveOptions={[...boolArr]}
            hasPartner={hasPartner}
          />
        )}
        <div className={classes.active_user_info_menu_other}>
          {activeUserMenu === "income" && <AddBudgetItem type="incomes" />}
          {activeUserMenu === "assets" && <AddBudgetItem type="assets" />}
          {activeUserMenu === "liabilities" && (
            <AddBudgetItem type="liabilities" />
          )}
          {activeUserMenu === "expenses" && <AddBudgetItem type="expenses" />}
        </div>
      </div>

      {Family}

      {/* <div className={classes.boxes}>
        {dustbins.map(
          ({ accepts, lastDroppedItem, binFor, binStateIndex }, index) => (
            <PeopleBin
              accepts={accepts}
              lastDroppedItem={lastDroppedItem}
              onDrop={(item) => handleDrop(index, item)}
              key={index}
              binFor={binFor}
              binStateIndex={binStateIndex}
            />
          )
        )}
      </div> */}

      {/* <div className={classes.house}>
        <Image
          src={"/assets/images/00 house_2x.svg"}
          height={250}
          width={250}
        />
      </div> */}
    </div>
  );
});

export default UserInfoCanvas;

// <div className={classes.nodes_container}>
//   <Canvas orthographic camera={{ zoom: 80 }} dpr={[1, 2]}>
//     <Nodes
//       dashed
//       color="#ff1050"
//       lineWidth={1}
//       dashSize={0.4}
//       gapSize={0.1}
//     >
//       {dustbins.map(({ accepts, lastDroppedItem }, index) => (
//         <Node
//           ref={nodeRefs[index]}
//           name="a"
//           position={[-2, 2.5, 0]}
//           // connectedTo={[b, c, e]}
//         >
//           <DndProvider backend={HTML5Backend}>
//             <PeopleBin
//               accepts={accepts}
//               lastDroppedItem={lastDroppedItem}
//               onDrop={(item) => handleDrop(index, item)}
//               key={index}
//             />
//           </DndProvider>
//         </Node>
//       ))}
//       {/* <Node ref={b} name="b" position={[0, 1, 0]} connectedTo={[d, a]} />
//       <Node ref={c} name="c" position={[-0.25, 0, 0]} />
//       <Node ref={d} name="d" position={[2, 0.5, 0]} />
//       <Node ref={e} name="e" position={[-0.5, -1, 0]} /> */}
//     </Nodes>
//   </Canvas>
