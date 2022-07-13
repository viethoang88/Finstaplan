import { Form } from "antd";

const BudgetList = ({ data }) => {
  const [form] = Form.useForm();
  console.log(data);

  const handleFieldsChange = (changedFields, allFields) => {
    console.log("FIELDS CHANGED");
    console.log(changedFields);
    console.log(allFields);
    console.log("--------------");
  };
  const handleValuesChange = (changedValues, allValues) => {
    console.log("VALUES CHANGED");
    console.log(changedValues);
    console.log(allValues);
    console.log("--------------");
  };
  return (
    <>
      <Form
        name="dynamic_form"
        form={form}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        onFieldsChange={handleFieldsChange}
        onValuesChange={handleValuesChange}
        style={{
          zIndex: 15000,
          paddingTop: ".45rem",
          backgroundColor: "white",
        }}
      >
        <Form.List
          name={"data"}
          // initialValue={}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <></>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default BudgetList;
