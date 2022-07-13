import { Form, Input, Checkbox, Card } from "antd";
import { Button } from "primereact/button";
import { UserOutlined, LockOutlined, FormOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { Auth } from "aws-amplify";
/*
Data needed:

type Underwriter @model {
  id: ID!  
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  employerName: String!
  businessNumber: String!
  mobile: String
  phone: String
}
*/
async function signUp(email, password, id) {
  try {
    const { user, userSub, userConfirmed } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        id,
      },
    });
    console.log(user);
    console.log(userSub);
    console.log(userConfirmed);
    return { user, userSub, userConfirmed };
  } catch (error) {
    console.log("error signing up:", error);
    return { error };
  }
}

const layout = {
  // labelCol: { span: 1 },
  // wrapperCol: { span: 10 },
};

const Wrapper = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100vh;
  width: 100vw;
`;

export const getUnderwriterById = async (id) => {
  const url = `api/underwriter/getbyid`;
  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }), // body data type must match "Content-Type" header
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      console.log(res.data);
      return res;
    })
    .catch((e) => console.error(e));
};

export const getUnderwriters = async () => {
  const url = `/api/underwriter/get`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      console.log(res.data);
    })
    .catch((e) => console.error(e));
};

// Create pre-assessment here?
/*type Preassessment @model {
  id: ID!
  advisorName: String!
  dealerGroup: String!
  clientName: String!
  dob: String!
  gender: String!
  healthInfo: AWSJSON!
  attachments: AWSJSON
}*/
const doUnderwritersExist = async () => {
  const url = `/api/underwriter/createrequest`;
  const body = {
    underwriters: [
      { email: "sean2evo@hotmail.com", id: "" },
      { email: "martin@myfinancialmentors.com.au", id: "" },
      { email: "sean2evo@gmail.com", id: "new1", firstName: "Sean" },
      { email: "yblecher@hotmail.com", id: "new2", firstName: "Yula" },
    ],
    preassessment: {},
    advisorProfile: {
      advisorName: "Martin",
      advisorCompany: "MyFinancialMentors",
    },
  };

  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(body), // body data type must match "Content-Type" header
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log("--- SUCCESS ---");
      console.log(data);
    })
    .catch((err) => {
      console.log("--- ERROR ---");
      console.error(err);
    });
};

const createUnderwriter = async (data, setLoading, setError, router, id) => {
  if (data.password !== data.passwordVerify) {
    setError({ message: "Passwords must match" });
    return;
  }

  setLoading(true);
  const url = `/api/underwriter/create`;
  const body = { ...data, id };

  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(body), // body data type must match "Content-Type" header
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setLoading(false);
      setError(data);
      router.push(`/underwriter/dashboard/${id}`);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
      setError(err);
    });
};

const CreateUnderwriter = () => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   Auth.currentUserPoolUser()
  //     .then((user) => console.log(user))
  //     .catch((err) => console.log(err));
  // });

  useEffect(() => {
    const { newId } = router.query;
    if (newId !== undefined) {
      console.log(`--- USING EXISTING ID: ${newId} ---`);
      setId(newId);
    } else {
      console.log("--- GENERATING NEW ID ----");
      const uid = uuidv4();
      console.log(uid);
      setId(uid);
    }
  }, []);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    createUnderwriter(values, setLoading, setError, router, id);
  };

  return (
    <Wrapper>
      <button onClick={() => getUnderwriters()}>GET</button>
      <button
        onClick={() =>
          getUnderwriterById("436a2fbb-7cfb-4cf7-9af4-de6fe2ec9773")
        }
      >
        GETBYID
      </button>
      <button onClick={() => doUnderwritersExist()}>doUwsExist</button>
      <Card
        style={{ width: "43vw" }}
        title={
          "Join our network of insurance underwriters to receive pre-assessment requests from financial advisors"
        }
      >
        <Form
          {...layout}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ paddingRight: "8rem", paddingLeft: "8rem" }}
        >
          <Form.Item
            name="email"
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
          </Form.Item>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Please input your name" }]}
            // label="Name"
          >
            <Input
              prefix={<FormOutlined className="site-form-item-icon" />}
              placeholder="First name"
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Please input your last name" }]}
            // label="Surname"
          >
            <Input
              prefix={<FormOutlined className="site-form-item-icon" />}
              placeholder="Last Name"
            />
          </Form.Item>
          <Form.Item
            name="employerName"
            rules={[
              {
                required: true,
                message: "Please input your employer/company name",
              },
            ]}
            // label="Employer"
          >
            <Input
              prefix={<FormOutlined className="site-form-item-icon" />}
              placeholder="Employer"
            />
          </Form.Item>
          <Form.Item
            name="businessNumber"
            rules={[
              {
                required: true,
                message:
                  "Please input the registered business or company registration number for your employer",
              },
            ]}
            // label="Reference Number"
          >
            <Input
              prefix={<FormOutlined className="site-form-item-icon" />}
              placeholder="Company Registration Number"
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
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default CreateUnderwriter;
