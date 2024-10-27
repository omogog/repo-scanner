import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type ListItemCodeRepository {
    name: String
    size: Int
    owner: String
  }

  type CodeRepository {
    name: String!
    size: Int!
    owner: String!
    isPrivate: Boolean
    fileCount: Int
    ymlFileContent: String
    activeWebhooks: [String]
  }

  type Query {
    listRepositories: [ListItemCodeRepository]
    getRepositoryDetails(repoName: String!): CodeRepository
  }
`;
