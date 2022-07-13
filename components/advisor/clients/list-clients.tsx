import { DataTable } from "primereact/datatable";
import { useRouter } from "next/router";
import { Card } from "antd";
import { Button } from "primereact/button";
import {
  getClientsSummary,
  getClients,
  deleteExistingClient,
  authSliceActions,
  getClientSetActive,
} from "../../../store/auth";
import { Column } from "primereact/column";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

function monthDiff(date) {
  try {
    if (!date) return "N / A";

    let months;
    const now = new Date();
    const then = new Date(date);
    months = (now.getFullYear() - then.getFullYear()) * 12;
    months -= now.getMonth();
    months += then.getMonth();
    return months <= 0 ? `${then.getDay()} days ago` : `${months} ago`;
  } catch (e) {
    return "N / A";
  }
}

// const DUMMY_CLIENTS = [
//   {
//     id: "1",
//     lastName: "van Der Westhuizen",
//     client: "Tjaart",
//     partner: "Cecille",
//     status: "Client",
//     lastModified: `${monthDiff(new Date("21 Feb 2020"))} months ago`,
//     advisor: "Martin Morris",
//     activeClient: "Yes",
//   },
//   {
//     id: "2",
//     lastName: "van Der Testhuizen",
//     client: "Timmy",
//     partner: "Tammy",
//     status: "Client",
//     lastModified: `${monthDiff(new Date("21 Feb 2007"))} months ago`,
//     advisor: "Martin Morris",
//     activeClient: "No",
//   },
//   {
//     id: "3",
//     lastName: "McTest",
//     client: "Testy",
//     partner: "MrsTesty",
//     status: "Prospect",
//     lastModified: `${monthDiff(new Date("21 Feb 2020"))} months ago`,
//     advisor: "Martin Morris",
//     activeClient: "Yes",
//   },
// ];

/* SHAPE of clientsSummary 
[{
  id:"597571aa-ed34-44ff-9603-3b4c92852af0"
  primary: { 
    firstName:"Sean"
    lastName:"Blecher"
    dateOfBirth:"2021-09-07T21:40:08.778Z"
    updatedAt:"2021-09-22T21:41:26.699Z" },
  partner: {
    firstName:"test"
    dateOfBirth:"2021-08-31T21:40:14.529Z"
  }            
}, ...]
*/

const reshapeClientDataForTable = (clients) => {
  if (!clients) return [];
  else {
    return clients?.map((client, idx) => {
      const updatedAt = client?.updatedAt;
      const lastModified = monthDiff(updatedAt);
      console.log("--- CLIENT LAST UPDATED ---");
      console.log(updatedAt);
      console.log(typeof updatedAt);
      console.log(lastModified);
      console.log(typeof lastModified);
      let activeClient = "No";
      if (Number.isFinite(lastModified)) {
        if (lastModified <= 6) {
          activeClient = "Yes";
        }
      }
      return {
        id: client?.id,
        lastName: client?.primary?.lastName,
        client: client?.primary?.firstName,
        partner: client?.partner?.firstName || "N / A",
        status: client?.status || "Prospect",
        lastModified,
        advisor: client?.advisorName || "Martin Morris",
        activeClient,
      };
    });
  }
};

const ListClients = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const clients = useSelector((state) => state.auth.clients);
  const advisorId = useSelector((state) => state.auth.sub);
  const [clientsData, setClientsData] = useState(undefined);

  useEffect(() => {
    if (clients === undefined) {
      dispatch(getClientsSummary());
      // dispatch(getClients());
    }
  }, []);

  // useEffect(() => {
  //   if (clients) {
  //     setClientsData(reshapeClientDataForTable(clients));
  //   }
  // }, [clients]);

  useEffect(() => {
    if (clients !== undefined) {
      const client_data = reshapeClientDataForTable(clients);
      setClientsData((prevState) => client_data);
    }
  }, [clients]);

  return (
    <>
      <div className="card p-shadow-22">
        <button
          onClick={() => {
            setClientsData([]);
            dispatch(getClientsSummary());
          }}
          style={{ border: "none" }}
        >
          Refresh
        </button>
        <DataTable
          value={clientsData}
          sortMode="multiple"
          paginator
          rows={8}
          className="p-datatable-striped p-datatable-sm"
        >
          <Column
            field="lastName"
            header="Surname"
            sortable
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search by surname"
          ></Column>
          <Column
            field="client"
            header="Client"
            sortable
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search by name"
          ></Column>
          <Column field="partner" header="Partner" sortable></Column>
          <Column field="status" header="Status" sortable></Column>
          <Column field="lastModified" header="Last Modified" sortable></Column>
          <Column field="activeClient" header="Active" sortable></Column>
          <Column field="advisor" header="Advisor" sortable></Column>
          {/* <Column
            header="Delete Client"
            body={deleteBodyTemplate.bind(null, dispatch)}
          ></Column> */}
          <Column
            header="Actions"
            body={actionsBodyTemplate.bind(null, dispatch, advisorId, router)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default ListClients;

const setActiveClient = (clientData) => {
  // console.log("--- SETTING ACTIVE CLIENT WITH ---");
  // console.log(clientData);
  const childNames = clientData?.children?.map((child) => child.firstName);
  return authSliceActions.setAttribute({
    attribute: "activeClient",
    value: {
      lastName: clientData?.primary?.lastName || "Unknown Last Name",
      primary: clientData?.primary?.firstName || "Unnamed Client",
      partner: clientData?.partner?.firstName || "Unnamed Partner",
      children: childNames || [],
      activeMember: clientData?.primary?.lastName || "Unknown Last Name",
      id: clientData?.id,
    },
  });
};

const actionsBodyTemplate = (
  dispatch,
  advisorId,
  router,
  rowData,
  metadata
) => {
  // console.log(rowData);
  const clientData = {};
  const client = rowData?.client;
  const partner = rowData?.partner;
  const hasPartner = !(partner === "N / A");
  const lastName = rowData?.lastName;
  const id = rowData?.id;
  clientData["id"] = id;
  clientData["primary"] = {
    firstName: client,
    lastName: lastName,
  }; //{ firstName: rowData?.rowData?.};
  if (hasPartner) {
    clientData["partner"] = { firstName: partner };
  }
  //dispatch(setActiveClient(clientData));
  return (
    <div
      style={{
        borderRadius: "25px",
        backgroundColor: "rgba(245,245,245,.5)",
        padding: "1.35rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        justifyItems: "space-evenly",
        alignItems: "space-evenly",
        alignContent: "space-evently",
      }}
    >
      <Button
        icon="pi pi-check"
        tooltip={"Set as Active Client"}
        className="p-button-rounded p-button-success"
        style={{ marginRight: "0.25rem" }}
        onClick={() => {
          console.log("--- SETTING ACTIVE CLIENT ---");
          console.log(clientData?.id);
          console.log(clientData);
          dispatch(setActiveClient(clientData));
        }}
      />
      <Button
        icon="pi pi-upload"
        tooltip={"Load Client in Fact Find"}
        className="p-button-rounded p-button-primary"
        style={{ marginRight: "0.25rem" }}
        onClick={() => {
          // console.log("CLICKED LAUNCH FF FOR CLIENT");
          // dispatch(getClientSetActive(id));
          dispatch(setActiveClient(clientData));
          router.push(`/auth/${advisorId}/ff/${id}`);
        }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-warning"
        tooltip={"Delete Client"}
        onClick={() => {
          console.log("CLICKED DELETE");
          if (id) {
            dispatch(deleteExistingClient(id));
          }
        }}
      />
    </div>
  );
};

// const deleteBodyTemplate = (dispatch, fieldType, rowData) => {
//   const id = rowData?.rowData?.id;
//   console.log(id);
//   return (
//     <Button
//       icon="pi pi-trash"
//       className="p-button-rounded p-button-warning"
//       onClick={() => {
//         console.log("CLICKED DELETE");
//         if (id) {
//           dispatch(deleteExistingClient(id));
//         }
//       }}
//     />
//   );
// };
