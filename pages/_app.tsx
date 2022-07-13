import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "antd/dist/antd.css";
import "react-phone-number-input/style.css";
// import "react-datasheet/lib/react-datasheet.css";

import PrimeReact from "primereact/api";
// import { Ripple } from "primereact/ripple";
PrimeReact.ripple = true;

// primereact / resources / themes / bootstrap4 - light - blue / theme.css;
// primereact / resources / themes / bootstrap4 - light - purple / theme.css;
// primereact / resources / themes / bootstrap4 - dark - blue / theme.css;
// primereact / resources / themes / bootstrap4 - dark - purple / theme.css;
// primereact / resources / themes / md - light - indigo / theme.css;
// primereact / resources / themes / md - light - deeppurple / theme.css;
// primereact / resources / themes / md - dark - indigo / theme.css;
// primereact / resources / themes / md - dark - deeppurple / theme.css;
// primereact / resources / themes / mdc - light - indigo / theme.css;
// primereact / resources / themes / mdc - light - deeppurple / theme.css;
// primereact / resources / themes / mdc - dark - indigo / theme.css;
// primereact / resources / themes / mdc - dark - deeppurple / theme.css;
// primereact / resources / themes / fluent - light / theme.css;
// primereact / resources / themes / saga - blue / theme.css;
// primereact / resources / themes / saga - green / theme.css;
// primereact / resources / themes / saga - orange / theme.css;
// primereact / resources / themes / saga - purple / theme.css;
// primereact / resources / themes / vela - blue / theme.css;
// primereact / resources / themes / vela - green / theme.css;
// primereact / resources / themes / vela - orange / theme.css;
// primereact / resources / themes / vela - purple / theme.css;
// primereact / resources / themes / arya - blue / theme.css;
// primereact / resources / themes / arya - green / theme.css;
// primereact / resources / themes / arya - orange / theme.css;
// primereact / resources / themes / arya - purple / theme.css;
// primereact / resources / themes / nova / theme.css;
// primereact / resources / themes / nova - alt / theme.css;
// primereact / resources / themes / nova - accent / theme.css;
// primereact / resources / themes / nova - vue / theme.css;
// primereact / resources / themes / luna - amber / theme.css;
// primereact / resources / themes / luna - blue / theme.css;
// primereact / resources / themes / luna - green / theme.css;
// primereact / resources / themes / luna - pink / theme.css;
// primereact / resources / themes / rhea / theme.css;

import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/ui/layout";
import { Provider } from "react-redux";
import {
  Provider as AuthProvider,
  useSession,
  signIn,
  signOut,
} from "next-auth/client";
import store from "../store/index";

import Amplify from "aws-amplify";
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

// import { withAuthenticator } from "@aws-amplify/ui-react";
// import {
//   Authenticator,
//   SignIn,
//   SignUp,
//   ConfirmSignUp,
//   Greetings,
// } from "aws-amplify-react";

// const AlwaysOn = (props) => {
//   return (
//     <div>
//       <div>I am always here to show current auth state: {props.authState}</div>
//       <button onClick={() => props.onStateChange("signUp")}>
//         Show Sign Up
//       </button>
//     </div>
//   );
// };

// const handleAuthStateChange = (state) => {
//   console.log(state);
//   if (state === "signedIn") {
//     /* Do something when the user has signed-in */
//   }
// };

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );

  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </AuthProvider>
  );

  // return (
  //   <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
  //     <SignIn />
  //     <SignUp />
  //     <ConfirmSignUp />
  //     <Greetings />
  //     <AlwaysOn />
  //     <Provider store={store}>
  //       <Layout>
  //         <Component {...pageProps} />
  //       </Layout>
  //     </Provider>
  //   </Authenticator>
  // );
}
export default MyApp;

function Auth({ children }) {
  const [session, loading] = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}

// import {
//   ConfirmSignIn,
//   ConfirmSignUp,
//   ForgotPassword,
//   RequireNewPassword,
//   SignIn,
//   SignUp,
//   VerifyContact,
//   withAuthenticator,
// } from "aws-amplify-react";

// export default withAuthenticator(App, false, [
//   <MySignIn/>,
//   <ConfirmSignIn/>,
//   <VerifyContact/>,
//   <SignUp/>,
//   <ConfirmSignUp/>,
//   <ForgotPassword/>,
//   <RequireNewPassword />
// ]);
//  , MyTheme);
