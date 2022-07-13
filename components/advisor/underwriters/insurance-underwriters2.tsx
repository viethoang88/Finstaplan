import { Form, Input, Space, Card, Button, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { authSliceActions } from "../../../store/auth";
import { Button as PRButton } from "semantic-ui-react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

const Error = styled.div`
  margin-top: 0.25rem;
  opacity: 1;
  position: relative;
  color: darkred;
  border-left: darkred 25px solid;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  /* align-self: center; */
  /* justify-self: center; */
  min-width: 100%;
  transition: all ease-in-out 0.35s;
  max-width: 21rem;
  padding-left: 0.35rem;
  background-color: rgb(245, 245, 245);
`;

const blankUnderwriter = {
  email: "",
  firstName: "",
  lastName: "",
  useUnderwriter: false,
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validEmail = re.test(String(email).toLowerCase());
  return validEmail;
}

const InsuranceUnderwriters = ({ message }) => {
  const underwriters = useSelector((state) => state.auth.underwriters);
  const [_underwriters, _setUnderwriters] = useState([]);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const onFinish = (underwriters, values) => {
    // form.validateFields().then((values) => {
    //   console.log("validated values");
    //   console.log(values);
    // });

    // console.log("Received values of form:", values);
    // console.log(values?.underwriters);
    console.log(underwriters);
    dispatch(
      authSliceActions.setAttribute({
        attribute: "underwriters",
        value: underwriters,
      })
    );
  };

  useEffect(() => {
    if (underwriters !== undefined) {
      console.log("--- UNDERWRITERS CHANGED ---");
      console.log(underwriters);
      _setUnderwriters(underwriters);
    }
  }, [underwriters]);

  const remove = (idx) => {
    const newUw = _underwriters.filter((uw, _idx) => _idx !== idx);
    _setUnderwriters(newUw);
  };

  const add = () => {
    _setUnderwriters((prevState) => {
      const newVal = [...prevState, { ...blankUnderwriter }];
      console.log(newVal);
      return newVal;
    });
  };

  const handleChange = (index, e) => {
    console.log("--- HANDLE CHANGE ---");
    console.log(e);
    console.log(e?.target?.value);
    console.log(e?.target?.checked);
    console.log(e?.target?.name);
    const name = e?.target?.name;
    const value = e?.target?.checked ? e?.target?.checked : e?.target?.value;
    _setUnderwriters((prevState) => {
      const toUpdate = { ...prevState[index] };
      toUpdate[name] = value;
      const newState = prevState
        .slice(0, index)
        .concat([toUpdate])
        .concat(prevState.slice(index + 1));
      console.log(newState);
      console.log(prevState.slice(0, index));
      console.log(prevState.slice(index));
      return newState;
    });
  };

  return (
    <Card
      title={
        message !== undefined
          ? message
          : "Store a set of Insurance Underwriters for Preassessment Requests"
      }
    >
      <div style={{ maxWidth: "50rem" }}>
        <Form
          form={form}
          name="insurance_underwriters"
          onFinish={onFinish.bind(null, _underwriters)}
          autoComplete="off"
        >
          {_underwriters.map(
            ({ useUnderwriter, email, firstName, lastName }, idx) => (
              <>
                <Space
                  key={idx}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    fieldKey={[`useUnderwriter_${idx}`, "useUnderwriter"]}
                    // name={`useUnderwriter_${idx}`}
                    valuePropName="checked"
                  >
                    <Checkbox
                      name={"useUnderwriter"}
                      onChange={handleChange.bind(null, idx)}
                      // value={_underwriters[idx]?.useUnderwriter}
                      checked={_underwriters[idx]?.useUnderwriter}
                    />
                  </Form.Item>
                  <Form.Item
                    fieldKey={[`email_${idx}`, "email"]}
                    // name={`email_${idx}`}
                    rules={[{ required: true, message: "Missing email" }]}
                    style={{ width: "20rem" }}
                    // initialValue={_underwriters[idx]?.email}
                  >
                    <Input
                      placeholder="Email Address"
                      value={_underwriters[idx]?.email}
                      name={"email"}
                      onChange={handleChange.bind(null, idx)}
                    />
                    {!validateEmail(email) && <Error>Email is required</Error>}
                  </Form.Item>
                  <Form.Item
                    fieldKey={[`firstName_${idx}`, "firstName"]}
                    // name={`firstName_${idx}`}
                    //   rules={[{ required: true, message: "Missing last name" }]}
                  >
                    <Input
                      placeholder="(Optional) Name"
                      value={_underwriters[idx]?.firstName}
                      name={"firstName"}
                      onChange={handleChange.bind(null, idx)}
                    />
                  </Form.Item>
                  <Form.Item
                    fieldKey={[`lastName_${idx}`, "lastName"]}
                    // name={`lastName_${idx}`}
                    //   rules={[{ required: true, message: "Missing last name" }]}
                  >
                    <Input
                      placeholder="(Optional) Surname"
                      value={_underwriters[idx]?.lastName}
                      name={"lastName"}
                      onChange={handleChange.bind(null, idx)}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(idx)} />
                </Space>
              </>
            )
          )}

          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add Underwriter
            </Button>
          </Form.Item>

          <Form.Item>
            <PRButton
              htmlType="submit"
              content="Save changes"
              labelPosition="right"
              icon="checkmark"
              disabled={
                !_underwriters
                  .map((uw) => validateEmail(uw.email))
                  .every((b) => b === true)
              }
              // onClick={handleSaveChanges}
              positive
            />
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default InsuranceUnderwriters;
