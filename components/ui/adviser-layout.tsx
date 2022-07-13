import SideNav from "./side-nav";
import TopNav from "./top-nav";
import { Auth, Amplify } from "aws-amplify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Layout, Breadcrumb } from "antd";
const { Header, Content, Footer } = Layout;
import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import AdvisorDataManager from "./advisor-data-manager";
import ClientDataManager from "./ff-data-manager";
import {
  getAdvisor,
  authSliceActions,
  createNewClient,
  getClients,
  getClientsSummary,
  updateExistingClientSection,
} from "../../store/auth";

import { tjaart } from "../../dummy_data/client-examples";

// import RenderToPdf from "../../helpers/render-to-pdf3";

export const getScopingDocument = async (advisorId, clientData) => {
  if (clientData === undefined) return;
  console.log(JSON.stringify(clientData));
  //const _clientData = convertClientDataToDb(advisorId, clientData);
  //console.log(JSON.stringify(_clientData));
  const url = `/api/documents/scoping-document`;
  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(clientData), // body data type must match "Content-Type" header
  })
    .then((res) => res.blob())
    .then((blob) => {
      //var file = window.URL.createObjectURL(blob);
      //window.location.assign(file);

      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "scoping-document.pdf";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    })
    // .then((data) => console.log(data))
    .catch((err) => console.error(err));
};

const AdvisorLayout = (props) => {
  const [renderedPdfJSX, setRenderedPdfJSX] = useState();
  const router = useRouter();
  const user = useSelector((state) => state.auth);
  const sub = useSelector((state) => state.auth.sub);
  const email = useSelector((state) => state.auth.email);

  // FOR TESTING:
  // const clientData = tjaart;
  const clientData = useSelector((state) => state.factFind);

  const dispatch = useDispatch();

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  const _getAdvisor = () => {
    if (sub !== null && email !== null) {
      dispatch(getAdvisor({ email, sub }));
    } else {
      Auth.currentAuthenticatedUser().then(async (userInfo) => {
        let user = userInfo;
        //let userAttributes = await Auth.userAttributes(user);
        const sub = user?.attributes?.sub;
        const email = user?.attributes?.email;
        console.log(user);
        //  console.log(userAttributes);
        if (sub && email) {
          dispatch(getAdvisor({ email, sub }));
        }
      });
    }
  };
  // if (!session) {
  //   // return <button onClick={() => signIn()}>Sign in</button>;
  //   router.push("/auth/login");
  // }
  useEffect(() => {
    // Auth.currentSession().then((session) => {
    //   console.log(session);
    // });
    // Auth.currentUserInfo().then((userInfo) => {
    //   console.log(userInfo);
    // });
    // Auth.currentUserPoolUser().then((userInfo) => {
    //   console.log(userInfo);
    // });
    // Auth.currentUserCredentials().then((userInfo) => {
    //   console.log(userInfo);
    // });
    // // returns Promise<CognitoUser></CognitoUser>
    Auth.currentAuthenticatedUser().then(async (userInfo) => {
      let user = userInfo;
      // let userAttributes = await Auth.userAttributes(user);

      const sub = user?.attributes?.sub;
      const email = user?.attributes?.email;
      dispatch(
        authSliceActions.setAttributes({
          sub,
          email,
          cognitoUser: user,
        })
      );
      console.log(user);
      // console.log(userAttributes);
      dispatch(getAdvisor({ email, sub }));
    });
  }, []);

  // // dispatch(createNewClient(sub, tjaart))}>
  //"Variable 'advisors' has an invalid value. Unable to parse [] as valid JSON.";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdvisorDataManager advisorId={sub} />
      <ClientDataManager />
      <SideNav />
      <Layout className="site-layout">
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <TopNav />
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <div>{props.children}</div>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          {/* <button
            onClick={() => {
              //getScopingDocument(sub, tjaart)}
              const renderedPdfJSX = renderToPdf(clientData);
              // console.log(renderedPdfJSX);
              // setRenderedPdfJSX(renderedPdfJSX);
            }}
          >
            SCOPING DOCUMENT
          </button> */}
          {/* <div>
            SCOPING DOCUMENT: <RenderToPdf clientData={clientData} />
          </div> */}
          {/* <button onClick={() => _getAdvisor()}>GET ADVISOR</button>
          <button onClick={() => dispatch(createNewClient(sub, tjaart))}>
            CREATE CLIENT
          </button>
          <button onClick={() => dispatch(getClients())}>GET CLIENTS</button>
          <button onClick={() => dispatch(getClientsSummary())}>
            GET CLIENTS SUMMARY
          </button>

          <button
            onClick={() => {
              console.log("---- YOU CLICKED MEEEEE ----");
              // dispatch(
              //   updateExistingClientSection(
              //     _clientId,
              //     _payload,
              //     ["partner", "authorities"],
              //     "[]"
              //   )
              // );
              dispatch(
                updateExistingClientSection(
                  _clientId,
                  _goalPayload,
                  ["goals"],
                  "[]"
                )
              );
            }}
          >
            EDIT CLIENT WITH OBJECT
          </button> */}
          Finstaplan ©2021
          {/* <div>{renderedPdfJSX}</div> */}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdvisorLayout;

const _clientId = "7cb90e07-1d03-417f-97da-7d15cff1cc4d";
const _payload = {
  partner: {
    firstName: "Casey",
    lastName: "Test-Case",
    authorities: [
      {
        planType: "investment",
        company: "OtherCompany",
        referenceNumber: "7654321",
        estimatedValue: 50000,
        id: "ejtg",
        firstName: "Casey",
        authorityGranted: "asAdvisor",
      },
    ],
  },
};
const _goalPayload = {
  goals: [
    {
      goalFrequency: "yearly",

      when: "date",
      date: "2022-05-1T05:24:55.824Z",
      dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
      age: 65,
      estimateType: "PV",
      estimatedCost: 120000,
      goalType: "monetary",
      priority: 2,
      numTimes: 29,
      goal: "Retirement Income",
    },
    {
      goalFrequency: "onceOff",

      when: "date",
      date: "2030-05-1T05:24:55.824Z",
      dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
      age: 65,
      estimateType: "PV",
      estimatedCost: 120000,
      goalType: "monetary",
      priority: 1,
      goal: "Buy a Racehorse",
    },
    {
      goalFrequency: "onceOff",

      when: "date",
      date: "2030-05-1T05:24:55.824Z",
      dateRange: ["2021-09-19T05:28:05.535Z", "2021-10-06T04:28:05.535Z"],
      age: 65,
      estimateType: "PV",
      estimatedCost: 120000,
      goalType: "monetary",
      priority: 3,
      goal: "Buy New Car",
    },
  ],
};
