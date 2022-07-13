import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import classes from "./signup-form.module.css";
import BlurOverlay from "./blur-overlay";
import { Message } from "primereact/message";
import { ConfirmSignIn } from "aws-amplify-react";

const emailValidator = {
  value:
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g,
  message: "Invalid email address. E.g. example@email.com",
};
const passwordValidator = {
  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/g,
  message: "Your password does not meet the minimum security requirements",
};

const acceptValidator = {
  message: "You must accept the terms of service to create an account.",
};

// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

export const SignupForm = ({
  password,
  email,
  acceptTerms,
  onPasswordChange,
  onEmailChange,
  onAcceptTermsChange,
  onSubmit,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [acceptIsValid, setAcceptIsValid] = useState(true);
  const [errorSubmitting, setErrorSubmitting] = useState(false);

  const validate = async (value, validator, setter) => {
    return new Promise(async (res, rej) => {
      const isValid = await validator.value.exec(value);
      if (isValid == null) {
        const isValidTwo = await validator.value.exec(value);
        setter((prevState) => isValidTwo);
        if (isValidTwo) return res(true);
        else return rej(false);
      }
      setter((prevState) => isValid);
      if (isValid) res(true);
      else rej(false);
    });
  };

  const handleOnChange = async (e) => {
    if (errorSubmitting) setErrorSubmitting(false);

    if (e.target.name === "email") {
      onEmailChange(e);
    } else if (e.target.name === "password") {
      onPasswordChange(e);
    } else if (e.target.name === "accept") {
      onAcceptTermsChange(e.checked);
      setAcceptIsValid(e.checked);
    }
  };

  const canSubmit = async () => {
    return validate(password, passwordValidator, setPasswordIsValid)
      .then((v) => validate(email, emailValidator, setEmailIsValid))
      .then((v) => v && acceptIsValid)
      .catch((e) => false);
  };

  const _onSubmit = async (e) => {
    e.preventDefault();
    if (await canSubmit()) {
      onSubmit()
        .then((res) => {
          console.log(res);
          setShowMessage(true);
        })
        .catch((e) => {
          setErrorSubmitting(true);
        });
    }
  };

  const dialogFooter = (
    <div className="p-d-flex p-jc-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="p-mt-2">Suggestions</p>
      <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );

  const dialog = (
    <Dialog
      visible={showMessage}
      onHide={() => setShowMessage(false)}
      position="center"
      footer={dialogFooter}
      showHeader={false}
      breakpoints={{ "960px": "80vw" }}
      style={{ width: "58vw" }}
    >
      <div
        style={{ padding: "2rem" }}
        className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3"
      >
        <br />

        <i
          className="pi pi-check-circle"
          style={{ fontSize: "2.5rem", color: "var(--green-500)" }}
        ></i>
        <h2 style={{ position: "relative", top: "-2.6rem", left: "3.35rem" }}>
          Registration Successful!
        </h2>
        <p style={{ lineHeight: 1.5 }}>
          Your account has been registered. Please check your email at{" "}
          <b>{email}</b> for activation instructions before attempting to sign
          in.
        </p>
      </div>
    </Dialog>
  );

  return (
    <div className={classes.container}>
      <BlurOverlay />
      {/* <div className={classes.form}> */}
      <div className={`${classes.loginform} p-d-flex p-jc-center p-shadow-23`}>
        {dialog}

        <div className="p-d-flex p-jc-center">
          <div className={`${classes.card} p-card card`}>
            <h2 className={classes.header_text}>Register</h2>
            <form className="p-fluid">
              <div className={`${classes.field} p-field`}>
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-envelope" />
                  <InputText
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    onBlur={() =>
                      validate(email, emailValidator, setEmailIsValid)
                    }
                    className={`${emailIsValid ? "" : "p-invalid"}`}
                  />
                  <label htmlFor="email">Email*</label>
                </span>
              </div>
              <span
                className={`${classes.error_hidden} ${
                  !emailIsValid ? classes.error : ""
                }`}
              >
                <Message
                  severity="error"
                  text={emailValidator.message}
                  style={{ borderLeft: "15px solid darkred" }}
                />
              </span>
              {/* <span
                className={`${classes.error_hidden} ${
                  !emailIsValid ? classes.error : ""
                }`}
              >
                {emailValidator.message}
              </span> */}
              <div className={`${classes.field} p-field`}>
                <span className="p-float-label">
                  <Password
                    id="password"
                    name="password"
                    onChange={handleOnChange}
                    value={password}
                    toggleMask
                    header={passwordHeader}
                    footer={passwordFooter}
                    onBlur={() =>
                      validate(password, passwordValidator, setPasswordIsValid)
                    }
                    className={`${passwordIsValid ? "" : "p-invalid"}`}
                  />
                  <label htmlFor="password">Password*</label>
                </span>
              </div>
              <span
                className={`${classes.error_hidden} ${
                  !passwordIsValid ? classes.error : ""
                }`}
              >
                <Message
                  severity="error"
                  text={passwordValidator.message}
                  style={{ borderLeft: "15px solid darkred" }}
                />
              </span>
              {/* <span
                className={`${classes.error_hidden} ${
                  !passwordIsValid ? classes.error : ""
                }`}
              >
                {passwordValidator.message}
              </span> */}

              <div className={`${classes.field} p-field-checkbox`}>
                <Checkbox
                  name="accept"
                  inputId="accept"
                  onChange={handleOnChange}
                  checked={acceptTerms}
                  className={classes.checkbox}
                />
                <label htmlFor="accept">
                  I agree to the terms and conditions*
                </label>
              </div>
              <span
                className={`${classes.error_hidden} ${
                  !acceptIsValid ? classes.error : ""
                }`}
              >
                <Message
                  severity="error"
                  text={acceptValidator.message}
                  style={{ borderLeft: "15px solid darkred" }}
                />
              </span>
              {/* <Button
                type="submit"
                label="Submit"
                className={`${classes.field} p-mt-2`}
                onClick={_onSubmit}
              /> */}
              <Button
                label="Sign up"
                icon="pi pi-user-plus"
                className={`p-button-raised p-button-outlined p-button-success ${classes.button}`}
                onClick={_onSubmit}
              />
              <span
                className={`${classes.error_hidden} ${
                  errorSubmitting ? classes.error : ""
                }`}
              >
                <Message
                  severity="error"
                  text={
                    "There was a problem creating your account. Please check your email and password and try again."
                  }
                  style={{
                    borderLeft: "15px solid darkred",
                    marginTop: "3rem",
                  }}
                />
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
