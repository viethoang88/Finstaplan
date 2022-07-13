import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import styled from "@emotion/styled";
import { InputNumber } from "antd";
import { Button } from "semantic-ui-react";
import { Checkbox } from "primereact/checkbox";
import { useSelector, useDispatch } from "react-redux";
import createPreassessment from "../../../store/auth/create-preassessment";

const StyledTable = styled.table`
  border-bottom: 1.5px solid black;
  padding-bottom: 5rem;
  width: 100%;
`;

const Th = styled.td`
  position: relative;
  padding-right: 1.5rem;
  padding-bottom: 0.95rem;
  width: auto;
  border-color: ${(props) => {
    // console.log("--- In Th setting border-color ----");
    // console.log(props.isChecked);
    return props.isChecked ? "darkgreen" : "transparent";
  }};
  background-color: ${(props) => (props.isChecked ? "lightgreen" : "white")}    
  box-shadow: ${(props) =>
    props.isChecked ? `2px 2px 1px darkgreen` : "none"};
`;

const inputNumberStyles = {
  width: "94%",
  border: "solid .55px rgba(0,0,0,0.45)",
  marginBottom: "0.95rem",
};

const textAreaStyles = {
  width: "100%",
};

const checkboxStyles = {
  position: "absolute",
  left: 5,
};

/*
type Preassessment @model {
    id: ID!
    advisorName: String!
    dealerGroup: String!
    clientName: String!
    dob: String!
    gender: String!
    healthInfo: AWSJSON!                                            -> object, completed health form answers for <HealthForm> component
    attachments: String                                             -> s3 path name to relevant attachments for this preassessment
    underwriters: [Underwriter!] @connection(fields: ["id"])
}*/

const AdvisorForm = ({
  activeClient,
  activeClientInfo,
  advisorProfile,
  healthInfo,
  coverRequiredLife = undefined,
  coverRequiredTpd = undefined,
  coverRequiredIP = undefined,
  coverRequiredTrauma = undefined,
  handleSubmitForm,
}) => {
  const [formState, setFormState] = useState({
    referenceNumber: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    coverRequired: {
      life: coverRequiredLife,
      tpd: coverRequiredTpd,
      monthlyIP: coverRequiredIP,
      trauma: coverRequiredTrauma,
    },
    notes: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    generalNotes: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
  });
  const [lifeCoverChecked, setLifeCoverChecked] = useState(true);
  const [tpdCoverChecked, setTpdCoverChecked] = useState(true);
  const [ipCoverChecked, setIpCoverChecked] = useState(true);
  const [traumaCoverChecked, setTraumaCoverChecked] = useState(true);

  const dispatch = useDispatch();

  const filterStateItem = (stateItem) => {
    const item = { ...stateItem };
    if (!lifeCoverChecked) delete stateItem["life"];
    if (!tpdCoverChecked) delete stateItem["tpd"];
    if (!ipCoverChecked) delete stateItem["monthlyIP"];
    if (!traumaCoverChecked) delete stateItem["trauma"];
    return item;
  };

  const filterFormState = (formState) => {
    const referenceNumber = { ...formState.referenceNumber };
    const coverRequired = { ...formState.coverRequired };
    const notes = { ...formState.notes };
    const generalNotes = { ...formState.generalNotes };
    const filteredState = {
      referenceNumber: filterStateItem(referenceNumber),
      coverRequired: filterStateItem(coverRequired),
      notes: filterStateItem(notes),
      generalNotes: filterStateItem(generalNotes),
    };
    console.log(filteredState);
    return filteredState;
  };

  const handleFormChange = (row, column, newValue) => {
    const newState = { ...formState };
    const newRow = { ...formState[row] };
    newRow[column] = newValue;
    newState[row] = newRow;
    setFormState(newState);
  };

  return (
    <Paper elevation={3} style={{ padding: "3rem", width: "100%" }}>
      <StyledTable>
        <thead>
          <tr
            style={{
              borderBottom: "2px solid black",
              marginBottom: "0rem",
              fontWeight: "bold",
              textAlign: "center",
              //   paddingBottom: "3.5rem",
            }}
          >
            <Th></Th>
            <Th isChecked={lifeCoverChecked}>
              <Checkbox
                checked={lifeCoverChecked}
                onChange={(e) => setLifeCoverChecked(e.checked)}
                style={checkboxStyles}
              />
              Life Cover
            </Th>
            <Th isChecked={tpdCoverChecked}>
              <Checkbox
                checked={tpdCoverChecked}
                onChange={(e) => setTpdCoverChecked(e.checked)}
                style={checkboxStyles}
              />
              Total & Permanent Disability
            </Th>
            <Th isChecked={ipCoverChecked}>
              <Checkbox
                checked={ipCoverChecked}
                onChange={(e) => setIpCoverChecked(e.checked)}
                style={checkboxStyles}
              />
              Monthly Income Protector
            </Th>
            <Th isChecked={traumaCoverChecked}>
              <Checkbox
                checked={traumaCoverChecked}
                onChange={(e) => setTraumaCoverChecked(e.checked)}
                style={checkboxStyles}
              />
              Trauma
            </Th>
          </tr>
        </thead>
        <tbody
          style={{
            paddingTop: "2rem",
            marginTop: "2rem",
            position: "relative",
            top: "0.65rem",
          }}
        >
          <tr>
            <Th>Reference Number</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={textAreaStyles}
                value={formState.referenceNumber.life}
                onChange={(e) =>
                  handleFormChange("referenceNumber", "life", e.target.value)
                }
                disabled={!lifeCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={textAreaStyles}
                value={formState.referenceNumber.tpd}
                onChange={(e) =>
                  handleFormChange("referenceNumber", "tpd", e.target.value)
                }
                disabled={!tpdCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={textAreaStyles}
                value={formState.referenceNumber.monthlyIP}
                onChange={(e) =>
                  handleFormChange(
                    "referenceNumber",
                    "monthlyIP",
                    e.target.value
                  )
                }
                disabled={!ipCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={textAreaStyles}
                value={formState.referenceNumber.trauma}
                onChange={(e) =>
                  handleFormChange("referenceNumber", "trauma", e.target.value)
                }
                disabled={!traumaCoverChecked}
              />
            </Th>
          </tr>
          <tr>
            <td style={{ position: "relative", top: "-.45rem" }}>
              Cover Required
            </td>
            <td>
              <InputNumber
                style={inputNumberStyles}
                value={formState.coverRequired.life}
                onChange={(newVal) =>
                  handleFormChange("coverRequired", "life", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                disabled={!lifeCoverChecked}
              />
            </td>
            <td>
              <InputNumber
                style={inputNumberStyles}
                value={formState.coverRequired.tpd}
                onChange={(newVal) =>
                  handleFormChange("coverRequired", "tpd", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                disabled={!tpdCoverChecked}
              />
            </td>
            <td>
              <InputNumber
                style={inputNumberStyles}
                value={formState.coverRequired.monthlyIP}
                onChange={(newVal) =>
                  handleFormChange("coverRequired", "monthlyIP", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                disabled={!ipCoverChecked}
              />
            </td>
            <td>
              <InputNumber
                style={inputNumberStyles}
                value={formState.coverRequired.trauma}
                onChange={(newVal) =>
                  handleFormChange("coverRequired", "trauma", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                disabled={!traumaCoverChecked}
              />
            </td>
          </tr>
          <tr>
            <Th>Notes</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={textAreaStyles}
                value={formState.notes.life}
                onChange={(e) =>
                  handleFormChange("notes", "life", e.target.value)
                }
                disabled={!lifeCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={textAreaStyles}
                value={formState.notes.tpd}
                onChange={(e) =>
                  handleFormChange("notes", "tpd", e.target.value)
                }
                disabled={!tpdCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={textAreaStyles}
                value={formState.notes.monthlyIP}
                onChange={(e) =>
                  handleFormChange("notes", "monthlyIP", e.target.value)
                }
                disabled={!ipCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={textAreaStyles}
                value={formState.notes.trauma}
                onChange={(e) =>
                  handleFormChange("notes", "trauma", e.target.value)
                }
                disabled={!traumaCoverChecked}
              />
            </Th>
          </tr>
          <tr style={{ marginBottom: "2rem", paddingBottom: "2rem" }}>
            <Th>General Notes</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                value={formState.generalNotes.life}
                style={textAreaStyles}
                onChange={(e) =>
                  handleFormChange("generalNotes", "life", e.target.value)
                }
                disabled={!lifeCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                value={formState.generalNotes.tpd}
                style={textAreaStyles}
                onChange={(e) =>
                  handleFormChange("generalNotes", "tpd", e.target.value)
                }
                disabled={!tpdCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                value={formState.generalNotes.monthlyIP}
                style={textAreaStyles}
                onChange={(e) =>
                  handleFormChange("generalNotes", "monthlyIP", e.target.value)
                }
                disabled={!ipCoverChecked}
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                value={formState.generalNotes.trauma}
                placeholder=""
                style={textAreaStyles}
                onChange={(e) =>
                  handleFormChange("generalNotes", "trauma", e.target.value)
                }
                disabled={!traumaCoverChecked}
              />
            </Th>
          </tr>
        </tbody>
      </StyledTable>
      <div
        style={{
          marginTop: "0.65rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          content={"Submit Pre-Assessment Request"}
          labelPosition="right"
          icon="edit"
          className={"ui inverted purple button"}
          onClick={() => handleSubmitForm(filterFormState(formState))}
          // loading={clientLoading}
          // positive
        />
        {/* <Button
          content={"Submit Preassessment Request"}
          // disabled={false}
          labelPosition="right"
          icon="plus"
          onClick={() => handleSubmitForm(filterFormState(formState))}
          // loading={false}
          positive={true}
        /> */}
      </div>
    </Paper>
  );
};

export default AdvisorForm;
