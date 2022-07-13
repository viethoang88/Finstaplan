const providers = [
  Providers.Credentials({
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // Here call your API with data passed in the login form
      const token = await loginEndpoint(credentials);

      if (token) {
        return token;
      } else {
        return null;
      }
    },
  }),
];

/*
// // dynamodb adapter: https://next-auth.js.org/adapters/dynamodb
// used by NextAuth
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { Auth, CognitoUser } from "aws-amplify";

const providers = [
  Providers.Cognito({
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
    domain: process.env.COGNITO_DOMAIN,
  }),
  Providers.Credentials({
    id: "AWS_COGNITO_MANUAL",
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: "AWS_COGNITO_MANUAL",
    type: "credentials",
    // type: "oauth",
    // version: "2.0",
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      username: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      console.log(credentials);
      // const { email, password } = req.body;
      const { email, password } = credentials;

      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address)
      try {
        const cognitoUser = await Auth.signIn(email, password);
        // console.log(cognitoUser);
        // const userSession = cognitoUser.signInUserSession;
        // const user = {
        //   sub: cognitoUser.attributes.sub,
        //   email_verified: cognitoUser.attributes.email_verified,
        //   email: cognitoUser.attributes.email,
        //   idToken: userSession.idToken.jwtToken,
        //   refreshToken: userSession.refreshToken.token,
        //   accessToken: userSession.accessToken.jwtToken,
        //   idTokenPayload: userSession.idToken.payload,
        //   accessTokenPayload: userSession.accessToken.payload,
        // };
        return cognitoUser;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    async profile(profile, tokens) {
      // You can use the tokens, in case you want to fetch more profile information
      // For example several OAuth providers do not return email by default.
      // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
      const userAttributes = await Auth.userAttributes(profile);
      console.log(userAttributes);
      return userAttributes;
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  }),
];

// // see: for full list of options: https://next-auth.js.org/configuration/providers
// export default function Cognito(options) {
//   const { domain } = options;
//   return {
//     id: "cognito",
//     name: "Cognito",
//     type: "oauth",
//     version: "2.0",
//     scope: "openid profile email",
//     params: { grant_type: "authorization_code" },
//     accessTokenUrl: `https://${domain}/oauth2/token`,
//     authorizationUrl: `https://${domain}/oauth2/authorize?response_type=code`,
//     profileUrl: `https://${domain}/oauth2/userInfo`,
//     profile(profile, tokens) {
//       return {
//         id: profile.sub,
//         name: profile.username,
//         email: profile.email,
//         image: null,
//       };
//     },
//     ...options,
//   };
// }
*/

// export default NextAuth({
//   session: {
//     jwt: true,
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   // Configure one or more authentication providers
//   providers,
//   // pages: {
//   //   signIn: "/auth/login",
//   //   signOut: "/auth/login",
//   //error: "/auth/error", // Error code passed in query string as ?error=
//   //verifyRequest: "/auth/verify-request", // (used for check email message)
//   //newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
//   //},
//   // A database is optional, but required to persist accounts in a database
//   //database: process.env.DATABASE_URL,
//   callbacks: {
//     /**
//      * @param  {object} user     User object
//      * @param  {object} account  Provider account
//      * @param  {object} profile  Provider profile
//      * @return {boolean|string}  Return `true` to allow sign in
//      *                           Return `false` to deny access
//      *                           Return `string` to redirect to (eg.: "/unauthorized")
//      */
//     async signIn(user, account, profile) {
//       console.log("----SIGNIN----");
//       console.log(user); // => full CognitoUser object.
//       //console.log(account); // => { id: 'AWS_COGNITO_MANUAL', type: 'credentials' }
//       //console.log(profile); //
//       /* [Object: null prototype] {
//         email: 'sean2evo@hotmail.com',
//         password: 'Sean2020',
//         redirect: 'false',
//         csrfToken: '74be66425cd74adcc79912c5e59ac46c1e3f573b30d46f61eeb9311b55e74ee8',
//         callbackUrl: 'http://localhost:3000/auth/login',
//         json: 'true'
//       } */
//       const isAllowedToSignIn = true;
//       if (isAllowedToSignIn) {
//         return true;
//       } else {
//         // Return false to display a default error message
//         return false;
//         // Or you can return a URL to redirect to:
//         // return '/unauthorized'
//       }
//     },
//     /**
//      * @param  {string} url      URL provided as callback URL by the client
//      * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
//      * @return {string}          URL the client will be redirect to
//      */
//     async redirect(url, baseUrl) {
//       console.log("----REDIRECT----");
//       console.log(url);
//       console.log(baseUrl);
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//     /**
//      * @param  {object} session      Session object
//      * @param  {object} token        User object    (if using database sessions)
//      *                               JSON Web Token (if not using database sessions)
//      * @return {object}              Session that will be returned to the client
//      */
//     async session(session, token) {
//       console.log("---SESSION----");
//       console.log(token);
//       session.accessToken = token?.accessToken;
//       session.idToken = token?.idToken;
//       // session.refreshToken = token?.refreshToken;
//       session.sub = token?.sub;
//       session.email = token?.email;
//       return session;
//     },
//     /**
//      * @param  {object}  token     Decrypted JSON Web Token
//      * @param  {object}  user      User object      (only available on sign in)
//      * @param  {object}  account   Provider account (only available on sign in)
//      * @param  {object}  profile   Provider profile (only available on sign in)
//      * @param  {boolean} isNewUser True if new user (only available on sign in)
//      * @return {object}            JSON Web Token that will be saved
//      */
//     async jwt(token, user, account, profile, isNewUser) {
//       console.log("----TOKEN----");
//       delete token["name"];
//       delete token["picture"];
//       console.log(token);
//       console.log(user);
//       // console.log(account);
//       // console.log(profile);
//       // console.log(isNewUser);

//       if (user !== undefined) {
//         const userSession = user.signInUserSession;
//         console.log("----userSession----");
//         console.log(userSession);
//         token.sub = user.attributes.sub;
//         token.email = user.attributes.email;
//         token.idToken = userSession.idToken.jwtToken;
//         token.accessToken = userSession.accessToken.jwtToken;
//         // TOO BIG WITH:
//         // token.refreshToken = userSession.refreshToken.token;
//         // token.idTokenPayload = userSession.idToken.payload;
//         // token.accessTokenPayload = userSession.accessToken.payload;
//         console.log("-----TOKEN AFTER-----");
//         console.log(token);
//       }

//       return token;
//     },
//   },
// });
