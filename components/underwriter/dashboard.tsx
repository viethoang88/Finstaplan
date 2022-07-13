import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "antd";
import TopNav from "./top-nav";
import FormContainer from "./form-container";
import Requests from "./requests";
import { getUnderwriter } from "../../src/graphql/queries";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { getUnderwriterById } from "./create";

const { Header, Content, Footer } = Layout;

const DUMMY_DATA = [
  {
    id: "1",
    dateCreated: new Date(),
    status: "New",
    advisorName: "Martin Morris",
    dealerGroup: "Madison Financial",
    clientName: "Dummy Client",
    dob: new Date("1987-07-09"),
    gender: "Male",
    coverRequired: {
      life: 287523,
      tpd: 323555,
      ip: 67666,
      trauma: 55341,
    },
  },
  {
    id: "2",
    dateCreated: new Date(),
    status: "New",
    advisorName: "Martin Morris",
    dealerGroup: "Madison Financial",
    clientName: "Timmy Test",
    dob: new Date("1957-09-09"),
    gender: "Male",
    coverRequired: {
      life: 287523,
      tpd: 323555,
      ip: 67666,
      trauma: 55341,
    },
  },
  {
    id: "3",
    dateCreated: new Date(),
    status: "Pending",
    advisorName: "Martin Morris",
    dealerGroup: "Madison Financial",
    clientName: "Tammy Test",
    dob: new Date("1971-07-09"),
    gender: "Female",
    coverRequired: {
      life: 287523,
      tpd: 323555,
      ip: 67666,
      trauma: 55341,
    },
  },
  {
    id: "4",
    dateCreated: new Date(),
    status: "Pending",
    advisorName: "Martin Morris",
    dealerGroup: "Madison Financial",
    clientName: "Tony Testerson",
    dob: new Date("1980-07-09"),
    gender: "Male",
    coverRequired: {
      life: 287523,
      tpd: 323555,
      ip: 67666,
      trauma: 55341,
    },
  },
  {
    id: "5",
    dateCreated: new Date(),
    status: "Completed",
    advisorName: "Martin Morris",
    dealerGroup: "Madison Financial",
    clientName: "Tina Testerson",
    dob: new Date("1980-07-09"),
    gender: "Female",
    coverRequired: {
      life: 287523,
      tpd: 323555,
      ip: 67666,
      trauma: 55341,
    },
  },
];

const fetchUwQuery = `
query GetUnderwriter($id: ID!) {
  getUnderwriter(id: $id) {
    id
    email
    password
    firstName
    lastName
    employerName
    businessNumber
    mobile
    phone
    status
    preassessments {
      items {
        id
        clientID
        advisorID
        underwriterID
        preassessmentID
        createdAt
        updatedAt
        preassessment {
          advisorName
          dealerGroup
          clientName
          dob
          gender
          healthInfo
          preassessmentData
          attachments        
        }
      }
      nextToken
    }
    preassessmentResponses {
      items {
        id
        clientID
        advisorID
        underwriterID
        preassessmentID
      }
      nextToken
    }
  }
}
`;

/*
INPUT (type PreassessmentUnderwriter): {
  advisorID: "bc4c479d-aa16-4d93-a487-f370c0566c46"
  clientID: "a96546c3-5c8e-4c73-b283-0e7dc36de770"
  createdAt: "2021-12-01T01:36:56.536Z"
  id: "f7674aa0-627d-4dbc-a3fe-5729dceff190"
  preassessmentID: "522e42e0-53ec-4636-b121-b565f713b987"
  underwriterID: "436a2fbb-7cfb-4cf7-9af4-de6fe2ec9773"
  updatedAt: "2021-12-01T01:36:56.536Z"
  preassessment:
    advisorName: "Martin Morris"
    attachments: null
    clientName: "Demo Client"
    dealerGroup: "Madison Financial Group"
    dob: "1979-06-24T14:00:00.000Z"
    gender: "male"
    healthInfo: "{"primary":[{"question":"How would you describe your health?","options":[{"label":"Excellent","value":"Excellent"},{"label":"Very Good","value":"Very Good"},{"label":"Good","value":"Good"},{"label":"Fair","value":"Fair"},{"label":"Poor","value":"Poor"},{"label":"Health concerns","value":"Health concerns"},{"label":"Congenital condition","value":"Congenital condition"},{"label":"Would rather not say","value":"Would rather not say"}],"type":"radio","selected":null},{"question":"What is your height?","type":"text","selected":""},{"question":"What is your weight?","type":"text","selected":""},{"question":"Do you smoke?","options":[{"label":"Smoker","value":"Smoker"},{"label":"Non-smoker","value":"Non-smoker"}],"type":"select","selected":"Smoker"},{"question":"How many cigarettes per day?","conditional":"Smoker","type":"number","selected":3,"hideInitially":true},{"question":"Do you drink alcohol?","options":[{"label":"Yes","value":"Yes"},{"label":"No","value":"No"}],"type":"select","selected":"Yes"},{"question":"How many standard drinks per day?","conditional":"Yes","type":"number","selected":0,"hideInitially":true},{"question":"Are you presently or do you intend to receive treatment for any medical issue?","options":[{"label":"Yes","value":"Yes"},{"label":"No","value":"No"}],"type":"radio","selected":"Yes"},{"question":"What is the issue?","conditional":"Yes","type":"text","selected":"High blood pressure, cholesterol, breast cancer, knee operation, hip operation, ankle operation, shoulder operation, ulcers,","hideInitially":true},{"question":"Have you been diagnosed with any significant illness or illnesses in the last five years?","options":[{"label":"Yes","value":"Yes"},{"label":"No","value":"No"}],"type":"radio","selected":"Yes"},{"question":"Please provide details","conditional":"Yes","type":"text","selected":"","hideInitially":true},{"question":"Has any member of your immediate family been diagnosed with any significant illness or illnesses?","options":[{"label":"Yes","value":"Yes"},{"label":"No","value":"No"}],"type":"radio","selected":"Yes"},{"question":"Please provide details","conditional":"Yes","type":"text","selected":"","hideInitially":true},{"question":"Have you ever suffered from any the following?","options":["Anxiety","Depression","Back or neck problems","A heart condition","Cancer"],"type":"checkbox","selected":["Anxiety","Back or neck problems","A heart condition"]},{"question":"Is there a history of any particular illness in your family e.g. diabetis, heart conditions, genetic disorders?","options":[{"label":"Yes","value":"Yes"},{"label":"No","value":"No"}],"type":"radio","selected":"Yes"},{"question":"Which condition(s)?","conditional":"Yes","type":"text","selected":"","hideInitially":true},{"question":"Do you exercise, play any sports or pursue outdoor activities?","options":[{"label":"Yes","value":"Yes"},{"label":"No","value":"No"}],"type":"radio","selected":"Yes"}]}"
    preassessmentData:"{"notes":{"trauma":"d","monthlyIP":"c","tpd":"b","life":"a"},
                      "referenceNumber":{"trauma":"4","monthlyIP":"3","tpd":"2","life":"1"},
                      "generalNotes":{"trauma":"h","monthlyIP":"g","tpd":"f","life":"e"},
                      "coverRequired":{"trauma":75000,"monthlyIP":67000,"tpd":1500000,"life":1200000}}"
}

OUTPUT: 
  {
    id: "4",
    dateCreated: new Date(),
    status: "Pending",
    advisorName: "Martin Morris",
    dealerGroup: "Madison Financial",
    clientName: "Tony Testerson",
    dob: new Date("1980-07-09"),
    gender: "Male",
    coverRequired: {
      life: 287523,
      tpd: 323555,
      ip: 67666,
      trauma: 55341,
    },
    healthInfo: {OBJECT},
    preassessmentData: {OBJECT}    
*/
const capitalize = (word) => {
  return word?.slice(0, 1)?.toUpperCase() + word?.slice(1);
};
const parsePreassessments = (preassessments) => {
  if (preassessments === undefined) return [];
  console.log("--- parsing preassessments ---");
  console.log(preassessments);

  return preassessments?.map(
    ({
      advisorID,
      clientID,
      createdAt,
      id,
      preassessment,
      preassessmentID,
      underwriterID,
      updatedAt,
    }) => {
      let healthInfo;
      let preassessmentData;
      console.log(id);
      console.log(advisorID);
      console.log(clientID);
      console.log(createdAt);
      console.log(preassessment);
      console.log(preassessmentID);
      console.log(underwriterID);
      console.log(updatedAt);

      try {
        healthInfo = JSON.parse(preassessment.healthInfo);
      } catch (e) {
        healthInfo = {};
      }
      try {
        preassessmentData = JSON.parse(preassessment.preassessmentData);
      } catch (e) {
        preassessmentData = {};
      }
      return {
        id: id,
        advisorID: advisorID,
        clientID: clientID,
        preassessmentID: preassessmentID,
        underwriterID: underwriterID,
        dateCreated: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        status: "Pending",
        advisorName: preassessment.advisorName,
        dealerGroup: preassessment.dealerGroup,
        clientName: preassessment.clientName,
        dob: new Date(preassessment.dob),
        gender: capitalize(preassessment.gender),
        coverRequired: preassessmentData?.coverRequired,
        notes: preassessmentData?.notes,
        referenceNumber: preassessmentData?.referenceNumber,
        generalNotes: preassessmentData?.generalNotes,
        healthInfo,
      };
    }
  );
};

const fetchUnderwriter = async (id, setter, setPreassessments) => {
  const inputs = {
    id:
      id === undefined || id === ""
        ? "436a2fbb-7cfb-4cf7-9af4-de6fe2ec9773"
        : id,
  };
  console.log("--- FETCHING UNDERWRITER WITH ID ---");
  console.log(id);
  console.log(inputs);
  // const underwriter = await getUnderwriterById(id);
  try {
    const underwriter = await API.graphql(
      // graphqlOperation(getUnderwriter, inputs)
      graphqlOperation(fetchUwQuery, inputs)
    );
    console.log("--- FETCHING UW SUCCESSFUL ---");
    console.log(underwriter);
    console.log();
    const parsedPreassessments = parsePreassessments(
      underwriter?.data?.getUnderwriter?.preassessments?.items
    );
    console.log("--- PARSED PREASSESSMENTS ---");
    console.log(parsedPreassessments);
    setPreassessments(parsedPreassessments);
    // TODO:
    const parsedResponses = undefined; //  underwriter?.data?.getUnderwriter?.preassessmentResponses?.items;
    const uw = {
      ...underwriter?.data?.getUnderwriter,
      preassessments: undefined,
      preassessmentResponses: undefined,
    };
    setter(uw);
  } catch (e) {
    console.log("--- FETCHING UW FAILED ---");
    console.log(e);
  }
};

const UnderwriterDashboard = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [advisor, setAdvisor] = useState({});
  const [clients, setClients] = useState(DUMMY_DATA);
  const [activeClient, setActiveClient] = useState(undefined);
  const [selectedClientId, setSelectedClientId] = useState();
  const [uwObject, setUwObject] = useState();
  const [preassessments, setPreassessments] = useState([]);

  useEffect(() => {
    console.log(router);
    console.log(router.query);
    console.log(router.query.id);
    // const { id } = router.query;
    if (router.query.id !== undefined) {
      const id = router.query.id;
      setId(id);
      fetchUnderwriter(id, setUwObject, setPreassessments);
    } else {
      setId("436a2fbb-7cfb-4cf7-9af4-de6fe2ec9773");
      fetchUnderwriter(id, setUwObject, setPreassessments);
    }
  }, []);

  useEffect(() => {
    console.log("--- UPDATING PREASSESSMENTS ---");
    console.log([...DUMMY_DATA, ...preassessments]);
    setClients((prevState) => [...DUMMY_DATA, ...preassessments]);
  }, [preassessments]);

  useEffect(() => {
    if (clients !== undefined && selectedClientId?.[0]) {
      const ac = clients.find((client) => client.id === selectedClientId[0]);
      setActiveClient(ac);
      console.log(ac);
    }
  }, [selectedClientId]);

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          {/* <Header className="site-layout-background" style={{ padding: 0 }}> */}
          <TopNav firstName={"Sean"} setActiveClient={setActiveClient} />
          {/* </Header> */}
          <Content style={{ margin: "0 16px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <div
                style={{
                  opacity: activeClient === undefined ? 1 : 0,
                  position:
                    activeClient === undefined ? "relative" : "absolute",
                }}
              >
                <Requests
                  setSelectedClientId={setSelectedClientId}
                  clientData={clients}
                />
              </div>
              {activeClient !== undefined && (
                <div>
                  <FormContainer
                    activeClient={activeClient}
                    underwriter={uwObject}
                  />
                </div>
              )}
            </div>
          </Content>

          <Footer style={{ textAlign: "center" }}>Finstaplan ©2021</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default UnderwriterDashboard;
