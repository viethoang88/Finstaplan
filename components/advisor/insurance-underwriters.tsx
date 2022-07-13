import { Form, Input, Space, Card, Button, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { authSliceActions } from "../../store/auth";
import { Button as PRButton } from "semantic-ui-react";
import { useEffect, useState } from "react";

const InsuranceUnderwriters = ({ message }) => {
  const underwriters = useSelector((state) => state.auth.underwriters);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [_underwriters, _setUnderwriters] = useState([]);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    console.log(values?.underwriters);
    dispatch(
      authSliceActions.setAttribute({
        attribute: "underwriters",
        value: values?.underwriters,
      })
    );
  };

  const forceRefreshOnEmpty = () => {
    setForceRefresh(true);
    setTimeout(() => {
      setForceRefresh(false);
    }, 1000);
    return [];
  };

  useEffect(() => {
    console.log("--- UNDERWRITERS CHANGED ---");
    console.log(underwriters);
    if (underwriters !== undefined) {
      _setUnderwriters(underwriters);
    }
    setForceRefresh(true);
    setTimeout(() => {
      setForceRefresh(false);
    }, 1000);
  }, [underwriters]);

  useEffect(() => {
    setForceRefresh(true);
    setTimeout(() => {
      setForceRefresh(false);
    }, 1000);
  }, [_underwriters]);

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
          onFinish={onFinish}
          autoComplete="off"
          initialValues={_underwriters}
          // initialValues={underwriters === undefined ? {} : underwriters}
        >
          <Form.List name="underwriters" initialValue={_underwriters}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "useUnderwriter"]}
                      fieldKey={[fieldKey, "useUnderwriter"]}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "email"]}
                      fieldKey={[fieldKey, "email"]}
                      rules={[{ required: true, message: "Missing email" }]}
                      style={{ width: "20rem" }}
                    >
                      <Input placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "firstName"]}
                      fieldKey={[fieldKey, "firstName"]}
                      //   rules={[{ required: true, message: "Missing last name" }]}
                    >
                      <Input placeholder="(Optional) Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "lastName"]}
                      fieldKey={[fieldKey, "lastName"]}
                      //   rules={[{ required: true, message: "Missing last name" }]}
                    >
                      <Input placeholder="(Optional) Surname" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
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
              </>
            )}
          </Form.List>
          <Form.Item>
            <PRButton
              htmlType="submit"
              content="Save changes"
              labelPosition="right"
              icon="checkmark"
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
