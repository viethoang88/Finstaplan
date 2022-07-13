import { Icon, Button } from "semantic-ui-react";

const defaultStyles = {
  margin: ".25rem",
  position: "relative",
  top: ".33rem",
  height: "3.2rem",
};

const AnimatedStepButton = ({
  direction,
  text,
  onClick,
  styling = defaultStyles,
}) => {
  const color = direction === "left" ? "yellow" : "green";
  return (
    <Button
      style={styling}
      onClick={onClick}
      animated="vertical"
      inverted
      color={color}
    >
      <Button.Content visible>{text}</Button.Content>
      <Button.Content hidden>
        <Icon name={`arrow ${direction}`} />
      </Button.Content>
    </Button>
  );
};

export default AnimatedStepButton;
