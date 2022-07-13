import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import FileUpload from "../../ui/file-upload";
import PhotoService from "../../../src/libs/photo-service";
import { useSelector } from "react-redux";

const checkboxStyles = {
  //   padding: "0.5rem",
  //   backgroundColor: "white",
  //   flexBasis: "33.33%",
  //   minWidth: "33.33%",
  //   maxWidth: "33.33%",
  marginLeft: "1rem",
  //   margin-left:
};
const flexStyles = {};
const labelStyles = {
  //   display: "inline-block",
  marginLeft: "0.5rem",
  display: "flex",
  flexWrap: "wrap",
  width: "80%",
  position: "relative",
  left: "2rem",
  top: "-1.6rem",
  //   position: "absolute",
  //   float: "inline-end",
  //   top: ".1rem",
  //   width: "auto",
};
const questionStyles = {};

const generateCheckbox = (selected, idx, updaterFn, question) => {
  return (
    <>
      <div key={`cb_${idx}`} className="p-row-2" style={checkboxStyles}>
        <Checkbox
          inputId={`cb_${idx}`}
          value={question}
          onChange={updaterFn}
          checked={selected}
        />
        <label
          style={labelStyles}
          htmlFor={`cb_${idx}`}
          //   className="p-checkbox-label"
        >
          {question}
        </label>
      </div>
    </>
  );
};

const uploadFunction = (uploadPath, clientId, { onSuccess, onError, file }) => {
  if (clientId === undefined) return;

  const fileName = file.name;
  // const fullPath = `${uploadPath}/${fileName}`;
  const fullPath = `${uploadPath}/${fileName}`;
  PhotoService.put(file, fullPath)
    .then((res) => {
      console.log("--- PUT SUCCEEDED ---");
      console.log(res);
      onSuccess(null, file);
    })
    .catch(() => {
      onError();
    });
  console.log(file);
};

const ChecklistItem = ({
  value,
  question,
  selected,
  files,
  key,
  section,
  idx,
}) => {
  const clientId = useSelector((state) => state.factFind.id);
  const uploadPath = [section, value];
  // const _uploadPath = `/${clientId}/${section}/${value}`;
  // const _uploadPath = `${clientId}/${section}/${value}`;
  const _uploadPath = `${clientId}-${section}-${value}`;

  const [checked, setChecked] = useState(selected);
  //const [localFiles, setLocalFiles] = useState(files);

  // console.log(value, question, selected, files, key, section, idx);
  // use /${clientId}/${section}/${value}

  const checkedHandler = (e) => {
    setChecked((prevState) => e.checked);
  };

  return (
    <div key={key}>
      {generateCheckbox(checked, `${section}_${idx}`, checkedHandler, question)}
      {checked && (
        <FileUpload
          uploadPath={uploadPath}
          uploaderStyles={{ marginLeft: ".75rem" }}
          uploadFunction={uploadFunction.bind(null, _uploadPath, clientId)}
        />
      )}
    </div>
  );
};

export default ChecklistItem;
