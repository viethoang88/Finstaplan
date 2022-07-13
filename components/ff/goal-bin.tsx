import { CSSProperties, Component } from "react";
import { ConnectDropTarget, DropTargetMonitor, XYCoord } from "react-dnd";
import { DropTarget } from "react-dnd";
import update from "immutability-helper";
import GoalDropped from "./goal-dropped";
import { iconOptions } from "./user-goals";

export const ItemTypes = {
  GOAL: "goal",
};

export interface BoxDragItem {
  id: string;
  goal: string;
  idx: number;
  left: number;
  top: number;
  arrIdx: number;
}

const styles: CSSProperties = {
  width: "auto",
  height: "61.25vh",
  marginLeft: "4.8vw",
  // border: "1px solid black",
  position: "relative",
  zIndex: 4100,
  backgroundColor: "transparent",
};

export interface ContainerProps {
  hideSourceOnDrag: boolean;
  connectDropTarget: ConnectDropTarget;
  updateStoredGoal: (goal: Object, idx: number) => {};
}

export interface ContainerState {
  boxes: {
    [key: string]: {
      top: number;
      left: number;
      goal: string;
      idx: number;
      arrIdx: number;
    };
  };
}

class GoalBin extends Component<ContainerProps, ContainerState> {
  constructor(props) {
    super(props);
    this.state = { boxes: props.goals };
  }

  public render() {
    const { hideSourceOnDrag = false, connectDropTarget } = this.props;
    const { boxes } = this.state;

    return connectDropTarget(
      <div style={styles}>
        {boxes &&
          Object.keys(boxes).map((key) => {
            const { left, top, goal, arrIdx, idx, ...rest } = boxes[key];
            return (
              <GoalDropped
                key={key}
                id={key}
                left={left}
                top={top}
                goal={goal}
                icon={iconOptions[idx]}
                hideSourceOnDrag={hideSourceOnDrag}
                idx={idx}
                arrIdx={arrIdx}
                goalData={rest}
              >
                {goal}
              </GoalDropped>
            );
          })}
      </div>
    );
  }

  public boxExists(id) {
    return this.state.boxes[id] !== undefined;
  }

  public dropBox(
    id: string,
    left: number,
    top: number,
    goal: string,
    idx: number,
    arrIdx: number
  ) {
    this.setState(
      update(this.state, {
        boxes: {
          [id]: {
            $set: { left, top, idx, goal, arrIdx },
          },
        },
      })
    );
  }

  public moveBox(id: string, left: number, top: number) {
    this.setState(
      update(this.state, {
        boxes: {
          [id]: {
            $merge: { left, top },
          },
        },
      })
    );
  }
}

export default DropTarget(
  ItemTypes.GOAL,
  {
    drop(
      props: ContainerProps,
      monitor: DropTargetMonitor,
      component: GoalBin | null
    ) {
      if (!component) {
        return;
      }
      const item = monitor.getItem<BoxDragItem>();
      const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);

      console.log(item, delta, left, top);

      if (component.boxExists(item.id)) {
        component.moveBox(item.id, left, top);
        props.updateStoredGoal({ ...item, left, top }, item.arrIdx);
      } else component.dropBox(item.id, 0, 0, item.goal, item.idx, item.arrIdx);
    },
  },
  (connect: any) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(GoalBin);
