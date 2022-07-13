// TODO: get CSS from globals.css and transfer it to modules for this file.
import classes from "./user-info-background.module.css";

const UserInfoBackground = (props) => {
  return (
    <div className={classes.background}>
      <div id="clouds">
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
        <div className="cloud x6"></div>
        <div className="cloud x7"></div>
        <div className="cloud x8"></div>
        <div className="cloud x9"></div>
        <div className="cloud x10"></div>
      </div>

      <div className="ground">
        <div className="blade1"></div>
        <div className="blade2"></div>
        <div className="blade3"></div>
        <div className="blade4"></div>
        <div className="blade5"></div>
        <div className="blade6"></div>
        <div className="blade7"></div>
        <div className="blade8"></div>
        <div className="blade9"></div>
        <div className="blade10"></div>
        <div className="blade11"></div>
        <div className="blade12"></div>
      </div>
      <div className="sun"></div>

      <div className="logo">
        <div id="tree"></div>
        <div id="trunk">
          <div id="left-branch"></div>
          <div id="right-bottom-branch"></div>
          <div id="right-top-branch"></div>
        </div>
      </div>
      <div className="logo1">
        <div id="tree1"></div>
        <div id="trunk1">
          <div id="left-branch1"></div>
          <div id="right-bottom-branch1"></div>
          <div id="right-top-branch1"></div>
        </div>
      </div>
      <div className="logo2">
        <div id="tree2"></div>
        <div id="trunk2">
          <div id="left-branch2"></div>
          <div id="right-bottom-branch2"></div>
          <div id="right-top-branch2"></div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoBackground;
