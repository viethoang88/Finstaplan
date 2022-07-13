export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
};

// REQUIRES: clientData, philosophies, assumptions:
async function handler(req, res) {
  console.log("--- IN INSURANCE HANDLER ---");
  if (req.method === "POST") {
    const { clientData, assumptions, philosophies } = JSON.parse(req.body);

    // console.log("--- READY TO MAKE REQUEST WITH ---");
    // console.log(clientData);
    // console.log(assumptions);
    // console.log(philosophies);

    // NOT NEEDED: python backend does this:
    // const reshapedAssumptions = DataManager.reshapeAssumtions(assumptions);
    // const data = { client, assumptions: reshapedAssumptions, philosophies };
    //  const allowedOrigins = [
    //    "http://127.0.0.1:8020",
    //    "http://localhost:8020",
    //    "http://127.0.0.1:9000",
    //    "http://localhost:9000",
    //  ];

    const url =
      "https://9ec580v6xi.execute-api.us-east-1.amazonaws.com/Prod/hello/";

    const data = {
      clientData,
      assumptions,
      philosophies,
    };

    console.log("--- next api SUBMITTING API REQUEST WITH ---");
    console.log(data);

    const resp = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    try {
      const data = await resp.json();
      console.log("---- PYTHON LAMBDA SENT BACK DATA ----");
      console.log(data);
      console.log("---- SETTING HEADERS ----");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", true);
      return res.json(data);
    } catch (err) {
      console.log("---- SOMETHING WENT WRONG ----");
      console.error(err);
      return res.json({ error: err });
    }
  }
}

async function handler2(req, res) {
  if (req.method === "POST") {
    const { clientData, assumptions, philosophies } = req.body;

    // NOT NEEDED: python backend does this:
    // const reshapedAssumptions = DataManager.reshapeAssumtions(assumptions);
    // const data = { client, assumptions: reshapedAssumptions, philosophies };
    //  const allowedOrigins = [
    //    "http://127.0.0.1:8020",
    //    "http://localhost:8020",
    //    "http://127.0.0.1:9000",
    //    "http://localhost:9000",
    //  ];

    const url =
      "https://9ec580v6xi.execute-api.us-east-1.amazonaws.com/Prod/hello/";

    const data = {
      clientData,
      assumptions,
      philosophies,
    };

    console.log("--- READY TO MAKE REQUEST WITH ---");
    console.log(data);
    const testData = {
      hi: "bye",
    };
    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((resp) => resp.json()) // parses JSON response into native JavaScript objects)
      .then((data) => {
        // const origin = req.headers.origin;
        // if (allowedOrigins.includes(origin)) {
        //   res.setHeader("Access-Control-Allow-Origin", origin);
        // }
        console.log("---- PYTHON LAMBDA SENT BACK DATA ----");
        console.log(data);
        console.log("---- SETTING HEADERS ----");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        console.log("---- HEADERS SET ----");
        return res.json(data);
      })
      .catch((err) => {
        console.log("---- SOMETHING WENT WRONG ----");
        console.error(err);
      });
  }
}

export default handler;
