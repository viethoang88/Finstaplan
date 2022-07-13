import { Select, Input } from "antd";
const { Option } = Select;
import FileUpload from "../../ui/file-upload";

const containerStyles = {
  display: "flex",
  flexDirection: "row",
  maxWidth: "70%",
  minWidth: "70%",
  paddingBottom: ".4rem",
  //   justifyItems: "flex-end",
  //   justifyContent: "flex-end",
};

const structureToLabelMap = new Map([
  ["trust", "Trust"],
  ["company", "Company"],
  ["smsf", "SMSF"],
]);

const ExistingStructureDetails = ({
  idx,
  createdBy,
  structure,
  name,
  owner,
  hasPartner,
  primaryName,
  partnerName,
  onChangeHandler,
  currentPerson,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    onChangeHandler(idx, name, value);
  };

  const primaryDisplayName =
    primaryName && partnerName != "primary" ? primaryName : "Unnamed Client";

  const partnerDisplayName =
    partnerName && partnerName != "partner" ? partnerName : "Unnamed Partner";

  console.log(createdBy);
  console.log(currentPerson);
  return (
    <div
      key={idx}
      style={{
        display: "flex",
        justifyItems: "flex-end",
        width: "100%",
        justifyContent: "flex-end",
        paddingBottom: "1.75rem",
        paddingTop: "0.65rem",
      }}
    >
      <div style={containerStyles} key={`${idx}-${createdBy}-${structure}`}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", top: "-1.7rem" }}>
            {/* {currentPerson !== createdBy && "Partner's "} */}
            {structureToLabelMap.get(structure)}
          </span>
          <Input
            name={`${createdBy}-${structure}-name`}
            value={name}
            placeholder={`Name this ${structureToLabelMap.get(structure)}...`}
            onChange={handleChange}
            style={{ marginRight: ".5rem" }}
          />
        </div>
        {hasPartner && (
          <div>
            <Select
              showArrow
              placeholder="Select owner..."
              value={owner}
              style={{ width: "100%", minWidth: "10rem" }}
              onChange={(value) =>
                handleChange({
                  target: {
                    name: `${createdBy}-${structure}-owner`,
                    value: value,
                  },
                })
              }
            >
              <Option value={"joint"}>Joint</Option>
              <Option value={"primary"}>{primaryDisplayName}</Option>
              <Option value={"partner"}>{partnerDisplayName}</Option>
            </Select>
          </div>
        )}
        <FileUpload
          uploadPath={[structure, owner, name]}
          uploaderStyles={{
            marginLeft: ".15rem",
            maxWidth: "12rem",
            maxHeight: "7rem",
          }}
          abbreviateText="Upload relevant documents"
          // renderUploader="button"
          uploadMessage="Upload relevant documents"
        />
      </div>
    </div>
  );
};

export default ExistingStructureDetails;
