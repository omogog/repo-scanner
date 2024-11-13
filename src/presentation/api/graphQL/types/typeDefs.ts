import { gql } from 'apollo-server';

export const typeDefs = gql`
  type RepositorySummary {
    name: String!
    size: Int!
    owner: String!
  }

  type RepositoryDetails {
    name: String!
    size: Int!
    owner: String!
    isPrivate: Boolean
    fileCount: Int
    ymlFileContent: String
    activeWebhooks: [String]
  }

  type PaginatedRepositorySummary {
    items: [RepositorySummary]!
    page: Int!
  }

  type Query {
    listRepositories(page: Int): PaginatedRepositorySummary
    getRepositoryDetails(repoName: String!): RepositoryDetails
  }
`;
