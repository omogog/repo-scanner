import { Config } from "apollo-server";
import { config as loadEnv } from "dotenv";
import { createAppConfig } from "../../../infrastructure/configs/createAppConfig";
import { typeDefs } from "./types";
import { resolvers } from "./resolvers";
import { validateToken } from "../../middleware/TokenValidation";

loadEnv();

const { listRepositories, getRepositoryDetails } = createAppConfig();

export const apolloConfig: Config = {
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    await validateToken(token);

    return {
      dataSources: {
        listRepositories,
        getRepositoryDetails,
      },
      token,
    };
  },
  formatError: (error) => {
    const { message} = error;
    return { message };
  },
  persistedQueries: false,
  introspection: process.env.NODE_ENV !== "production", // Enable introspection in non-production environments
};