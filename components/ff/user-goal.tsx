import classes from "./user-goal.module.css";
import React, { memo, useMemo, useState, forwardRef } from "react";
import { ConnectDragSource, DragSourceMonitor } from "react-dnd";
import { DragSource, DragSourceConnector } from "react-dnd";
import { useEffect } from "react";

export interface MenuItemProps {
  type: string;
  goal: string;
  id: string;
  icon: React.ElementType;

  // Collected Props
  isDropped: boolean;
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}

export const UserGoal = memo(function UserGoal({
  type,
  name,
  didDrop,
  dropResult,
  getItem,
  isDragging,
  connectDragSource,
  removeDroppedGoal,
  id,
  goal,
  icon,
  color,
  clickable,
  width,
  height,
  deleteMe,
  useColor = true,
}) {
  // useEffect(() => {
  //   console.log(dropResult);
  //   console.log(didDrop);
  //   console.log(getItem);
  // }, [didDrop, getItem, dropResult]);

  return connectDragSource(
    <div
      className={classes.goalContainer}
      role={"goal"}
      style={{ zIndex: "2050", backgroundColor: useColor ? color : "" }}
    >
      <div className={classes.goal_button}>
        {/* <i className={`pi pi-plus ${classes.goal_button}`} /> */}
        <span className={classes.goal_button_icon}>{icon}</span>
      </div>
    </div>
  );
});

export default DragSource(
  (props) => props.type,
  {
    beginDrag: (props: MenuItemProps) => ({
      type: props.type,
      goal: props.goal,
      icon: props.icon,
      id: props.id,
      top: 0,
      left: 0,
    }),
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop(),
    dropResult: monitor.getDropResult(),
    getItem: monitor.getItem(),
  })
)(UserGoal);

// <Popover
//   placement="top" //"topLeft"
//   title={text}
//   content={content}
//   style={{ zIndex: 14 }}
//   // trigger="click"
//   visible={showPopover}
//   onVisibleChange={handlePopoverChange}
//   //onMouseLeave={() => setShowPopover(false)}
// >
//   {/* <div style={{ width: "50rem", height: "50rem", zIndex: 14 }}>
//     {" "}
//     YYOOOOOOOOOOOOOOOO
//   </div> */}
//   <div
//     onMouseEnter={() => setShowPopover(true)}
//     // onMouseLeave={() => setShowPopover(false)}
//   >

//</div> {teachingBubbleVisible
// <TeachingBubble
//   target={`#${id}`}
//   primaryButtonProps={examplePrimaryButtonProps}
//   secondaryButtonProps={exampleSecondaryButtonProps}
//   onDismiss={toggleTeachingBubbleVisible}
//   headline="Discover what’s trending around you"
// >
//   <div>
//     Give this goal an icon
//     <Dropdown
//       optionLabel="name"
//       // value={city}
//       options={cities}
//       // onChange={(e) => setCity(e.value)}
//       placeholder="Select a City"
//     />
//   </div>
// </TeachingBubble>
// )}
