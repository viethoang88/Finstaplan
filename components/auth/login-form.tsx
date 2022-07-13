import BlurOverlay from "./blur-overlay";
import { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Image from "next/image";
// import { Link } from "next/link";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useRouter } from "next/router";
import classes from "./login-form.module.css";
import { Divider } from "primereact/divider";
// import { PrimeIcons } from 'primereact/api';
import { ProgressSpinner } from "primereact/progressspinner";
import Logo from "../ui/logo";

const img = "/public/assets/images/my-financial-mentors.jpg";

const header = (
  <div
    style={{
      zIndex: "2000",
      height: "12.5rem",
      display: "flex",
      justifyContent: "center",
      justifyItems: "center",
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#3d0264",
      marginBottom: "4rem",
      borderTop: "solid black 10px",
      borderBottom: "solid black 10px",
    }}
  >
    <div style={{ position: "relative", top: "-5.5rem" }}>
      <Logo />
    </div>
  </div>
);

const passwordHeader = <h6>Enter your password</h6>;

// const passwordFooter = (
//   <>
//     <Divider />
//     <p className="p-mt-2">Suggestions</p>
//     <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: "1.5" }}>
//       <li>At least one lowercase</li>
//       <li>At least one uppercase</li>
//       <li>At least one numeric</li>
//       <li>Minimum 8 characters</li>
//     </ul>
//   </>
// );

const LoginForm = ({ onLogin, router, isLoading }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    onLogin(emailRef.current.value, password);
  };

  const footer = (
    <span className={classes.footer}>
      <Button
        label="Login"
        icon="pi pi-sign-in"
        className={`p-button-raised p-button-outlined p-button-success ${classes.button}`}
        onClick={onSubmit}
      />
      <Divider />
      <div>
        <p>
          Don't have an account?&nbsp;&nbsp;
          <a onClick={() => router.push("/auth/signup")}>Create one.</a>
        </p>
      </div>
      <br />
    </span>
  );

  //   return (
  //     <div>
  //       <BlurOverlay />
  //     </div>
  //   );

  return (
    <div className={classes.container}>
      <BlurOverlay />
      <div className={`${classes.loginform} p-d-flex p-jc-center p-shadow-23`}>
        <Card
          className={classes.card}
          title="Login"
          style={{ width: "35rem" }}
          footer={footer}
          header={header}
        >
          <div className={`p-fluid ${classes.form}`}>
            {isLoading && (
              <div className={classes.loading_spinner}>
                <ProgressSpinner className={classes.spinner} />
              </div>
            )}
            <h5>Email</h5>
            <div className="p-field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <InputText
                  id="email"
                  name="email"
                  ref={emailRef}
                  className={classNames({ "p-invalid": false })}
                  keyfilter={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}
                  validateOnly
                />
              </span>
            </div>
            <br />

            <h5>Password</h5>
            <div className="p-field">
              <Password
                id="password"
                name="password"
                ref={passwordRef}
                toggleMask
                className={classes.lastform}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
