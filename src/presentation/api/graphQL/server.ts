import { Config } from 'apollo-server';
import { config } from 'dotenv';
import { createAppConfig } from '../../../infrastructure/config/createAppConfig';
import { typeDefs } from './types';
import { resolvers } from './resolvers';

config();

const { listRepositories, getRepositoryDetails } = createAppConfig();

const apolloConfig: Config = {
  typeDefs,
  resolvers,
  introspection: true,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    // implemented introspection only for dev purposes
    const isIntrospection =
      req.body?.query?.includes('__schema') ||
      req.body?.query?.includes('__type');

    if (!token && !isIntrospection) {
      throw new Error('Authorization token is required');
    }

    return {
      dataSources: {
        listRepositories,
        getRepositoryDetails,
      },
      token: isIntrospection ? null : token,
    };
  },
  formatError: (error) => {
    const { message, locations, path, extensions } = error;
    return { message, locations, path, extensions };
  },
};

export { apolloConfig };
