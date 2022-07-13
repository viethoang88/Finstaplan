import {
  CSSProperties,
  FC,
  memo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import { DropTarget } from "react-dnd";
import PersonItem from "../person-item";
import { MenuItemTypes } from "./menu-item-types";
import classes from "./people-bin.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  factFindActions,
  emptyPartner,
  emptyDependent,
} from "../../../store/fact-find";

// const style: CSSProperties = {
//   height: "12rem",
//   width: "12rem",
//   marginRight: "1.5rem",
//   marginBottom: "1.5rem",
//   color: "white",
//   padding: "1rem",
//   textAlign: "center",
//   fontSize: "1rem",
//   lineHeight: "normal",
//   float: "left",
//   zIndex: "1001",
// };

export interface DustbinProps {
  accepts: string[];
  lastDroppedItem?: any;
  binFor: string;
  binStateIndex: string;
  onDrop: (item: any) => void;

  // Collected Props
  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}

// if (action === "REMOVE_DEPENDENT") {
//   state[key] = state[key].filter((person, index) => {
//     return idx !== index;
//   });
// } else if (action === "ADD_PARTNER") {
//   state[key].push({ ...emptyPartner });
// } else if (action === "ADD_ADVISOR") {
//   state[key].push({ ...emptyAdvisor });
// } else if (action === "UPDATE_DEPENDENT") {
//   state[key][idx] = person;
// } else if (action === "ADD_DEPENDENT") {
//   state[key].push({ ...emptyDependent });
// } else if (action === "UPDATE_CLIENT" || action === "UPDATE_PARTNER") {
//   state[key] = person;

const binStateIndexToAction = {
  primary: "UPDATE_CLIENT",
  partner: "UPDATE_PARTNER",
  dependents: "UPDATE_DEPENDENT",
  children: "UPDATE_DEPENDENT",
  partnerDependents: "UPDATE_DEPENDENT",
  jointDependents: "UPDATE_DEPENDENT",
};

export const Dustbin: FC<DustbinProps> = memo(function Dustbin({
  accepts,
  isOver,
  canDrop,
  connectDropTarget,
  lastDroppedItem,
  binFor,
  idx,
  binStateIndex,
  dataFromStore,
  binContains,
}) {
  // const store = useSelector((state) => state.factFind);
  const dispatch = useDispatch();

  let _primary;
  try {
    _primary = useSelector((state) => state.factFind.primary.firstName);
  } catch {
    _primary = "";
  }
  let _partner;
  try {
    _partner = useSelector((state) => state.factFind.partner.firstName);
  } catch {
    _partner = "";
  }

  const currentPeople = useSelector((state) => state.factFind[binStateIndex]);

  const [droppedItems, setDroppedItems] = useState([]);
  const [droppedItemsData, setDroppedItemsData] = useState([]);

  useEffect(() => {
    if (currentPeople) {
      console.log(currentPeople);
      if (Array.isArray(currentPeople)) {
        const uiDataAvailable = currentPeople.map(
          (person) => person.uiData !== undefined
        );
        if (uiDataAvailable.every((item) => item === true)) {
          setDroppedItems(currentPeople.map((person) => person.uiData));
        }
        setDroppedItemsData(
          currentPeople.map((person) => {
            let currPerson = { ...person };
            delete currPerson.uiData;
            return currPerson;
          })
        );
      } else {
        if (currentPeople.uiData !== undefined) {
          setDroppedItems([currentPeople.uiData]);
        }
        const currPerson = { ...currentPeople };
        delete currPerson.uiData;
        setDroppedItemsData([currPerson]);
      }
    }
  }, [currentPeople]);

  const isActive = isOver && canDrop;

  const updatePerson = (idx, data) => {
    const newData = [...droppedItemsData];
    newData[idx] = data;
    setDroppedItemsData(newData);

    /* USAGE: updateClientDataNested(state, _action) {
      const { newValue, action, path } = _action.payload;
    */
    // dispatch(
    //   factFindActions.updateClientDataNested({
    //     newValue: droppedItems[idx],
    //     action: "UPDATE",
    //     path: [binStateIndex, "uiData"],
    //   })
    // );

    dispatch(
      factFindActions.updatePerson({
        action: binStateIndexToAction[binStateIndex],
        idx: idx,
        key: binStateIndex,
        person: { ...data, uiData: { ...droppedItems[idx] } },
      })
    );
  };

  // const removeItem = useCallback((id) => {
  const removeItem = useCallback(
    (id, e) => {
      if (binContains === "dependents") {
        const newItems = droppedItems.filter((item, idx) => {
          return id !== idx;
        });
        const newItemsData = droppedItemsData.filter((item, idx) => id !== idx);
        setDroppedItems(newItems);
        setDroppedItemsData(newItemsData);
        dispatch(
          factFindActions.updatePerson({
            action: "REMOVE_DEPENDENT",
            key: binStateIndex,
            idx: id,
          })
        );
      }
      if (binContains === "partner" || binContains === "primary") {
        setDroppedItems([]);
        setDroppedItemsData([]);
        dispatch(
          factFindActions.updatePerson({
            action: "UPDATE_PARTNER",
            key: binStateIndex,
            person: {},
          })
        );
      }
    },
    [droppedItems, droppedItemsData]
  );

  const getRelation = (binStateIndex) => {
    if (["children", "jointDependents"].includes(binStateIndex)) return "Both";
    else if (binStateIndex === "dependents") return _primary;
    else if (binStateIndex === "partnerDependents") return _partner;
  };

  // let backgroundColor = "#222";
  // dependents, children, jointDependents, partnerDependents
  useEffect(() => {
    if (lastDroppedItem) {
      const gender = lastDroppedItem.gender;

      if (
        [
          "dependents",
          "children",
          "jointDependents",
          "partnerDependents",
        ].includes(binStateIndex)
      ) {
        const relatedTo = getRelation(binStateIndex);
        const newDependent = {
          ...emptyDependent,
          gender,
          relatedTo,
          uiData: lastDroppedItem,
        };
        setDroppedItems((prevState) => prevState.concat(lastDroppedItem));
        setDroppedItemsData((prevState) => prevState.concat(newDependent));
        dispatch(
          factFindActions.updatePerson({
            action: "ADD_DEPENDENT",
            key: binStateIndex,
            person: newDependent,
          })
        );
      } else if (binStateIndex === "partner") {
        setDroppedItems([lastDroppedItem]);
        setDroppedItemsData([{ ...emptyPartner, gender }]);
        // const newPartner = { ...emptyPartner, gender, uiData: lastDroppedItem };
        // dispatch(
        //   factFindActions.updatePerson({
        //     action: "ADD_PARTNER",
        //     key: binStateIndex,
        //     person: newPartner,
        //   })
        // );
        dispatch(
          factFindActions.updateClientDataNested({
            newValue: lastDroppedItem,
            action: "UPDATE",
            path: [binStateIndex, "uiData"],
          })
        );
      } else if (binStateIndex === "primary") {
        setDroppedItems([lastDroppedItem]);
        setDroppedItemsData([{ ...emptyPartner, gender }]);
        // const newPrimary = { ...emptyPartner, gender, uiData: lastDroppedItem };
        // dispatch(
        //   factFindActions.updatePerson({
        //     action: "UPDATE_CLIENT",
        //     key: binStateIndex,
        //     person: newPrimary,
        //   })
        // );
        dispatch(
          factFindActions.updateClientDataNested({
            newValue: lastDroppedItem,
            action: "UPDATE",
            path: [binStateIndex, "uiData"],
          })
        );
      }
    }
  }, [lastDroppedItem]);

  let people;

  if (["partner", "primary"].includes(binStateIndex)) {
    const person = droppedItems[0] ? droppedItems[0] : false;
    if (person) {
      people = (
        <PersonItem
          idx={idx}
          name={person.name}
          type={person.type}
          src={person.src}
          role={person.role}
          height={person.height}
          width={person.width}
          removeItem={removeItem.bind(null, 0)}
          updatePerson={updatePerson.bind(null, 0)}
          gender={person.gender}
          currentPerson={currentPeople}
          binContains={binContains}
          binStateIndex={binStateIndex}
        />
      );
    }
  } else {
    // ["jointDependents", "dependents", "children"]
    people = droppedItems.map((person, idx) => (
      <PersonItem
        key={`${person.role}_${idx}`}
        name={person.name}
        type={person.type}
        src={person.src}
        role={person.role}
        id={idx}
        idx={idx}
        height={person.height}
        width={person.width}
        removeItem={removeItem.bind(null, idx)}
        updatePerson={updatePerson.bind(null, idx)}
        dropped={true}
        gender={person.gender}
        currentPerson={{ ...currentPeople[idx] }}
        binContains={binContains}
        binStateIndex={binStateIndex}
      />
    ));
  }

  let backgroundColor = "transparent";

  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  // const binFor =
  // accepts[0] === MenuItemTypes.PRIMARY
  //   ? "Primary"
  //   : accepts[0] === MenuItemTypes.PARTNER
  //   ? "Partner"
  //   : accepts[0] === MenuItemTypes.CHILD
  //   ? "Children"
  //   : "Other dependents";

  return connectDropTarget(
    <div
      ref={connectDropTarget}
      style={{
        backgroundColor,
        height: "23rem",
        width: "100%",
        position: "absolute",
      }}
      role="Dustbin"
      className={classes.bin}
      id={binStateIndex}
      key={binStateIndex}
    >
      <div className={classes.binlabel}>
        <span>{binFor}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          top: "-1rem",
          userSelect: "none",
        }}
      >
        {people}
      </div>
      {/* {people} */}
      {isActive && (
        <div className={classes.droptext_container}>
          <span className={classes.droptext}>"Release to drop"</span>
        </div>
      )}
    </div>
  );
});

export default DropTarget(
  (props: DustbinProps) => props.accepts,
  {
    drop(props: DustbinProps, monitor: DropTargetMonitor) {
      props.onDrop(monitor.getItem());
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(Dustbin);
