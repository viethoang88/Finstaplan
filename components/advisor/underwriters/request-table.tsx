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

const StyledTable = styled.table`
  border-bottom: 1.5px solid black;
  padding-bottom: 5rem;
`;

const Th = styled.td`
  padding-right: 1.5rem;
  padding-bottom: 0.95rem;
`;

const inputNumberStyles = {
  width: "91.25%",
  border: "solid .55px rgba(0,0,0,0.45)",
  marginBottom: "0.95rem",
};

const handleSubmitForm = (formData) => {};

const RequestTable = ({ activeClient }) => {
  const [formState, setFormState] = useState({
    referenceNumber: {
      life: "",
      tpd: "",
      monthlyIP: "",
      trauma: "",
    },
    coverRequired: {
      life: undefined,
      tpd: undefined,
      monthlyIP: undefined,
      trauma: undefined,
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

  const handleFormChange = (row, column, newValue) => {
    const newState = { ...formState };
    const newRow = { ...formState[row] };
    newRow[column] = newValue;
    newState[row] = newRow;
    console.log(newState);
    setFormState(newState);
  };

  return (
    <Paper elevation={3} style={{ padding: "3rem" }}>
      <StyledTable>
        <thead>
          <tr
            style={{
              borderBottom: "2px solid black",
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
          <tr>
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
                style={{ width: 200 }}
                value={formState.notes.life}
                onChange={(e) =>
                  handleFormChange("notes", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.notes.tpd}
                onChange={(e) =>
                  handleFormChange("notes", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.notes.monthlyIP}
                onChange={(e) =>
                  handleFormChange("notes", "monthlyIP", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                style={{ width: 200 }}
                value={formState.notes.trauma}
                onChange={(e) =>
                  handleFormChange("notes", "trauma", e.target.value)
                }
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
                style={{ width: 200 }}
                onChange={(e) =>
                  handleFormChange("generalNotes", "life", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                value={formState.generalNotes.tpd}
                style={{ width: 200 }}
                onChange={(e) =>
                  handleFormChange("generalNotes", "tpd", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder=""
                value={formState.generalNotes.monthlyIP}
                style={{ width: 200 }}
                onChange={(e) =>
                  handleFormChange("generalNotes", "monthlyIP", e.target.value)
                }
              />
            </Th>
            <Th>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                value={formState.generalNotes.trauma}
                placeholder=""
                style={{ width: 200 }}
                onChange={(e) =>
                  handleFormChange("generalNotes", "trauma", e.target.value)
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
        {/* <Button
          content={"Save Changes"}
          labelPosition="right"
          icon="edit"
          className={"ui inverted purple button"}
          onClick={() => {}}
          // loading={clientLoading}
          // positive
        /> */}
        <Button
          content={"Submit Request"}
          // disabled={false}
          labelPosition="right"
          icon="plus"
          onClick={() => handleSubmitForm(formState)}
          // loading={false}
          positive={true}
        />
      </div>
    </Paper>
  );
};

export default RequestTable;
