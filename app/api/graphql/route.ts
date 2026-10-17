import { createYoga } from "graphql-yoga";
import { schema, type GraphQLContext } from "@/lib/graphql/schema";

const { handleRequest } = createYoga<object, GraphQLContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: ({ request }) => {
    const match = request.headers.get("cookie")?.match(/(?:^|;\s*)cp_uid=([^;]+)/);
    return { uid: match ? decodeURIComponent(match[1]) : null };
  },
});

export { handleRequest as GET, handleRequest as POST };
