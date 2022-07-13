import { InputText } from "primereact/inputtext";

const tfn = ({ authoritiesData, updaterFn, onBlur }) => {
  return (
    <>
      <h3>Tax File Number Authority</h3>
      <p>To Whom It May Concern,</p>
      <p>
        I give permission for my tax file number (TFN) to be stored in a secure
        format by my Financial Planner in accordance with legislative
        requirements.
      </p>
      <p>
        I give permission for my TFN to be forwarded to financial institutions
        as required.
      </p>
      <InputText
        placeholder={"Tax File Number"}
        value={authoritiesData.TFN}
        onChange={(e) => updaterFn(e.target.value)}
        style={{ minWidth: "75%" }}
        // onBlur={onBlur}
      />
    </>
  );
};

export default tfn;
