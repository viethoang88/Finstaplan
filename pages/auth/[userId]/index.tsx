import { Auth } from "aws-amplify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdvisorLayout from "../../../components/ui/adviser-layout";
import { signIn, signOut, useSession } from "next-auth/client";
import { Result } from "antd";
import { Button } from "primereact/button";
import { getAdvisor } from "../../../store/auth";
import { uiSliceActions } from "../../../store/ui";
import router from "next/router";

const AuthHomePage = (props) => {
  const dispatch = useDispatch();
  const advisorId = useSelector((state) => state.auth.sub);
  const advisor = useSelector((state) => state.auth);
  console.log(advisor);

  // useEffect(() => {
  //   Auth.currentSession().then((session) => {
  //     console.log(session);
  //   });
  //   Auth.currentUserInfo().then((userInfo) => {
  //     console.log(userInfo);
  //   });
  //   Auth.currentUserPoolUser().then((userInfo) => {
  //     console.log(userInfo);
  //   });
  //   Auth.currentUserCredentials().then((userInfo) => {
  //     console.log(userInfo);
  //   });
  //   // returns Promise<CognitoUser></CognitoUser>
  //   Auth.currentAuthenticatedUser().then(async (userInfo) => {
  //     let user = userInfo;
  //     let userAttributes = await Auth.userAttributes(user);
  //     console.log(userAttributes);
  //   });
  // }, []);
  return (
    <AdvisorLayout>
      <Result
        status="success"
        title="Welcome to Finstaplan!"
        subTitle="Select a client, view clients or create a client to continue"
        style={{
          backgroundColor: "white",
          boxShadow:
            "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
        }}
        className={"p-shadow-23"}
        extra={[
          <Button
            icon={"pi pi-user-plus"}
            label={"Create new client"}
            className="p-button-raised"
            onClick={
              () =>
                dispatch(
                  uiSliceActions.setAttribute({
                    attribute: "showNewClientModal",
                    newValue: true,
                  })
                )
              // dispatch(getAdvisor({ sub: advisor.sub, email: advisor.email }))
            }
          ></Button>,
          <Button
            icon={"pi pi-users"}
            label={"View clients"}
            className="p-button-raised p-button-warning"
            onClick={() => router.push(`/auth/${advisorId}/clients`)}
          ></Button>,
        ]}
      />
    </AdvisorLayout>
  );
};

/*
export async function getServerSideProps(context) {
  console.log(context);
  let session;

  Auth.currentSession()
    .then((session) => {
      console.log(session);
      session = session;
    })
    .catch((e) => console.log(e));

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/auth/login",
  //       permanent: false,
  //     },
  //   };
  // }
  // useEffect(() => {
  //   Auth.currentSession().then((session) => {
  //     console.log(session);
  //   });
  //   Auth.currentUserInfo().then((userInfo) => {
  //     console.log(userInfo);
  //   });
  //   Auth.currentUserPoolUser().then((userInfo) => {
  //     console.log(userInfo);
  //   });
  //   Auth.currentUserCredentials().then((userInfo) => {
  //     console.log(userInfo);
  //   });
  //   // returns Promise<CognitoUser></CognitoUser>
  //   Auth.currentAuthenticatedUser().then(async (userInfo) => {
  //     let user = userInfo;
  //     let userAttributes = await Auth.userAttributes(user);
  //     console.log(userAttributes);
  //   });
  // }, []);

  return {
    props: { session }, // Will be passed to the page component as props
  };
}
*/

export default AuthHomePage;
