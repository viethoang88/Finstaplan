import { Auth, API, graphqlOperation } from "aws-amplify";
import * as queries from "../../src/graphql/queries";
import { listPreassessments } from "../../src/graphql/queries";

export const getPreassessments = async () => {
  const preassessments = await API.graphql(
    graphqlOperation(listPreassessments)
  );
  console.log("--- EXISTING PREASSESSMENTS ---");
  console.log(preassessments);
};
