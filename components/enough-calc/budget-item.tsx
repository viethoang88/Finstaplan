import { Form, InputNumber, Select, Input } from "antd";
const { Option } = Select;

const BudgetItem = ({ id, idx, fieldKey, restField }) => {
  return (
    <>
      <Form.Item
        {...restField}
        name={[name, `value`]}
        fieldKey={[fieldKey, `value`]}
        rules={[{ required: true, message: `Missing value` }]}
      >
        <InputNumber
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={() => {}}
          style={{
            width: 105,
            height: "2.5rem",
            position: "relative",
            top: "-.1rem",
            zIndex: 35001,
          }}
        />
      </Form.Item>

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
      <Form.Item
        {...restField}
        name={[name, `period`]}
        fieldKey={[fieldKey, `period`]}
        rules={[{ required: true, message: `Missing period` }]}
      >
        <Select
          showSearch
          style={{ width: 130, zIndex: 35001 }}
          placeholder="Select a frequency"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          className="p-inputtext p-component"
          defaultValue={"lifetime"}
        >
          <Option value="lifetime">Lifetime</Option>
          <Option value="untilRetirement">Until Retirement</Option>
          <Option value="fromRetirement">From Retirement</Option>
          <Option value="yearsFromNow">Years from now</Option>
        </Select>
      </Form.Item>
    </>
  );
};
