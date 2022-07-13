/*
- Behaviour: Risk profile assigned by questionnaire 
- Behaviour Modification Loading/Behaviour investment allocation:
e.g. 25% => invested based on risk profile 
     75% => will go towards funding goals 
        - uses the long rows to adjust rate based on 
          allocations which change as goal dates approach

NOTE: any surplus after goal requirements are calculated 
      goes into selected portfolio based on risk profile.          

*/

// - Kinda bugged but still working:
const url =
  "https://51qd9gv8w2.execute-api.us-east-1.amazonaws.com/Prod/goals/";

// - Should be perfect, must test:
// const url =
//   "https://efd1juwsti.execute-api.us-east-1.amazonaws.com/Prod/goals/";

// Requires: "clientData", "behaviouralRate", "portfolios", "clientData", "assignedGoals"
// - clientData: primary.dateOfBirth,
//               partner.dateOfBirth
//               hasPartner
// - behaviouralRate: portfolios[clientPortfolio][returnRate]
// - portfolios: all portfolios
// - assignedGoals: [[portfolioValue, portfolioName, goalsForThatPortfolio], ...]
async function handler(req, res) {
  if (req.method === "POST") {
    const requestBody = JSON.parse(req.body);

    // NOT NEEDED: python backend does this:
    // const reshapedAssumptions = DataManager.reshapeAssumtions(assumptions);
    // const data = { client, assumptions: reshapedAssumptions, philosophies };
    //  const allowedOrigins = [
    //    "http://127.0.0.1:8020",
    //    "http://localhost:8020",
    //    "http://127.0.0.1:9000",
    //    "http://localhost:9000",
    //  ];

    console.log(`--- READY TO MAKE REQUEST to ${url} WITH ---`);
    console.log(requestBody);

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
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
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
    }
  }
}

export default handler;
