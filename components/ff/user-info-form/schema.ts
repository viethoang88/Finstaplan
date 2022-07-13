import * as yup from "yup";

// https://github.com/jquense/yup#api
const UserInputSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  dateOfBirth: yup.date().required(),
  //age: yup.number().required().positive().integer(),
});

export default UserInputSchema;

export enum RelationshipStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  DeFacto = "De Facto",
  Partner = "Partner",
  Engaged = "Engaged",
}

export type ContactDetails = {
  mobileNumber: string; // required
  email: string; // required
  phoneNumber: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  state: string;
  postCode: number;
  postalSameAsStreetAddress: boolean;
};

export type FormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  relationShipStatus: RelationshipStatus;
  contactDetails: ContactDetails;
  dependents: boolean;
  dependentsInfo: Object; // how many, dependent, non-dependent
  otherAdvisers: boolean;
  numOtherAdvisers: number;
  otherAdviserDetails: Object; // { name, role, happy, permission to contact (yes/no), email, telephone }
  existingStructure: [string];
};
