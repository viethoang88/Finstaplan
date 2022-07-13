import ListClients from "./clients/list-clients";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientSetActive } from "../../store/auth";
import Paper from "@mui/material/Paper";

const ActiveClientRequired = ({ activeClient, feature }) => {
  if (activeClient !== undefined) return <></>;

  const dispatch = useDispatch();

  useEffect(() => {
    const clientId = activeClient?.id;
    if (clientId !== undefined) {
      console.log(
        `--- ACTIVE CLIENT DETECTED with ID: ${activeClient?.id} ---`
      );
      console.log(`--- DISPATCHING getClientSetActive ----`);
      dispatch(getClientSetActive(clientId));
    }
  }, [activeClient]);

  return (
    <div
      style={{
        margin: "2rem",
        padding: "2.35rem",
        position: "relative",
        top: "-3.5rem",
        right: "3.5rem",
        width: "95%",
      }}
    >
      <Paper elevation={3} style={{ padding: "3rem" }}>
        <h2
          style={{
            color: "darkgrey",
            fontWeight: 700,
            marginBottom: "1.25rem",
            position: "relative",
            left: "0.25rem",
            fontSize: "1.3rem",
          }}
        >
          An Active Client is required for {feature}. Select a client to
          proceed.
        </h2>
        <ListClients />
      </Paper>
    </div>
  );
};

export default ActiveClientRequired;
