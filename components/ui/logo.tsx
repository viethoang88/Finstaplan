import { Button as PRButton } from "primereact/button";
import classes from "./logo.module.css";
const Logo = () => {
  return (
    <div className={`${classes.menu_button}`}>
      <span className={classes.menu_button_f}>ƒ</span>
      <span className={classes.menu_button_i}>i</span>
      <span className={classes.menu_button_p}>p</span>
    </div>
  );
};

export default Logo;

//   return (
//     <PRButton
//       className={`p-button-rounded p-button-raised p-button-primary ${classes.menu_button}`}
//     >
//       <span className={classes.menu_button_f}>ƒ</span>
//       <span className={classes.menu_button_i}>i</span>
//       <span className={classes.menu_button_p}>p</span>
//     </PRButton>
//   );
