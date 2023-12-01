import { globals } from "@/core/globals";
import { graphqlClient } from "../../../client";
import getDynamicPropertyQuery from "./getDynamicProperty.graphql";

export async function getDynamicProperty() {
  const { cultureName } = globals;
  const objectType = "VirtoCommerce.CustomerModule.Core.Model.Organization";
  const { data } = await graphqlClient.query({
    query: getDynamicPropertyQuery,
    variables: {
      cultureName,
      objectType,
    },
  });

  return data.dynamicProperties.items;
}
