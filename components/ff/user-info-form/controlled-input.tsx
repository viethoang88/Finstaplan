import React from "react";
import {
  useController,
  useFormContext,
  Controller,
  useForm,
} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { DatePicker, Space, Tag, Select, Radio } from "antd";
import InputMask from "react-input-mask";
import { RadioButton } from "primereact/radiobutton";
import WhyMoneyOptions from "./why-money-input";
// import { createId } from "../../../helpers/util";
import classes from "./controlled-input.module.css";

const { RangePicker } = DatePicker;

function ControlledInput({
  control,
  children,
  type,
  placeholder,
  name,
  options,
  defaultValue = "",
  onSubmit,
}) {
  //   const {
  //     field: { ref, ...inputProps },
  //     fieldState: { error, invalid, isTouched, isDirty },
  //     formState: { touchedFields, dirtyFields },
  //   } = useController({
  //     name,
  //     control,
  //     rules: { required: true },
  //     defaultValue: "",
  //   });

  //const { register } = useFormContext();

  if (type === "text") {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={""}
        // rules={{ required: "First name is required" }}
        render={({
          field, //{ onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => {
          function myOnChange() {
            console.log(arguments);
            onSubmit(null, name);
            return field.onChange(...arguments);
          }
          console.log(error);
          // const randomId = createId();
          return (
            // className="p-field p-float-label">
            <div className={`${classes.errorinput} ${classes.input}`}>
              {/* <label htmlFor="firstName" className="p-d-block">
              Username
            </label> */}

              <InputText
                // onChange={onChange}
                // value={value}
                // id={randomId}
                className={`${error && `p-invalid`} ${classes.inputtext}`}
                placeholder={placeholder}
                {...field}
                // onChange={myOnChange}
                //   {...register(name)}
              />
              {error && error.message && (
                <div className={classes.errormessage}>
                  {placeholder} is required{"."}
                </div>
              )}
            </div>
          );
        }}
      />
    );
  } else if (type === "radio") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          defaultValue={""}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            function myOnChange() {
              console.log(arguments);
              onSubmit(null, name);
              return field.onChange(...arguments);
            }
            console.log(error);
            return (
              // className="p-field p-float-label">
              <span>
                {/* <label htmlFor="firstName" className="p-d-block">
              Username
            </label> */}
                <Radio.Group
                  value={field.value}
                  onChange={(e) => myOnChange(e.target.value)}
                >
                  {children}
                </Radio.Group>
              </span>
            );
          }}
        />
      </div>
    );
    // Doesn't work:
  } else if (type === "number") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            return (
              // className="p-field p-float-label">
              <div className="site-input-number-wrapper">
                <InputNumber min={1} max={100000} onChange={field.onChange} />
              </div>
            );
          }}
        />
      </div>
    );
  } else if (type === "options") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            return (
              // className="p-field p-float-label">
              <WhyMoneyOptions onChange={field.onChange} name={name} />
            );
          }}
        />
      </div>
    );
    // } else if (type === "number") {
    //   return (
    //     <Controller
    //       name={name}
    //       control={control}
    //       // rules={{ required: "First name is required" }}
    //       render={({
    //         field, //{ onChange, onBlur, value, name, ref },
    //         fieldState: { invalid, isTouched, isDirty, error },
    //       }) => {
    //         return (
    //           // className="p-field p-float-label">
    //           <span>
    //             {/* <label htmlFor="firstName" className="p-d-block">
    //             Username
    //           </label> */}
    //             <InputNumber
    //               // onChange={onChange}
    //               // value={value}
    //               className={`${error && "p-invalid"}`}
    //               {...field}
    //               value={2015}
    //               // onChange={myOnChange}
    //               //   {...register(name)}
    //             />
    //             {error && error.message && (
    //               <small id={`${name}-help`} className="p-error p-d-block">
    //                 {placeholder} is required{"."}
    //               </small>
    //             )}
    //           </span>
    //         );
    //       }}
    //     />
    //   );
  } else if (type === "date") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          defaultValue={""}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            function myOnChange() {
              console.log(arguments);
              onSubmit(null, name);
              return field.onChange(...arguments);
            }
            return (
              <Space direction="vertical" size={18}>
                <DatePicker
                  placeholder={placeholder}
                  {...field}
                  onOk={myOnChange}
                  onChange={myOnChange}
                  //   onChange={onChange}
                  //   onOk={onChange}
                />
                {error && error.message && (
                  <div className={classes.errormessage}>
                    {placeholder} is required{"."}
                  </div>
                )}
              </Space>
            );
          }}
        />
      </div>
    );
  } else if (type === "multiselect") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            function myOnChange() {
              console.log(arguments);
              onSubmit(null, name);
              return field.onChange(...arguments);
            }
            return (
              <Space direction="vertical" size={18} width={300}>
                <Select
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  //defaultValue={props.defaultValue}
                  placeholder="None"
                  style={{ width: "100%", minWidth: "10rem" }}
                  options={options}
                  {...field}
                  // onChange={myOnChange}
                />
              </Space>
            );
          }}
        />
      </div>
    );
  } else if (type === "select") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            function myOnChange() {
              console.log(arguments);
              onSubmit(null, name);
              return field.onChange(...arguments);
            }
            return (
              <Space direction="vertical" size={18} width={300}>
                <Select
                  showArrow
                  tagRender={tagRender}
                  placeholder="None"
                  style={{ width: "100%", minWidth: "10rem" }}
                  options={options}
                  {...field}
                  onChange={myOnChange}
                />
              </Space>
            );
          }}
        />
      </div>
    );
  } else if (type === "phone") {
    return (
      <div className={`${classes.errorinput} ${classes.input}`}>
        <Controller
          name={name}
          control={control}
          // rules={{ required: "First name is required" }}
          render={({
            field, //{ onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => {
            return (
              <Space direction="vertical" size={18} width={300}>
                <InputMask
                  className="p-inputtext p-component"
                  maskChar={null}
                  mask="(+999) 000-0000"
                  style={{ width: "100%", minWidth: "10rem" }}
                  {...field}
                />
              </Space>
            );
          }}
        />
      </div>
    );
  }
}

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

// function onChange(value, dateString) {
//   console.log("Selected Time: ", value);
//   console.log("Formatted Selected Time: ", dateString);
// }

// function onOk(value) {
//   console.log("onOk: ", value);
// }
// );

// THIS IS WORKING:::
//   if (type === "text") {
//     return (
//       <InputText
//         name={name}
//         placeholder={placeholder}
//         type="text"
//         // ref={ref}
//         // {...inputProps}
//         {...register(name)}
//       />
//     );

//   } else return <div></div>;

//   return React.Children.map(children, (child) => {
//     return child.props.name
//       ? React.createElement(child.type, {
//           ...{
//             ...register(name),
//           },
//         })
//       : child;
//   });

//   return <input {...register(name)} />;

//   return React.Children.map(children, (child) => {
//     return child.props.name
//       ? React.createElement(child.type, {
//           ...{
//             // control: control,
//             // name: name,
//             // key: child.props.name,
//             // ref: ref,
//             // error: error,
//             // className: `p-d block ${error && "p-invalid"}`,
//             // ...inputProps,
//             ...register(name),
//             // ...child.props,
//           },
//         })
//       : child;
//   });
//}

export default ControlledInput;
