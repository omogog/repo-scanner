export const resolvers = {
  Query: {
    listRepositories: async (_, { page = 1 }, { dataSources, token }) => {
      const repositories = await dataSources.listRepositories.execute(
        token,
        page
      );
      return {
        page,
        items: repositories,
      };
    },
    getRepositoryDetails: async (_, { repoName }, { dataSources, token }) => {
      return await dataSources.getRepositoryDetails.execute(token, repoName);
    },
  },
};
