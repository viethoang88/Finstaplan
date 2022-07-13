import { CSSProperties, FC, memo, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ContextMenu } from "primereact/contextmenu";

const style: CSSProperties = {
  //   border: "1px dashed gray",
  //   padding: "0.5rem 1rem",
  //   marginBottom: ".5rem",
  //   backgroundColor: "white",
  cursor: "pointer",
};

export interface CardProps {
  id: string;
  text: string;
  numSteps: number;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
}

interface Item {
  id: string;
  originalIndex: number;
}

export const Card: FC<CardProps> = memo(function Card({
  id,
  text,
  moveCard,
  findCard,
}) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "card",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      canDrop: () => false,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );

  const contextMenuItems = [
    {
      label: "Disable for Client",
      icon: "pi pi-lock",
      command: () => console.log("LOK", id),
    },
    {
      label: "Hide for Client",
      icon: "pi pi-window-minimize",
      command: () => console.log("HIDE", id),
    },
  ];

  const cm = useRef();
  const opacity = isDragging ? 0 : 1;
  return (
    <>
      <ContextMenu model={contextMenuItems} ref={cm}></ContextMenu>
      <div
        ref={(node) => drag(drop(node))}
        style={{ ...style, opacity }}
        onContextMenu={(e) => cm.current.show(e)}
      >
        {text}
      </div>
    </>
  );
});

export default Card;
