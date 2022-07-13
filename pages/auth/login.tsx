import LoginForm from "../../components/auth/login-form";
import { useRouter } from "next/router";
// AWS COGNITO IMPORTS HERE...
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { signIn, useSession, getSession } from "next-auth/client";
import { useDispatch, useSelector } from "react-redux";
import { authSliceActions, asyncLogin } from "../../store/auth";

const styles = {
  position: "absolute",
  top: 0,
  left: 0,
};

const LoginPage = (props) => {
  // const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const router = useRouter();
  const dispatch = useDispatch();

  const sub = useSelector((state) => state.auth.sub);

  // const _getSession = () => {
  //   return getSession().then((session) => {
  //     if (session) {
  //       console.log(session);
  //       // router.replace("/auth/advisor");
  //     } else {
  //       // setIsLoading(false);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   console.log(session);
  //   console.log(loading);
  //   if (session) {
  //     dispatch(
  //       authSliceActions.setAttribute({ attribute: "sub", value: session.sub })
  //     );
  //     dispatch(
  //       authSliceActions.setAttribute({
  //         attribute: "email",
  //         value: session.email,
  //       })
  //     );
  //     dispatch(asyncLogin(credentials));
  //     router.push(`/auth/${session.sub}`);
  //   }
  //   // _getSession();
  // }, [session]);

  useEffect(() => {
    console.log("SUB FROM EFFECT");
    console.log(sub);
    if (sub !== null) {
      console.log("GOING TO LOGGED IN PAGE");
      router.push(`/auth/[userId]`, `/auth/${sub}`, { shallow: true });
    }
  }, [sub]);

  const onLogin = async (email, password) => {
    setIsLoading(true);
    try {
      dispatch(asyncLogin({ email, password }));
      // setCredentials({ email, password });
      // const res = await signIn("AWS_COGNITO_MANUAL", {
      //   email,
      //   password,
      //   redirect: false,
      // });
      //const res = await Auth.signIn(email, password);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setCredentials({ email: "", password: "" });
    }
  };
  //   useEffect(() => {
  //     getSession().then((session) => {
  //       if (session) {
  //         router.replace("/auth/advisor");
  //       } else {
  //         setIsLoading(false);
  //       }
  //     });
  //   }, [router]);

  return (
    <div style={styles}>
      <LoginForm router={router} onLogin={onLogin} isLoading={isLoading} />
    </div>
  );
};

export default LoginPage;
