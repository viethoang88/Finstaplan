import { Divider } from "antd";

const SectionHeader = ({ text }) => {
  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "2.5rem" }}>{text}</h2>
      <Divider />
    </>
  );
};

export default SectionHeader;
