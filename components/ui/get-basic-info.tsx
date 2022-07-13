import { useState } from "react";
import { Form, DatePicker, TimePicker } from "antd";
import { prefixSelector } from "../../components/ff/person-item-modal-form";
import { Input, Select, AutoComplete } from "antd";
import PhoneInput from "react-phone-number-input";
const { Option } = Select;

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

const dateConfig = {
  rules: [
    {
      type: "object" as const,
      required: false,
      message: "Birthdate is required",
    },
  ],
};

const GetBasicInfo = ({
  label,
  target,
  onRelationshipStatusChange = () => {},
  number,
  setNumber,
}) => {
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

  return (
    <>
      <h2>{label}</h2>
      <Form.Item
        name={`${target}_firstName`}
        label="First name"
        rules={[
          {
            required: false,
            message: "Please input a first name",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={`${target}_lastName`}
        label="Last name"
        rules={[
          {
            required: false,
            message: "Please input a last name",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {target === "primary" && (
        <Form.Item
          name="primary_relationshipStatus"
          label="Relationship Status"
          rules={[
            { required: false, message: "Please select relationship status" },
          ]}
        >
          <Select
            placeholder="Select a relationship status"
            onChange={onRelationshipStatusChange}
          >
            {relationshipOptions.map((opt) => (
              <Option key={opt.key} value={opt.value}>
                {opt.text}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name={`${target}_gender`}
        label="Gender"
        rules={[{ required: false, message: "Please select gender" }]}
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
      <Form.Item
        name={`${target}_dateOfBirth`}
        label="Date of Birth"
        {...dateConfig}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name={`${target}_email`}
        label="E-mail"
        // rules={[
        //   {
        //     type: "email",
        //     message: "This input was not a valid E-mail address",
        //   },
        //   {
        //     required: false,
        //     message: "Please input an E-mail address",
        //   },
        // ]}
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
        name={`${target}_mobile`}
        label="Contact Number"
        rules={[{ required: false, message: "Please input a contact number" }]}
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
    </>
  );
};

export default GetBasicInfo;
