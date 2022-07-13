import { CSSProperties, FC, memo, useState } from "react";
import { ConnectDragSource, DragSourceMonitor } from "react-dnd";
import { DragSource, DragSourceConnector } from "react-dnd";
import Image from "next/image";
import classes from "./menu-item.module.css";
import { Label } from "semantic-ui-react";

export interface MenuItemProps {
  name: string;
  type: string;
  src: string;
  width: number;
  height: number;
  role: string;
  gender: string;
  isDropped: boolean;
  paddingTop: string;

  // Collected Props
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}

// <Image src={link} alt={title} width={width} height={height} />

export const MenuItem: FC<MenuItemProps> = memo(function MenuItem({
  name,
  isDropped,
  isDragging,
  connectDragSource,
  src: link,
  width,
  height,
  role,
  gender,
  paddingTop,
}) {
  const [hovered, onHover] = useState(false);

  const opacity = isDragging ? 0.4 : 1;
  return connectDragSource(
    <li className={classes.item} role={role}>
      {/* <span>{role}</span> */}
      {hovered && (
        <Label
          style={{
            position: "absolute",
            top: "-2.5rem",
          }}
          pointing="below"
        >
          {name}
        </Label>
      )}
      {/* <Image> doesnt work with amplify */}
      <img
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        src={link}
        alt={name}
        // width={width}
        // height={height}
        style={{
          position: "absolute",
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
          display: "flex",
          top: paddingTop,
          // alignSelf: "flex-end",
          // justifySelf: "flex-end",
          // alignContent: "flex-end",
          // justifyContent: "flex-end,",
          // position: "relative",
          // top: "-.5rem",
          // left: ".1rem",
        }}
      />
    </li>
  );
});

export default DragSource(
  (props: MenuItemProps) => props.type,
  {
    beginDrag: (props: MenuItemProps) => ({
      name: props.name,
      type: props.type,
      src: props.src,
      width: props.width,
      height: props.height,
      role: props.role,
      gender: props.gender,
    }),
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(MenuItem);
