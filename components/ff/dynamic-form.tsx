import {
  Form,
  Input,
  Button,
  Space,
  Tag,
  InputNumber,
  Select,
  Divider,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
const { Option } = Select;
import { useSelector } from "react-redux";

const extractNamesAndIndices = (dependentsList, stateKey) =>
  dependentsList.map((d, idx) => ({
    idx,
    firstName: d.firstName || "",
    lastName: d.lastName || "",
    stateKey: stateKey,
    expenses: d.expenses,
    liabilities: d.liabilities,
    assets: d.assets,
    incomes: d.incomes,
  }));

export function tagRender(props) {
  const { label, closable, onClose, color } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}

const extractRequiredData = ({
  primary,
  partner,
  dependents,
  children,
  jointDependents,
  partnerDependents,
  joint,
}) => {
  const _primary = [
    {
      idx: null,
      firstName: primary?.firstName || "",
      lastName: primary?.lastName || "",
      stateKey: "primary",
      incomes: primary?.incomes,
      expenses: primary?.expenses,
      liabilities: primary?.liabilities,
      assets: primary?.assets,
    },
  ];
  let _partner = [];
  if (Object.keys(partner).length !== 0) {
    _partner = [
      {
        idx: null,
        firstName: partner?.firstName || "",
        lastName: partner?.lastName || "",
        stateKey: "partner",
        incomes: partner?.incomes,
        expenses: partner?.expenses,
        liabilities: partner?.liabilities,
        assets: partner?.assets,
      },
    ];
  }
  // const _joint = { ...joint, stateKey: "joint", idx: null };
  // const _dependents = extractNamesAndIndices(dependents, "dependents");
  // const _children = extractNamesAndIndices(children, "children");
  // const _jointDependents = extractNamesAndIndices(
  //   jointDependents,
  //   "jointDependents"
  // );
  // const _partnerDependents = extractNamesAndIndices(
  //   partnerDependents,
  //   "partnerDependents"
  // );
  return [
    ..._primary,
    ..._partner,
    // ..._dependents,
    // ..._children,
    // ..._jointDependents,
    // ..._partnerDependents,
    // ..._joint,
  ];
  // return {
  //   primary: _primary, partner: _partner, dependents: _dependents, children: _children, jointDependents: _jointDependents, partnerDependents: _partnerDependents
  // }
};

const DynamicForm = ({
  nodes,
  submitData,
  type,
  setSelectedNodeKey,
  selectedNodeKey,
  setSelectedNode,
  setSelectedNodesData,
  selectedNodesData,
  defaultData = [],
  renderWithDefaults,
  FormInputsComponent,
}) => {
  const addButtonRef = useRef();
  const [form] = Form.useForm();

  const onFinish = (args) => {
    if (args === undefined || args[1] === undefined) return;
    try {
      const formName = args[0];
      const form = args[1]["forms"][formName];

      // console.log("----- onFINISH ----");
      // console.log(formName);
      // console.log(form);
      // console.log(args[1]);

      form
        .validateFields()
        .then(async (values) => {
          console.log("Received values from form:", values);
          submitData(values);
        })
        .catch((err) => console.log(err));
    } catch (e) {
      console.error(e);
    }
  };

  const clientData = useSelector((state) => state.factFind);
  const { hasPartner } = clientData;
  const people = extractRequiredData(clientData);

  const callAdd = (numTimes) => {
    for (let i = 0; i < numTimes; i++) {
      addButtonRef.current.focus();
    }
  };

  useEffect(() => {
    if (defaultData.length > 0) {
      callAdd(defaultData.length);
    } else {
      // form.resetFields();
      form.setFieldsValue({});
    }
  }, [defaultData, renderWithDefaults]);

  const handleFieldsChange = (changedFields, allFields) => {
    // console.log("FIELDS CHANGED");
    // console.log(changedFields);
    // console.log(allFields);
    // console.log("--------------");
  };
  const handleValuesChange = (changedValues, allValues) => {
    // console.log("VALUES CHANGED");
    // console.log(changedValues);
    // console.log(allValues);
    // console.log("--------------");
  };

  const _form = (
    <Form
      name="dynamic_form"
      form={form}
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      onFieldsChange={handleFieldsChange}
      onValuesChange={handleValuesChange}
      style={{ zIndex: 15000, paddingTop: ".45rem", backgroundColor: "white" }}
    >
      <Form.List
        name={"data"}
        initialValue={renderWithDefaults ? defaultData : []}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <>
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <FormInputsComponent
                    type={type}
                    key={key}
                    name={name}
                    fieldKey={fieldKey}
                    restField={{ ...restField }}
                    nodeOptions={nodes}
                    selectedNodeKey={selectedNodeKey}
                    setSelectedNodeKey={setSelectedNodeKey}
                    setSelectedNodesData={setSelectedNodesData}
                    hasPartner={hasPartner}
                    people={people}
                  />

                  <MinusCircleOutlined
                    style={{
                      position: "absolute",
                      right: "2rem",
                      float: "right",
                    }}
                    onClick={() => {
                      remove(name);
                      setSelectedNodeKey((prevState) => {
                        const newValue = { ...prevState };
                        delete newValue[fieldKey];
                        return newValue;
                      });
                      setSelectedNodesData((prevState) => {
                        const newValue = { ...prevState };
                        delete newValue[fieldKey];
                        return newValue;
                      });
                    }}
                  />
                </Space>
                <Divider />
              </>
            ))}
            <Form.Item>
              <Button
                ref={addButtonRef}
                type="dashed"
                onClick={() => {
                  add();
                }}
                block
                icon={<PlusOutlined />}
                style={
                  ["expenses", "liabilities"].includes(type)
                    ? {
                        color: "darkred",
                        marginLeft: ".3rem",
                      }
                    : {
                        color: "green",
                        marginLeft: ".3rem",
                      }
                }
              >
                {type === "liabilities"
                  ? `Add new liability`
                  : `Add new ${type.slice(0, -1)}`}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button
          type="dashed"
          htmlType="submit"
          block
          icon={<SaveOutlined />}
          onClick={onFinish}
          style={{ marginLeft: ".3rem" }}
        >
          Save these {type}
        </Button>
      </Form.Item>
    </Form>
  );

  // form.resetFields()
  return (
    <Form.Provider
      onFormChange={function () {
        console.log(arguments);
      }}
      onFormFinish={function () {
        return onFinish(arguments);
      }}
    >
      {_form}
    </Form.Provider>
  );
};

export default DynamicForm;

// MOVED to budget-item-inputs:

// <Form.Item
//                 {...restField}
//                 name={[name, `fieldKey`]}
//                 fieldKey={[fieldKey, `fieldKey`]}
//                 initialValue={fieldKey}
//                 hidden
//               >
//                 <Input />
//               </Form.Item>

//               <Form.Item
//                 label={<span>type</span>}
//                 {...restField}
//                 validateTrigger={["onChange", "onBlur"]}
//                 name={[name, `type`]}
//                 fieldKey={[fieldKey, `type`]}
//                 // rules={[
//                 //   { required: true, message: `${type} category is required` },
//                 // ]}
//                 valuePropName="node"
//                 // getValueProps={(e) => {
//                 //   if (!e && !e.node) {
//                 //     return undefined;
//                 //   }
//                 //   return e.node.value;
//                 // }}
//                 noStyle
//               >
//                 <TreeSelect
//                   filter
//                   selectionMode="single"
//                   placeholder={`Select ${type} type`}
//                   value={selectedNodeKey[fieldKey]}
//                   options={nodes}
//                   onChange={(e) => {
//                     // console.log(e);
//                     setSelectedNodeKey((prevState) => {
//                       const newValue = { [fieldKey]: e.value };
//                       return { ...prevState, ...newValue };
//                     });
//                   }}
//                   onNodeSelect={(e) => {
//                     console.log(e);
//                     setSelectedNodesData((prevState) => {
//                       const newValue = {
//                         [fieldKey]: {
//                           value: e.node.key,
//                           data: e.node.data,
//                           label: e.node.label,
//                           icon: e.node.icon,
//                         },
//                       };
//                       return { ...prevState, ...newValue };
//                     });

//                     // setSelectedNode({
//                     //   value: e.node.value,
//                     //   data: e.node.data,
//                     //   label: e.node.label,
//                     //   icon: e.node.icon,
//                     //   fieldKey: fieldKey,
//                     // });
//                   }}
//                   style={{ zIndex: 35001, width: "15rem", height: "auto" }}
//                 />
//               </Form.Item>

//               {people.length === 1 && (
//                 <Form.Item
//                   {...restField}
//                   name={[name, `belongsTo`]}
//                   fieldKey={[fieldKey, `belongsTo`]}
//                   initialValue={"primary-null"}
//                   hidden
//                 >
//                   <Input />
//                 </Form.Item>
//               )}
//               {people.length > 1 && (
//                 <>
//                   <Select
//                     mode="multiple"
//                     showArrow
//                     tagRender={tagRender}
//                     placeholder="Select person(s)"
//                     style={{ width: 220, zIndex: 35001 }}
//                     onChange={(e) =>
//                       handleUpdateCurrentPeople(e, key, name, fieldKey, {
//                         ...restField,
//                       })
//                     }
//                   >
//                     {hasPartner && (
//                       <Option value="joint">Joint ownership</Option>
//                     )}
//                     {people.map(({ idx, firstName, lastName, stateKey }) => (
//                       <Option value={`${stateKey}-${idx}`}>
//                         {(firstName !== "" && `${firstName} ${lastName}`) ||
//                           "Please name this person"}
//                       </Option>
//                     ))}
//                   </Select>

//                   <Form.Item
//                     {...restField}
//                     name={[name, `belongsTo`]}
//                     fieldKey={[fieldKey, `belongsTo`]}
//                     rules={[{ required: true, message: `Assign owner` }]}
//                   >
//                     {/* OLD SELECT */}
//                     <Select
//                       style={{ width: 180 }}
//                       placeholder="Belongs to"
//                       onBlur={(v) => {
//                         console.log(v.target.value);
//                       }}
//                     >
//                       {hasPartner && (
//                         <Option value="joint">Joint ownership</Option>
//                       )}
//                       {people.map(
//                         ({ idx, firstName, lastName, stateKey }) => (
//                           <Option value={`${stateKey}-${idx}`}>
//                             {(firstName !== "" &&
//                               `${firstName} ${lastName}`) ||
//                               "Please name this person"}
//                           </Option>
//                         )
//                       )}
//                     </Select>
//                   </Form.Item>
//                 </>
//               )}

//               <Form.Item
//                 {...restField}
//                 name={[name, `value`]}
//                 fieldKey={[fieldKey, `value`]}
//                 rules={[{ required: true, message: `Missing value` }]}
//               >
//                 <InputNumber
//                   // defaultValue={0}
//                   formatter={(value) =>
//                     `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//                   onChange={() => {}}
//                   onBlur={(v) => {
//                     console.log(v.target.value);
//                   }}
//                   // className="p-inputtext p-component"
//                   style={{
//                     width: 115,
//                     height: "2.5rem",
//                     position: "relative",
//                     top: "-.1rem",
//                     zIndex: 35001,
//                   }}
//                 />
//               </Form.Item>

//               {["expenses", "incomes"].includes(type) && (
//                 <Form.Item
//                   {...restField}
//                   name={[name, `frequency`]}
//                   fieldKey={[fieldKey, `frequency`]}
//                   rules={[{ required: true, message: `Missing frequency` }]}
//                 >
//                   <Select
//                     showSearch
//                     style={{ width: 155, zIndex: 35001 }}
//                     placeholder="Select a frequency"
//                     optionFilterProp="children"
//                     onBlur={(v) => {
//                       console.log(v.target.value);
//                     }}
//                     // onChange={onChange}
//                     // onFocus={onFocus}
//                     // onBlur={onBlur}
//                     // onSearch={onSearch}
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .indexOf(input.toLowerCase()) >= 0
//                     }
//                     className="p-inputtext p-component"
//                   >
//                     <Option value="monthly">Monthly</Option>
//                     <Option value="quarterly">Quarterly</Option>
//                     <Option value="biAnnually">Bi-annually</Option>
//                     <Option value="annually">Annually</Option>
//                   </Select>
//                 </Form.Item>
//               )}
