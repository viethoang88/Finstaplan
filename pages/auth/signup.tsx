import SignUpForm from "../../components/auth/signup-form";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  RequireNewPassword,
  SignIn,
  SignUp,
  VerifyContact,
  withAuthenticator,
} from "aws-amplify-react";

// /*
// returns: {
//     user: CognitoUser;
//     userConfirmed: boolean;
//     userSub: string // <- UUID (universally unique id of user)
// }
// */

async function signUp(email, password) {
  try {
    const { user, userSub, userConfirmed } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      },
    });
    console.log(user);
    console.log(userSub);
    console.log(userConfirmed);
    return { user, userSub, userConfirmed };
  } catch (error) {
    console.log("error signing up:", error);
    return { error };
  }
}

const styles = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  justifyItems: "center",
};

const SignUpPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const onSubmitHandler = async () => {
    console.log(password, email, acceptTerms);
    const res = await signUp(email, password);
    if (res.error) {
      throw res.error;
    } else {
      console.log("SUCCESS");
      router.push("/auth/login");
    }
    // return new Promise((res, rej) => {
    //   setTimeout(() => res("HI"), 5000);
    // });
  };

  return (
    <div style={styles}>
      <SignUpForm
        password={password}
        email={email}
        acceptTerms={acceptTerms}
        onEmailChange={(val) => setEmail(val.target.value)}
        onPasswordChange={(val) => setPassword(val.target.value)}
        onAcceptTermsChange={(val) => setAcceptTerms(val)}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};

export default SignUpPage;
