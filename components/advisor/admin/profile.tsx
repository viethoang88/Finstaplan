import Paper from "@mui/material/Paper";
import { Form, Input, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined, FormOutlined } from "@ant-design/icons";
import { Storage } from "aws-amplify";
import { Button } from "primereact/button";
import FileUpload from "../../ui/file-upload";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import { authSliceActions } from "../../../store/auth";

const submitImage = async (getProfileImage, file) => {
  Storage.configure({ level: "private" });
  console.log("Submit image called");

  console.log(file.file);
  // file-name, file, config options:
  const result = await Storage.vault.put("profile.png", file.file);
  console.log("--- FILE UPLOADED ----");
  console.log(result);
  getProfileImage();
};

export const getProfileImage = async (setProfileUrl) => {
  const signedURL = await Storage.vault.get("profile.png");
  console.log("--- SIGNED URL ---");
  console.log(signedURL);
  setProfileUrl(signedURL);
};

const dispatchUpdateProfile = (updatedData, dispatcher) => {
  dispatcher(
    authSliceActions.updateClientData({
      action: "SET",
      key: "advisorProfile",
      newVal: updatedData,
    })
  );
};

const Profile = () => {
  const [profileURL, setProfileUrl] = useState("");
  // const advisor = useSelector((state) => state.auth);
  const advisorProfile = useSelector((state) => state.auth.advisorProfile);
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    dispatchUpdateProfile(values, dispatch);
  };

  useEffect(() => {
    getProfileImage(setProfileUrl);
  }, [profileURL]);

  return (
    <div style={{ padding: "2.5rem", margin: "0rem" }}>
      <Paper elevation={3}>
        <div
          style={{
            padding: "1.5rem",
            paddingBottom: "2.5rem",
            borderBottom: "8px solid black",
          }}
        >
          <h3 style={{ fontSize: "2.25rem", marginTop: "0.75rem" }}>
            <i style={{ fontSize: "2.25rem" }} className={"pi pi-cog"} />
            &nbsp;&nbsp;Configure your Account Profile
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "row", padding: "5rem" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {profileURL !== "" && (
              <img src={profileURL} height={350} width={550} />
            )}
            <FileUpload
              uploadPath={""}
              uploadFunction={submitImage.bind(
                null,
                getProfileImage.bind(null, setProfileUrl)
              )}
              abbreviateText={"Upload a Business Profile Image"}
              uploaderStyles={{
                height: "7rem",
                width: "12rem",
                justifySelf: "center",
                alignSelf: "center",
                marginTop: "2.25rem",
              }}
            />
          </div>
          <Form
            name="normal_login"
            className="login-form"
            // initialValues={{ remember: true }}
            initialValues={{ ...advisorProfile }}
            onFinish={onFinish}
            style={{
              paddingRight: "8rem",
              paddingLeft: "8rem",
              width: "45rem",
            }}
          >
            <div
              style={{
                padding: "0.5rem",
                paddingBottom: "1rem",
                borderBottom: "3px solid black",
              }}
            >
              <h5>Personal Information</h5>
            </div>
            <Form.Item
              name="email"
              // initialValue={advisor?.email}
              rules={[
                { required: true, message: "Please input your email address" },
              ]}
              // label="Email"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name={`mobile`}
              label="Mobile number"
              rules={[
                { required: false, message: "Please input a mobile number" },
              ]}
            >
              <PhoneInput
                international
                placeholder="Mobile number"
                defaultCountry="AU"
                // style={{ width: "100%" }}
                countryCallingCodeEditable={false}
              />
            </Form.Item>
            <Form.Item
              name={`phone`}
              label="Phone Number"
              // rules={[
              //   { required: false, message: "Please input a contact number" },
              // ]}
            >
              <PhoneInput
                international
                defaultCountry="AU"
                // style={{ width: "100%" }}
                countryCallingCodeEditable={false}
              />
            </Form.Item>
            {/* <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input a password" }]}
              // label="Password"
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="passwordVerify"
              rules={[{ required: true, message: "Verify your password" }]}
              // label="Repeat Password"
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Repeat Password"
              />
            </Form.Item> */}
            <Form.Item
              name="firstName"
              // rules={[{ required: true, message: "Please input your name" }]}
              // label="Name"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="First name"
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              // rules={[{ required: true, message: "Please input your last name" }]}
              // label="Surname"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Last Name"
              />
            </Form.Item>

            <Form.Item
              name="addressOne"
              // label="Email"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Address"
              />
            </Form.Item>
            <Form.Item name="addressTwo">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Address Line 2 (Optional)"
              />
            </Form.Item>
            {/* City */}
            <Form.Item
              name="city"
              // label="Email"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="City"
              />
            </Form.Item>
            <Form.Item
              name="state"
              // label="Email"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="State"
              />
            </Form.Item>
            {/* Country */}
            <Form.Item
              name="country"
              // label="Email"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Country"
              />
            </Form.Item>
            {/* Currency */}
            <div
              style={{
                padding: "0.5rem",
                paddingBottom: "1rem",
                borderBottom: "3px solid black",
              }}
            >
              <h5>Administrative Information</h5>
            </div>
            <Form.Item
              name="employerName"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please input your employer/company name",
              //   },
              // ]}
              // label="Employer"
            >
              <Input
                prefix={<FormOutlined className="site-form-item-icon" />}
                placeholder="Employer"
              />
            </Form.Item>
            <Form.Item
              name="businessNumber"
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Please input the registered business or company registration number for your employer",
              //   },
              // ]}
              // label="Reference Number"
            >
              <Input
                prefix={<FormOutlined className="site-form-item-icon" />}
                placeholder="Company Registration Number"
              />
            </Form.Item>
            <Form.Item
              name="dealerGroup"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please input your registered Dealer Group name",
              //   },
              // ]}
              // label="Reference Number"
            >
              <Input
                prefix={<FormOutlined className="site-form-item-icon" />}
                placeholder="Dealer Group Name"
              />
            </Form.Item>
            <Form.Item
              name="dealerGroupNumber"
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Please input the registered business or company registration number for your dealer group",
              //   },
              // ]}
              // label="Reference Number"
            >
              <Input
                prefix={<FormOutlined className="site-form-item-icon" />}
                placeholder="Dealer Group Registration Number"
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="p-button-raised p-button-success p-button-text"
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}
              >
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Paper>
    </div>
  );
};

export default Profile;
