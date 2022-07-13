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
import { Divider } from "antd";
import { createPreassessmentResponse } from "../../store/auth/create-preassessment-response";

const StyledTable = styled.table`
  border: 1.85px solid black;
  padding-bottom: 5rem;
  width: 95%;
`;

const Th = styled.td`
  padding-left: 0.45rem;
  padding-right: 1.5rem;
  padding-top: 1.95rem;
  padding-bottom: 1.95rem;
  border-right: 0.75px solid grey;
`;

const Tr = styled.tr`
  padding-bottom: 2.95rem;
  border-bottom: solid 3.25px darkgreen;
`;

const inputNumberStyles = {
  width: "91.25%",
  border: "solid .55px rgba(0,0,0,0.45)",
  marginBottom: "0.95rem",
};

/*
type PreassessmentResponse:
  id: ID!
  underwriterID: ID!
  clientID: ID!
  clientFullName: String!
  underwriterFullName: String!
  underwriterCompany: String!
  advisorID: ID!
  preassessmentID: ID!
  underwriter: Underwriter! @connection(fields: ["underwriterID"])
  response: AWSJSON
*/
const handleSubmitForm = async (
  {
    referenceNumber,
    coverRequired,
    maxCoverOffered,
    possibleExclusions,
    possibleLoadings,
    notes,
    generalNotes,
    decisionNotes,
  },
  { advisorID, underwriterID, clientID, clientName, preassessmentID },
  underwriter
) => {
  const response = {
    referenceNumber,
    coverRequired,
    maxCoverOffered,
    possibleExclusions,
    possibleLoadings,
    decisionNotes,
  };

  const preassessmentResponseObject = {
    // id: uuidv4(),
    response: JSON.stringify(response),
    underwriterID,
    advisorID,
    clientID,
    clientFullName: clientName,
    preassessmentID,
    underwriterFullName: `${underwriter?.firstName} ${underwriter?.lastName}`,
    underwriterCompany: underwriter?.employerName,
  };

  console.log("--- CREATING A PREASSESSMENT RESPONSE WITH ---");
  console.log(preassessmentResponseObject);
  // createPreassessmentResponse(preassessmentResponseObject);
};

const PreassessmentForm = ({ activeClient, underwriter }) => {
  console.log(activeClient);
  console.log(underwriter);

  const [formState, setFormState] = useState({
    referenceNumber: {
      life: activeClient?.referenceNumber?.life,
      tpd: activeClient?.referenceNumber?.tpd,
      monthlyIP: activeClient?.referenceNumber?.monthlyIP,
      trauma: activeClient?.referenceNumber?.trauma,
    },
    coverRequired: {
      life: activeClient?.coverRequired?.life,
      tpd: activeClient?.coverRequired?.tpd,
      monthlyIP: activeClient?.coverRequired?.ip,
      trauma: activeClient?.coverRequired?.trauma,
    },
    maxCoverOffered: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    possibleExclusions: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    possibleLoadings: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    notes: {
      life: activeClient?.notes?.life,
      tpd: activeClient?.notes?.tpd,
      monthlyIP: activeClient?.notes?.monthlyIP,
      trauma: activeClient?.notes?.trauma,
    },
    generalNotes: {
      life: activeClient?.generalNotes?.life,
      tpd: activeClient?.generalNotes?.tpd,
      monthlyIP: activeClient?.generalNotes?.monthlyIP,
      trauma: activeClient?.generalNotes?.trauma,
    },
    decisionNotes: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
  });

  const handleFormChange = (row, column, newValue) => {
    const newState = { ...formState };
    const newRow = { ...formState[row] };
    newRow[column] = newValue;
    newState[row] = newRow;
    console.log(newState);
    setFormState(newState);
  };

  return (
    <Paper elevation={1} style={{ padding: "3rem", width: "100%" }}>
      <StyledTable>
        <thead>
          <tr
            style={{
              borderBottom: "4.5px solid black",
              marginBottom: "0rem",
              fontWeight: "bold",
              //   paddingBottom: "3.5rem",
            }}
          >
            <Th></Th>
            <Th>Life Cover</Th>
            <Th>TPD</Th>
            <Th>Monthly IP</Th>
            <Th>Trauma</Th>
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
          <Tr>
            <Th>Reference Number</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.referenceNumber.life}
                onChange={(e) =>
                  handleFormChange("referenceNumber", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.referenceNumber.tpd}
                onChange={(e) =>
                  handleFormChange("referenceNumber", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.referenceNumber.monthlyIP}
                onChange={(e) =>
                  handleFormChange(
                    "referenceNumber",
                    "monthlyIP",
                    e.target.value
                  )
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.referenceNumber.trauma}
                onChange={(e) =>
                  handleFormChange("referenceNumber", "trauma", e.target.value)
                }
              />
            </Th>
            <Divider />
          </Tr>
          <Tr>
            <Th style={{ position: "relative", top: "-.45rem" }}>
              Cover Required
            </Th>
            <Th>
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
                disabled
              />
            </Th>
            <Th>
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
                disabled
              />
            </Th>
            <Th>
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
                disabled
              />
            </Th>
            <Th>
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
                disabled
              />
            </Th>
          </Tr>
          <Tr>
            <Th>Notes</Th>
            <Th>
              <p style={{ width: 200 }}>{formState.notes.life}</p>
            </Th>
            <Th>
              <p style={{ width: 200 }}>{formState.notes.tpd}</p>
            </Th>
            <Th>
              <p style={{ width: 200 }}>{formState.notes.monthlyIP}</p>
            </Th>
            <Th>
              <p style={{ width: 200 }}>{formState.notes.trauma}</p>
            </Th>
          </Tr>
          <Tr style={{ marginBottom: "2rem", paddingBottom: "2rem" }}>
            <Th>General Notes</Th>
            <Th>
              <p style={{ width: 200 }}>{formState.generalNotes.life}</p>
            </Th>
            <Th>
              <p style={{ width: 200 }}>{formState.generalNotes.tpd}</p>
            </Th>
            <Th>
              <p style={{ width: 200 }}>{formState.generalNotes.monthlyIP}</p>
            </Th>
            <Th>
              <p style={{ width: 200 }}>{formState.generalNotes.trauma}</p>
            </Th>
          </Tr>
          <Tr>
            <Th>Max Cover Offered</Th>
            <Th>
              <InputNumber
                style={inputNumberStyles}
                value={formState.maxCoverOffered.life}
                onChange={(newVal) =>
                  handleFormChange("maxCoverOffered", "life", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Th>
            <Th>
              <InputNumber
                style={inputNumberStyles}
                value={formState.maxCoverOffered.tpd}
                onChange={(newVal) =>
                  handleFormChange("maxCoverOffered", "tpd", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Th>
            <Th>
              <InputNumber
                style={inputNumberStyles}
                value={formState.maxCoverOffered.monthlyIP}
                onChange={(newVal) =>
                  handleFormChange("maxCoverOffered", "monthlyIP", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Th>
            <Th>
              <InputNumber
                style={inputNumberStyles}
                value={formState.maxCoverOffered.trauma}
                onChange={(newVal) =>
                  handleFormChange("maxCoverOffered", "trauma", newVal)
                }
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Th>
            {/* <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.maxCoverOffered.life}
                onChange={(e) =>
                  handleFormChange("maxCoverOffered", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.maxCoverOffered.tpd}
                onChange={(e) =>
                  handleFormChange("maxCoverOffered", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.maxCoverOffered.monthlyIP}
                onChange={(e) =>
                  handleFormChange(
                    "maxCoverOffered",
                    "monthlyIP",
                    e.target.value
                  )
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={1}
                placeholder=""
                style={{ width: 200 }}
                value={formState.maxCoverOffered.trauma}
                onChange={(e) =>
                  handleFormChange("maxCoverOffered", "trauma", e.target.value)
                }
              /> */}
          </Tr>
          <Tr>
            <Th>Possible Exclusions</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleExclusions.life}
                onChange={(e) =>
                  handleFormChange("possibleExclusions", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleExclusions.tpd}
                onChange={(e) =>
                  handleFormChange("possibleExclusions", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleExclusions.monthlyIP}
                onChange={(e) =>
                  handleFormChange(
                    "possibleExclusions",
                    "monthlyIP",
                    e.target.value
                  )
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                value={formState.possibleExclusions.trauma}
                style={{ width: 200 }}
                onChange={(e) =>
                  handleFormChange(
                    "possibleExclusions",
                    "trauma",
                    e.target.value
                  )
                }
              />
            </Th>
          </Tr>
          <Tr>
            <Th>Possible Loadings</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleLoadings.life}
                onChange={(e) =>
                  handleFormChange("possibleLoadings", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleLoadings.tpd}
                onChange={(e) =>
                  handleFormChange("possibleLoadings", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleLoadings.monthlyIP}
                onChange={(e) =>
                  handleFormChange(
                    "possibleLoadings",
                    "monthlyIP",
                    e.target.value
                  )
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.possibleLoadings.trauma}
                onChange={(e) =>
                  handleFormChange("possibleLoadings", "trauma", e.target.value)
                }
              />
            </Th>
          </Tr>
          <tr>
            <Th>Decision Notes</Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.decisionNotes.life}
                onChange={(e) =>
                  handleFormChange("decisionNotes", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.decisionNotes.tpd}
                onChange={(e) =>
                  handleFormChange("decisionNotes", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.decisionNotes.monthlyIP}
                onChange={(e) =>
                  handleFormChange("decisionNotes", "monthlyIP", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.decisionNotes.trauma}
                onChange={(e) =>
                  handleFormChange("decisionNotes", "trauma", e.target.value)
                }
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
          content={"Submit Quote"}
          labelPosition="right"
          icon="edit"
          className={"ui inverted purple button"}
          onClick={() => handleSubmitForm(formState, activeClient, underwriter)}
          // onClick={() => {}}
          // loading={clientLoading}
          // positive
        />
        {/* <Button
          content={"Submit Quote"}
          // disabled={false}
          labelPosition="right"
          icon="plus"
          onClick={() => handleSubmitForm(formState)}
          // loading={false}
          positive={true}
        /> */}
      </div>
    </Paper>
  );
};

export default PreassessmentForm;
