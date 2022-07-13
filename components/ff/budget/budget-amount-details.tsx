import { Form, InputNumber, Select, Input } from "antd";
const { Option } = Select;

const BudgetAmountDetails = ({
  idx,
  type,
  name,
  fieldKey,
  restField,
  belongsTo,
  personName,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", marginLeft: "1rem" }}>
      <div
        style={{
          marginRight: "0.3rem",
          width: "5rem",
          position: "relative",
          top: ".35rem",
        }}
      >
        {personName}
      </div>
      <Form.Item
        {...restField}
        name={[name, `belongsTo_${idx}`]}
        fieldKey={[fieldKey, `belongsTo_${idx}`]}
        initialValue={belongsTo}
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        {...restField}
        name={[name, `value_${idx}`]}
        fieldKey={[fieldKey, `value_${idx}`]}
        rules={[{ required: true, message: `Missing value` }]}
      >
        <InputNumber
          // defaultValue={0}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={() => {}}
          onBlur={(v) => {
            console.log(v.target.value);
          }}
          // className="p-inputtext p-component"
          style={{
            width: 105,
            height: "2.5rem",
            position: "relative",
            top: "-.1rem",
            zIndex: 35001,
          }}
        />
      </Form.Item>

      {["expenses", "incomes"].includes(type) && (
        <Form.Item
          {...restField}
          name={[name, `frequency_${idx}`]}
          fieldKey={[fieldKey, `frequency_${idx}`]}
          rules={[{ required: true, message: `Missing frequency` }]}
        >
          <Select
            showSearch
            style={{ width: 130, zIndex: 35001 }}
            placeholder="Select a frequency"
            optionFilterProp="children"
            onBlur={(v) => {
              console.log(v.target.value);
            }}
            // onChange={onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            className="p-inputtext p-component"
          >
            <Option value="weekly">Weekly</Option>
            <Option value="fortnightly">Fortnightly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="quarterly">Quarterly</Option>
            <Option value="biAnnually">Bi-annually</Option>
            <Option value="annually">Annually</Option>
          </Select>
        </Form.Item>
      )}
    </div>
  );
};

export default BudgetAmountDetails;
