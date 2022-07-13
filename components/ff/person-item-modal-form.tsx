import ExistingStructureDetails from "./user-info-form/existing-structures-details";
import Moment from "moment";
import React, { useState, useRef } from "react";
import { Modal, Button } from "semantic-ui-react";
import { Form, DatePicker, TimePicker } from "antd";
import PhoneInput from "react-phone-number-input";
import { Toast } from "primereact/toast";
import {
  Space,
  Input,
  // Cascader,
  Select,
  // Row,
  // Col,
  Checkbox,
  AutoComplete,
  // Button,
  // Divider,
  Radio,
  InputNumber,
} from "antd";
import WhyMoneyInput from "./user-info-form/why-money-input";
import Advisors from "./user-info-form/advisors";

const { Option } = Select;
import { tagRender } from "../ff/user-info-form/controlled-input";
import { useSelector } from "react-redux";

import { Tabs } from "antd";
import { ProfileOutlined, UserOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  // faInfoCircle,
  faChartBar,
  faHeart,
  faIdCard,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import ExistingStructures from "./user-info-form/existing-structures";

const tabIconStyles = {
  fontSize: "1.1rem",
  maxWidth: "1.2rem",
  maxHeight: "1.2rem",
  marginRight: ".75rem",
  position: "relative",
  top: ".15rem",
};

/*
from: https://form.jotform.com/203652171972052

- dateNow: (auto-generate date object and store with ff data)

FOR PRIMARY: 
- name, lastname, date of birth (ALL REQUIRED)
- native language? 
- health status (poor, fair, good, excellent)?
- private health insurance? (yes, no)
- relationship status (REQUIRED) (Single, Married, Divorced, De Facto, Partner, Engaged)
- employment status:
  - do you currently work (YES or NO)
  - Desired retirement age
  - Job title
  - Industry
  - Employer name 
  - Employment start date 
- dependents (REQUIRED) (YES if children || dependents)
- do you have any other advisors? (REQUIRED) (accountants, attorneys, insurance agents, investment specialists, etc.) - YES / NO radio
  - how many?
- contact details:
  - mobile number (REQUIRED)
  - phone number 
  - email (REQUIRED)
  - physical address (street address, street address line 2, city, state/province, postal/zip code)
  - is postal address same as physical address (YES/NO radio button)
- existing structure(s) in place (multi-choice dropdown)

=> STEP 1: Balance Sheet & Budget:
  - financial assets (cash, term deposits, share portfolio, managed funds)
  - investment assets (land, buildings, equipment, vehicles, real estate, investments, cash, bank accounts, business ownership, any other)
    - estimated value for each (min-max slider)
  - lifestyle assets (residential house, jewellery, boats, cars, household contents, other)
  - Debt/liabilities (credit card loan(s), personal loan (car loan, education loan), investment loan, mortgage, other)
    - balance ($), interest rate (%), repayment amount ($), repayment frequency
  - Budget (can upload result of budgeting tool??)
  - Income: (salary/wages, bonuses, business income, investment income, super/pension income, centrelink income, rental income, income streams, other)
  - Expenses: (Home & utilities, insurance premiums & financial, groceries, personal & medical, entertainment & eat-out, transport & auto, children, other)

=> STEP 2: financial health report pdf for example
=> STEP 3: whats important about money to you?
   - what would you like to do? 
    "build a home",
    "travel",
    "plan to retire",
    "move to another place",
    "buy a new car",
    "save more / spend less",
    "contribute to super",
    "set up a SMSF",
    "check insurance cover and policies",
    "make better financial decisions",
    "buy a property",
    "start a family",
    "start a business",
    "help the kids out",
    "fund education",
    "look after extended family",
    "manage investment portfolio",
    "plan to retire",
    "manage debt",
    "invest a lump sum",
    "manage retirement income",
    other: input 

   - what are your specific objectives? (PER OBJECTIVE):
     - goal (text)
     - how much? 
     - why is it important (text)
     - start date (dd/mm/yyyy)

   - how do you feel about fees and costs? 
   1 - Disagree
   2 - Agree
   3 - Strongly Agree

  Lowest cost is the primary goal:

  Seeking value for money:

  Willing to pay for relevant features:

STEP 4 => Investment (Risk) Profile 

STEP 5 => Contingency (Estate planning, legacies)

STEP 6 => Authorities 

FOR DEPENDENTS:
- do you have? auto-check based on ui inputs
- name, lastname, date of birth
- Is this child a dependent? -> yes default 
- Relationship -> default to role (son/daughter/grandfather/grandmother)
    - extra options: godchild, friend
- Support to age
- extra info (textbox)
*/

// should detect/check gender based on ui input (CAN EDIT)
const genderOptions = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
  { key: "o", text: "Other", value: "other" },
];

// Should detect/check if there are 2 in the adults array:
const relationshipOptions = [
  { key: "de", text: "De Facto", value: "de facto" },
  { key: "p", text: "Partner", value: "partner" },
  { key: "m", text: "Married", value: "married" },
  { key: "s", text: "Single", value: "single" },
  { key: "d", text: "Divorced", value: "divorced" },
  { key: "e", text: "Engaged", value: "engaged" },
];

//  <Dropdown placeholder='None' fluid multiple selection options={structureOptions} />
const structureOptions = [
  { key: "n", label: "None", value: "none" },
  { key: "s", label: "SMSF", value: "smsf" },
  { key: "t", label: "Trust", value: "trust" },
  { key: "c", label: "Company", value: "company" },
  { key: "p", label: "Partnership", value: "partnership" },
  { key: "o", label: "Overseas Investments", value: "overseas investments" },
  { key: "pep", label: "PEP", value: "pep" },
  { key: "ot", label: "Other", value: "other" },
  { key: "ns", label: "Not sure. I need to check", value: "unsure" },
];

const structureInput = (
  <Space direction="vertical" size={18} width={300}>
    <Select
      showArrow
      tagRender={tagRender}
      placeholder="None"
      style={{ width: "100%", minWidth: "10rem" }}
      options={structureOptions}
    />
  </Space>
);

const employmentStatusOptions = [
  { key: "ft", text: "Full-time", value: "full-time" },
  { key: "pt", text: "Part-time", value: "part-time" },
  { key: "c", text: "Casual", value: "casual" },
  { key: "se", text: "Self-employed", value: "self-employed" },
  { key: "br", text: "Between roles", value: "between roles" },
  { key: "oas", text: "On a sabbatical", value: "on a sabbatical" },
];

const educationStatusOptions = [
  { key: "ft", text: "Full-time University", value: "fullTimeUniversity" },
  { key: "pt", text: "Part-time University", value: "partTimeUniversity" },
  { key: "c", text: "High School", value: "highSchool" },
  { key: "se", text: "Primary School", value: "primarySchool" },
  { key: "br", text: "Kindergarden", value: "kindergarden" },
];

// const healthOptions = [
//   { key: "gr", label: "Excellent", value: "excellent" },
//   { key: "vg", label: "Very Good", value: "veryGood" },
//   { key: "go", label: "Good", value: "good" },
//   { key: "fa", label: "Fair", value: "fair" },
//   { key: "po", label: "Poor", value: "poor" },
//   { key: "hc", label: "Health concerns", value: "healthConcerns" },
//   { key: "cc", label: "Congenital condition", value: "congenitalCondition" },
//   { key: "ns", label: "Would rather not say", value: "wouldRatherNotSay" },
// ];

const dateConfig = {
  rules: [
    {
      type: "object" as const,
      required: true,
      message: "Birthdate is required",
    },
  ],
};

const formItemLayout = {
  // labelCol: {
  //   xs: { span: 24 },
  //   sm: { span: 8 },
  //   l: { span: 14 },
  //   xl: { span: 14 },
  // },
  // wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 },
  //   l: { span: 14 },
  //   xl: { span: 14 },
  // },
};

const convertMomentToDateOnFields = (fields) => {
  if (
    fields.dateOfBirth === undefined ||
    fields.dateOfBirth === null ||
    fields.dateOfBirth === ""
  )
    return fields;

  const updatedFields = { ...fields.values };
  try {
    updatedFields.dateOfBirth = new Date(fields.dateOfBirth).toDateString();
  } catch (e) {}
  return updatedFields;
};

const mapFieldToTab = {
  firstName: "0",
  lastName: "0",
  dateOfBirth: "0",
  healthStatus: "0",
  gender: "0",
  employed: "2",
  email: "3",
  mobile: "3",
  otherAdvisors: "4",
};

const PersonItemModalForm = (props) => {
  const {
    // gender,
    // firstName,
    // lastName,
    // dateOfBirth,
    // legacyNominee,
    // health,
    // relatedTo,
    // assets,
    // expenses,
    // incomes,
    // liabilities,
    onClose,
    role,
    saveChangesButton,
    updatePerson,
    idx,
    binStateIndex,
    binContains,
    handleSaveChanges,
    closeModal,
  } = props;
  const [form] = Form.useForm();

  const [existingStructures, setExistingStructures] = useState([]);
  // const fullState = useSelector((state) => state.factFind);
  // useEffect(() => {
  //   console.log("------FF STATE------");
  //   console.log(fullState);
  // }, [fullState]);
  // saveChangesButton.render.

  let primaryRef = useSelector((state) => state.factFind.primary);
  const streetAddress = primaryRef?.streetAddress || "";
  const streetAddress2 = primaryRef?.streetAddress2 || "";
  const city = primaryRef?.city || "";
  const state = primaryRef?.state || "";
  const zipCode = primaryRef?.zipCode || "";
  const existingStructuresPrimary = primaryRef?.existingStructures;
  let existingStructuresPartner = [];

  let personRef = {};
  try {
    if (binContains === "dependents") {
      personRef = useSelector((state) => state.factFind[binStateIndex][idx]);
    } else {
      personRef = useSelector((state) => state.factFind[binStateIndex]);
    }
  } catch {
    console.log("err");
  }

  // console.log(personRef);
  const [activeTab, setActiveTab] = useState("0");
  const [number, setNumber] = useState();
  const [studying, setStudying] = useState(personRef.studying || false);
  const [employed, setEmployed] = useState(personRef.employed || false);
  const [otherAdvisors, setOtherAdvisors] = useState(
    personRef.otherAdvisors || false
  );
  const [isLegacy, setIsLegacy] = useState(false);

  useEffect(() => {
    setExistingStructures(
      personRef?.existingStructures ? personRef.existingStructures : []
    );
  }, [personRef]);

  const hasPartner = useSelector((state) => state.factFind.hasPartner);
  let primaryName = "Client";
  let partnerName = "Partner";
  try {
    primaryName = useSelector((state) => state.factFind.primary.firstName);
    partnerName = useSelector((state) => state.factFind.partner.firstName);
  } catch {
    console.log("err");
  }
  let relatedToOptions = [
    { key: "pri", text: primaryName, value: primaryName },
  ];

  if (hasPartner) {
    relatedToOptions.push({
      key: "prt",
      text: partnerName,
      value: partnerName,
    });
    relatedToOptions.push({ key: "bot", text: "Both", value: "both" });
  }

  const changeActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const isPrimary = ["partner", "primary"].includes(binContains);

  const onFinish = (fields) => {
    // const updatedFields = convertMomentToDateOnFields(fields);
    // updatePerson(updatedFields);
    updatePerson(fields);
    if (activeTab === "5" && role === "parent") {
      closeModal();
      return;
    }
    if (activeTab === "2" && role !== "parent") {
      closeModal();
      return;
    }
    setActiveTab((prevTab) =>
      prevTab === "0" ? "2" : String(Number(prevTab) + 1)
    );
  };

  const onFinishFailed = (err) => {
    // console.log(typeof err);
    // console.log(err);
    const errFieldName = err.errorFields[0].name[0];
    const rerouteToTab = mapFieldToTab[errFieldName];
    // const errorsList = err.errorFields.map((e) => e.errors[0]);
    console.log("rerouting to tab ", rerouteToTab);
    setActiveTab(rerouteToTab);
    // toast.current.show({
    //   severity: "warn",
    //   summary: "Required Fields Missing",
    //   detail: "Please provide all required information", //`${errorsList.join(".&#13;&#10")}`,
    //   life: 3000,
    // });
    // const updatedFields = convertMomentToDateOnFields(err.values);
    // updatePerson(updatedFields);
    updatePerson(err.values);
  };

  const [emailAutoCompleteResult, setEmailAutoCompleteResult] = useState<
    string[]
  >([]);

  const onEmailChange = (value: string) => {
    if (!value) {
      setEmailAutoCompleteResult([]);
    } else {
      setEmailAutoCompleteResult(
        ["@gmail.com", "@hotmail.com", ".com", ".com.au", ".org", ".net"].map(
          (domain) => `${value}${domain}`
        )
      );
    }
  };
  const emailOptions = emailAutoCompleteResult.map((domain) => ({
    label: domain,
    value: domain,
  }));

  // BASIC DETAILS - BOTH:
  const basicDetails = (
    <>
      <Form.Item
        name="firstName"
        label="First name"
        rules={[
          {
            required: true,
            message: "Please input a first name",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Last name"
        rules={[
          {
            required: true,
            message: "Please input a last name",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* DEPENDENT ONLY  */}
      {!isPrimary && (
        <Form.Item
          name="relatedTo"
          label="Related to"
          rules={[{ required: true, message: "Please select a relation" }]}
        >
          <Select placeholder="Select a relation">
            {relatedToOptions.map((opt) => (
              <Option key={opt.key} value={opt.value}>
                {opt.text}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {/* BOTH */}
      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please select gender" }]}
      >
        <Select placeholder="Select a gender">
          {genderOptions.map((opt) => (
            <Option key={opt.key} value={opt.value}>
              {opt.text}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* BOTH */}
      <Form.Item name="dateOfBirth" label="Date of Birth" {...dateConfig}>
        <DatePicker />
      </Form.Item>

      {/* DEPENDENTS ONLY */}
      {!isPrimary && (
        <Form.Item
          name="legacyNominee"
          label="Legacy Nominee"
          valuePropName="checked"
        >
          <Checkbox onChange={(e) => setIsLegacy(e.target.checked)}></Checkbox>
        </Form.Item>
      )}
      {!isPrimary && isLegacy && (
        <Form.Item
          name="legacyAmount"
          label="Legacy Amount (Estimate)"
          initialValue={0}
        >
          <InputNumber
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      )}

      {/* BOTH  */}
      {/* <Form.Item
        name="healthStatus"
        label="Health"
        rules={[{ required: true, message: "Please select a health status" }]}
      >
        <Select placeholder="Select a health status">
          {healthOptions.map((opt) => (
            <Option key={opt.key} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </Form.Item> */}
    </>
  );

  const educationInfo = (
    <>
      {!isPrimary && (
        <Form.Item name="studying" label="Are you currently studying?">
          <Radio.Group onChange={(e) => setStudying(e.target.value)}>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>
      )}
      {!isPrimary && studying && (
        <>
          <Form.Item label="Type of study" name="studyingStatus">
            <Select placeholder="Studying status">
              {educationStatusOptions.map((opt) => (
                <Option key={opt.key} value={opt.value}>
                  {opt.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="studyingCompletionDate"
            label="Expected date of completion"
          >
            <DatePicker />
          </Form.Item>
        </>
      )}
    </>
  );

  const employmentInfo = (
    <>
      {isPrimary && (
        <Form.Item
          name="employed"
          label="Are you currently employed?"
          rules={[
            {
              required: true,
              message: "Please select an employment status",
            },
          ]}
        >
          <Radio.Group onChange={(e) => setEmployed(e.target.value)}>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>
      )}
      {isPrimary && employed && (
        <>
          <Form.Item name="jobTitle" label="Job Title">
            <Input />
          </Form.Item>
          <Form.Item name="jobIndustry" label="Industry">
            <Input />
          </Form.Item>
          <Form.Item
            name="employmentStatus"
            label="Employment Status"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please select an employment status",
            //   },
            // ]}
          >
            <Select placeholder="Select an employment status">
              {employmentStatusOptions.map((opt) => (
                <Option key={opt.key} value={opt.value}>
                  {opt.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="employerName" label="Employer name">
            <Input />
          </Form.Item>
          <Form.Item
            name="employmentStartDate"
            label="Employment Start Date"
            //{...dateConfig}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="desiredRetirementAge"
            label="What age would you like to retire?"
          >
            <InputNumber min={17} max={130} />
          </Form.Item>
        </>
      )}
    </>
  );

  const contactInfo = (
    <>
      {isPrimary && (
        <>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "This input was not a valid E-mail address",
              },
              {
                required: true,
                message: "Please input an E-mail address",
              },
            ]}
          >
            <AutoComplete
              options={emailOptions}
              onChange={onEmailChange}
              placeholder="E-mail address"
            >
              <Input />
            </AutoComplete>
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Contact Number"
            rules={[
              { required: true, message: "Please input a contact number" },
            ]}
          >
            {/* <Input addonBefore={prefixSelector} style={{ width: "100%" }} /> */}
            <PhoneInput
              international
              placeholder="Enter phone number"
              defaultCountry="AU"
              value={number}
              onChange={setNumber}
              // style={{ width: "100%" }}
              countryCallingCodeEditable={false}
            />
          </Form.Item>
          <br />
          <span>Physical Address</span>
          <Form.Item
            name="streetAddress"
            label="Street Address"
            initialValue={streetAddress}
            rules={[
              {
                required: true,
                message: "Please input your residential address",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="streetAddress2"
            label="Street Address Line 2"
            initialValue={streetAddress2}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please input a city" }]}
            initialValue={city}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="state"
            label="State / Province"
            rules={[
              { required: true, message: "Please input a State / Province" },
            ]}
            initialValue={state}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="zipCode"
            label="Postal / Zip Code"
            rules={[
              { required: true, message: "Please input Postal / Zip Code" },
            ]}
            initialValue={zipCode}
          >
            <Input />
          </Form.Item>
        </>
      )}
    </>
  );

  const advisorsAndStructures = (
    <>
      {isPrimary && (
        <Form.Item
          name="existingStructures"
          label="Do you have any of the following existing structures?"
        >
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            placeholder="None"
            style={{ width: "100%", minWidth: "10rem" }}
            options={structureOptions}
          />
        </Form.Item>
      )}

      {isPrimary && (
        <>
          <ExistingStructures
            existingStructures={existingStructures}
            currentPerson={binStateIndex}
            primaryName={primaryName}
            partnerName={partnerName}
          />
        </>
      )}

      {isPrimary && (
        <>
          <Form.Item
            name="otherAdvisors"
            label={
              <div
                style={{
                  lineHeight: 1.1,
                }}
              >
                Do you have any other advisors? <br />
                (accountants, attorneys, insurance agents, investment
                specialists, etc.)
              </div>
            }
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <Radio.Group onChange={(e) => setOtherAdvisors(e.target.value)}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          {otherAdvisors && (
            <div>
              <Advisors />
            </div>
          )}
          <br />
        </>
      )}
    </>
  );

  const whyMoneyInputs = (
    <>{isPrimary && <WhyMoneyInput inputFor={binContains} />}</>
  );

  const toast = useRef(null);

  const handleChangeValues = (changedValues, allValues) => {
    if (Object.keys(changedValues).includes("existingStructures")) {
      setExistingStructures(changedValues.existingStructures);
    }
  };

  const _personRef = { ...personRef };
  if (typeof personRef?.dateOfBirth === "string") {
    _personRef["dateOfBirth"] = Moment(personRef.dateOfBirth);
  }
  if (typeof personRef?.employmentStartDate === "string") {
    _personRef["employmentStartDate"] = Moment(personRef.employmentStartDate);
  }
  if (typeof personRef?.studyingCompletionDate === "string") {
    _personRef["studyingCompletionDate"] = Moment(
      personRef.studyingCompletionDate
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <Toast ref={toast} />
      <Form
        {...formItemLayout}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={handleChangeValues}
        scrollToFirstError
        form={form}
        initialValues={{
          ..._personRef,
        }}
      >
        <Tabs
          defaultActiveKey="0"
          activeKey={activeTab}
          onChange={changeActiveTab}
        >
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Basic Details
              </span>
            }
            key="0"
          >
            {basicDetails}
          </TabPane>
          {!isPrimary && (
            <TabPane
              tab={
                <span>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faSchool}
                    style={tabIconStyles}
                  />
                  Education Details
                </span>
              }
              key="1"
            >
              {educationInfo}
            </TabPane>
          )}
          {isPrimary && (
            <TabPane
              tab={
                <span>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faBriefcase}
                    style={tabIconStyles}
                  />
                  Employment Details
                </span>
              }
              key="2"
            >
              {employmentInfo}
            </TabPane>
          )}
          {isPrimary && (
            <TabPane
              tab={
                <span>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faIdCard}
                    style={tabIconStyles}
                  />
                  Contact Details
                </span>
              }
              key="3"
            >
              {contactInfo}
            </TabPane>
          )}
          {isPrimary && (
            <TabPane
              tab={
                <span>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faChartBar}
                    style={tabIconStyles}
                  />
                  Existing Structures and Advisors
                </span>
              }
              key="4"
            >
              {advisorsAndStructures}
            </TabPane>
          )}

          {isPrimary && (
            <TabPane
              tab={
                <span>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faHeart}
                    style={tabIconStyles}
                  />
                  Why is money important to you?
                </span>
              }
              key="5"
            >
              {whyMoneyInputs}
            </TabPane>
          )}
        </Tabs>

        {/* Advisors / Structure Options*/}
        <div
          style={{
            background: "#f9fafb",
            // float: "right",
            borderTop: "2px solid rgba(34,36,38,.15)",
            padding: "1rem 1rem",
            textAlign: "right",
            width: "100%",
          }}
        >
          {/* <Button
            content="Close"
            labelPosition="right"
            icon="cancel"
            color="black"
            onClick={() => closeModal()}
            negative
          /> */}

          <Button
            htmlType="submit"
            content="Save/Next"
            labelPosition="right"
            icon="checkmark"
            // onClick={() => closeModal()}
            positive
          />
        </div>
      </Form>
      <Button
        style={{
          float: "right",
          top: "-3.60rem",
          left: "-11.5rem",
          // marginBottom: 0,
          height: "auto",
        }}
        content="Close"
        labelPosition="right"
        icon="cancel"
        color="black"
        onClick={() => {
          console.log("close modal clicked");
          closeModal();
        }}
        negative
      />
    </div>
  );
};

export default PersonItemModalForm;
