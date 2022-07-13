// see: https://codesandbox.io/s/react-hook-form-usefieldarray-nested-arrays-m8w6j?file=/src/fieldArray.js

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState } from "react";
import PersonalDetails from "./personal-details";
import Image from "next/image";
import AnimatedStepButton from "../../ui/animated-step-button";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import UserInputSchema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../../store/fact-find";

import WhyMoneyInput from "./why-money-input";
import ControlledInput from "./controlled-input";
import classes from "./user-info-form.module.css";

const fallbackImage = "/assets/images/my-financial-mentors.jpg";

const UserInfoForm = (props) => {
  // const [formStep, setFormStep] = useState(0);
  const formStep = useSelector((state) => state.factFind.formStep);
  const personalData = useSelector((state) => state.factFind.client);

  console.log(formStep);

  const methods = useForm({
    resolver: yupResolver(UserInputSchema),
    mode: "all",
    defaultValues: personalData,
  });

  const dispatch = useDispatch();

  // testing code:

  const onSubmit = (data, key) => {
    console.log(data);
    console.log(key);
    // UGLY HACK: need to fix here and in controlled-input too:
    // if (!data) {
    //   const newValue = { [key]: methods.getValues()[key] };
    //   console.log(methods.getValues()[key]);
    //   dispatch(factFindActions.updateClientData(newValue));
    //   return;
    // }

    // console.log(data.dateOfBirth.getDate());
    // console.log(data.dateOfBirth.toDateString());
    // console.log(new Date(data.dateOfBirth));

    // do same for partnerDateOfBirth:
    // const partner = {...data.partner};
    // if (partner && partner.dateOfBirth) partner.dateOfBirth = partner.dateOfBirth.toDateString();
    // const reduxData = { ...data, partner, dateOfBirth: data.dateOfBirth.toDateString() };
    // dispatch(factFindActions.updateClientData(reduxData));

    // console.log(methods);
  };

  const imageSrc = props.img || fallbackImage;

  const header = (
    <span className={classes.header}>
      <div style={{ padding: "1.5rem" }}>
        <Image src={imageSrc} width={200} height={80} />
      </div>
    </span>
  );
  // <img alt="Card" src="showcase/demo/images/usercard.png" />;
  const footer = (
    <span className={classes.buttons}>
      {formStep !== 0 && (
        <AnimatedStepButton
          onClick={(e) => dispatch(factFindActions.prevStep())}
          direction="left"
          text="previous"
        />
      )}
      <Button
        label="cancel"
        icon="pi pi-times"
        className="p-button-warning p-button-outlined"
        style={{ marginRight: ".25em", height: "3rem" }}
      />
      <Button
        label="save progress"
        icon="pi pi-check"
        className="p-button-outlined"
        style={{ marginRight: ".25em", height: "3rem" }}
        onClick={() => methods.handleSubmit(onSubmit)()}
      />
      <AnimatedStepButton
        onClick={(e) => dispatch(factFindActions.nextStep())}
        direction="right"
        text="next"
      />
    </span>
  );

  //<form onSubmit={methods.handleSubmit(onSubmit)}>></form>
  // header={header} removed from Card...
  return (
    <div className={classes.container}>
      <Card
        footer={footer}
        className={`formcard p-shadow-24 p-elevated ${classes.card}`}
        style={{
          boxShadow:
            "0px 0px 20px rgba(0,0,0,0.10), 0px 10px 20px rgba(0,0,0,0.05), 0px 20px 20px rgba(0,0,0,0.05), 0px 30px 20px rgba(0,0,0,0.05)",
        }}
      >
        <FormProvider {...methods}>
          <form>
            {formStep === 0 && <PersonalDetails onSubmit={onSubmit} />}
            {formStep === 2 && (
              <WhyMoneyInput name="moneyOptions" onSubmit={onSubmit} />
              // Personal information & family portrait: formStep 0
              // BALANCE SHEET AND BUDGET: formStep 1:
              // Why is money important to you: formStep 2:
              // Values: formStep 3:
              // Goals: formStep 4:
              // Contingency: formStep 5:
              // Authorities: formStep 6:
            )}
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default UserInfoForm;
