import GoalMap from "../components/ff/goal-map";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const renderGoals = () => {
  return (
    <div
      style={{
        margin: 0,
        overflow: "hidden",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            transform: "rotate(90deg) translateY(-100%)",
            transformOrigin: "top left",
          }}
        >
          <GoalMap />
        </div>
      </DndProvider>
    </div>
  );
};

export default renderGoals;
