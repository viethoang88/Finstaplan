// for npm run dev, npm run export, npm run build and for when the server is hosting the built code:
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require("next/constants");

// ACCESSIBLE ANYWHERE in your next project as process.env.<some-key> on the global process variable.
// - ONLY accessible on server-side code running on nodejs server or at build/dev time,  NOT to client-side bundle.

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.py/,
      use: [],
    });

    return config;
  },
  env: {
    BCRYPT_SALT_ROUNDS: 10,
    BCRYPT_PASS: "3c1943ab-c22a463d-bd2b-729a137c0b09",
    ROOT_URL: "localhost:3000",
    COGNITO_CLIENT_ID: "3rdchfhkdl1gfcv8bd48mjemmj",
    COGNITO_CLIENT_SECRET:
      "1h6n7gl1rsedfh48pnaemosbhelr4l9f2uvaue1d0duafo07t9im",
    COGNITO_DOMAIN: "https://finstaplan-dev.auth.us-east-1.amazoncognito.com",
    DATABASE_URL: "",
    AWS_ACCESS_KEY_ID: "AKIAYAJOP3C3E3F7RUUX",
    AWS_SECRET_ACCESS_KEY: "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",
    SITE_URL: "https://fsta.vercel.app",
    // NEXTAUTH_URL="http://localhost:3000",
  },
};

// module.exports = {
//   env: {
//     mongoDbUsername: "",
//     mongoPassword: "",
//   }
// };

// Can use specific values based on the current phase:
// module.exports = (phase) => {
//   if (phase === PHASE_DEVELOPMENT_SERVER) {
//     return { env: {
//   mongoDbUsername: "",
//   mongoPassword: "",
//   clientId: process.env.COGNITO_CLIENT_ID,
//   clientSecret: process.env.COGNITO_CLIENT_SECRET,
//   domain: process.env.COGNITO_DOMAIN,
//   database: process.env.DATABASE_URL,
//     }
//   }
// }
