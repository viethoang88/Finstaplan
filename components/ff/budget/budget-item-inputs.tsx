import { Form, Input, InputNumber, Select, Tag } from "antd";
import { TreeSelect } from "primereact/treeselect";
const { Option } = Select;
import BudgetAmountDetails from "./budget-amount-details";
import { useState } from "react";
import { getNativeElementProps } from "@fluentui/react";

const getDisplayName = (idx, firstName, lastName, stateKey) => {
  if (firstName && firstName !== "") {
    if (lastName && lastName !== "") return `${firstName} ${lastName}`;
    return `${firstName}`;
  } else {
    return stateKey === "primary" ? "Unnamed Client" : "Unnamed Partner";
  }
};

const getFirstName = (people, person) => {
  const binStateIndex = person.split("-")[0];
  return people.find((p) => p.stateKey === binStateIndex)?.["firstName"];
};

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

const BudgetItemInputs = ({
  type,
  key,
  name,
  fieldKey,
  restField,
  nodeOptions,
  selectedNodeKey,
  setSelectedNodeKey,
  setSelectedNodesData,
  hasPartner,
  people,
}) => {
  const [currentPeople, setCurrentPeople] = useState([]);
  const handleUpdateCurrentPeople = (key, name, fieldKey, ...restField) => {
    setCurrentPeople(key);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "0.35rem",
        flexWrap: "wrap",
        height: people.length === 1 ? "2.5rem" : "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form.Item
          {...restField}
          name={[name, `fieldKey`]}
          fieldKey={[fieldKey, `fieldKey`]}
          initialValue={fieldKey}
          hidden
        >
          <Input />
        </Form.Item>

        <div>
          <Form.Item
            // label={<span>type</span>}
            {...restField}
            validateTrigger={["onChange", "onBlur"]}
            name={[name, `type`]}
            fieldKey={[fieldKey, `type`]}
            // rules={[
            //   { required: true, message: `${type} category is required` },
            // ]}
            valuePropName="node"
            // getValueProps={(e) => {
            //   if (!e && !e.node) {
            //     return undefined;
            //   }
            //   return e.node.value;
            // }}
            noStyle
          >
            <TreeSelect
              filter
              selectionMode="single"
              placeholder={`Select ${type} type`}
              value={selectedNodeKey[fieldKey]}
              options={nodeOptions}
              onChange={(e) => {
                setSelectedNodeKey((prevState) => {
                  const newValue = { [fieldKey]: e.value };
                  return { ...prevState, ...newValue };
                });
              }}
              onNodeSelect={(e) => {
                setSelectedNodesData((prevState) => {
                  const newValue = {
                    [fieldKey]: {
                      value: e.node.key,
                      data: e.node.data,
                      label: e.node.label,
                      icon: e.node.icon,
                      parentType: e.node.parentType,
                      bucket: e.node.bucket,
                    },
                  };
                  return { ...prevState, ...newValue };
                });

                // setSelectedNode({
                //   value: e.node.value,
                //   data: e.node.data,
                //   label: e.node.label,
                //   icon: e.node.icon,
                //   fieldKey: fieldKey,
                // });
              }}
              style={{
                zIndex: 35001,
                width: "15rem",
                // minHeight: "2.3rem",
                // maxHeight: "2.3rem",
                marginRight: "0.25rem",
              }}
            />
          </Form.Item>
        </div>

        {people.length === 1 && (
          <>
            <Form.Item
              {...restField}
              name={[name, `belongsTo_0`]}
              fieldKey={[fieldKey, `belongsTo_0`]}
              initialValue={"primary-null"}
              hidden
            >
              <Input />
            </Form.Item>
            <div style={{ position: "relative", top: "-2.5rem", left: "9rem" }}>
              <BudgetAmountDetails
                idx={0}
                type={type}
                name={name}
                fieldKey={fieldKey}
                restField={restField}
                belongsTo={people[0]}
                personName={""}
              />
            </div>
          </>
        )}
        {people.length > 1 && (
          <div>
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              placeholder="Select person(s)"
              style={{
                width: "15rem",
                zIndex: 35001,
                maxHeight: "3.5rem",
                marginRight: "0.25rem",
              }}
              onChange={(e) =>
                handleUpdateCurrentPeople(e, key, name, fieldKey, {
                  ...restField,
                })
              }
            >
              {hasPartner && <Option value="joint">Joint</Option>}
              {people.map(({ idx, firstName, lastName, stateKey }) => (
                <Option value={`${stateKey}-${idx}`}>
                  {getDisplayName(idx, firstName, lastName, stateKey)}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {/* <Form.Item
        {...restField}
        name={[name, `numPeople`]}
        fieldKey={[fieldKey, `numPeople`]}
        hidden
      >
        <InputNumber value={currentPeople.length} />
      </Form.Item> */}

      {currentPeople.length > 0 && (
        <>
          <br />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {currentPeople.map((person, idx) => (
              <BudgetAmountDetails
                idx={idx}
                type={type}
                name={name}
                fieldKey={fieldKey}
                restField={restField}
                belongsTo={person}
                personName={
                  person === "joint"
                    ? "Joint"
                    : getFirstName(people, person) ||
                      getDisplayName(
                        idx,
                        undefined,
                        undefined,
                        person.split("-")[0]
                      )
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetItemInputs;
