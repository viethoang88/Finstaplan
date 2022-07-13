import {
  CSSProperties,
  FC,
  memo,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  ConnectDropTarget,
  DropTargetMonitor,
  XYCoord,
  DropTarget,
} from "react-dnd";
import DroppedGoal from "./goal-dropped";
import update from "immutability-helper";

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
  onDrop: (item: any) => void;

  // Collected Props
  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}

export interface GoalDragItem {
  id: string;
  left: number;
  top: number;
  goal: string;
  icon: any;
}

export const GoalBin: FC<DustbinProps> = memo(function GoalBin({
  top,
  left,
  id,
  accepts,
  isOver,
  canDrop,
  connectDropTarget,
  lastDroppedItem,
  handleDrop,
}) {
  const [droppedItems, setDroppedItems] = useState([]);
  // const [remove, setRemoveItem] = useState(false);
  // const [removeId, setRemoveId] = useState(null);

  useEffect(() => {
    console.log(isOver);
    console.log(canDrop);
    console.log(lastDroppedItem);
    console.log(droppedItems);
  }, [isOver, canDrop, lastDroppedItem]);

  const moveBox = (
    id: string,
    left: number,
    top: number,
    goal: string,
    icon: any
  ) => {
    setDroppedItems(
      update(droppedItems, {
        boxes: {
          [id]: {
            $merge: { left, top, goal, icon },
          },
        },
      })
    );
  };

  const isActive = isOver && canDrop;

  // const removeItem = useCallback((id) => {
  const removeItem = (id, e) => {
    const newItems = droppedItems.filter((item, idx) => {
      return id !== idx;
    });
    setDroppedItems(newItems);
  };
  // }, []);

  // let backgroundColor = "#222";
  useEffect(() => {
    if (lastDroppedItem) {
      setDroppedItems((prevState) => prevState.concat(lastDroppedItem));
    }
  }, [lastDroppedItem]);

  const goals = droppedItems.map(({ goal, icon }, idx) => (
    <DroppedGoal key={idx} goal={goal} icon={icon} />
  ));

  let backgroundColor = "transparent";
  // let backgroundColor = "black";

  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  const binFor = "goal";

  return connectDropTarget(
    <div
      ref={connectDropTarget}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor,
        zIndex: "33000",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "space-between",
        justifyContent: "space-between",
      }}
      role="Dustbin"
    >
      {isActive && (
        <div>
          <span
            style={{
              position: "relative",
              fontWeight: "700",
              fontSize: "1.5rem",
              textAlign: "center",
              color: "white",
            }}
          >
            "Release to drop"
          </span>
        </div>
      )}
      {canDrop && !isActive && (
        <div>
          <span
            style={{
              position: "relative",
              fontWeight: "700",
              fontSize: "1.5rem",
              textAlign: "center",
              color: "white",
            }}
          >
            "Drag here to drop"
          </span>
        </div>
      )}

      {goals}
    </div>
  );
});

export default DropTarget(
  (props: DustbinProps) => props.accepts,
  {
    drop(
      props: DustbinProps,
      monitor: DropTargetMonitor
      // component: any | null
    ) {
      props.onDrop(monitor.getItem());
      //  if (!component) {
      //    return;
      //  }
      // const item = monitor.getItem();
      // const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
      // const left = Math.round(item.left + delta.x);
      // const top = Math.round(item.top + delta.y);
      // component.moveBox(item.id, left, top);
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(GoalBin);
