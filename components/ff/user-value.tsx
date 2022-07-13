import { useState } from "react";
import { Box } from "grommet";

const valueContainer = {
  textAlign: "center",
  alignSelf: "center",
  justifySelf: "center",
  fontSize: "3.25rem",
  position: "relative",
  top: "2.35rem",
  minWidth: "20rem",
  userSelect: "none",
};
const valueContainerClicked = {
  textAlign: "center",
  alignSelf: "center",
  justifySelf: "center",
  fontSize: "4rem",
  fontWeight: "700",
  transition: "width 1.5s, height 1.5s, font-size 2s, text-shadow 2s",
  textShadow: "1.5px 1.5px white",
  minWidth: "20rem",
  userSelect: "none",
};

const UserValue: React.FC<{}> = ({
  key,
  clickable = true,
  onValueClicked,
  value,
  color,
  width = 12,
  height = 12,
  id = null,
  dragPreview = null,
  _clicked = false,
  grow = false,
}) => {
  const [clicked, onClicked] = useState(_clicked);

  const handleValueClicked = (e) => {
    if (clickable) {
      onClicked((prevState) => !prevState);
      onValueClicked(value);
    }
  };

  // const styles = {
  //   backgroundColor: color,
  //   display: "flex",
  //   // flexWrap: "wrap",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // flexGrow: 1,
  //   // flexShrink: 1,
  //   borderRadius: "145px",
  //   height: clicked ? `${height * 1.4}` : `${height}rem`,
  //   width: clicked ? `${width * 1.4}` : `${width}rem`,
  //   fontSize: clicked ? "2.5rem" : "1.5rem",
  //   fontWeight: "700",
  //   boxShadow:
  //     "0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.29)",
  //   margin: ".35rem",
  //   transition: "width 1.5s, height 1.5s, font-size 2s, text-shadow 2s",
  //   textShadow: clicked ? "2px 2px white" : "",
  //   textAlign: "center",
  //   // alignSelf: "flex-start",
  // };

  return (
    <Box
      key={key}
      background={clicked ? "lightgreen" : color}
      id={value}
      // flex={shouldFlex}
      align="center"
      flex={grow}
      alignContent="center"
      alignSelf="center"
      basis="auto"
      margin="small"
      pad="medium"
      gap="xsmall"
      round="large"
      border={true}
      elevation="xlarge"
      // flex="grow"
      animation={{
        type: "zoomIn",
        delay: 0,
        duration: 500,
        size: "xlarge",
      }}
      height={{
        min: clicked ? `${height * 1.2}rem` : `${height}rem`,
      }}
      // width={{
      //   min: clicked ? `${width * 1.4}` : `${width}rem`,
      // }}
      onClick={handleValueClicked}
    >
      <span style={clicked ? valueContainerClicked : valueContainer}>
        {value}
        {clicked && (
          <>
            <br />
            <i
              className="pi pi-check-circle"
              style={{ fontSize: "5rem", color: "black" }}
            />
          </>
        )}
      </span>
    </Box>
    // <div ref={dragPreview} id={id} style={styles} onClick={handleValueClicked}>
    //   {value}
    // </div>
  );
};

export default UserValue;
