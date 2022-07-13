import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import { useMemo, useRef } from "react";
const { Dragger } = Upload;
import { Toast } from "primereact/toast";

const uploadToS3 = (file, clientId, advisorId, uploadPath) => {
  console.log("PREPARING TO UPLOAD FILE TO S3");
  console.log(uploadPath);
  console.log(file);
  console.log(clientId);
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("done"), 3000);
  });
};

const _uploaderStyles = {
  //   marginLeft: "0.35rem",
};

const legalFileTypes = [
  "application/vnd.msexcel",
  "vnd.ms-excel.sheet",
  "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/pdf",
];

const toastLifespan = 9000;

const FileUpload = ({
  uploadPath,
  uploaderStyles = _uploaderStyles,
  abbreviateText = "",
  renderUploader = "drag",
  uploadMessage = "",
  uploadFunction = async (file) => {},
}) => {
  const toast = useRef(null);
  const props = useMemo(
    () => ({
      name: "file",
      multiple: true,
      customRequest: (file) => uploadFunction(file),
      // uploadToS3(file, clientId, advisorId, uploadPath),
      //action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      // beforeUpload: (file) => {
      //   if (!legalFileTypes.includes(file.type)) {
      //     console.log(file.type);
      //     message.error(`${file.name} is not a legal file type`);
      //     toast.current.show({
      //       severity: "error",
      //       summary: "Upload failed",
      //       detail: `${file.name} is not a legal file type.`,
      //       life: toastLifespan,
      //     });
      //   }
      //   return legalFileTypes.includes(file.type) ? true : Upload.LIST_IGNORE;
      // },
      onChange: (info) => {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${info.file.name} file uploaded successfully.`,
            life: toastLifespan,
          });
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
          toast.current.show({
            severity: "error",
            summary: "Upload failed",
            detail: `${info.file.name} file upload failed.`,
            life: toastLifespan,
          });
        }
      },
      onDrop: (e) => {
        console.log("Dropped files", e.dataTransfer.files);
      },
    }),
    []
  );

  if (renderUploader === "drag") {
    return (
      <div style={uploaderStyles}>
        <Toast ref={toast} />
        <Dragger {...props}>
          {abbreviateText !== "" && (
            <>
              <p
                className="ant-upload-drag-icon"
                style={{ position: "relative", top: "-1.05rem" }}
              >
                <InboxOutlined />
              </p>
              <p
                className="ant-upload-text"
                style={{ position: "relative", top: "-2.35rem" }}
              >
                {abbreviateText}
              </p>
            </>
          )}

          {abbreviateText === "" && (
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
          )}

          {abbreviateText === "" && (
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          )}
          {abbreviateText === "" && (
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          )}
        </Dragger>
      </div>
    );
  } else {
    return (
      <div style={uploaderStyles}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>{uploadMessage}</Button>
        </Upload>
      </div>
    );
  }
};

export default FileUpload;
