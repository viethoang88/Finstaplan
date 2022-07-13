import { Radio, DatePicker } from "antd";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import UserInputSchema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledInput from "./controlled-input";
import { useSelector } from "react-redux";
import { Row, Col, Divider } from "antd";
import classes from "./personal-details.module.css";
import Dependents from "./dependents";

const structureOptions = [
  { value: "SMSF" },
  { value: "Trust" },
  { value: "Company" },
  { value: "Partnership" },
  { value: "Overseas Investments" },
  { value: "PEP" },
  { value: "Other" },
];

const relationshipOptions = [
  { value: "Single" },
  { value: "Married" },
  { value: "Divorced" },
  { value: "De Facto" },
  { value: "Partner" },
  { value: "Engaged" },
];

const employmentOptions = [
  { value: "Full-time" },
  { value: "Part-time" },
  { value: "Casual" },
  { value: "Self-employed" },
  { value: "Between roles" },
  { value: "On a sabbatical" },
];

const partnerInfoNeeded = ["Married", "De Facto", "Partner"];

const PersonalDetails = ({ onSubmit }) => {
  const client = useSelector((state) => state.factFind.client);
  const partner = useSelector((state) => state.factFind.partner);

  const {
    hasPartner,
    hasDependents,
    hasChildren,
    hasJointDependents,
    hasPartnerDependents,
  } = useSelector((state) => state.factFind);

  const [activeIndex, setActiveIndex] = useState(null);

  console.log(client);
  console.log(partner);

  const {
    // reset,
    // setValue,
    // register,
    // handleSubmit,
    // formState,
    control,
    getValues,
  } = useFormContext();

  const anyDependents = [
    hasDependents,
    hasChildren,
    hasJointDependents,
    hasPartnerDependents,
  ].some((v) => v === true);

  // const personalData = useSelector((state) => state.factFind.client);
  const relationshipStatus = hasPartner || getValues("relationshipStatus");
  const _hasDependents = anyDependents || getValues("hasDependents");
  const employed = getValues("employed");
  const needPartnerInfo =
    hasPartner || partnerInfoNeeded.includes(relationshipStatus);

  return (
    <div>
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
        Personal Details
      </h1>
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <AccordionTab header="Basic Details">
          <div className={classes.input}>
            <div className={classes.inputcontainer}>
              <span className={classes.inputlabel}>Tell us about you</span>
              <ControlledInput
                control={control}
                name="firstName"
                type="text"
                onSubmit={onSubmit}
                placeholder={
                  client && client.firstName ? client.firstName : "First Name"
                }
              />

              <ControlledInput
                control={control}
                name="lastName"
                type="text"
                placeholder={
                  client && client.lastName ? client.lastName : "Last Name"
                }
                onSubmit={onSubmit}
              />

              <DatePicker
                placeholder={
                  client && client.dateOfBirth
                    ? client.dateOfBirth
                    : "Select Date of Birth"
                }
                onOk={(d) =>
                  onSubmit(new Date(d).toDateString(), "dateOfBirth")
                }
                onChange={(d) =>
                  onSubmit(new Date(d).toDateString(), "dateOfBirth")
                }
              />
              {/* <ControlledInput
                control={control}
                name="dateOfBirth"
                type="date"
                placeholder="Date of Birth"
                onSubmit={onSubmit}
              /> */}
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Employment Details">
          <div className={classes.input}>
            <div className={classes.inputcontainer}>
              <span
                className={`${classes.inputlabel} ${classes.longinputlabel}`}
              >
                Do you currently work?
              </span>
              <ControlledInput
                control={control}
                name="employed"
                type="radio"
                onSubmit={onSubmit}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </ControlledInput>
            </div>
            {employed && (
              <>
                <ControlledInput
                  control={control}
                  name="employmentTitle"
                  type="text"
                  placeholder="Job Title"
                  onSubmit={onSubmit}
                />
                <ControlledInput
                  control={control}
                  name="employmentIndustry"
                  type="text"
                  placeholder="Industry"
                  onSubmit={onSubmit}
                />
                <div className={classes.inputcontainer}>
                  <span className={classes.inputlabel}>Employment status</span>
                  <ControlledInput
                    control={control}
                    name="employmentStatus"
                    type="select"
                    placeholder="Please select"
                    options={employmentOptions}
                    onSubmit={onSubmit}
                  />
                </div>
                <ControlledInput
                  control={control}
                  name="employerName"
                  type="text"
                  placeholder="Employer name"
                  onSubmit={onSubmit}
                />
                <div className={classes.inputcontainer}>
                  <span className={classes.inputlabel}>
                    Employment start date
                  </span>
                  <ControlledInput
                    control={control}
                    name="employmentStartDate"
                    type="date"
                    // placeholder="Employment Start Date"
                    onSubmit={onSubmit}
                  />
                </div>
              </>
            )}
          </div>
        </AccordionTab>

        <AccordionTab header="Relationship Status">
          <div className={classes.input}>
            <div className={classes.inputcontainer}>
              <span className={classes.inputlabel}>
                Are you currently in a relationship?
              </span>
              <ControlledInput
                control={control}
                name="relationshipStatus"
                type="select"
                placeholder={hasPartner ? "Partner" : "Single"}
                options={relationshipOptions}
                onSubmit={onSubmit}
              />

              {needPartnerInfo && (
                <>
                  <ControlledInput
                    control={control}
                    name="partnerName"
                    type="text"
                    placeholder="Partners Name"
                    onSubmit={onSubmit}
                  />

                  <ControlledInput
                    control={control}
                    name="partnerLastName"
                    type="text"
                    placeholder="Partners Last Name"
                    onSubmit={onSubmit}
                  />

                  <ControlledInput
                    control={control}
                    name="partnerDateOfBirth"
                    type="date"
                    placeholder="Partners Date of Birth"
                    onSubmit={onSubmit}
                  />
                </>
              )}
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Contact Details">
          <div className={classes.input}>
            <div className={classes.inputcontainer}>
              <span className={classes.inputlabel}>
                How can we contact you?
                <br />
                <br />
              </span>
              <span className={classes.inputlabel}>Mobile number</span>
              <ControlledInput
                control={control}
                name="mobileNumber"
                type="phone"
                onSubmit={onSubmit}
              />
              <span className={classes.inputlabel}>Phone number</span>
              <ControlledInput
                control={control}
                name="phoneNumber"
                type="phone"
                onSubmit={onSubmit}
              />
            </div>
            <br />
            <br />
            <div className={classes.inputcontainer}>
              <span className={classes.inputlabel}>Physical Address</span>
              <ControlledInput
                control={control}
                name="streetAddress"
                type="text"
                placeholder="Street Address"
                onSubmit={onSubmit}
              />
              <ControlledInput
                control={control}
                name="streetAddressTwo"
                type="text"
                placeholder="Street Address Line 2"
                onSubmit={onSubmit}
              />
              <ControlledInput
                control={control}
                name="city"
                type="text"
                placeholder="City"
                onSubmit={onSubmit}
              />
              <ControlledInput
                control={control}
                name="state"
                type="text"
                placeholder="State / Province"
                onSubmit={onSubmit}
              />
              <ControlledInput
                control={control}
                name="postCode"
                type="text"
                placeholder="Postal / Zip Code"
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Dependents">
          <div className={classes.inputcontainer}>
            <span className={classes.inputlabel}>
              Do you have any dependents?
            </span>
            <Radio.Group
              name="hasDependents"
              value={hasDependents}
              onChange={(e) => console.log(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>

            {_hasDependents && <Dependents />}
          </div>
        </AccordionTab>

        <AccordionTab header="Existing Structures">
          <div className={classes.inputcontainer}>
            <span className={classes.inputlabel}>
              Do you have any of the following existing structures?
            </span>
            <ControlledInput
              control={control}
              name="existingStructure"
              type="multiselect"
              placeholder="None"
              options={structureOptions}
              onSubmit={onSubmit}
            />
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default PersonalDetails;

// const formWrapper = (
//   { register, handleSubmit, formState: { errors } },
//   onSubmit
// ) => {
//   const BasicDetailsForm = (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input
//         type="text"
//         placeholder="First name"
//         {...register("First name", { required: true, maxLength: 80 })}
//       />
//       <input
//         type="text"
//         placeholder="Last name"
//         {...register("Last name", { required: true, maxLength: 100 })}
//       />
//       <input
//         type="datetime"
//         placeholder="Date of Birth"
//         {...register("Date of Birth", { required: true })}
//       />

//       <input type="submit" />
//     </form>
//   );

//   return { BasicDetailsForm };
// };

//   <Controller
//     name="firstName"
//     control={control}
//     defaultValue={""}
//     rules={{ required: "First name is required" }}
//     render={({ field: { onChange, value }, fieldState: { error } }) => (
//       <span className="p-field p-float-label">
//         <label htmlFor="firstName" className="p-d-block">
//           Username
//         </label>

//         <InputText
//           placeholder="First Name"
//           type="text"
//           onChange={onChange}
//           value={value}
//           className={`p-d block ${error && "p-invalid"}`}
//         />
//         {error && (
//           <small id="username2-help" className="p-error p-d-block">
//             Username is not available.{" "}
//           </small>
//         )}
//       </span>
//     )}
//   />;
