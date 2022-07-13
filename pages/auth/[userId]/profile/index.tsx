// import { Auth } from "aws-amplify";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import AdvisorLayout from "../../../../components/ui/adviser-layout";
import Profile from "../../../../components/advisor/admin/profile";
// import { signIn, signOut, useSession } from "next-auth/client";
// import { Result } from "antd";
// import { Button } from "primereact/button";
// import { getAdvisor } from "../../../store/auth";
// import { uiSliceActions } from "../../../store/ui";
// import router from "next/router";

const ProfilePage = (props) => {
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
      <Profile />
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

export default ProfilePage;
