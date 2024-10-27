export const resolvers = {
  Query: {
    listRepositories: async (_, __, { dataSources, token }) => {
      return await dataSources.listRepositories.execute(token);
    },
    getRepositoryDetails: async (_, { repoName }, { dataSources, token }) => {
      return await dataSources.getRepositoryDetails.execute(token, repoName);
    },
  },
};
